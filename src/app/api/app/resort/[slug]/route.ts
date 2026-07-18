import { NextResponse } from 'next/server'
import { ALL_DESTINATIONS } from '@/lib/destinations'
import { getDestContent } from '@/lib/dest-content'
import { resortImage } from '@/lib/country-content'
import guides from '@/content/t1_guides_rich.json'
import articles from '@/content/journal_articles.json'
import { appCors } from '../../shape'

// Resort editorial for the app (Ben, 2026-07-18: the website has the
// content — use it). Serves the same dest-content module as the site's
// destination pages plus related Journal reading, so resort pages carry
// identical editorial on both surfaces.

interface Article { slug: string; cat: string; title: string; dek: string; hero: string; read: number | string }

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dest = ALL_DESTINATIONS.find((d) => d.slug === slug)
  if (!dest) return NextResponse.json({ error: 'not found' }, { status: 404, headers: appCors })

  const content = getDestContent(slug, dest.name)
  const heroImage = resortImage(slug, dest.countrySlug)

  // Related reading: the resort's own guide first, then journal articles
  // that mention it.
  const reading: { slug: string; title: string; dek: string; href: string; img: string; read?: string }[] = []
  if ((guides as { slug: string }[]).some((g) => g.slug === slug)) {
    reading.push({
      slug: `${slug}-guide`,
      title: `The Vertige guide to ${dest.name}`,
      dek: content.heroSub,
      href: `/journal/guide/${slug}-guide`,
      img: heroImage,
    })
  }
  const nameLc = dest.name.toLowerCase()
  for (const a of articles as unknown as Article[]) {
    if (`${a.title} ${a.dek}`.toLowerCase().includes(nameLc)) {
      reading.push({ slug: a.slug, title: a.title, dek: a.dek, href: `/journal/${a.slug}`, img: `/images/chalets/${a.hero}.webp`, read: String(a.read) })
    }
  }

  return NextResponse.json(
    {
      name: dest.name,
      country: dest.country,
      countrySlug: dest.countrySlug,
      heroImage,
      heroSub: content.heroSub,
      overviewLead: content.overviewLead,
      guideBlocks: content.guideBlocks,
      gfacts: content.gfacts,
      hasGuide: content.hasGuide,
      reading: reading.slice(0, 4),
    },
    { headers: appCors },
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: appCors })
}
