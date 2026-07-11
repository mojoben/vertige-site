import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COUNTRIES, ALL_DESTINATIONS } from '@/lib/destinations'
import { getDestContent } from '@/lib/dest-content'
import { RESORT_FACTS } from '@/lib/facts-data'
import { FactStrip } from '@/components/FactStrip'
import { DestinationExplorer } from '@/components/DestinationExplorer'
import { getCatalogue } from '@/lib/portal-client'

// Destination landing page — faithful port of vertige-proto-dest-{slug}.html
// (the visual source of truth; 02 §1 "do not redesign"): SEO hero + floating
// search bar, breadcrumb, sticky scrollspy tabs, Overview, the scoped chalet
// search (filter bar + grid + placeholder map), Resort Guide blocks, the
// "Read the guide" band and the plan CTA. One template renders all 55.
// The FactStrip in Overview is the one approved addition (icon fact chips) —
// remove <FactStrip/> below to revert to prototype-exact.

export function generateStaticParams() {
  return ALL_DESTINATIONS.map((d) => ({ country: d.countrySlug, resort: d.slug }))
}

export default async function DestinationPage({ params }: { params: Promise<{ country: string; resort: string }> }) {
  const { country: countrySlug, resort: resortSlug } = await params
  const country = COUNTRIES.find((c) => c.slug === countrySlug)
  const resort = country?.resorts.find((r) => r.slug === resortSlug)
  if (!country || !resort) notFound()

  const content = getDestContent(resort.slug, resort.name)
  const hero = `/images/destinations/${resort.slug}-hero.jpg`
  // Live chalets from the res portal (mock fallback when unreachable — 03 §2).
  const { chalets } = await getCatalogue()

  const overview = (
    <section className="dsec" id="overview">
      <h2 className="lead-h">Discover our luxury chalets in <em>{resort.name}</em></h2>
      {content.overviewLead.map((p, i) => <p key={i} className="lead-p">{p}</p>)}
      {(RESORT_FACTS[resort.slug]?.length ?? 0) > 0 && (
        <div style={{ marginTop: '2.2rem' }}>
          <FactStrip facts={RESORT_FACTS[resort.slug]} />
        </div>
      )}
    </section>
  )

  const guide = (
    <section className="guide" id="guide">
      {content.guideBlocks.map((b, i) => (
        <React.Fragment key={b.title}>
          <div className="gblock">
            <div className="gl">
              <h3>{b.title}</h3>
              <p className="intro">{b.intro}</p>
              {i === 0 && content.gfacts.length > 0 && (
                <ul className="gfacts">
                  {content.gfacts.map((f) => <li key={f.label}>{f.label}<b>{f.value}</b></li>)}
                </ul>
              )}
            </div>
            <div className="gr">
              <p>{b.body}</p>
              {b.more && <p className="more">{b.more}</p>}
            </div>
          </div>
          {i === 0 && (
            <div className="gimg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero} alt={`${resort.name}, ${country.name}`} />
              <div className="cap">{resort.name} · {country.name}</div>
            </div>
          )}
        </React.Fragment>
      ))}
      {content.guideBlocks.length === 0 && (
        <div className="gblock">
          <div className="gl"><h3>The {resort.name} guide</h3><p className="intro">In preparation.</p></div>
          <div className="gr"><p>The full Vertige resort guide for {resort.name} — the skiing, the village, when to visit and getting there — is being prepared by the editorial team.</p></div>
        </div>
      )}
    </section>
  )

  return (
    <div className="dpage">
      {/* SEO hero */}
      <section className="dhero" id="top">
        <div className="bg" style={{ backgroundImage: `url(${hero})` }} />
        <div className="wrap">
          <span className="eyebrow">{country.name} {content.heroEyebrowExtra ?? ''}</span>
          <h1>{resort.name}</h1>
          <p className="sub">{content.heroSub}</p>
          <a className="hbtn" href="#chalets">View our {resort.name} chalets ↓</a>
        </div>
      </section>

      <DestinationExplorer
        resortName={resort.name}
        chalets={chalets}
        overview={overview}
        guide={guide}
        after={
          <nav className="crumb">
            <Link href="/">Home</Link><span className="sep">›</span>
            <Link href={`/${country.slug}`}>{country.name}</Link><span className="sep">›</span>
            {resort.name}
          </nav>
        }
      />

      {/* Read-the-guide band (Tier-1 resorts with a guide) */}
      {content.hasGuide && (
        <section className="gband">
          <Link href={`/journal/guide/${resort.slug}-guide`}>
            <div className="gb-im" style={{ backgroundImage: `url(${hero})` }} />
            <div>
              <span className="eyebrow">The complete guide</span>
              <h2>{resort.name}: the complete ski guide</h2>
              <p>Our honest, in-depth overview of the resort — the skiing, the village, when to visit, getting there and beyond the slopes.</p>
            </div>
            <span className="btn" style={{ whiteSpace: 'nowrap' }}>Read the guide</span>
          </Link>
        </section>
      )}

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

