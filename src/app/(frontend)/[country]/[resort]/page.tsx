import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COUNTRIES, ALL_DESTINATIONS } from '@/lib/destinations'
import { RESORT_FACTS } from '@/lib/facts-data'
import { FactStrip } from '@/components/FactStrip'
import guides from '@/content/t1_guides_rich.json'

// Destination landing page — LEAN first pass of the 02 §5 template, built to
// host the icon fact-chips for review. Still to come from the full spec:
// sticky Overview/Chalets/Guide tabs, the scoped chalet search + map (portal
// adapter), journal-from-resort, and the "Read the guide" band. Editorial
// intro comes from the guide content data (t1_guides_rich.json) until the
// Payload Destinations collection lands.

interface Guide { slug: string; name: string; intro?: string; skiing?: string }

export function generateStaticParams() {
  return ALL_DESTINATIONS.map((d) => ({ country: d.countrySlug, resort: d.slug }))
}

export default async function DestinationPage({ params }: { params: Promise<{ country: string; resort: string }> }) {
  const { country: countrySlug, resort: resortSlug } = await params
  const country = COUNTRIES.find((c) => c.slug === countrySlug)
  const resort = country?.resorts.find((r) => r.slug === resortSlug)
  if (!country || !resort) notFound()

  const guide = (guides as Guide[]).find((g) => g.slug === resortSlug)
  const facts = RESORT_FACTS[resortSlug] ?? []
  const heroCandidates = ['verbier', 'chamonix', 'courchevel']
  const hero = heroCandidates.includes(resortSlug)
    ? `/images/destinations/${resortSlug}-hero.jpg`
    : country.navImage

  return (
    <>
      <section className="hero">
        <div className="bg" style={{ backgroundImage: `url(${hero})` }} />
        <div className="wrap">
          <div className="eyebrow">{country.name}</div>
          <h1>{resort.name}</h1>
          <p className="sub">Luxury chalets, brokered on behalf of their owners — with Vertige concierge on every stay.</p>
          <div className="hcta">
            <Link className="btn" href={`/chalets?resort=${resort.slug}`}>View chalets</Link>
            <Link className="btn ghost" href="/contact">Speak to a specialist</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {guide?.intro && (
            <div className="dest-intro" style={{ marginBottom: '2.6rem' }}>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Why {resort.name}</div>
              <p>{guide.intro}</p>
            </div>
          )}
          <FactStrip facts={facts} />
        </div>
      </section>

      <section className="section warm2" style={{ paddingTop: 'clamp(2rem,4vw,3rem)' }}>
        <div className="wrap">
          <div className="gblock" style={{ borderTop: 'none' }}>
            <div className="gl">
              <h3>About skiing in {resort.name}</h3>
              <p className="intro">The mountain, the lift system and who it suits — from the full Vertige guide.</p>
            </div>
            <div className="gr">
              <p>{guide?.skiing?.slice(0, 420) ?? 'Guide content for this resort is being prepared by the editorial team.'}{guide?.skiing && guide.skiing.length > 420 ? '…' : ''}</p>
              <Link className="more" href={`/journal/guide/${resort.slug}-guide`}>Read the full Vertige guide →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ textAlign: 'center' as const }}>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>Chalets in {resort.name}</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', marginBottom: '1rem' }}>The collection, <em>hand-picked.</em></h2>
          <p style={{ color: 'var(--muted)', maxWidth: '52ch', margin: '0 auto 1.6rem' }}>
            Live chalet availability for {resort.name} arrives with the res-portal connection — every property vetted, every price indicative until confirmed by the team.
          </p>
          <Link className="btn" href="/contact">Enquire about {resort.name}</Link>
        </div>
      </section>
    </>
  )
}
