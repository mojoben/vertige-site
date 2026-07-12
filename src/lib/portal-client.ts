import 'server-only'
import { unstable_cache } from 'next/cache'
import { sharedDb } from './shared-db'
import { MOCK_CHALETS, type MockChalet } from './mock-chalets'

// Shared-database read adapter (HANDOFF-site doc 10 — supersedes the earlier
// portal HTTP API framing). The portal owns properties, availability and
// pricing in the ONE shared PostgreSQL; the site reads them LIVE through the
// stable `web.*` views — never raw tables — so a price or an open week
// appears here the instant it changes in the portal. No sync, no API, no lag.
// Property CONTENT is cached briefly (ISR-style); availability + pricing are
// queried at request time. If the database is unreachable (fresh dev clone)
// we fall back to the prototype mock set, flagged via `live: false`.

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

interface PropertyRow {
  slug: string; name: string; resort: string | null; resort_slug: string | null
  country: string | null; country_iso: string | null
  sleeps: number; bedrooms: number; tier: 'Reserve' | 'Privé'
  changeover_day: 'sat' | 'sun' | 'fri' | 'flexible'; min_nights: number
  currency: string; weekly_from: number | null; weekly_to: number | null
  images: PortalImage[]; features: string[]
  summary: string | null; service_inclusions: string | null
}

const toProperty = (r: PropertyRow): PortalProperty => ({
  slug: r.slug,
  name: r.name,
  resort: r.resort,
  resortSlug: r.resort_slug,
  country: r.country,
  countryIso: r.country_iso,
  sleeps: r.sleeps,
  bedrooms: r.bedrooms,
  tier: r.tier,
  changeoverDay: r.changeover_day,
  minNights: r.min_nights,
  currency: r.currency,
  weeklyFrom: r.weekly_from == null ? null : Number(r.weekly_from),
  weeklyTo: r.weekly_to == null ? null : Number(r.weekly_to),
  images: r.images ?? [],
  features: r.features ?? [],
  summary: r.summary,
  serviceInclusions: r.service_inclusions,
})

// Property content: mostly static → short shared cache (doc 10 §2 "live
// where it matters, cached where it doesn't").
const loadProperties = unstable_cache(
  async (): Promise<PortalProperty[] | null> => {
    try {
      const res = await sharedDb().query<PropertyRow>('SELECT * FROM web.property_public_v ORDER BY name')
      return res.rows.map(toProperty)
    } catch {
      return null
    }
  },
  ['web-property-public'],
  { revalidate: 300 },
)

export async function fetchPortalProperties(): Promise<{ properties: PortalProperty[]; live: boolean }> {
  const properties = await loadProperties()
  if (!properties) return { properties: [], live: false }
  return { properties, live: true }
}

// ── Week enumeration — the portal engine's contract (lib/quote-weeks.ts) ────
// A week is priced by the rate span covering its start day and unavailable if
// it overlaps any blocked/booked span. The window auto-extends to the Friday
// before / Monday after so Sat+Sun changeovers at the edges are included.
const DAY = 86_400_000
const DOW: Record<string, number> = { sun: 0, fri: 5, sat: 6 }
const atUTC = (iso: string) => new Date(`${iso}T00:00:00.000Z`)
const isoOf = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY)
const onOrBefore = (d: Date, dow: number) => addDays(d, -((d.getUTCDay() - dow + 7) % 7))
const onOrAfter = (d: Date, dow: number) => addDays(d, (dow - d.getUTCDay() + 7) % 7)

interface Span { start: number; end: number }

/** Live per-week availability + pricing for a chalet, read from the shared
 *  DB at request time (no cache — doc 10: availability/pricing stay live). */
