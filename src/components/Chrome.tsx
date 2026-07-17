'use client'

// Global chrome: fixed/overlay header + multi-level slide-out nav + search
// overlay. Ported from the flagship prototype (vertige-proto-journal-article.html)
// per HANDOFF/01 §3/§7 and 02 §2–§3. One client component so the three share
// open/close state; the page body stays server-rendered.

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { COUNTRIES, ALL_DESTINATIONS, destinationPath } from '@/lib/destinations'
import { SITE } from '@/lib/site'
import { WishlistHeaderButton } from '@/components/WishlistBits'

// overlay: fixed, transparent over the hero → solid past it (flagship pages).
// solid:   fixed, always solid (pages with no hero).
// light:   sticky, always white — the destination/listing-page header; sits in
//          flow so the sticky tabs/filterbar can stack beneath it (top: 80px).
// static:  absolute, transparent over the hero and scrolls away with it — the
//          chalet-detail header (its sticky subnav takes over at top: 0).
type Variant = 'overlay' | 'solid' | 'light' | 'static'

// Mock search dataset (resorts are real; chalets placeholder until the portal
// adapter lands — HANDOFF 07 "Site search").
const SEARCH_DATA = [
  ...ALL_DESTINATIONS.map((d) => ({
    n: d.name,
    s: d.country,
    h: destinationPath(d.countrySlug, d.slug),
  })),
  { n: 'Chalet Aiguille', s: 'Verbier · Switzerland', h: '/chalets' },
  { n: 'Chalet Bellevarde', s: "Val d'Isère · France", h: '/chalets' },
  { n: 'Chalet Cervin', s: 'Zermatt · Switzerland', h: '/chalets' },
]

const BackIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
)

