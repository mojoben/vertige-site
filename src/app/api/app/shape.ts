import type { PortalProperty } from '@/lib/portal-client'
import type { toCard } from '@/lib/portal-client'

// Shared shape helpers for the /api/app/* BFF endpoints (native app).

// Expo web dev + the packaged app both call cross-origin; these are public
// read-only feeds so a wide-open CORS policy is fine.
export const appCors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept, Content-Type',
} as const

const ISO_TO_COUNTRY_SLUG: Record<string, string> = { FR: 'france', CH: 'switzerland', AT: 'austria', IT: 'italy' }

type Card = ReturnType<typeof toCard>

/** The app's catalogue-card contract (app-native lib/api.ts `Chalet`). */
export function appChalet(p: PortalProperty, card: Card) {
  return {
    slug: p.slug,
    name: p.name,
    resort: card.resort,
    resortSlug: p.resortSlug,
    country: card.country,
    countrySlug: p.countryIso ? (ISO_TO_COUNTRY_SLUG[p.countryIso] ?? null) : null,
    ptype: card.ptype,
    guests: card.guests,
    beds: card.beds,
    baths: card.baths,
    from: card.from,
    to: card.to,
    sym: card.priceSymbol,
    tier: p.tier,
    img: card.img,
    attrs: card.attrs,
    chips: card.chips,
  }
}
