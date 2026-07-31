import { NextResponse } from 'next/server'
import { getCatalogue } from '@/lib/portal-client'
import { ALL_DESTINATIONS, destinationPath } from '@/lib/destinations'
import { loadArticles, loadResortGuides } from '@/lib/web-content'

// Header-search index: the 55 canonical destinations + the LIVE chalet
// catalogue + journal articles and guides. Chrome fetches this lazily the
// first time the search overlay opens (destinations render instantly from
// the static list while this loads).

export const revalidate = 900 // refresh every 15 min

interface Hit { n: string; s: string; h: string }

export async function GET() {
  const { chalets } = await getCatalogue()
  const items: Hit[] = [
    ...ALL_DESTINATIONS.map((d) => ({
      n: d.name,
      s: d.country,
      h: destinationPath(d.countrySlug, d.slug),
    })),
    ...chalets
      .filter((c) => c.slug)
      .map((c) => ({
        n: c.name,
        s: `${c.resort} · ${c.country}`,
        h: c.href ?? `/chalets/${c.slug}`,
      })),
    ...((await loadArticles()) as { title: string; slug: string; cat: string }[]).map((a) => ({
      n: a.title,
      s: `The Journal · ${a.cat}`,
      h: `/journal/${a.slug}`,
    })),
    ...((await loadResortGuides()) as { name: string; slug: string; country: string }[]).map((g) => ({
      n: `${g.name}: the complete ski guide`,
      s: `Destination guide · ${g.country}`,
      h: `/journal/guide/${g.slug}-guide`,
    })),
  ]
  return NextResponse.json({ items })
}
