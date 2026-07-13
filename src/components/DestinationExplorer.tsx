'use client'

// The destination page's interactive core, ported from the prototype
// (vertige-proto-dest-verbier.html JS → React state, same DOM/classes):
// floating search bar with Destination / Arrival / Departure / Guests
// popovers, the Sat/Sun flexible-changeover calendar (05 §2 — don't lose this
// rule), sticky scrollspy tabs, filter bar + slide-out filter panel, results
// grid, and the placeholder map with pins + popups (real Google Maps later).
// Chalet data comes from the res-portal adapter (getCatalogue), with the
// prototype mock set as the dev fallback when the portal is unreachable.

import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { COUNTRIES } from '@/lib/destinations'
import { gbp, type MockChalet } from '@/lib/mock-chalets'
import { addItem, isSaved, removeItemEverywhere } from '@/lib/wishlist'

// Card shape = the prototype contract; portal-fed cards add their currency
// symbol + slug (see lib/portal-client.ts toCard).
export type CatalogueChalet = MockChalet & { priceSymbol?: string; slug?: string }
const price = (c: CatalogueChalet, n: number) =>
  c.priceSymbol ? `${c.priceSymbol}${n >= 1000 ? (n / 1000).toFixed(0) + 'k' : n}` : gbp(n)

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const fmtD = (d: Date) => `${DOWS[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`
const CAL_MIN = { y: 2026, m: 11 } // Dec 2026, as the prototype

type PopName = 'dest' | 'cal' | 'guests' | null

interface FilterState {
  tier: string[]; country: string[]; ptype: string[]; attr: string[]
  beds: number; baths: number; bfrom: string; bto: string
  destCountry: string | null; destResort: string | null
  arr: Date | null; dep: Date | null; flex: boolean
  adults: number; children: number
}

const CHK_GROUPS: { grp?: string; title: string; f: 'tier' | 'country' | 'ptype' | 'attr'; opts: { v: string; label: React.ReactNode }[] }[] = [
  {
    grp: 'collection', title: 'The Collection', f: 'tier',
    opts: [
      { v: 'Reserve', label: <span>Reserve ◆<span className="desc">Considered, characterful chalets with full concierge before your stay.</span></span> },
      { v: 'Privé', label: <span>Privé ◆◆<span className="desc">Our most exceptional homes, with a dedicated host and in-resort team.</span></span> },
    ],
  },
  { title: 'Resort country', f: 'country', opts: ['France', 'Switzerland', 'Austria', 'Italy'].map((v) => ({ v, label: v })) },
  {
    title: 'Ski access', f: 'attr',
    opts: [
      { v: 'ski-in', label: 'Ski-in / ski-out' }, { v: 'near-slopes', label: 'Slopes within walking distance' },
      { v: 'near-lifts', label: 'Close to the lifts' }, { v: 'piste-view', label: 'Piste & mountain views' },
    ],
  },
  { title: 'Property type', f: 'ptype', opts: ['Chalet', 'Apartment', 'Penthouse', 'Lodge'].map((v) => ({ v, label: v })) },
  {
    grp: 'features', title: 'Chalet features', f: 'attr',
    opts: [
      { v: 'chef', label: 'Private chef' }, { v: 'fireplace', label: 'Open fireplace' },
      { v: 'cinema', label: 'Cinema room' }, { v: 'ski-room', label: 'Ski room & boot warmers' },
      { v: 'cellar', label: 'Wine cellar' },
    ],
  },
  {
    title: 'Wellness', f: 'attr',
    opts: [
      { v: 'indoor-pool', label: 'Indoor pool' }, { v: 'hot-tub', label: 'Hot tub' },
      { v: 'spa', label: 'Spa & sauna' }, { v: 'gym', label: 'Gym' },
    ],
  },
]

