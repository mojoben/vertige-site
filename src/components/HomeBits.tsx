'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// Home page interactivity, ported from vertige-proto-home-mockup.html:
// cross-fading hero slider, scroll-snap carousels, the full-width CTA
// slider, and the parallax + reveal effects.

export function HeroSlides({ images }: { images: string[] }) {
  const [on, setOn] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setOn((i) => (i + 1) % images.length), 6000)
    return () => clearInterval(t)
  }, [images.length])
  return (
    <>
      {images.map((im, i) => (
        <div key={im} className={`hslide${i === on ? ' on' : ''}`} style={{ backgroundImage: `url(${im})` }} />
      ))}
    </>
  )
}

export function CarouselRow({ step, children }: { step: number; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null)
  const go = (d: number) => row.current?.scrollBy({ left: d * step, behavior: 'smooth' })
  return (
    <div className="carwrap">
      <button className="carbtn prev" onClick={() => go(-1)}>‹</button>
      <div className="carrow" ref={row}>{children}</div>
      <button className="carbtn next" onClick={() => go(1)}>›</button>
    </div>
  )
}

export interface CtaSlide {
  img: string
  eyebrow: string
  title: string
  cta: { label: string; href: string }
}

export function CtaBand({ slides }: { slides: CtaSlide[] }) {
  const [on, setOn] = useState(0)
  const go = (d: number) => setOn((i) => (i + d + slides.length) % slides.length)
  useEffect(() => {
    const t = setInterval(() => setOn((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(t)
  }, [slides.length])
  return (
    <section className="ctaband">
      {slides.map((s, i) => (
        <div key={s.title} className={`ctaslide${i === on ? ' on' : ''}`}>
          <div className="bg" style={{ backgroundImage: `url(${s.img})` }} />
          <div className="ov" />
          <div className="inner">
            <span className="cta-eyebrow">{s.eyebrow}</span>
            <h2>{s.title}</h2>
            <Link className="cta-book" href={s.cta.href}>{s.cta.label}</Link>
          </div>
        </div>
      ))}
      <button className="ctabtn2 prev" onClick={() => go(-1)}>‹</button>
      <button className="ctabtn2 next" onClick={() => go(1)}>›</button>
    </section>
  )
}

// Parallax on .px images + intersection reveals — the prototype's scroll FX.
export function HomeFx() {
  useEffect(() => {
    const pxEls = [...document.querySelectorAll<HTMLElement>('.homepage .px')]
    const parallax = () => {
      const vh = innerHeight
      for (const el of pxEls) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -60 || r.top > vh + 60) continue
        const center = r.top + r.height / 2
        const prog = (center - vh / 2) / (vh / 2 + r.height / 2)
        const img = el.querySelector<HTMLElement>('.pxi')
        if (img) img.style.transform = `translateY(${(prog * -10).toFixed(2)}%)`
      }
    }
    const onScroll = () => requestAnimationFrame(parallax)
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', parallax)
    parallax()

    const io = new IntersectionObserver((entries) => entries.forEach((x) => {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) }
    }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    document.querySelectorAll<HTMLElement>('.homepage .reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 60}ms`
      io.observe(el)
    })

    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', parallax)
      io.disconnect()
    }
  }, [])
  return null
}

// ── Hero search ──────────────────────────────────────────────────────────────
// The home page's search box, made functional (Ben, 2026-07-14) with the one
// field set every search box shares: Destination · Guests · Bedrooms · Dates
// (a single range picker). Search carries the selections to /chalets as query
// params, which DestinationExplorer applies on mount. Popovers reuse the
// explorer's .pop classes so the two bars look and behave the same.

import { useRouter } from 'next/navigation'
import { COUNTRIES } from '@/lib/destinations'

