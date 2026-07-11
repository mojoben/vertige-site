import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCountryContent, COUNTRY_CONTENT, resortImage } from '@/lib/country-content'
import { DestinationExplorer } from '@/components/DestinationExplorer'
import { getCatalogue } from '@/lib/portal-client'

// Country destination page — faithful port of vertige-proto-dest-{country}.html
// (HANDOFF 08 §1): the resort destination template scoped to a whole country.
// Tabs are Overview / Luxury Chalets / Resorts; the guide slot holds a grid of
// every resort in the country; the band links to the country guide.

export function generateStaticParams() {
  return COUNTRY_CONTENT.map((c) => ({ country: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const c = getCountryContent(country)
  return c
    ? {
        title: `Luxury Ski Chalets in ${c.name} | Vertige`,
        description: `Luxury ski chalets across ${c.name} with Vertige — ${c.resorts.length} resorts, hand-picked chalets and full concierge. Explore the ${c.cc}.`,
      }
    : {}
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: countrySlug } = await params
  const c = getCountryContent(countrySlug)
  if (!c) notFound()

  const hero = `/images/destinations/_ski-${c.slug}.jpg`
  const { chalets } = await getCatalogue()

  const overview = (
    <section className="dsec" id="overview">
      <h2 className="lead-h">Discover our luxury chalets in <em>{c.name}</em></h2>
      <p className="lead-p">{c.ov1}</p>
      <p className="lead-p">{c.ov2}</p>
    </section>
  )

  // Resorts-in-country grid (replaces the resort page's guide section).
  const resortsGrid = (
    <section className="guide" id="guide">
      <div className="chhead"><h2>Resorts in {c.name}</h2><p>Explore our chalets resort by resort — {c.resorts.length} destinations across {c.name}.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 'clamp(1rem,2vw,1.6rem)', maxWidth: 1180, margin: '0 auto', padding: '0 clamp(1.3rem,4vw,3.4rem) clamp(1.6rem,3vw,2.4rem)' }}>
        {c.resorts.map((r) => (
          <Link key={r.slug} href={`/${c.slug}/${r.slug}`} style={{ display: 'block', color: 'inherit' }}>
            <div style={{ aspectRatio: '16/10', background: `url(${resortImage(r.slug, c.slug)}) center/cover`, marginBottom: '.55rem' }} />
            <div style={{ fontFamily: "'Ivy Mode','Cormorant Garamond',serif", fontSize: '1.05rem', color: 'var(--plum)' }}>{r.name}</div>
          </Link>
        ))}
      </div>
    </section>
  )

  return (
    <div className="dpage">
      {/* SEO hero */}
      <section className="dhero" id="top">
        <div className="bg" style={{ backgroundImage: `url(${hero})` }} />
        <div className="wrap">
          <span className="eyebrow">{c.name} · {c.cc}</span>
          <h1>{c.name}</h1>
          <p className="sub">{c.sub}</p>
          <a className="hbtn" href="#chalets">View our {c.name} chalets ↓</a>
        </div>
      </section>

      <DestinationExplorer
        resortName={null}
        initialCountry={c.name}
        guideTabLabel="Resorts"
        chaletsHead={{
          title: `Luxury chalets in ${c.name}`,
          sub: `Filter by resort, size, budget, service level and features — our collection spans ${c.resorts.length} resorts across ${c.name}.`,
        }}
        chalets={chalets}
        overview={overview}
        guide={resortsGrid}
        after={
          <nav className="crumb">
            <Link href="/">Home</Link><span className="sep">›</span>
            {c.name}
          </nav>
        }
      />

      {/* Country guide band */}
      <section className="gband">
        <Link href={`/journal/guide/${c.slug}-guide`}>
          <div className="gb-im" style={{ backgroundImage: `url(${hero})` }} />
          <div>
            <span className="eyebrow">The complete guide</span>
            <h2>{c.name}: the complete ski guide</h2>
            <p>Our honest, in-depth guide to skiing in {c.name} — the regions, when to visit, getting there and beyond the slopes.</p>
          </div>
          <span className="btn" style={{ whiteSpace: 'nowrap' }}>Read the guide</span>
        </Link>
      </section>

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
