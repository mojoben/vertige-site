'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Journal index: section filter bar + masonry grid — the prototype's jFilter()
// as React state. Cards alternate 4/5 and 5/4 aspect ratios as the prototype.

export interface JournalCard {
  slug: string
  cat: string
  title: string
  dek: string
  hero: string
}

const catKey = (cat: string) => cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const TABS: { f: string; label: string }[] = [
  { f: 'all', label: 'All' },
  { f: 'comparison', label: 'Comparison' },
  { f: 'the-local-s-guide', label: 'The Local’s Guide' },
  { f: 'the-mountain-life', label: 'The Mountain Life' },
  { f: 'planning', label: 'Planning' },
  { f: 'when-to-go', label: 'When To Go' },
  { f: 'families-groups', label: 'Families & Groups' },
  { f: 'vertige', label: 'Vertige' },
]

export function JournalIndexGrid({ cards, reads }: { cards: JournalCard[]; reads: Record<string, number> }) {
  const [f, setF] = useState('all')
  const shown = cards.filter((c) => f === 'all' || catKey(c.cat) === f)
  const n = shown.length

  return (
    <>
      <nav className="jfilter"><div className="wrap">
        <div className="lab">§ Filter by section</div>
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.f} className={`tab${f === t.f ? ' on' : ''}`} onClick={() => setF(t.f)}>{t.label}</button>
          ))}
        </div>
        <div className="cnt">{n < 10 ? `0${n}` : n}{n === 1 ? ' Entry' : ' Entries'}</div>
      </div></nav>

      <section className="jgrid"><div className="wrap">
        <div className="cols">
          {cards.map((c, i) => {
            const hide = f !== 'all' && catKey(c.cat) !== f
            return (
              <Link key={c.slug} className={`jcard${hide ? ' hide' : ''}`} href={`/journal/${c.slug}`}>
                <div className="jc-im" style={{ aspectRatio: i % 2 === 0 ? '4/5' : '5/4' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/chalets/${c.hero}.webp`} alt="" />
                  <div className="ov">{c.cat}</div>
                </div>
                <div className="jc-meta">{c.cat} · {reads[c.slug] ?? 3} min</div>
                <h3>{c.title}</h3>
                <p className="jc-ex">{c.dek}</p>
                <div className="jc-by">By Vertige</div>
              </Link>
            )
          })}
        </div>
      </div></section>
    </>
  )
}