export function DestinationExplorer({
  resortName,
  initialCountry = null,
  guideTabLabel = 'Resort Guide',
  chaletsHead,
  chalets,
  overview,
  guide,
  after,
}: {
  // Scopes (HANDOFF 05 §4 + 08): resort page = resortName; country page =
  // initialCountry + guideTabLabel "Resorts"; inspiration collection =
  // no scope + guideTabLabel null (tab hidden); /chalets catalogue = no
  // scope and no overview (tabs hidden entirely).
  resortName: string | null
  initialCountry?: string | null
  guideTabLabel?: string | null
  chaletsHead?: { title: string; sub: string }
  chalets: CatalogueChalet[]
  overview?: React.ReactNode
  guide?: React.ReactNode
  after?: React.ReactNode
}) {
  const [s, setS] = useState<FilterState>({
    tier: [], country: [], ptype: [], attr: [], beds: 0, baths: 0, bfrom: '', bto: '',
    destCountry: initialCountry, destResort: resortName, arr: null, dep: null, flex: true, adults: 0, children: 0,
  })
  const [pop, setPop] = useState<PopName>(null)
  const [popPos, setPopPos] = useState({ left: 0, top: 0 })
  const [calStart, setCalStart] = useState(() => new Date(CAL_MIN.y, CAL_MIN.m, 1))
  const [openCountry, setOpenCountry] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activePin, setActivePin] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const fbodyRef = useRef<HTMLDivElement>(null)

  // Wishlist hearts (HANDOFF 09 §5): saved state + save/unsave with a toast.
  // savedTick starts at 0 and flips post-mount so SSR and first client render
  // agree (localStorage is client-only).
  const [savedTick, setSavedTick] = useState(0)
  const [wlToast, setWlToast] = useState<string | null>(null)
  useEffect(() => {
    setSavedTick(1)
    const sync = () => setSavedTick((t) => t + 1)
    addEventListener('vg-wishlist', sync)
    return () => removeEventListener('vg-wishlist', sync)
  }, [])
  const saved = (c: CatalogueChalet) => savedTick > 0 && isSaved(c.slug ?? c.name)
  const toggleSave = (e: React.MouseEvent, c: CatalogueChalet) => {
    e.preventDefault()
    e.stopPropagation()
    const slug = c.slug ?? c.name
    if (isSaved(slug)) {
      removeItemEverywhere(slug)
      setWlToast('Removed from your list')
    } else {
      const list = addItem({
        slug,
        name: c.name,
        loc: `${c.resort}, ${c.country}`,
        meta: `${c.guests} guests · ${c.beds} bedrooms`,
        price: c.from > 0 ? `From ${price(c, c.from)} per week` : 'Price on request',
        img: c.img,
      })
      setWlToast(list ? `Saved to ${list.name}` : 'Already on your list')
    }
    setTimeout(() => setWlToast(null), 1800)
  }

  const set = (p: Partial<FilterState>) => setS((prev) => ({ ...prev, ...p }))

  // ── Filtering (prototype passes()) ─────────────────────────────────────
  const resortMatch = (c: MockChalet, sel: string) => {
    const a = c.resort.toLowerCase(); const b = sel.toLowerCase()
    return a.includes(b) || b.includes(a)
  }
  // Sat/Sun flexible-changeover rule: flex ON (default) includes BOTH
  // changeover days so a Sat→Sat pick also surfaces Sun-changeover chalets.
  const dateOK = (c: MockChalet) => {
    if (!s.arr || !s.dep) return true
    if (s.flex) return true
    return (c.co === 'Sat' ? 6 : 0) === s.arr.getDay()
  }
  const list = useMemo(() => chalets.filter((c) => {
    if (s.tier.length && !s.tier.includes(c.tier)) return false
    if (s.country.length && !s.country.includes(c.country)) return false
    if (s.destCountry && c.country !== s.destCountry) return false
    if (s.destResort && !resortMatch(c, s.destResort)) return false
    if (s.ptype.length && !s.ptype.includes(c.ptype)) return false
    if (s.attr.length && !s.attr.every((a) => c.attrs.includes(a))) return false
    if (c.beds < s.beds || c.baths < s.baths) return false
    const g = s.adults + s.children; if (g && c.guests < g) return false
    const bf = +s.bfrom || 0; const bt = +s.bto || Infinity
    if (c.from < bf || c.from > bt) return false
    return dateOK(c)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [s])

  // Chalet features + Wellness offer only what the chalets in the current
  // destination scope actually have (Ben, 2026-07-13) — no filter that can't
  // match anything. Scoped by destination only (not the other filter
  // controls), so options don't vanish as you tick them.
  const chkGroups = useMemo(() => {
    const inScope = chalets.filter((c) =>
      (!s.destCountry || c.country === s.destCountry) && (!s.destResort || resortMatch(c, s.destResort)))
    const availAttrs = new Set(inScope.flatMap((c) => c.attrs ?? []))
    return CHK_GROUPS
      .map((g) => (g.f === 'attr' && (g.grp === 'features' || g.title === 'Wellness')
        ? { ...g, opts: g.opts.filter((o) => availAttrs.has(o.v)) }
        : g))
      .filter((g) => g.opts.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chalets, s.destCountry, s.destResort])

  // ── Popovers ───────────────────────────────────────────────────────────
  function openPop(name: Exclude<PopName, null>, e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    if (pop === name) { setPop(null); return }
    const fr = e.currentTarget.getBoundingClientRect()
    const w = name === 'cal' ? Math.min(620, innerWidth * 0.94) : name === 'dest' ? Math.min(560, innerWidth * 0.92) : Math.min(320, innerWidth * 0.92)
    let left = fr.left
    if (left + w > innerWidth - 12) left = innerWidth - w - 12
    if (left < 12) left = 12
    setPopPos({ left, top: fr.bottom + 2 })
    setPop(name)
  }
  useEffect(() => {
    // Mirror the prototype's outside-click close: ignore clicks inside a
    // popover or on an opener (React delegates at document, so relying on
    // stopPropagation alone would close the pop in the same batch it opens).
    const close = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t?.closest?.('.pop') || t?.closest?.('.srch .f') || t?.closest?.('.fbtn.fdates')) return
      setPop(null)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  // ── Tabs scroll-spy (prototype spy()) ──────────────────────────────────
  useEffect(() => {
    const spy = () => {
      const y = scrollY + 170
      let cur = 'overview'
      for (const id of ['overview', 'chalets', 'guide']) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top + scrollY <= y) cur = id
      }
      setActiveTab(cur)
    }
    addEventListener('scroll', spy, { passive: true })
    spy()
    return () => removeEventListener('scroll', spy)
  }, [])
  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - 134, behavior: 'smooth' })
  }

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
  }, [filtersOpen])

  // ── Sub-renderers ──────────────────────────────────────────────────────
  const nights = s.arr && s.dep ? Math.round((s.dep.getTime() - s.arr.getTime()) / 86400000) : 0
  const guestsTxt = (() => {
    const t = s.adults + s.children
    if (!t) return 'Any'
    let txt = `${s.adults} adult${s.adults !== 1 ? 's' : ''}`
    if (s.children > 0) txt += ` · ${s.children} child${s.children !== 1 ? 'ren' : ''}`
    return txt
  })()

  function pickDay(y: number, m: number, dn: number) {
    const dt = new Date(y, m, dn)
    if (!s.arr || (s.arr && s.dep)) set({ arr: dt, dep: null })
    else if (dt.getTime() > s.arr.getTime()) set({ dep: dt })
    else set({ arr: dt, dep: null })
  }

  const monthGrid = (y: number, m: number, navSide: -1 | 1) => {
    const d = new Date(y, m, 1); const yy = d.getFullYear(); const mm = d.getMonth()
    const first = (new Date(yy, mm, 1).getDay() + 6) % 7
    const days = new Date(yy, mm + 1, 0).getDate()
    const atMin = calStart.getFullYear() === CAL_MIN.y && calStart.getMonth() === CAL_MIN.m
    const cells: React.ReactNode[] = []
    for (let i = 0; i < first; i++) cells.push(<div key={`b${i}`} className="day" />)
    for (let dn = 1; dn <= days; dn++) {
      const dt = new Date(yy, mm, dn); const wd = dt.getDay(); const co = wd === 6 || wd === 0; const t = dt.getTime()
      let cls = 'day' + (co ? ' co' : '')
      if (s.arr && t === s.arr.getTime()) cls += ' sel'
      if (s.dep && t === s.dep.getTime()) cls += ' sel'
      if (s.arr && s.dep && t > s.arr.getTime() && t < s.dep.getTime()) cls += ' inrange'
      cells.push(<div key={dn} className={cls} onClick={co ? () => pickDay(yy, mm, dn) : undefined}>{dn}</div>)
    }
    const nav = (dir: -1 | 1, disabled: boolean) => (
      <button className="cal-nav" disabled={disabled} onClick={() => {
        const nd = new Date(calStart.getFullYear(), calStart.getMonth() + dir, 1)
        if (nd.getFullYear() < CAL_MIN.y || (nd.getFullYear() === CAL_MIN.y && nd.getMonth() < CAL_MIN.m)) return
        setCalStart(nd)
      }}>{dir === -1 ? '‹' : '›'}</button>
    )
    return (
      <div className="cal-m">
        <div className="cal-mh">
          {navSide === -1 ? nav(-1, atMin) : <span />}
          <span className="mt">{MON[mm]} {yy}</span>
          {navSide === 1 ? nav(1, false) : <span />}
        </div>
        <div className="cal-grid">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((x, i) => <div key={i} className="dow">{x}</div>)}
          {cells}
        </div>
      </div>
    )
  }

  const toggleF = (f: 'tier' | 'country' | 'ptype' | 'attr', v: string, on: boolean) =>
    set({ [f]: on ? [...s[f], v] : s[f].filter((x) => x !== v) } as Partial<FilterState>)

  const chaletCard = (c: CatalogueChalet) => (
    <Link key={c.name} className="pc" href={c.slug ? `/chalets/${c.slug}` : '/chalets/sample'}>
      <div className="im" style={{ backgroundImage: `url(${c.img})` }}>
        <div
          className={`heart${saved(c) ? ' saved' : ''}`}
          role="button"
          aria-label="Save to wishlist"
          onClick={(e) => toggleSave(e, c)}
        >{saved(c) ? '♥' : '♡'}</div>
      </div>
      <h3>{c.name}</h3>
      <div className="loc">{c.resort}, {c.country}</div>
      <div className="meta">{c.guests} guests · {c.beds} bedrooms · {c.baths} bathrooms</div>
      <div className="chips">{c.chips.map((x) => <span key={x} className="chip">{x}</span>)}</div>
      <div className="price">{c.from > 0 ? <>From {price(c, c.from)} to {price(c, c.to)} per week</> : 'Price on request'}</div>
      <div className="tier">{c.tier} Collection {c.tier === 'Privé' ? '◆◆' : '◆'}</div>
    </Link>
  )

  const stopAll = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <>
      {/* ── Floating search bar ── */}
      <div className="searchwrap"><div className="searchbar"><div className="searchrow">
        <div className="srch">
          <div className={`f${pop === 'dest' ? ' active' : ''}`} onClick={(e) => openPop('dest', e)}><label>Destination</label><span>{s.destResort || s.destCountry || 'The Alps'}</span></div>
          <div className={`f${pop === 'cal' ? ' active' : ''}`} onClick={(e) => openPop('cal', e)}><label>Arrival</label><span>{s.arr ? fmtD(s.arr) : 'Add dates'}</span></div>
          <div className={`f${pop === 'cal' ? ' active' : ''}`} onClick={(e) => openPop('cal', e)}><label>Departure</label><span>{s.dep ? fmtD(s.dep) : 'Add dates'}</span></div>
          <div className={`f${pop === 'guests' ? ' active' : ''}`} onClick={(e) => openPop('guests', e)}><label>Guests</label><span>{guestsTxt}</span></div>
          <button onClick={() => { setPop(null); scrollToId('chalets') }}>Search</button>
        </div>
      </div></div></div>

      {/* Popovers (fixed, anchored to the clicked field) */}
      <div className={`pop pop-dest${pop === 'dest' ? ' on' : ''}`} style={popPos} onClick={stopAll}>
        <div className="pop-head">Where would you like to ski?</div>
        <button className="dest-all" onClick={() => { set({ destCountry: null, destResort: null }); setPop(null) }}>All the Alps</button>
        {COUNTRIES.map((c) => (
          <div key={c.slug} className={`dcountry${openCountry === c.name ? ' open' : ''}`}>
            <button className="dch" onClick={() => setOpenCountry(openCountry === c.name ? null : c.name)}>
              <span>{c.name}</span><span className="cc">{c.resorts.length} resorts ⌄</span>
            </button>
            <div className="drs">
              <button className="rall" onClick={() => { set({ destCountry: c.name, destResort: null }); setPop(null) }}>All of {c.name} →</button>
              <div className="rlab">Signature resorts</div>
              <div className="rlist">{c.resorts.filter((r) => r.tier === 1).map((r) => <button key={r.slug} className="rbtn" onClick={() => { set({ destCountry: c.name, destResort: r.name }); setPop(null) }}>{r.name}</button>)}</div>
              <div className="rlab">More in {c.name}</div>
              <div className="rlist">{c.resorts.filter((r) => r.tier === 2).map((r) => <button key={r.slug} className="rbtn" onClick={() => { set({ destCountry: c.name, destResort: r.name }); setPop(null) }}>{r.name}</button>)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`pop pop-cal${pop === 'cal' ? ' on' : ''}`} style={popPos} onClick={stopAll}>
        <div className="pop-head">Select your week</div>
        <div className="cal-note">Changeover days vary by chalet, so both <b>Saturdays</b> and <b>Sundays</b> are selectable. Choose the week you have in mind — we&rsquo;ll show chalets on either changeover.</div>
        <label className="cal-flex"><input type="checkbox" checked={s.flex} onChange={(e) => set({ flex: e.target.checked })} /> Flexible changeover — include Sat &amp; Sun (recommended)</label>
        <div className="cal-months">
          {monthGrid(calStart.getFullYear(), calStart.getMonth(), -1)}
          {monthGrid(calStart.getFullYear(), calStart.getMonth() + 1, 1)}
        </div>
        <div className="cal-foot">
          <button className="clr" onClick={() => set({ arr: null, dep: null })}>Clear</button>
          <span className="cal-sum">{s.arr && s.dep ? `${nights} nights selected` : s.arr ? 'Now choose your departure day' : ''}</span>
          <button className="apply" onClick={() => setPop(null)}>Apply</button>
        </div>
      </div>

      <div className={`pop pop-guests${pop === 'guests' ? ' on' : ''}`} style={popPos} onClick={stopAll}>
        <div className="pop-head">Who&rsquo;s coming?</div>
        {([['adults', 'Adults', 'Age 13+'], ['children', 'Children', 'Age 0–12']] as const).map(([k, n, sub]) => (
          <div key={k} className="gr">
            <div><div className="gn">{n}</div><div className="gs">{sub}</div></div>
            <div className="ctrl">
              <button disabled={s[k] <= 0} onClick={() => set({ [k]: Math.max(0, s[k] - 1) } as Partial<FilterState>)}>−</button>
              <span className="v">{s[k]}</span>
              <button onClick={() => set({ [k]: s[k] + 1 } as Partial<FilterState>)}>+</button>
            </div>
          </div>
        ))}
        <div className="gfoot"><button className="apply" onClick={() => setPop(null)}>Apply</button></div>
      </div>

      {/* ── Breadcrumb + sticky tabs ── */}
      {after}
      {overview != null && (
        <div className="dtabs"><div className="in">
          <button className={`dtab${activeTab === 'overview' ? ' act' : ''}`} onClick={() => scrollToId('overview')}>Overview</button>
          <button className={`dtab${activeTab === 'chalets' ? ' act' : ''}`} onClick={() => scrollToId('chalets')}>Luxury Chalets</button>
          {guideTabLabel && <button className={`dtab${activeTab === 'guide' ? ' act' : ''}`} onClick={() => scrollToId('guide')}>{guideTabLabel}</button>}
        </div></div>
      )}

      {overview}

      {/* ── Luxury chalets: filter bar + results + map ── */}
      <section id="chalets" className="chsec">
        {(chaletsHead || resortName) && (
          <div className="chhead">
            <h2>{chaletsHead?.title ?? `Luxury chalets in ${resortName}`}</h2>
            <p>{chaletsHead?.sub ?? 'From ski-in, ski-out flagships to quieter corners above the village; filter by size, budget, service level and features.'}</p>
          </div>
        )}

        <div className="filterbar"><div className="in">
          <div className="fbtns">
            <button className={`fbtn fdates${s.arr && s.dep ? ' has' : ''}`} onClick={(e) => openPop('cal', e)}>
              <svg className="fic" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="1" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
              <span>{s.arr && s.dep ? `${s.arr.getDate()} ${MON[s.arr.getMonth()]} – ${s.dep.getDate()} ${MON[s.dep.getMonth()]}` : 'Dates'}</span>
            </button>
            <button className="fbtn" onClick={() => setFiltersOpen(true)}>☰ All filters</button>
            <button className="fbtn" onClick={() => { setFiltersOpen(true); setTimeout(() => fbodyRef.current?.querySelector('[data-grp="rooms"]')?.scrollIntoView({ block: 'start' }), 200) }}>Rooms</button>
            <button className="fbtn" onClick={() => { setFiltersOpen(true); setTimeout(() => fbodyRef.current?.querySelector('[data-grp="budget"]')?.scrollIntoView({ block: 'start' }), 200) }}>Price</button>
            <button className="fbtn" onClick={() => { setFiltersOpen(true); setTimeout(() => fbodyRef.current?.querySelector('[data-grp="features"]')?.scrollIntoView({ block: 'start' }), 200) }}>Features</button>
          </div>
          <div className="fmeta"><span><b>{list.length}</b> chalets</span><span className="sort">Sort by: Recommended ⌄</span></div>
        </div></div>

        <div className="rlayout">
          <div className="rcol">
            <div className={`datehint${s.arr && s.dep ? ' on' : ''}`}>
              {s.arr && s.dep && (
                <>
                  <b>{fmtD(s.arr)} → {fmtD(s.dep)}</b> · {nights} nights.{' '}
                  {s.flex
                    ? <>Showing <b>Saturday and Sunday changeovers</b> — including chalets that run a day either side, so you see as many options as possible.</>
                    : <>Showing only <b>{DOWS[s.arr.getDay()]}</b> changeovers — switch on flexible dates to include the other changeover day.</>}
                </>
              )}
            </div>
            <div className="rgrid">
              {list.length
                ? list.map(chaletCard)
                : <div className="rempty">{resortName || initialCountry
                  ? <>We are finalising the Vertige collection in {resortName ?? initialCountry} for the coming season. Share your dates and party size and our team will send a hand-picked shortlist within a day.</>
                  : <>No chalets match these filters yet. Try widening your search, or let our team curate a bespoke selection for you.</>}</div>}
            </div>
          </div>
          <div className="mapcol">
            <div id="map">
              <div id="mapPins" onClick={() => setActivePin(null)}>
                {list.map((c) => {
                  const i = chalets.indexOf(c)
                  return (
                    <button key={c.name} className={`mpin${activePin === i ? ' act' : ''}`} style={{ left: `${c.mx * 100}%`, top: `${c.my * 100}%` }} onClick={(e) => { e.stopPropagation(); setActivePin(i) }}>
                      <span className="dot">{c.from > 0 ? price(c, c.from) : '—'}</span>
                    </button>
                  )
                })}
                {activePin != null && (() => {
                  const c = chalets[activePin]
                  return (
                    <div className={`mpop${c.my < 0.42 ? ' below' : ''}`} style={{ left: `${c.mx * 100}%`, top: `${c.my * 100}%` }} onClick={stopAll}>
                      <button className="cx" onClick={() => setActivePin(null)}>×</button>
                      <Link className="lk" href={c.slug ? `/chalets/${c.slug}` : '/chalets/sample'} target="_blank" rel="noopener">
                        <div className="im" style={{ backgroundImage: `url(${c.img})` }} />
                        <div className="b"><h4>{c.name}</h4><div className="r">{c.resort}, {c.country}</div><div className="pr">{c.from > 0 ? `From ${price(c, c.from)} / week` : 'Price on request'}</div><span className="view">View chalet ↗</span></div>
                      </Link>
                    </div>
                  )
                })()}
              </div>
              <span className="map-cap">Map placeholder · live Google Maps pins to follow</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter panel ── */}
      <div className={`foverlay${filtersOpen ? ' on' : ''}`} onClick={() => setFiltersOpen(false)} />
      <aside className={`fpanel${filtersOpen ? ' on' : ''}`}>
        <div className="fhead"><h2>All filters</h2><button className="x" onClick={() => setFiltersOpen(false)}>×</button></div>
        <div className="fbody" ref={fbodyRef}>
          {chkGroups.slice(0, 1).map((g) => (
            <div key={g.title} className="fgrp" data-grp={g.grp}>
              <h4>{g.title}</h4>
              {g.opts.map((o) => (
                <label key={o.v} className="chk"><input type="checkbox" checked={s[g.f].includes(o.v)} onChange={(e) => toggleF(g.f, o.v, e.target.checked)} /><span>{o.label}</span></label>
              ))}
            </div>
          ))}
          <div className="fgrp" data-grp="rooms">
            <h4>Bedrooms &amp; Bathrooms</h4>
            {([['beds', 'Bedrooms'], ['baths', 'Bathrooms']] as const).map(([k, n]) => (
              <div key={k} className="stepper"><span>{n}</span><div className="ctrl">
                <button onClick={() => set({ [k]: Math.max(0, s[k] - 1) } as Partial<FilterState>)}>−</button>
                <span className="v">{s[k]}</span>
                <button onClick={() => set({ [k]: s[k] + 1 } as Partial<FilterState>)}>+</button>
              </div></div>
            ))}
          </div>
          <div className="fgrp" data-grp="budget">
            <h4>Price per week (£)</h4>
            <div className="budget">
              <div><label>From</label><input type="number" value={s.bfrom} placeholder="0" onChange={(e) => set({ bfrom: e.target.value })} /></div>
              <div><label>To</label><input type="number" value={s.bto} placeholder="Any" onChange={(e) => set({ bto: e.target.value })} /></div>
            </div>
          </div>
          {chkGroups.slice(1).map((g) => (
            <div key={g.title} className="fgrp" data-grp={g.grp}>
              <h4>{g.title}</h4>
              {g.opts.map((o) => (
                <label key={o.v} className="chk"><input type="checkbox" checked={s[g.f].includes(o.v)} onChange={(e) => toggleF(g.f, o.v, e.target.checked)} /><span>{o.label}</span></label>
              ))}
            </div>
          ))}
        </div>
        <div className="ffoot">
          <button className="btn erase" onClick={() => set({ tier: [], country: [], ptype: [], attr: [], beds: 0, baths: 0, bfrom: '', bto: '' })}>Erase all</button>
          <button className="btn" onClick={() => setFiltersOpen(false)}>See {list.length} chalets</button>
        </div>
      </aside>

      {guide}

      {wlToast && <div className="wltoast" style={{ display: 'block' }}>{wlToast}</div>}
    </>
  )
}
