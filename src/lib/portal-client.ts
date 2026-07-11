import 'server-only'
import { MOCK_CHALETS, type MockChalet } from './mock-chalets'

// Res-portal read adapter (HANDOFF 03 §2, contract-first). The portal is the
// single source of truth for properties, availability and pricing; the site
// maps its feed onto the UI contract and NEVER depends on portal internals.
// If the portal is unreachable (dev, portal down) we fall back to the
// prototype mock set so the site still renders — flagged via `live: false`.

const PORTAL_URL = process.env.PORTAL_URL ?? ''
const PORTAL_API_KEY = process.env.PORTAL_API_KEY ?? ''

interface PortalImage { url: string; alt: string; tag: string | null }
export interface PortalProperty {
  slug: string
  name: string
  resort: string | null
  resortSlug: string | null
  country: string | null
  countryIso: string | null
  sleeps: number
  bedrooms: number
  tier: 'Reserve' | 'Privé'
  changeoverDay: 'sat' | 'sun' | 'fri' | 'flexible'
  minNights: number
  currency: string
  weeklyFrom: number | null
  weeklyTo: number | null
  images: PortalImage[]
  features: string[]
  summary: string | null
  serviceInclusions: string | null
}

export interface PortalWeek {
  startISO: string
  endISO: string
  label: string
  changeover: string
  price: number | null
  available: boolean
}

async function portalGet<T>(path: string): Promise<T | null> {
  if (!PORTAL_URL || !PORTAL_API_KEY) return null
  try {
    const res = await fetch(`${PORTAL_URL}${path}`, {
      headers: { 'x-api-key': PORTAL_API_KEY },
      next: { revalidate: 300 }, // ISR: property content refreshes within 5 min
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function fetchPortalProperties(): Promise<{ properties: PortalProperty[]; live: boolean }> {
  const data = await portalGet<{ properties: PortalProperty[] }>('/api/public/site/properties')
  if (!data) return { properties: [], live: false }
  return { properties: data.properties, live: true }
}

/** Live per-week availability + indicative pricing for a chalet (runtime,
 *  short cache) — powered by the portal's quote-week engine. */
export async function fetchPortalAvailability(slug: string, startISO: string, endISO: string) {
  return portalGet<{ slug: string; changeoverDay: string; weeks: PortalWeek[] }>(
    `/api/public/site/availability/${slug}?start=${startISO}&end=${endISO}`,
  )
}

// ── Mapping onto the catalogue-card contract (the prototype's shape) ────────
const sym = (ccy: string) => (ccy === 'CHF' ? 'CHF ' : ccy === 'GBP' ? '£' : '€')

/** Deterministic pseudo-position on the placeholder map for portal chalets
 *  (no lat/lng yet — real pins come with Google Maps). */
function hashPos(name: string): [number, number] {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return [0.3 + (h % 47) / 100, 0.15 + ((h >> 5) % 60) / 100]
}

export function toCard(p: PortalProperty): MockChalet & { priceSymbol: string; slug: string } {
  const [mx, my] = hashPos(p.name)
  return {
    slug: p.slug,
    name: p.name,
    resort: p.resort ?? '—',
    country: p.country ?? '—',
    ptype: 'Chalet',
    guests: p.sleeps,
    beds: p.bedrooms,
    baths: p.bedrooms, // portal doesn't model bathrooms yet — mirror bedrooms
    from: p.weeklyFrom ?? 0,
    to: p.weeklyTo ?? p.weeklyFrom ?? 0,
    tier: p.tier,
    img: p.images[0]?.url ?? '',
    // Sat/Sun search contract: fri/flexible surface as Sat until the search
    // grows a per-day model (the portal keeps the true changeover day).
    co: p.changeoverDay === 'sun' ? 'Sun' : 'Sat',
    chips: p.features.slice(0, 2),
    attrs: [],
    mx,
    my,
    priceSymbol: sym(p.currency),
  }
}

/** The catalogue feed: live portal chalets when reachable, prototype mocks
 *  otherwise (dev fallback — never ship mocks as real inventory). */
export async function getCatalogue(): Promise<{ chalets: (MockChalet & { priceSymbol?: string; slug?: string })[]; live: boolean }> {
  const { properties, live } = await fetchPortalProperties()
  if (!live || properties.length === 0) return { chalets: MOCK_CHALETS, live: false }
  return { chalets: properties.map(toCard), live: true }
}
