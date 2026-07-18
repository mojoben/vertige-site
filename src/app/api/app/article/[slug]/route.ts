import { NextResponse } from 'next/server'
import guides from '@/content/t1_guides_rich.json'
import articles from '@/content/journal_articles.json'
import { ALL_DESTINATIONS } from '@/lib/destinations'
import { resortImage } from '@/lib/country-content'
import { appCors } from '../../shape'

// Journal reading for the app (Ben, 2026-07-18: posts open in-app, not the
// website). One unified shape covers both content types:
//   {slug}         → journal article (journal_articles.json)
//   {resort}-guide → destination guide (t1_guides_rich.json, the same
//                    sections + order as the site's guide page)

interface Guide {
  slug: string; name: string; country: string
  intro: string; skiing: string; town: string; when: string
  getting: string; beyond: string; eating: string; pick: string
}
interface Section { title: string; paras: string[]; figure?: { src: string; cap?: string } | null }
interface Article {
  slug: string; cat: string; title: string; dek: string; hero: string; read: number | string
  h1: string; sub: string; lead: string | null
  sections: { title: string; paras: string[]; figure?: { src: string; cap?: string } | null }[]
  pick?: { text: string; att?: string } | null
  pickAfter?: number
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (slug.endsWith('-guide')) {
    const rslug = slug.replace(/-guide$/, '')
    const g = (guides as Guide[]).find((x) => x.slug === rslug)
    const dest = ALL_DESTINATIONS.find((d) => d.slug === rslug)
    if (!g || !dest) return NextResponse.json({ error: 'not found' }, { status: 404, headers: appCors })
    const sections: Section[] = [
      { title: 'The skiing', paras: [g.skiing] },
      { title: 'The village and the chalets', paras: [g.town] },
      { title: 'When to visit', paras: [g.when] },
      { title: 'Getting there', paras: [g.getting] },
      { title: 'Beyond the slopes', paras: [g.beyond], figure: { src: '/images/chalets/liv-10.webp', cap: `Beyond the pistes — the slow afternoons a week in ${g.name} is really about` } },
      { title: 'Eating and après', paras: [g.eating], figure: { src: '/images/chalets/din-04.webp', cap: `A long table — lunch on the mountain and dinner in ${g.name}` } },
    ].filter((s) => s.paras[0])
    return NextResponse.json(
      {
        cat: 'Destination guide',
        title: `The Vertige guide to ${g.name}`,
        sub: g.intro,
        hero: resortImage(rslug, dest.countrySlug),
        lead: null,
        sections,
        pick: g.pick ? { text: g.pick, att: 'The Vertige Pick' } : null,
        pickAfter: sections.length - 1,
      },
      { headers: appCors },
    )
  }

  const a = (articles as unknown as Article[]).find((x) => x.slug === slug)
  if (!a) return NextResponse.json({ error: 'not found' }, { status: 404, headers: appCors })
  return NextResponse.json(
    {
      cat: a.cat,
      title: a.h1 || a.title,
      sub: a.sub || a.dek,
      hero: `/images/chalets/${a.hero}.webp`,
      read: String(a.read),
      lead: a.lead ?? null,
      sections: a.sections.map((s) => ({ title: s.title, paras: s.paras, figure: s.figure ?? null })),
      pick: a.pick ?? null,
      pickAfter: a.pickAfter ?? null,
    },
    { headers: appCors },
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: appCors })
}
