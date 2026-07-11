import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import guides from '@/content/t1_guides_rich.json'
import { ALL_DESTINATIONS, destinationPath } from '@/lib/destinations'
import { getCatalogue } from '@/lib/portal-client'
import { Share, TocSpy } from '@/components/ArticleBits'
import { SITE } from '@/lib/site'

// Destination guide article — faithful port of vertige-proto-guide-{slug}.html
// (the flagship article layout; 26 Tier-1 guides from t1_guides_rich.json, the
// same content source the prototype generators used). URL pattern per the
// handoff: /journal/guide/{resort}-guide.

interface Guide {
  slug: string; name: string; country: string; cslug: string
  intro: string; skiing: string; town: string; when: string
  getting: string; beyond: string; eating: string; pick: string
}

const firstSentence = (s: string) => {
  const i = s.indexOf('. ')
  return i === -1 ? s : s.slice(0, i + 1)
}

export function generateStaticParams() {
  return (guides as Guide[]).map((g) => ({ slug: `${g.slug}-guide` }))
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params
  if (!raw.endsWith('-guide')) notFound()
  const resortSlug = raw.replace(/-guide$/, '')
  const g = (guides as Guide[]).find((x) => x.slug === resortSlug)
  const dest = ALL_DESTINATIONS.find((d) => d.slug === resortSlug)
  if (!g || !dest) notFound()

  const hero = `/images/destinations/${resortSlug}-hero.jpg`
  const destUrl = destinationPath(dest.countrySlug, dest.slug)

  // Sandwich chalets: live portal chalets in this resort; prototype-style
  // sample cards otherwise (replaced as real chalets are imported).
  const { chalets } = await getCatalogue()
  const inResort = chalets.filter((c) => {
    const a = c.resort.toLowerCase(); const b = g.name.toLowerCase()
    return a.includes(b) || b.includes(a)
  }).slice(0, 3)
  const sampleCards = [
    { name: `Chalet ${g.name} I`, img: '/images/chalets/ext-02.webp', guests: 12, beds: 6 },
    { name: `Chalet ${g.name} II`, img: '/images/chalets/ext-03.webp', guests: 10, beds: 5 },
    { name: `Chalet ${g.name} III`, img: '/images/chalets/ext-04.webp', guests: 8, beds: 4 },
  ]

  const sections = [
    { id: 's1', title: 'The skiing', body: g.skiing },
    { id: 's2', title: 'The village and the chalets', body: g.town },
    { id: 's3', title: 'When to visit', body: g.when },
    { id: 's4', title: 'Getting there', body: g.getting },
    { id: 's5', title: 'Beyond the slopes', body: g.beyond, figure: { src: '/images/chalets/liv-10.webp', cap: `Beyond the pistes — the slow afternoons a week in ${g.name} is really about` } },
    { id: 's6', title: 'Eating and après', body: g.eating, figure: { src: '/images/chalets/din-04.webp', cap: `A long table — lunch on the mountain and dinner in ${g.name}` } },
  ]

  // Related: same country first, then the rest (3 total, prototype pattern).
  const others = (guides as Guide[]).filter((x) => x.slug !== g.slug)
  const related = [...others.filter((x) => x.country === g.country), ...others.filter((x) => x.country !== g.country)].slice(0, 3)

  return (
    <>
      <section className="ahero">
        <div className="bg" style={{ backgroundImage: `url(${hero})` }} />
        <div className="kick"><div className="wrap">The Vertige Journal — Destination Guide</div></div>
        <div className="btm"><div className="wrap">
          <div className="cat">§ {g.country} · Destination Guide</div>
          <h1>{g.name}: the complete <em>ski guide.</em></h1>
          <p className="sub">Our honest, in-depth guide to {g.name} — the skiing, the village, when to visit, getting there and everything beyond the slopes.</p>
        </div></div>
      </section>

      <div className="jfade">
        <div className="ameta"><div className="wrap">
          <div className="who">
            <div className="av" style={{ backgroundImage: `url(${hero})` }} />
            <div><div className="n">Vertige Guides</div><div className="r">Destination guide</div></div>
          </div>
          <div className="mid">{g.country} · 5 min read · {g.name}</div>
          <Share title={`${g.name}: the complete ski guide — Vertige`} />
        </div></div>

        <div className="artbody"><div className="wrap">
          <aside className="toc">
            <TocSpy />
            <div className="th">§ Contents</div>
            <nav>
              {sections.map((s, i) => <a key={s.id} href={`#${s.id}`} className={i === 0 ? 'on' : undefined}>{s.title}</a>)}
            </nav>
            <div className="fu">
              <div className="th">Filed under</div>
              <div className="tags"><span>Destination Guide</span><span>{g.country}</span><span>{g.name}</span><span>Ski Guide</span></div>
            </div>
          </aside>

          <article className="artmain">
            <p className="lead">{g.intro}</p>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero} alt={`${g.name} in winter`} />
              <figcaption>{g.name} · the resort in its setting</figcaption>
            </figure>

            {sections.slice(0, 2).map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2><span className="rn">{String(i + 1).padStart(2, '0')}</span>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}

            {/* Chalet sandwich: Where to stay */}
            <div className="locblock">
              <div className="lb-eye">§ Where to stay · {g.name}</div>
              <h2>{g.name}</h2>
              <figure className="lb-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero} alt={g.name} />
              </figure>
              <div className="lb-guide">
                <div className="g"><h4>The mountain</h4><p>{firstSentence(g.skiing)}</p></div>
                <div className="g"><h4>The village</h4><p>{firstSentence(g.town)}</p></div>
                <div className="g"><h4>Why go</h4><p>{firstSentence(g.pick)}</p></div>
              </div>
              <div className="lb-head"><h3>Handpicked chalets in {g.name}</h3></div>
              <div className="lb-cards">
                {(inResort.length ? inResort : sampleCards).map((c) => (
                  <Link key={c.name} className="ccard" href={'slug' in c && c.slug ? `/chalets/${c.slug}` : '/chalets/sample'}>
                    <div className="im" style={{ backgroundImage: `url(${c.img})` }} />
                    <h3>{c.name}</h3>
                    <div className="loc">{g.name}, {g.country}</div>
                    <div className="meta">{c.guests} guests · {c.beds} bedrooms</div>
                    <div className="go">View chalet →</div>
                  </Link>
                ))}
              </div>
              <Link className="btn block" href={destUrl} style={{ marginTop: 'clamp(1.6rem,3vw,2.2rem)', padding: '1.15rem 1.8rem' }}>
                View all chalets in {g.name}
              </Link>
            </div>

            {sections.slice(2, 4).map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2><span className="rn">{String(i + 3).padStart(2, '0')}</span>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}

            {/* The Vertige Pick */}
            <div className="pullq">
              <p>{g.pick}</p>
              <div className="att">The Vertige Pick</div>
            </div>

            {sections.slice(4).map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2><span className="rn">{String(i + 5).padStart(2, '0')}</span>{s.title}</h2>
                <p>{s.body}</p>
                {s.figure && (
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.figure.src} alt={s.title} />
                    <figcaption>{s.figure.cap}</figcaption>
                  </figure>
                )}
              </section>
            ))}

            <div className="endmark">§ ✦ End</div>

            <div className="jcta">
              <div className="jcta-im" style={{ backgroundImage: 'url(/images/cta-man.jpg)' }} />
              <div className="jcta-tx">
                <div className="k">§ Plan your stay</div>
                <h3>Planning a week in {g.name}?</h3>
                <p>Tell us how your group skis and who&rsquo;s coming, and we&rsquo;ll match you to the right chalet in {g.name} — then take care of everything, from instructors and transfers to the tables worth booking.</p>
                <div className="jcta-row"><Link className="btn" href={destUrl}>View chalets in {g.name}</Link><span className="jcta-ph">or call <b>{SITE.phone}</b></span></div>
              </div>
            </div>
          </article>
        </div></div>
      </div>

      {/* More destination guides */}
      <section className="same"><div className="wrap">
        <div className="sh"><h2>More destination guides</h2><Link href="/journal">All guides →</Link></div>
        <div className="g3">
          {related.map((r) => (
            <Link key={r.slug} className="jcard" href={`/journal/guide/${r.slug}-guide`}>
              <div className="jc-im">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/destinations/${r.slug}-hero.jpg`} alt={r.name} />
              </div>
              <div className="jc-meta">{r.country} · Destination guide</div>
              <h3>{r.name}</h3>
              <p className="jc-ex">A complete guide to skiing in {r.name} — the mountain, the village and everything beyond.</p>
            </Link>
          ))}
        </div>
      </div></section>

      {/* Newsletter */}
      <section className="jnews"><div className="wrap">
        <div className="jn-eye">§ Correspondence</div>
        <h2>The Journal, <em>by post.</em></h2>
        <p>A printed edition of the quarterly, dispatched to two hundred addresses each season. Enter yours to be considered.</p>
        <form className="jn-form"><input placeholder="your@address.com" /><button className="btn" type="submit">Subscribe →</button></form>
      </div></section>
    </>
  )
}
