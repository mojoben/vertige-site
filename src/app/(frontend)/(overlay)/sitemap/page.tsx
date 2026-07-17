import React from 'react'
import Link from 'next/link'
import { COUNTRIES, destinationPath } from '@/lib/destinations'
import guides from '@/content/t1_guides_rich.json'
import articles from '@/content/journal_articles.json'
import inspiration from '@/content/inspiration.json'
import { COUNTRY_CONTENT } from '@/lib/country-content'

// Sitemap — faithful port of vertige-proto-sitemap.html, generated from the
// same data modules the nav uses so it never drifts from the built routes.

export const metadata = {
  title: 'Sitemap — Vertige',
  description: 'Every corner of the Vertige site, in one place.',
}

export default function SitemapPage() {
  const guideList = [
    ...(guides as { slug: string; name: string }[]).map((g) => ({ href: `/journal/guide/${g.slug}-guide`, name: g.name })),
    ...COUNTRY_CONTENT.map((c) => ({ href: `/journal/guide/${c.slug}-guide`, name: c.name })),
  ].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/chalets/ext-13.webp)' }} />
        <div className="wrap">
          <span className="eyebrow">Find your way around</span>
          <h1>Sitemap</h1>
          <p className="sub">Every corner of the Vertige site, in one place.</p>
        </div>
      </section>

      <section className="sect"><div className="wrap">
        <div className="smgrid">
          <div className="smcol"><h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/chalets">All chalets</Link>
            <Link href="/wishlist">My Favourites</Link>
            <Link href="/concierge">Concierge</Link>
            <Link href="/approach">The Approach</Link>
            <Link href="/journal">The Journal</Link>
          </div>
          <div className="smcol"><h3>Company</h3>
            <Link href="/about">Our Story</Link>
            <Link href="/approach">The Approach</Link>
            <Link href="/owners">Join the Portfolio</Link>
            <Link href="/concierge">Concierge</Link>
          </div>
          <div className="smcol"><h3>Help</h3>
            <Link href="/contact">Contact us</Link>
            <Link href="/faq">FAQ &amp; Help</Link>
            <Link href="/sitemap">Sitemap</Link>
          </div>
          <div className="smcol"><h3>Legal</h3>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>

        <div className="smwide"><h3>Destinations</h3>
          <div className="smcountry">
            {COUNTRIES.map((c) => (
              <div key={c.slug}>
                <div className="cc"><Link href={`/${c.slug}`}>{c.name}</Link></div>
                {c.resorts.map((r) => <Link key={r.slug} href={destinationPath(c.slug, r.slug)}>{r.name}</Link>)}
              </div>
            ))}
          </div>
        </div>

        <div className="smwide"><h3>Destination Guides</h3>
          <div className="smcountry">
            {guideList.map((g) => <Link key={g.href} href={g.href}>{g.name}</Link>)}
          </div>
        </div>

        <div className="smwide"><h3>Inspiration collections</h3>
          <div className="smcountry">
            {(inspiration as { slug: string; name: string }[]).map((o) => (
              <Link key={o.slug} href={`/inspiration/${o.slug}`}>{o.name}</Link>
            ))}
          </div>
        </div>

        <div className="smwide"><h3>The Journal</h3>
          <div className="smcountry">
            {(articles as { slug: string; title: string }[]).map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`}>{a.title}</Link>
            ))}
          </div>
        </div>
      </div></section>
    </>
  )
}
