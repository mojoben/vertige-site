import { NextResponse } from 'next/server'
import { fetchPortalProperties, fetchPortalContent, fetchPortalAvailability, toCard } from '@/lib/portal-client'
import { appCors, appChalet } from '../../shape'

// Native-app BFF: one chalet in full — card fields + approved editorial
// content + a rolling year of live week availability/pricing.

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { properties, live } = await fetchPortalProperties()
  const p = live ? properties.find((x) => x.slug === slug) : undefined
  if (!p) return NextResponse.json({ error: 'not found' }, { status: 404, headers: appCors })

  const today = new Date()
  const startISO = today.toISOString().slice(0, 10)
  const endISO = new Date(today.getTime() + 365 * 86_400_000).toISOString().slice(0, 10)
  const [content, avail] = await Promise.all([
    fetchPortalContent(slug),
    fetchPortalAvailability(slug, startISO, endISO),
  ])

  return NextResponse.json(
    {
      ...appChalet(p, toCard(p)),
      gallery: p.images.map((i) => i.url),
      exclusive: p.exclusive,
      overview: content?.overview ?? null,
      keyFeatures: content?.keyFeatures ?? [],
      amenities: content?.amenities ?? [],
      interior: content?.interior ?? null,
      bedroomsIntro: content?.bedroomsIntro ?? null,
      exterior: content?.exterior ?? null,
      locationIntro: content?.locationIntro ?? null,
      locationSpecs: content?.locationSpecs ?? [],
      rooms: (content?.rooms ?? []).map((r) => ({
        name: r.name,
        beds: r.beds ?? '',
        ensuite: r.ensuite,
        description: r.description ?? null,
        points: r.points,
      })),
      weeks: (avail?.weeks ?? []).map((w) => ({
        s: w.startISO,
        e: w.endISO,
        price: w.price,
        status: !w.available ? 'un' : w.price != null ? 'a' : 'req',
      })),
    },
    { headers: appCors },
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: appCors })
}
