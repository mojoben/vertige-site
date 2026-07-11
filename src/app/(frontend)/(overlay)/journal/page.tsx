import React from 'react'
import Link from 'next/link'
import articles from '@/content/journal_articles.json'
import { JournalIndexGrid } from '@/components/JournalIndexGrid'

// The Journal index — faithful port of vertige-proto-journal.html.
// Hero, featured essay, section filter, masonry grid of the 15 worked-up
// articles, and the newsletter band.

export const metadata = { title: 'The Journal — Vertige' }

interface A { slug: string; cat: string; title: string; dek: string; hero: string; read: number }

export default function JournalIndexPage() {
  const all = articles as A[]
  const featured = all.find((a) => a.slug === 'journal-the-journey')
  const cards = all.map(({ slug, cat, title, dek, hero }) => ({ slug, cat, title, dek, hero }))
  const reads = Object.fromEntries(all.map((a) => [a.slug, a.read]))

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

        <JournalIndexGrid cards={cards} reads={reads} />
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
