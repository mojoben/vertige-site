import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import inspiration from '@/content/inspiration.json'
import { DestinationExplorer, type CatalogueChalet } from '@/components/DestinationExplorer'
import { getCatalogue } from '@/lib/portal-client'

// Inspiration collection pages — faithful port of
// vertige-proto-inspiration-{slug}.html (HANDOFF 08 §3): the destination
// template with no resort/country scope and no guide tab; each collection
// applies its themed filter over the whole catalogue. Modelled to become a
// CMS "Collection" type (title + hero + overview + filter definition) so
// editors can add collections without code.

interface Inspo { slug: string; name: string; hero: string; sub: string; ov1: string; ov2: string }

const INSPO = inspiration as Inspo[]

// Resorts that hold their snow into spring (high / glacier — 08 §3 table).
const LATE_SEASON_RESORTS = [
  'Val Thorens', 'Tignes', "Val d'Isère", 'Zermatt', 'Cervinia', 'Sölden', 'Hintertux', 'Obertauern', 'Andermatt', 'Zürs', 'Saas-Fee', 'Les Arcs', 'La Plagne',
]

// The intended filter/query per collection (08 §3). "Where to ski this
// season" and "New to the collection" are editorial (featured flag / date
// added) — those fields arrive with the CMS Collection type, so they show
// the full catalogue until then.
const FILTERS: Record<string, (c: CatalogueChalet) => boolean> = {
  'ski-in-ski-out': (c) => c.attrs.includes('ski-in'),
  'pool-and-spa': (c) => ['indoor-pool', 'spa', 'hot-tub'].some((a) => c.attrs.includes(a)),
  // 'winter-2026-27' is editorial like where-to-ski-this-season: the whole
  // bookable collection, narrowed by dates rather than a theme.
  'private-chef': (c) => c.attrs.includes('chef'),
  'large-groups': (c) => c.guests >= 12,
  'late-season-snow': (c) => LATE_SEASON_RESORTS.some((r) => c.resort.toLowerCase().includes(r.toLowerCase())),
}

export function generateStaticParams() {
  return INSPO.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const o = INSPO.find((x) => x.slug === slug)
  return o
    ? {
        title: `${o.name} — Luxury Ski Chalets | Vertige`,
        description: `${o.name} — a curated Vertige collection of luxury ski chalets across the Alps. ${o.sub}`,
      }
    : {}
}

export default async function InspirationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const o = INSPO.find((x) => x.slug === slug)
  if (!o) notFound()

  const { chalets } = await getCatalogue()
  const themed = FILTERS[o.slug] ? chalets.filter(FILTERS[o.slug]) : chalets
  const hero = `/${o.hero}`

  const overview = (
    <section className="dsec" id="overview">
      <h2 className="lead-h">{o.name}</h2>
      <p className="lead-p">{o.ov1}</p>
      <p className="lead-p">{o.ov2}</p>
    </section>
  )

  return (
    <div className="dpage">
      {/* Hero */}
      <section className="dhero" id="top">
        <div className="bg" style={{ backgroundImage: `url(${hero})` }} />
        <div className="wrap">
          <span className="eyebrow">Inspiration · Collection</span>
          <h1>{o.name}</h1>
          <p className="sub">{o.sub}</p>
          <a className="hbtn" href="#chalets">View the chalets ↓</a>
        </div>
      </section>

      <DestinationExplorer
        resortName={null}
        guideTabLabel={null}
        chaletsHead={{
          title: o.name,
          sub: 'Chalets from across our collection — filter by resort, size, budget, service level and features.',
        }}
        chalets={themed}
        overview={overview}
        after={
          <nav className="crumb">
            <Link href="/">Home</Link><span className="sep">›</span>
            <a href="#">Inspiration</a><span className="sep">›</span>
            {o.name}
          </nav>
        }
      />

      {/* Plan CTA */}
      <section className="plancta"><div className="in2">
        <div className="pcta-tx">
          <span className="eyebrow">Start your search</span>
          <h2>Not sure where to <em>begin</em>?</h2>
          <p>Tell us how your group skis, who&rsquo;s coming and the week you have in mind — our team will hand-pick a shortlist of chalets and plan every detail, from instructors and childcare to the tables worth booking.</p>
          <Link className="btn" href="/contact">Speak to our team</Link>
        </div>
        <div className="pcta-im" style={{ backgroundImage: 'url(/images/cta-man.jpg)' }} />
      </div></section>
    </div>
  )
}
