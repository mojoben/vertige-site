import { NextResponse } from 'next/server'
import { fetchPortalProperties, toCard } from '@/lib/portal-client'
import { appCors, appChalet } from '../shape'

// Native-app BFF: the whole catalogue in one card-shaped payload. Mirrors
// what the website's destination pages render — same live web.* reads, same
// derived attrs — so app and site can never disagree on inventory.

export const dynamic = 'force-dynamic'

export async function GET() {
  const { properties, live } = await fetchPortalProperties()
  const chalets = live ? properties.map((p) => appChalet(p, toCard(p))) : []
  return NextResponse.json({ live, chalets }, { headers: appCors })
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: appCors })
}
