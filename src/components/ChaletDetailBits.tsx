'use client'

// Interactive parts of the chalet detail page, ported from
// vertige-proto-chalet-detail-alt.html JS → React (same DOM/classes):
// - subnav scroll-spy
// - booking card: changeover-day-constrained calendar (7/14 nights), running
//   total, inline two-stage request → /api/enquiry (chalet-request)
// - Prices & availability: week rows by month (live portal weeks when
//   available, the prototype's mock season otherwise)
// - schedule-a-call reveal + reserve form → /api/enquiry
// - gallery lightbox (keyboard: Esc / ← / →)

import React, { useEffect, useMemo, useState } from 'react'
import type { Week } from '@/lib/weeks'
import { addItem, isSaved, removeItemEverywhere } from '@/lib/wishlist'

export type { Week }

const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const d = (iso: string) => new Date(`${iso}T00:00:00`)
const afd = (dt: Date) => `${DN[dt.getDay()]} ${String(dt.getDate()).padStart(2, '0')} ${MN[dt.getMonth()].slice(0, 3)}`
const keyOf = (dt: Date) => `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`
const sameDay = (a: Date, b: Date) => keyOf(a) === keyOf(b)

async function sendEnquiry(body: Record<string, unknown>): Promise<boolean> {
  const res = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enquiryType: 'chalet-request', sourcePath: location.pathname, website: '', ...body }),
  })
  return res.ok
}