export async function fetchPortalAvailability(slug: string, startISO: string, endISO: string) {
  try {
    const db = sharedDb()
    const prop = await db.query<{ id: string; changeover_day: string }>(
      'SELECT id, changeover_day FROM web.property_public_v WHERE slug = $1', [slug])
    if (!prop.rows[0]) return null
    const { id, changeover_day } = prop.rows[0]

    const start = onOrBefore(atUTC(startISO), DOW.fri)
    const end = onOrAfter(atUTC(endISO), 1 /* Monday */)

    // Dates come back as ISO strings (::date::text) and are re-parsed at UTC
    // midnight — node-pg would otherwise parse timestamps in server-local
    // time, shifting week boundaries off the portal engine's UTC math.
    const [rates, spans] = await Promise.all([
      db.query<{ s: string; e: string; gross_amount: number }>(
        'SELECT start_date::date::text AS s, end_date::date::text AS e, gross_amount FROM web.property_rates_v WHERE property_id = $1 AND start_date <= $3 AND end_date >= $2 ORDER BY start_date',
        [id, isoOf(start), isoOf(end)]),
      db.query<{ s: string; e: string }>(
        'SELECT start_date::date::text AS s, end_date::date::text AS e FROM web.property_unavailable_v WHERE property_id = $1 AND start_date < $3 AND end_date > $2',
        [id, isoOf(start), isoOf(end)]),
    ])
    const blocked: Span[] = spans.rows.map((r) => ({ start: atUTC(r.s).getTime(), end: atUTC(r.e).getTime() }))
    const priceFor = (ws: Date) => {
      const r = rates.rows.find((rr) => ws.getTime() >= atUTC(rr.s).getTime() && ws.getTime() <= atUTC(rr.e).getTime())
      return r ? Number(r.gross_amount) : null
    }
    const availableFor = (ws: Date, we: Date) =>
      !blocked.some((b) => ws.getTime() < b.end && b.start < we.getTime())

    const days = changeover_day === 'flexible' ? ['sat', 'sun'] : [changeover_day === 'fri' ? 'fri' : changeover_day]
    const weeks: PortalWeek[] = []
    for (const dayName of days) {
      let ws = onOrAfter(start, DOW[dayName] ?? 6)
      while (addDays(ws, 7).getTime() <= end.getTime()) {
        const we = addDays(ws, 7)
        weeks.push({
          startISO: isoOf(ws), endISO: isoOf(we),
          label: `${isoOf(ws)} – ${isoOf(we)}`,
          changeover: dayName,
          price: priceFor(ws),
          available: availableFor(ws, we),
        })
        ws = addDays(ws, 7)
      }
    }
    weeks.sort((a, b) => a.startISO.localeCompare(b.startISO) || a.changeover.localeCompare(b.changeover))
    return { slug, changeoverDay: changeover_day, weeks }
  } catch {
    return null
  }
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

/** Portal features are human-readable labels ("Ski-in / ski-out", "Spa &
 *  sauna"); the search filters and Inspiration collections match on the
 *  prototype's attr keys — derive them by keyword. */
const ATTR_PATTERNS: [string, RegExp][] = [
  ['ski-in', /ski-in/i],
  ['indoor-pool', /pool/i],
  ['spa', /spa|sauna|steam|hammam|wellness/i],
  ['hot-tub', /hot tub/i],
  ['chef', /chef/i],
  ['cinema', /cinema/i],
  ['fireplace', /fire/i],
  ['gym', /gym/i],
  ['cellar', /cellar/i],
  ['ski-room', /ski room|boot/i],
  ['near-lifts', /near lift/i],
]
function toAttrs(features: string[]): string[] {
  return ATTR_PATTERNS.filter(([, re]) => features.some((f) => re.test(f))).map(([k]) => k)
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
    attrs: toAttrs(p.features),
    mx,
    my,
    priceSymbol: sym(p.currency),
  }
}

/** The catalogue feed: live shared-DB chalets when reachable, prototype mocks
 *  otherwise (dev fallback — never ship mocks as real inventory). */
export async function getCatalogue(): Promise<{ chalets: (MockChalet & { priceSymbol?: string; slug?: string })[]; live: boolean }> {
  const { properties, live } = await fetchPortalProperties()
  if (!live || properties.length === 0) return { chalets: MOCK_CHALETS, live: false }
  return { chalets: properties.map(toCard), live: true }
}
