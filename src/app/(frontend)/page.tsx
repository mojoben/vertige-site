import Link from 'next/link'
import { COUNTRIES } from '@/lib/destinations'

// Home — PLACEHOLDER shell proving the global chrome. The canonical home
// design is an open decision (home / home-alt / home-mockup — HANDOFF 07,
// [Ben]); this page will be rebuilt from the chosen prototype. Hero follows
// the site-wide rule: white text, left-aligned, anchored bottom-left.
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="bg" style={{ backgroundImage: 'url(/images/destinations/_ski-france.jpg)' }} />
        <div className="wrap">
          <div className="eyebrow">Luxury ski chalets &amp; concierge</div>
          <h1>The Alps, <em>arranged.</em></h1>
          <p className="sub">
            Hand-picked chalets across France, Switzerland, Austria and Italy —
            brokered on behalf of their owners, with concierge on every stay.
          </p>
          <div className="hcta">
            <Link className="btn" href="/chalets">Explore the chalets</Link>
            <Link className="btn ghost" href="/contact">Speak to a specialist</Link>
          </div>
        </div>
      </section>

      <section className="section warm">
        <div className="wrap">
          <div className="eyebrow">Destinations</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.6rem)', margin: '0.8rem 0 1.4rem' }}>
            Four countries. Fifty-five resorts.
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: '58ch', marginBottom: '1.6rem' }}>
            From Courchevel to Cortina — every chalet in the portfolio is one we
            would stay in ourselves, in a resort we know season after season.
          </p>
          <div style={{ display: 'flex', gap: '2.4rem', flexWrap: 'wrap' }}>
            {COUNTRIES.map((c) => (
              <div key={c.slug}>
                <div style={{ fontFamily: "'Ivy Mode','Cormorant Garamond',serif", fontSize: '1.2rem', color: 'var(--plum)' }}>{c.name}</div>
                <div style={{ fontSize: '.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>{c.resorts.length} resorts</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
