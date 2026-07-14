import React from 'react'
import Link from 'next/link'
import articles from '@/content/journal_articles.json'
import guides from '@/content/t1_guides_rich.json'
import { COUNTRY_CONTENT, resortImage } from '@/lib/country-content'
import { JournalIndexGrid, type JournalCard } from '@/components/JournalIndexGrid'

// The Journal index — everything findable in one place (Ben, 2026-07-14):
// the 16 worked-up articles PLUS all 30 destination guides (26 resort + 4
// country), under five simple filters. The guides stay reachable from the
// destination pages too — this is the editorial front door.

export const metadata = { title: 'The Journal — Vertige' }

interface A { slug: string; cat: string; title: string; dek: string; hero: string; read: number }
interface G { slug: string; name: string; country: string; cslug: string; intro: string }

// Original fine-grained categories → the five filter groups. "Vertige"
// (the journey essay) is featured up top and lives under All.
const GROUP: Record<string, string> = {
  'Comparison': 'Planning',
  'Planning': 'Planning',
  'When To Go': 'When to go',
  'Families & Groups': 'Families & groups',
  'The Mountain Life': 'Mountain life',
  'Dining': 'Mountain life',
  'The Local’s Guide': 'Destination guides',
  'Vertige': 'Vertige',
}

const firstSentence = (s: string) => {
  const i = s.indexOf('. ')
  return i === -1 ? s : s.slice(0, i + 1)
}

export default function JournalIndexPage() {
  const arts = articles as A[]
  const featured = arts.find((a) => a.slug === 'journal-the-journey')

  const articleCards: JournalCard[] = arts.map((a) => ({
    slug: a.slug,
    cat: GROUP[a.cat] ?? a.cat,
    title: a.title,
    dek: a.dek,
    img: `/images/chalets/${a.hero}.webp`,
    read: a.read,
  }))

  const resortGuideCards: JournalCard[] = (guides as G[]).map((g) => ({
    slug: `guide/${g.slug}-guide`,
    cat: 'Destination guides',
    title: `${g.name}: the Vertige guide`,
    dek: firstSentence(g.intro),
    img: resortImage(g.slug, g.cslug),
    read: 7,
  }))

  const countryGuideCards: JournalCard[] = COUNTRY_CONTENT.map((c) => ({
    slug: `guide/${c.slug}-guide`,
    cat: 'Destination guides',
    title: `Skiing in ${c.name}: the Vertige guide`,
    dek: `Where to go, when to travel and which resorts suit your group — ${c.name}, resort by resort.`,
    img: `/images/destinations/_ski-${c.slug}.jpg`,
    read: 8,
  }))

  const cards = [...articleCards, ...countryGuideCards, ...resortGuideCards]

  return (
    <div className="jipage">
      <section className="jhero">
        <div className="jh-bg" />
        <div className="wrap"><div className="jh-tx">
          <div className="jh-lab">Issue Nº 12 — MMXXVI</div>
          <h1>The <em>Journal</em></h1>
          <p>Dispatches from the massif — essays, guides, and correspondence from our stewards, guides, and chefs.</p>
        </div></div>
      </section>

      <div className="jifade">
        <section className="feat"><div className="wrap">
          <div className="fim">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/chalets/ext-10.webp" alt="The Vertige Journey" />
            <div className="flabel"><span className="no">Featured</span> · Vertige</div>
          </div>
          <div className="ftx">
            <div className="k">Vertige</div>
            <h2>{featured?.title ?? 'The Vertige Journey'}</h2>
            <p>{featured?.dek ?? 'Why we started, what we are building, and the one measure we care about.'}</p>
            <div className="by"><span>By Vertige</span><span>{featured?.read ?? 3} min read</span></div>
            <Link className="rd" href="/journal/journal-the-journey">Read the article →</Link>
          </div>
        </div></section>

        <JournalIndexGrid cards={cards} />
      </div>

      <section className="jnews"><div className="wrap">
        <div className="jn-eye">§ Correspondence</div>
        <h2>The Journal, <em>by post.</em></h2>
        <p>A printed edition of the quarterly, dispatched to two hundred addresses each season. Enter yours to be considered.</p>
        <form className="jn-form"><input placeholder="your@address.com" /><button className="btn" type="submit">Subscribe →</button></form>
      </div></section>
    </div>
  )
}