const HS_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const HS_DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hsFmt = (d: Date) => `${HS_DOWS[d.getDay()]} ${d.getDate()} ${HS_MON[d.getMonth()]}`
const HS_CAL_MIN = { y: 2026, m: 11 } // Dec 2026, matching the explorer
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function HeroSearch() {
  const router = useRouter()
  const [dest, setDest] = useState<string | null>(null)
  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)
  const [beds, setBeds] = useState(0)
  const [arr, setArr] = useState<Date | null>(null)
  const [dep, setDep] = useState<Date | null>(null)
  const [pop, setPop] = useState<'dest' | 'guests' | 'beds' | 'cal' | null>(null)
  const [popPos, setPopPos] = useState({ left: 0, top: 0 })
  const [openCountry, setOpenCountry] = useState<string | null>(null)
  const [calStart, setCalStart] = useState(() => new Date(HS_CAL_MIN.y, HS_CAL_MIN.m, 1))

  const barRef = useRef<HTMLDivElement>(null)
  function openPop(name: Exclude<typeof pop, null>, e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    if (pop === name) { setPop(null); return }
    const fr = e.currentTarget.getBoundingClientRect()
    const wr = barRef.current?.getBoundingClientRect()
    if (!wr) return
    const w = name === 'cal' ? Math.min(620, innerWidth * 0.94) : name === 'dest' ? Math.min(560, innerWidth * 0.92) : Math.min(320, innerWidth * 0.92)
    // Anchored (absolute) inside the bar wrapper — clamp to the viewport
    // by translating viewport limits into wrapper coordinates.
    let left = fr.left - wr.left
    if (wr.left + left + w > innerWidth - 12) left = innerWidth - 12 - w - wr.left
    if (wr.left + left < 12) left = 12 - wr.left
    setPopPos({ left, top: fr.bottom - wr.top + 2 })
    setPop(name)
  }
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t?.closest?.('.pop') || t?.closest?.('.hsrch .f')) return
      setPop(null)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const guestsTxt = (() => {
    const t = adults + children
    if (!t) return 'Any'
    let txt = `${adults} adult${adults !== 1 ? 's' : ''}`
    if (children > 0) txt += ` · ${children} child${children !== 1 ? 'ren' : ''}`
    return txt
  })()

  function pickDay(y: number, m: number, dn: number) {
    const dt = new Date(y, m, dn)
    if (!arr || (arr && dep)) { setArr(dt); setDep(null) }
    else if (dt.getTime() > arr.getTime()) setDep(dt)
    else { setArr(dt); setDep(null) }
  }

  const monthGrid = (y: number, m: number, navSide: -1 | 1) => {
    const d = new Date(y, m, 1); const yy = d.getFullYear(); const mm = d.getMonth()
    const first = (new Date(yy, mm, 1).getDay() + 6) % 7
    const days = new Date(yy, mm + 1, 0).getDate()
    const atMin = calStart.getFullYear() === HS_CAL_MIN.y && calStart.getMonth() === HS_CAL_MIN.m
    const cells: React.ReactNode[] = []
    for (let i = 0; i < first; i++) cells.push(<div key={`b${i}`} className="day" />)
    for (let dn = 1; dn <= days; dn++) {
      const dt = new Date(yy, mm, dn); const wd = dt.getDay(); const co = wd === 6 || wd === 0; const t = dt.getTime()
      let cls = 'day' + (co ? ' co' : '')
      if (arr && t === arr.getTime()) cls += ' sel'
      if (dep && t === dep.getTime()) cls += ' sel'
      if (arr && dep && t > arr.getTime() && t < dep.getTime()) cls += ' inrange'
      cells.push(<div key={dn} className={cls} onClick={co ? () => pickDay(yy, mm, dn) : undefined}>{dn}</div>)
    }
    const nav = (dir: -1 | 1, disabled: boolean) => (
      <button className="cal-nav" disabled={disabled} onClick={() => {
        const nd = new Date(calStart.getFullYear(), calStart.getMonth() + dir, 1)
        if (nd.getFullYear() < HS_CAL_MIN.y || (nd.getFullYear() === HS_CAL_MIN.y && nd.getMonth() < HS_CAL_MIN.m)) return
        setCalStart(nd)
      }}>{dir === -1 ? '‹' : '›'}</button>
    )
    return (
      <div className="cal-m">
        <div className="cal-mh">
          {navSide === -1 ? nav(-1, atMin) : <span />}
          <span className="mt">{HS_MON[mm]} {yy}</span>
          {navSide === 1 ? nav(1, false) : <span />}
        </div>
        <div className="cal-grid">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((x, i) => <div key={`d${i}`} className="dow">{x}</div>)}
          {cells}
        </div>
      </div>
    )
  }

  function go() {
    const q = new URLSearchParams()
    if (dest) q.set('dest', dest)
    if (adults) q.set('adults', String(adults))
    if (children) q.set('children', String(children))
    if (beds) q.set('beds', String(beds))
    if (arr) q.set('arr', iso(arr))
    if (dep) q.set('dep', iso(dep))
    router.push(`/chalets${q.size ? `?${q}` : ''}#chalets`)
  }

  const stop = (e: React.MouseEvent) => e.stopPropagation()
  const stepper = (label: string, sub: string, v: number, setV: (n: number) => void, fmt?: (n: number) => string) => (
    <div className="gr">
      <div><div className="gn">{label}</div><div className="gs">{sub}</div></div>
      <div className="ctrl">
        <button disabled={v <= 0} onClick={() => setV(Math.max(0, v - 1))}>−</button>
        <span className="v">{fmt ? fmt(v) : v}</span>
        <button onClick={() => setV(v + 1)}>+</button>
      </div>
    </div>
  )

  return (
    <div className="hsrch" ref={barRef}>
      <div className="srch">
        <div className={`f${pop === 'dest' ? ' active' : ''}`} onClick={(e) => openPop('dest', e)}><label>Destination</label><span>{dest ?? 'Any resort'}</span></div>
        <div className={`f${pop === 'guests' ? ' active' : ''}`} onClick={(e) => openPop('guests', e)}><label>Guests</label><span>{guestsTxt}</span></div>
        <div className={`f${pop === 'beds' ? ' active' : ''}`} onClick={(e) => openPop('beds', e)}><label>Bedrooms</label><span>{beds > 0 ? `${beds}+` : 'Any'}</span></div>
        <div className={`f${pop === 'cal' ? ' active' : ''}`} onClick={(e) => openPop('cal', e)}><label>Dates</label><span>{arr && dep ? `${hsFmt(arr)} — ${hsFmt(dep)}` : arr ? `${hsFmt(arr)} — ?` : 'Add dates'}</span></div>
        <button onClick={go}>Search</button>
      </div>

      <div className={`pop anchored pop-dest${pop === 'dest' ? ' on' : ''}`} style={popPos} onClick={stop}>
        <div className="pop-head">Where would you like to ski?</div>
        <button className="dest-all" onClick={() => { setDest(null); setPop(null) }}>All the Alps</button>
        {COUNTRIES.map((c) => (
          <div key={c.slug} className={`dcountry${openCountry === c.name ? ' open' : ''}`}>
            <button className="dch" onClick={() => setOpenCountry(openCountry === c.name ? null : c.name)}>
              <span>{c.name}</span><span className="cc">{c.resorts.length} resorts ⌄</span>
            </button>
            <div className="drs">
              <button className="rall" onClick={() => { setDest(c.name); setPop(null) }}>All of {c.name} →</button>
              <div className="rlab">Signature resorts</div>
              <div className="rlist">{c.resorts.filter((r) => r.tier === 1).map((r) => <button key={r.slug} className="rbtn" onClick={() => { setDest(r.name); setPop(null) }}>{r.name}</button>)}</div>
              <div className="rlab">More in {c.name}</div>
              <div className="rlist">{c.resorts.filter((r) => r.tier === 2).map((r) => <button key={r.slug} className="rbtn" onClick={() => { setDest(r.name); setPop(null) }}>{r.name}</button>)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`pop anchored pop-cal${pop === 'cal' ? ' on' : ''}`} style={popPos} onClick={stop}>
        <div className="pop-head">Select your week</div>
        <div className="cal-note">Changeover days vary by chalet, so both <b>Saturdays</b> and <b>Sundays</b> are selectable.</div>
        <div className="cal-months">
          {monthGrid(calStart.getFullYear(), calStart.getMonth(), -1)}
          {monthGrid(calStart.getFullYear(), calStart.getMonth() + 1, 1)}
        </div>
        <div className="cal-foot">
          <button className="clr" onClick={() => { setArr(null); setDep(null) }}>Clear</button>
          <span className="cal-sum">{arr && dep ? `${Math.round((dep.getTime() - arr.getTime()) / 86400000)} nights selected` : arr ? 'Now choose your departure day' : ''}</span>
          <button className="apply" onClick={() => setPop(null)}>Apply</button>
        </div>
      </div>

      <div className={`pop anchored pop-guests${pop === 'guests' ? ' on' : ''}`} style={popPos} onClick={stop}>
        <div className="pop-head">Who&rsquo;s coming?</div>
        {stepper('Adults', 'Age 13+', adults, setAdults)}
        {stepper('Children', 'Age 0–12', children, setChildren)}
        <div className="gfoot"><button className="apply" onClick={() => setPop(null)}>Apply</button></div>
      </div>

      <div className={`pop anchored pop-guests${pop === 'beds' ? ' on' : ''}`} style={popPos} onClick={stop}>
        <div className="pop-head">How many bedrooms?</div>
        {stepper('Bedrooms', 'Minimum', beds, setBeds, (n) => (n > 0 ? `${n}+` : 'Any'))}
        <div className="gfoot"><button className="apply" onClick={() => setPop(null)}>Apply</button></div>
      </div>
    </div>
  )
}
