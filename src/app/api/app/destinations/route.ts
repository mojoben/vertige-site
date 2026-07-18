import { NextResponse } from 'next/server'
import { COUNTRIES } from '@/lib/destinations'
import { appCors } from '../shape'

// The canonical destination list for the app (Ben, 2026-07-18: app
// destinations must match the website's). One source — src/lib/
// destinations.ts — served verbatim: 4 countries, 55 tiered resorts.
// Public labels: tier 1 = "Signature resorts", tier 2 = "More in {country}".

export function GET() {
  return NextResponse.json(
    {
      countries: COUNTRIES.map((c) => ({
        name: c.name,
        slug: c.slug,
        currency: c.currency,
        resorts: c.resorts.map((r) => ({ name: r.name, slug: r.slug, tier: r.tier })),
      })),
    },
    { headers: appCors },
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: appCors })
}
