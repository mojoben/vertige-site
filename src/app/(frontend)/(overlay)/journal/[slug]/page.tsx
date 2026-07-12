import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import articles from '@/content/journal_articles.json'
import { ALL_DESTINATIONS, destinationPath } from '@/lib/destinations'
import { Share, TocSpy } from '@/components/ArticleBits'
import { SITE } from '@/lib/site'

// Journal article — faithful port of vertige-proto-journal-{slug}.html.
// The 15 articles were extracted from the prototype pages into
// journal_articles.json (same flagship layout as the destination guides).

interface Article {
  slug: string; cat: string; title: string; dek: string; hero: string; read: number
  h1: string; sub: string; lead: string
  sections: { id: string; title: string; paras: string[]; figure: { src: string; alt: string; cap: string } | null }[]
  pick: { text: string; att: string } | null
  pickAfter: number
}

export function generateStaticParams() {
  return (articles as Article[]).map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = (articles as Article[]).find((x) => x.slug === slug)
  return a ? { title: `${a.title} — Vertige`, description: a.dek } : {}
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = (articles as Article[]).find((x) => x.slug === slug)
  if (!a) notFound()

  const hero = `/images/chalets/${a.hero}.webp`
  const idx = (articles as Article[]).findIndex((x) => x.slug === slug)
  const related = (articles as Article[]).filter((x) => x.slug !== slug).slice(idx % 3, idx % 3 + 3)

  // Some article paragraphs carry markdown-style resort links,
  // e.g. [Bad Gastein](https://vertigeski.com/destinations/bad-gastein) —
  // resolve them to the built destination routes.
  const linkify = (text: string): React.ReactNode[] => {
    const out: React.ReactNode[] = []
    let last = 0
    for (const m of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) {
      out.push(text.slice(last, m.index))
      const destSlug = m[2].match(/\/destinations\/([a-z0-9-]+)/)?.[1]
      const dest = destSlug ? ALL_DESTINATIONS.find((d) => d.slug === destSlug) : null
      out.push(dest
        ? <Link key={m.index} href={destinationPath(dest.countrySlug, dest.slug)}>{m[1]}</Link>
        : <a key={m.index} href={m[2]}>{m[1]}</a>)
      last = (m.index ?? 0) + m[0].length
    }
    out.push(text.slice(last))
    return out
  }

  const renderSection = (s: Article['sections'][number], i: number) => (
    <section key={s.id} id={s.id}>
      <h2><span className="rn">{String(i + 1).padStart(2, '0')}</span>{s.title}</h2>
      {s.paras.map((p, j) => <p key={j}>{linkify(p)}</p>)}
      {s.figure && (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.figure.src} alt={s.figure.alt} />
          <figcaption>{s.figure.cap}</figcaption>
        </figure>
      )}
    </section>
  )

  return (
    <>
      <section className="ahero">
        <div className="bg" style={{ backgroundImage: `url(${hero})` }} />
        <div className="kick"><div className="wrap">The Vertige Journal</div></div>
        <div className="btm"><div className="wrap">
          <div className="cat">§ {a.cat}</div>
          <h1>{a.h1}</h1>
          <p className="sub">{a.sub}</p>
        </div></div>
      </section>

      <div className="jfade">
        <div className="ameta"><div className="wrap">
          <div className="who">
            <div className="av" style={{ backgroundImage: `url(${hero})` }} />
            <div><div className="n">The Vertige Journal</div><div className="r">{a.cat}</div></div>
          </div>
          <div className="mid">{a.cat} · {a.read} min read</div>
          <Share title={`${a.title} — Vertige`} />
        </div></div>

        <div className="artbody"><div className="wrap">
          <aside className="toc">
            <TocSpy />
            <div className="th">§ Contents</div>
            <nav>
              {a.sections.map((s, i) => <a key={s.id} href={`#${s.id}`} className={i === 0 ? 'on' : undefined}>{s.title}</a>)}
            </nav>
            <div className="fu">
              <div className="th">Filed under</div>
              <div className="tags"><span>{a.cat}</span><span>Journal</span></div>
            </div>
          </aside>

          <article className="artmain">
            <p className="lead">{a.lead}</p>

            {a.sections.slice(0, a.pickAfter + 1).map((s, i) => renderSection(s, i))}

            {a.pick && (
              <div className="pullq">
                <p>{a.pick.text}</p>
                <div className="att">{a.pick.att}</div>
              </div>
            )}

            {a.sections.slice(a.pickAfter + 1).map((s, i) => renderSection(s, a.pickAfter + 1 + i))}

            <div className="endmark">§ ✦ End</div>

            <div className="jcta">
              <div className="jcta-im" style={{ backgroundImage: 'url(/images/cta-man.jpg)' }} />
              <div className="jcta-tx">
                <div className="k">§ Plan your stay</div>
                <h3>Looking for the right chalet?</h3>
                <p>Tell us how you like to ski and who you&rsquo;re travelling with, and we&rsquo;ll find the chalet that fits — then take care of everything, from the first enquiry to the last morning on the mountain.</p>
                <div className="jcta-row"><Link className="btn" href="/chalets">Speak to a specialist</Link><span className="jcta-ph">or call <b>{SITE.phone}</b></span></div>
              </div>
            </div>
          </article>
        </div></div>
      </div>

      {/* More from the Journal */}
      <section className="same"><div className="wrap">
        <div className="sh"><h2>More from the Journal</h2><Link href="/journal">The full Journal →</Link></div>
        <div className="g3">
          {related.map((r) => (
            <Link key={r.slug} className="jcard" href={`/journal/${r.slug}`}>
              <div className="jc-im">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/chalets/${r.hero}.webp`} alt={r.title} />
              </div>
              <div className="jc-meta">{r.cat}</div>
              <h3>{r.title}</h3>
              <p className="jc-ex">{r.dek}</p>
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