export function Chrome({ variant = 'overlay' }: { variant?: Variant }) {
  const [navOpen, setNavOpen] = useState(false)
  const [panels, setPanels] = useState<string[]>([]) // stack of open sub-panels
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Header is solid white on every page, hero or not (Ben, 2026-07-14:
  // "really, really clear and visible") — the prototype's transparent-over-
  // hero state and its scroll threshold are retired. "scrolled" stays as
  // the CSS hook for the solid styling.
  const scrolled = true

  // Lock body scroll while an overlay is open; Escape closes.
  useEffect(() => {
    document.body.style.overflow = navOpen || searchOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeNav(); setSearchOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navOpen, searchOpen])

  function closeNav() {
    setNavOpen(false)
    setTimeout(() => setPanels([]), 350) // reset sub-views after the slide-out
  }
  const showPanel = (id: string) => setPanels((p) => [...p, id])
  const backPanel = (id: string) => setPanels((p) => p.filter((x) => x !== id))
  const openSearch = () => { setSearchOpen(true); setQuery('') }

  const results = SEARCH_DATA.filter(
    (d) => !query.trim()
      || d.n.toLowerCase().includes(query.trim().toLowerCase())
      || d.s.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const subtop = (id: string) => (
    <div className="subtop">
      <button className="back" onClick={() => backPanel(id)}><BackIcon /> Back</button>
      <button className="navx" onClick={closeNav} aria-label="Close menu">×</button>
    </div>
  )

  // Contact / help / language block — rendered at the bottom of EVERY nav
  // level, not just the first (Ben, 2026-07-17).
  const navFoot = (
    <div className="navfoot">
      <div className="nf-row">
        <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" /></svg>
        <div className="t">Our advisors can be reached on <b>{SITE.phone}</b><span>{SITE.phoneHours}</span></div>
      </div>
      <div className="nf-row"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg><Link href="/contact" onClick={closeNav}>Contact us</Link></div>
      <div className="nf-row nf-xtra"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 1 1 4.5 2.6c-.9.5-1.6 1.2-1.6 2.4" /><path d="M12 17h.01" /></svg><Link href="/faq" onClick={closeNav}>FAQ &amp; Help</Link></div>
      <div className="nf-row nf-xtra"><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="14" y2="18" /></svg><Link href="/sitemap" onClick={closeNav}>Sitemap</Link></div>
      <div className="nf-lang"><a href="#">English · GBP</a></div>
    </div>
  )

  return (
    <>
      {/* ── Slide-out nav ── */}
      <div className={`navov${navOpen ? ' on' : ''}`} onClick={closeNav} />
      <nav className={`navpanel${navOpen ? ' on' : ''}`} aria-label="Main menu">
        <div className="nv nv-main">
          <div className="navtop"><button className="navx" onClick={closeNav} aria-label="Close menu">×</button></div>
          <div className="navlinks">
            <button className="nvlink" onClick={() => showPanel('dest')}>Destinations</button>
            <button className="nvlink" onClick={() => showPanel('insp')}>Inspiration</button>
            <button className="nvlink" onClick={() => showPanel('about')}>About us</button>
            <Link className="nvlink" href="/concierge" onClick={closeNav}>Concierge</Link>
            <Link className="nvlink" href="/approach" onClick={closeNav}>The Approach</Link>
            <Link className="nvlink" href="/journal" onClick={closeNav}>The Journal</Link>
            <Link className="nvlink" href="/owners" onClick={closeNav}>Join the portfolio</Link>
          </div>
          {navFoot}
        </div>

        {/* Destinations → country cards */}
        <div className={`nv${panels.includes('dest') ? ' on' : ''}`}>
          {subtop('dest')}
          <div className="nvbody">
            <div className="nvtitle">Destinations</div>
            <div className="nv-grid">
              {COUNTRIES.map((c) => (
                <button key={c.slug} className="nv-country" onClick={() => showPanel(c.slug)}>
                  <div className="im" style={{ backgroundImage: `url(${c.navImage})` }} />
                  <h4>{c.name}</h4>
                  <div className="c">{c.resorts.length} resorts</div>
                </button>
              ))}
            </div>
          </div>
          {navFoot}
        </div>

        {/* Country → resort lists (Signature / More — never "Tier") */}
        {COUNTRIES.map((c) => (
          <div key={c.slug} className={`nv${panels.includes(c.slug) ? ' on' : ''}`}>
            {subtop(c.slug)}
            <div className="nvbody">
              <div className="nvtitle">{c.name}</div>
              <Link className="nv-seeall" href={`/${c.slug}`} onClick={closeNav}>
                {c.name}: see all chalets →
              </Link>
              <div className="nv-reg">
                <div className="rh">Signature resorts</div>
                {c.resorts.filter((r) => r.tier === 1).map((r) => (
                  <Link key={r.slug} href={destinationPath(c.slug, r.slug)} onClick={closeNav}>{r.name}</Link>
                ))}
              </div>
              <div className="nv-reg">
                <div className="rh">More in {c.name}</div>
                {c.resorts.filter((r) => r.tier === 2).map((r) => (
                  <Link key={r.slug} href={destinationPath(c.slug, r.slug)} onClick={closeNav}>{r.name}</Link>
                ))}
              </div>
            </div>
            {navFoot}
          </div>
        ))}

        {/* Inspiration collections (HANDOFF 08 §3) */}
        <div className={`nv${panels.includes('insp') ? ' on' : ''}`}>
          {subtop('insp')}
          <div className="nvbody">
            <div className="nvtitle">Inspiration</div>
            <div className="nv-list">
              <Link href="/inspiration/where-to-ski-this-season" onClick={closeNav}>Where to ski this season</Link>
              <Link href="/inspiration/winter-2026-27" onClick={closeNav}>Winter 2026 / 2027</Link>
              <Link href="/inspiration/ski-in-ski-out" onClick={closeNav}>Ski-in / ski-out chalets</Link>
              <Link href="/inspiration/pool-and-spa" onClick={closeNav}>Chalets with a pool &amp; spa</Link>
              <Link href="/inspiration/private-chef" onClick={closeNav}>A private chef, included</Link>
              <Link href="/inspiration/large-groups" onClick={closeNav}>Best for large groups</Link>
              <Link href="/inspiration/new-to-the-collection" onClick={closeNav}>New to the collection</Link>
              <Link href="/journal" onClick={closeNav}>Seen in the press</Link>
              <Link href="/inspiration/remarkable-architecture" onClick={closeNav}>Remarkable architecture</Link>
              <Link href="/inspiration/late-season-snow" onClick={closeNav}>Late-season snow</Link>
            </div>
          </div>
          {navFoot}
        </div>

        {/* About us */}
        <div className={`nv${panels.includes('about') ? ' on' : ''}`}>
          {subtop('about')}
          <div className="nvbody">
            <div className="nvtitle">About us</div>
            <div className="nv-list">
              <Link href="/about" onClick={closeNav}>Our story</Link>
              <Link href="/approach" onClick={closeNav}>What makes us different</Link>
              <Link href="/about" onClick={closeNav}>Meet the founders</Link>
            </div>
          </div>
          {navFoot}
        </div>
      </nav>

      {/* ── Header ── */}
      <header className={`hdr${scrolled ? ' scrolled' : ''}${variant === 'light' ? ' light' : ''}${variant === 'static' ? ' static' : ''}`}>
        <div className="wrap">
          <button className="menu" onClick={() => setNavOpen(true)}>
            <span className="bars"><i /><i /><i /></span> Menu
          </button>
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-white" src="/images/vertige-logo-white.png" alt="Vertige" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-dark" src="/images/vertige-logo.png" alt="Vertige" />
          </Link>
          <div className="right">
            <span className="ph">☏ {SITE.phone}</span>
            <button className="hicon" onClick={openSearch} aria-label="Search">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            </button>
            <WishlistHeaderButton />
            <Link className="book" href="/contact">Book your stay</Link>
          </div>
        </div>
      </header>

      {/* ── Search overlay ── */}
      <div className={`srchbg${searchOpen ? ' on' : ''}`} onClick={() => setSearchOpen(false)} />
      <div className={`srchov${searchOpen ? ' on' : ''}`}>
        <div className="srchbar">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input
            placeholder="Search a resort or chalet…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={searchOpen}
          />
          <button className="x" onClick={() => setSearchOpen(false)} aria-label="Close">×</button>
        </div>
        <div className="srchres">
          {results.length === 0 && <div className="none">No matches — try a resort or chalet name.</div>}
          {results.map((d) => (
            <Link key={`${d.n}-${d.h}`} href={d.h} onClick={() => setSearchOpen(false)}>
              <span className="nm">{d.n}</span><span className="sub">{d.s}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
