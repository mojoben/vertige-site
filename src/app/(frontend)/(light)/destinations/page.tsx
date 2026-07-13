import React from 'react'
import Link from 'next/link'
import { COUNTRY_CONTENT } from '@/lib/country-content'

// Destinations index — the browse entry point (Ben, 2026-07-13: the
// wishlist's "Browse chalets" lands here). Hero in the destination-page
// treatment, then the four countries as large cards into their country
// pages, with the full-catalogue link beneath.

export const metadata = {
  title: 'Ski Destinations — France, Switzerland, Austria & Italy | Vertige',
  description:
    'Explore Vertige destinations across the Alps — 55 resorts in France, Switzerland, Austria and Italy, each with hand-picked luxury chalets and full concierge.',
}

export default function DestinationsPage() {
  const totalResorts = COUNTRY_CONTENT.reduce((n, c) => n + c.resorts.length, 0)
  return (
    <div className="dpage">
      <section className="dhero" id="top">
        <div className="bg" style={{ backgroundImage: 'url(/images/hero.jpg)' }} />
        <div className="wrap">
          <span className="eyebrow">The Alps · FR · CH · AT · IT</span>
          <h1>Destinations</h1>
          <p className="sub">Four countries, {totalResorts} resorts — every one home to chalets we know personally.</p>
          <a className="hbtn" href="#countries">Choose your country ↓</a>
        </div>
      </section>

      <section className="dsec" id="countries" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(2.2rem,4vw,3.4rem) clamp(1.3rem,4vw,3.4rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 'clamp(1rem,2vw,1.6rem)' }}>
          {COUNTRY_CONTENT.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} style={{ display: 'block', color: 'inherit' }}>
              <div style={{ aspectRatio: '4/5', background: `url(/images/destinations/_ski-${c.slug}.jpg) center/cover`, marginBottom: '.7rem' }} />
              <div style={{ fontFamily: "'Ivy Mode','Cormorant Garamond',serif", fontSize: '1.4rem', color: 'var(--plum)' }}>{c.name}</div>
              <div style={{ fontFamily: "'Proxima Nova','Inter'", fontSize: '.8rem', color: 'var(--muted)', marginTop: '.15rem' }}>{c.resorts.length} resorts</div>
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: "'Proxima Nova','Inter'", fontSize: '.9rem', marginTop: 'clamp(1.6rem,3vw,2.4rem)', textAlign: 'center' }}>
          Prefer to see everything at once? <Link href="/chalets" style={{ color: 'var(--rose)' }}>Browse the full chalet collection →</Link>
        </p>
      </section>
    </div>
  )
}