export function useSubnavSpy() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('.subnav .links a'))
    const secs = links
      .map((a) => document.querySelector(a.getAttribute('href') ?? ''))
      .filter(Boolean) as Element[]
    const spy = () => {
      let cur = secs[0]
      for (const s of secs) if (s.getBoundingClientRect().top < 160) cur = s
      links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${cur?.id}`))
    }
    addEventListener('scroll', spy, { passive: true })
    spy()
    return () => removeEventListener('scroll', spy)
  }, [])
}

export function SubnavSpy() {
  useSubnavSpy()
  return null
}

// ── Booking card ────────────────────────────────────────────────────────────
export function BookingCard({
  name, resort, country, priceFrom, priceTo, sym, guests, beds, baths, weeks, slug, phone, img,
}: {
  name: string; resort: string; country: string
  priceFrom: string; priceTo: string; sym: string
  guests: number; beds: number; baths: number
  weeks: Week[]; slug: string; phone: string; img?: string
}) {
  const [calOpen, setCalOpen] = useState(false)
  const months = useMemo(() => {
    const out: { y: number; m: number }[] = []
    for (const w of weeks) {
      const dt = d(w.s)
      if (!out.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth())) out.push({ y: dt.getFullYear(), m: dt.getMonth() })
    }
    return out
  }, [weeks])
  const [mi, setMi] = useState(0)
  const [selStart, setSelStart] = useState(-1)
  const [selSpan, setSelSpan] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' })
  const [busy, setBusy] = useState(false)

  // Wishlist heart (HANDOFF 09 §5) — synced post-mount so SSR and hydration agree.
  const [saved, setSaved] = useState(false)
  const [wsToast, setWsToast] = useState<string | null>(null)
  useEffect(() => {
    const sync = () => setSaved(isSaved(slug))
    sync()
    addEventListener('vg-wishlist', sync)
    return () => removeEventListener('vg-wishlist', sync)
  }, [slug])
  const flash = (t: string) => { setWsToast(t); setTimeout(() => setWsToast(null), 1800) }
  const toggleSave = () => {
    if (isSaved(slug)) {
      removeItemEverywhere(slug)
      flash('Removed from your list')
    } else {
      const list = addItem({
        slug, name,
        loc: `${resort}, ${country}`,
        meta: `${guests} guests · ${beds} bedrooms`,
        price: priceFrom && priceFrom !== '—' ? `From ${priceFrom} per week` : 'Price on request',
        img: img ?? '',
      })
      flash(list ? `Saved to ${list.name}` : 'Already on your list')
    }
  }

  const wkByKey = useMemo(() => {
    const m: Record<string, number> = {}
    weeks.forEach((w, i) => { m[keyOf(d(w.s))] = i })
    return m
  }, [weeks])
  const weekOK = (i: number) => i >= 0 && i < weeks.length && weeks[i].status !== 'un'
  const co = weeks.length ? d(weeks[0].s).getDay() : 0
  const CODN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][co]

  const money = (n: number) => `${sym}${n.toLocaleString('en-GB')}`
  const selected = selStart >= 0 ? weeks.slice(selStart, selStart + selSpan) : []
  const nights = selSpan * 7
  const anyReq = selected.some((w) => w.status === 'req' || w.price == null)
  const total = anyReq ? null : selected.reduce((a, w) => a + (w.price ?? 0), 0)
  const s0 = selected[0] ? d(selected[0].s) : null
  const eEnd = selected.length ? d(selected[selected.length - 1].e) : null

  function pickDay(wi: number) {
    if (selStart < 0 || (wi !== selStart && wi !== selStart + 1)) { setSelStart(wi); setSelSpan(1) }
    else if (wi === selStart + 1) { if (weekOK(selStart + 1)) setSelSpan(2) }
    else setSelSpan(1)
  }
  // Cross-component selection from the availability rows.
  useEffect(() => {
    const h = (e: Event) => {
      const i = (e as CustomEvent<number>).detail
      setSelStart(i); setSelSpan(1)
      document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })
    }
    addEventListener('vg-selweek', h as EventListener)
    return () => removeEventListener('vg-selweek', h as EventListener)
  }, [])
  useEffect(() => {
    if (selStart >= 0) dispatchEvent(new CustomEvent('vg-chosen', { detail: selStart }))
  }, [selStart])

  async function send() {
    if (busy || !f.firstName || !f.lastName || !f.email) return
    setBusy(true)
    const ok = await sendEnquiry({
      ...f,
      propertySlug: slug,
      travelStart: s0?.toISOString().slice(0, 10),
      travelEnd: eEnd?.toISOString().slice(0, 10),
      message: [`Chalet request: ${name} (${resort})`, s0 && eEnd ? `Week: ${afd(s0)} → ${afd(eEnd)} (${nights} nights)` : null, total != null ? `Indicative total shown: ${money(total)}` : null, f.notes].filter(Boolean).join('\n'),
    })
    setBusy(false)
    if (ok) { setFormOpen(false); setDone(true) }
  }

  const cal = (() => {
    if (!calOpen || !months.length) return null
    const { y, m } = months[Math.min(mi, months.length - 1)]
    const lead = (new Date(y, m, 1).getDay() + 6) % 7
    const days = new Date(y, m + 1, 0).getDate()
    const cells: React.ReactNode[] = []
    for (let i = 0; i < lead; i++) cells.push(<span key={`e${i}`} className="cd empty" />)
    for (let dn = 1; dn <= days; dn++) {
      const date = new Date(y, m, dn)
      const wi = wkByKey[keyOf(date)]
      const isStart = wi !== undefined && weekOK(wi)
      let inRange = false; let isEnd = false
      if (selStart >= 0 && selected.length) {
        const rs = d(weeks[selStart].s); const re = d(weeks[selStart + selSpan - 1].e)
        if (date >= rs && date <= re) inRange = true
        if (sameDay(date, rs) || sameDay(date, re)) isEnd = true
      }
      let cls = 'cd'
      if (!isStart && !inRange) cls += ' off'
      if (isStart) cls += ' sel-day'
      if (inRange) cls += ' inrange'
      if (isEnd) cls += ' end'
      cells.push(
        <span key={dn} className={cls} onClick={isStart ? () => pickDay(wi) : undefined}>{dn}</span>,
      )
    }
    return (
      <div className="cal" onClick={(e) => e.stopPropagation()}>
        <div className="calhead">
          <button type="button" onClick={() => setMi(Math.max(0, mi - 1))}>‹</button>
          <span>{MN[m].toUpperCase()} {y}</span>
          <button type="button" onClick={() => setMi(Math.min(months.length - 1, mi + 1))}>›</button>
        </div>
        <div className="caldow"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div>
        <div className="calgrid">{cells}</div>
        <div className="calnote">{CODN}-to-{CODN} changeover · 7 or 14 nights</div>
      </div>
    )
  })()

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t?.closest?.('.bcard .dates')) return
      setCalOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <div className="bcard" id="enquire">
      <div className="loc">{resort}, {country}</div>
      <h3>{name}</h3>
      <div className="pr">{priceFrom} {priceTo && <span>— {priceTo} per week</span>}</div>
      <p className="note">Prices vary with season and occupancy. Enquire for a bespoke quotation with our team.</p>
      <div className="sel">
        <div><div className="n">{guests}</div><div className="l">Guests</div></div>
        <div><div className="n">{beds}</div><div className="l">Beds</div></div>
        <div><div className="n">{baths}</div><div className="l">Baths</div></div>
      </div>
      <div className="dates">
        <div className="dlabel">Dates</div>
        <div className={`dfield${selected.length ? ' set' : ''}`} onClick={() => setCalOpen(!calOpen)}>
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="1" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
          <span>{s0 && eEnd ? `${afd(s0)} → ${afd(eEnd)}` : 'Select your dates'}</span>
        </div>
        {cal}
      </div>
      <div className="total"><span className="tl">Total · <b>{selected.length ? `${nights} nights` : '—'}</b></span><span className="tv">{selected.length ? (total != null ? money(total) : 'On request') : '—'}</span></div>
      <p className="tax">{selected.length ? `Chalet hire only, before additional services — total for your ${nights}-night stay.` : 'Select your dates to see the total for your stay.'}</p>
      {!formOpen && !done && (
        <button className="btn req" onClick={() => { if (selStart < 0) { setCalOpen(true); return } setFormOpen(true) }}>Make a request</button>
      )}
      {formOpen && (
        <div className="bcreq">
          <div className="frow2">
            <label>First name<input value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} /></label>
            <label>Last name<input value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} /></label>
          </div>
          <div className="frow2">
            <label>Email<input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
            <label>Phone<input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
          </div>
          <label className="full">Notes<textarea rows={4} placeholder="Party details, occasion, any requests…" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
          <button className="btn" type="button" onClick={send} disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
        </div>
      )}
      {done && <div className="bcdone">Thank you — your Vertige advisor will be in touch shortly to confirm availability and a bespoke quotation.</div>}
      <p className="nb">Sending a request is not binding and no payment is required.</p>
      <div className="div" />
      <div className="ws">
        <span role="button" style={saved ? { color: 'var(--rose)' } : undefined} onClick={toggleSave}>{saved ? '♥ On your wishlist' : '♡ Add to wishlist'}</span>
        <span role="button" onClick={() => { navigator.clipboard?.writeText(location.href); flash('Link copied') }}>↗ Share</span>
      </div>
      {wsToast && <div className="wltoast" style={{ display: 'block' }}>{wsToast}</div>}
      <div className="callspec">Call a specialist · <b>{phone}</b><small>Every day, 8am–midnight</small></div>
    </div>
  )
}

// ── Prices & availability (week rows by month) ──────────────────────────────
export function Availability({ weeks, sym }: { weeks: Week[]; sym: string }) {
  const months = useMemo(() => {
    const out: { y: number; m: number }[] = []
    for (const w of weeks) {
      const dt = d(w.s)
      if (!out.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth())) out.push({ y: dt.getFullYear(), m: dt.getMonth() })
    }
    return out
  }, [weeks])
  const [mi, setMi] = useState(0)
  const [chosen, setChosen] = useState(-1)
  useEffect(() => {
    const h = (e: Event) => setChosen((e as CustomEvent<number>).detail)
    addEventListener('vg-chosen', h as EventListener)
    return () => removeEventListener('vg-chosen', h as EventListener)
  }, [])
  if (!months.length) return <p className="avnote">Availability for this chalet is confirmed on enquiry — speak to the team for current weeks.</p>
  const { y, m } = months[Math.min(mi, months.length - 1)]
  const list = weeks.filter((w) => { const dt = d(w.s); return dt.getFullYear() === y && dt.getMonth() === m })
  const money = (n: number) => `${sym}${n.toLocaleString('en-GB')}`
  return (
    <>
      <div className="avtop">
        <div><div className="chapter">Prices &amp; availability</div><h2>Choose your <em>week</em>.</h2></div>
        <div className="monthnav">
          <button disabled={mi === 0} onClick={() => setMi(mi - 1)}>‹</button>
          <span className="lbl">{MN[m].toUpperCase()} {y}</span>
          <button disabled={mi === months.length - 1} onClick={() => setMi(mi + 1)}>›</button>
        </div>
      </div>
      <p className="avnote">Indicative reference prices for a catered week. Select a week to add it to your request — the team confirms availability and the final quotation on enquiry.</p>
      <div>
        {list.map((w) => {
          const gi = weeks.indexOf(w)
          return (
            <div key={w.s} className="avrow">
              <div className="wk">{afd(d(w.s))} → {afd(d(w.e))}<small>Min. 7 nights</small></div>
              {w.status === 'a' && w.price != null
                ? <div className="pr"><b>{money(w.price)}</b><small>for 7 nights</small></div>
                : w.status === 'un'
                  ? <div className="pr"><span className="st-un">Unavailable</span></div>
                  : <div className="pr"><span className="st-req">On request</span></div>}
              {w.status === 'un'
                ? <span />
                : <button className={`selbtn${w.status === 'req' ? ' ghost' : ''}${gi === chosen ? ' chosen' : ''}`} onClick={() => dispatchEvent(new CustomEvent('vg-selweek', { detail: gi }))}>{gi === chosen ? 'Selected' : w.status === 'req' ? 'Enquire' : 'Select'}</button>}
            </div>
          )
        })}
        {list.length === 0 && <p className="avnote">No weeks in this month — use the arrows to browse the season.</p>}
      </div>
    </>
  )
}

// ── Reserve form + schedule-a-call ──────────────────────────────────────────
export function ReserveForm({ slug, name }: { slug: string; name: string }) {
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '', party: '', week: '', notes: '' })
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state !== 'idle' || !f.firstName || !f.lastName || !f.email) return
    setState('busy')
    const ok = await sendEnquiry({
      ...f,
      propertySlug: slug,
      message: [`Reserve request: ${name}`, f.party ? `Party size: ${f.party}` : null, f.week ? `Preferred week: ${f.week}` : null, f.notes].filter(Boolean).join('\n'),
    })
    setState(ok ? 'done' : 'idle')
  }
  if (state === 'done') return <div className="eform"><div className="bcdone" style={{ marginBottom: 0 }}>Thank you — your request has been received. The Vertige atelier will reply within 24 hours.</div></div>
  return (
    <form className="eform" onSubmit={submit}>
      <div className="row">
        <div><label>First name</label><input placeholder="Elena" value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} /></div>
        <div><label>Family name</label><input placeholder="Marchetti" value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} /></div>
      </div>
      <div className="row">
        <div><label>Email</label><input placeholder="you@example.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div><label>Telephone</label><input id="corrPhone" placeholder="+44" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
      </div>
      <div className="row">
        <div><label>Party size</label><input placeholder="10" value={f.party} onChange={(e) => setF({ ...f, party: e.target.value })} /></div>
        <div><label>Preferred week</label><input placeholder="Dec 20 — 27" value={f.week} onChange={(e) => setF({ ...f, week: e.target.value })} /></div>
      </div>
      <div><label>A few words on your stay</label><textarea placeholder="Family of ten, keen skiers, would appreciate a private guide and chef tasting menu…" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      <div className="ef-foot"><span>Reply within 24h · Vertige atelier</span><button className="btn" type="submit" disabled={state !== 'idle'}>{state === 'busy' ? 'Sending…' : 'Make a request'}</button></div>
    </form>
  )
}

export function ScheduleCall({ slug, name }: { slug: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' })
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')
  async function submit() {
    if (state !== 'idle' || !f.firstName || !f.lastName || !f.email) return
    setState('busy')
    const ok = await sendEnquiry({ ...f, propertySlug: slug, message: [`Callback request: ${name}`, f.notes].filter(Boolean).join('\n') })
    setState(ok ? 'done' : 'idle')
  }
  return (
    <>
      <button className="btn" type="button" onClick={() => setOpen(!open)}>Schedule a call</button>
      {open && (
        <div className="cbform">
          {state !== 'done' ? (
            <>
              <div className="frow2">
                <label>First name<input value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} /></label>
                <label>Last name<input value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} /></label>
              </div>
              <div className="frow2">
                <label>Email<input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
                <label>Phone<input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              </div>
              <label className="full">Message<textarea rows={2} placeholder="A good time to reach you, and anything you'd like to discuss…" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
              <button className="btn" type="button" onClick={submit} disabled={state !== 'idle'}>{state === 'busy' ? 'Sending…' : 'Request callback'}</button>
            </>
          ) : (
            <div className="cbdone">Thank you — we&rsquo;ll call you back shortly.</div>
          )}
        </div>
      )}
    </>
  )
}

// ── Gallery + lightbox ──────────────────────────────────────────────────────
export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const layout = ['w2 h2', '', '', '', '', 'w2', '', ''] // the prototype mosaic
  const show = (n: number) => { setI(n); setOpen(true) }
  const step = (dlt: number) => setI((p) => (p + dlt + images.length) % images.length)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const key = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  return (
    <>
      <div className="galhead"><div><h2>The <em>gallery</em>.</h2></div><a href="#" onClick={(e) => { e.preventDefault(); show(0) }}>View full gallery ↗</a></div>
      <div className="gmosaic">
        {images.slice(0, 8).map((src, n) => (
          <div key={n} className={`g ${layout[n] ?? ''}`} style={{ backgroundImage: `url(${src})` }} onClick={() => show(n)} />
        ))}
      </div>
      <div className={`lbox${open ? ' on' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
        <button className="lbx" onClick={() => setOpen(false)} aria-label="Close">×</button>
        <button className="lbnav prev" onClick={() => step(-1)} aria-label="Previous">‹</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {open && <img src={images[i]} alt={name} />}
        <button className="lbnav next" onClick={() => step(1)} aria-label="Next">›</button>
        <div className="lbcount">{i + 1} / {images.length}</div>
      </div>
    </>
  )
}
