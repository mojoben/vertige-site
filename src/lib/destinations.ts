// The canonical 55 destinations (HANDOFF/02 §4, confirmed by Ben 2026-06-15,
// matching the res-platform DB and the 55 built prototype pages). NOTE:
// ../VERTIGE_DESTINATIONS.json is stale — it lists 54 (missing Courchevel,
// re-added to France Tier 1) and four of its slugs drifted from the built
// page set (canonical: kitzbuhel, solden, zurs, cortina-dampezzo). This module
// is the site's source of truth until the Payload `Destinations` collection
// is seeded from it.
//
// Tiers are internal grouping only. Public-facing labels are ALWAYS
// "Signature resorts" (tier 1) and "More in {country}" (tier 2) — never
// expose "Tier 1/Tier 2" (02 §3).

export interface Destination {
  name: string
  slug: string // route: /{countrySlug}/{slug}
  tier: 1 | 2
}

export interface Country {
  name: string
  slug: string
  code: 'fr' | 'ch' | 'at' | 'it'
  dial: string
  currency: 'EUR' | 'CHF'
  navImage: string // country card in the Destinations nav panel
  resorts: Destination[]
}

export const COUNTRIES: Country[] = [
  {
    name: 'France', slug: 'france', code: 'fr', dial: '+33', currency: 'EUR',
    navImage: '/images/destinations/_ski-france.jpg',
    resorts: [
      { name: 'Courchevel', slug: 'courchevel', tier: 1 },
      { name: "Val d'Isère", slug: 'val-disere', tier: 1 },
      { name: 'Méribel', slug: 'meribel', tier: 1 },
      { name: 'Chamonix', slug: 'chamonix', tier: 1 },
      { name: 'Megève', slug: 'megeve', tier: 1 },
      { name: 'Tignes', slug: 'tignes', tier: 1 },
      { name: 'Val Thorens', slug: 'val-thorens', tier: 1 },
      { name: 'Les Arcs', slug: 'les-arcs', tier: 1 },
      { name: 'La Plagne', slug: 'la-plagne', tier: 1 },
      { name: 'Argentière', slug: 'argentiere', tier: 2 },
      { name: 'Les Gets', slug: 'les-gets', tier: 2 },
      { name: 'Châtel', slug: 'chatel', tier: 2 },
      { name: 'Samoëns', slug: 'samoens', tier: 2 },
      { name: 'Saint-Martin-de-Belleville', slug: 'saint-martin-de-belleville', tier: 2 },
      { name: 'Serre Chevalier', slug: 'serre-chevalier', tier: 2 },
      { name: 'La Clusaz', slug: 'la-clusaz', tier: 2 },
      { name: 'Le Grand-Bornand', slug: 'le-grand-bornand', tier: 2 },
    ],
  },
  {
    name: 'Switzerland', slug: 'switzerland', code: 'ch', dial: '+41', currency: 'CHF',
    navImage: '/images/destinations/_ski-switzerland.jpg',
    resorts: [
      { name: 'Verbier', slug: 'verbier', tier: 1 },
      { name: 'Zermatt', slug: 'zermatt', tier: 1 },
      { name: 'St. Moritz', slug: 'st-moritz', tier: 1 },
      { name: 'Gstaad', slug: 'gstaad', tier: 1 },
      { name: 'Davos', slug: 'davos', tier: 1 },
      { name: 'Grindelwald', slug: 'grindelwald', tier: 1 },
      { name: 'Klosters', slug: 'klosters', tier: 2 },
      { name: 'Crans-Montana', slug: 'crans-montana', tier: 2 },
      { name: 'Wengen', slug: 'wengen', tier: 2 },
      { name: 'Adelboden', slug: 'adelboden', tier: 2 },
      { name: 'Andermatt', slug: 'andermatt', tier: 2 },
      { name: 'Laax', slug: 'laax', tier: 2 },
      { name: 'Arosa', slug: 'arosa', tier: 2 },
      { name: 'Engelberg', slug: 'engelberg', tier: 2 },
      { name: 'Villars', slug: 'villars', tier: 2 },
    ],
  },
  {
    name: 'Austria', slug: 'austria', code: 'at', dial: '+43', currency: 'EUR',
    navImage: '/images/destinations/_ski-austria.jpg',
    resorts: [
      { name: 'St. Anton', slug: 'st-anton', tier: 1 },
      { name: 'Lech', slug: 'lech', tier: 1 },
      { name: 'Kitzbühel', slug: 'kitzbuhel', tier: 1 },
      { name: 'Ischgl', slug: 'ischgl', tier: 1 },
      { name: 'Sölden', slug: 'solden', tier: 1 },
      { name: 'Saalbach-Hinterglemm', slug: 'saalbach-hinterglemm', tier: 1 },
      { name: 'Zürs', slug: 'zurs', tier: 2 },
      { name: 'Mayrhofen', slug: 'mayrhofen', tier: 2 },
      { name: 'Schladming', slug: 'schladming', tier: 2 },
      { name: 'Obertauern', slug: 'obertauern', tier: 2 },
      { name: 'Bad Gastein', slug: 'bad-gastein', tier: 2 },
      { name: 'SkiWelt', slug: 'skiwelt', tier: 2 },
      { name: 'Hintertux', slug: 'hintertux', tier: 2 },
    ],
  },
  {
    name: 'Italy', slug: 'italy', code: 'it', dial: '+39', currency: 'EUR',
    navImage: '/images/destinations/_ski-italy.jpg',
    resorts: [
      { name: "Cortina d'Ampezzo", slug: 'cortina-dampezzo', tier: 1 },
      { name: 'Courmayeur', slug: 'courmayeur', tier: 1 },
      { name: 'Alta Badia', slug: 'alta-badia', tier: 1 },
      { name: 'Madonna di Campiglio', slug: 'madonna-di-campiglio', tier: 1 },
      { name: 'Cervinia', slug: 'cervinia', tier: 1 },
      { name: 'Val Gardena', slug: 'val-gardena', tier: 2 },
      { name: 'Livigno', slug: 'livigno', tier: 2 },
      { name: 'Bormio', slug: 'bormio', tier: 2 },
      { name: 'Sestriere', slug: 'sestriere', tier: 2 },
      { name: 'Kronplatz', slug: 'kronplatz', tier: 2 },
    ],
  },
]

export const ALL_DESTINATIONS = COUNTRIES.flatMap((c) =>
  c.resorts.map((r) => ({ ...r, country: c.name, countrySlug: c.slug })),
)

export const destinationPath = (countrySlug: string, resortSlug: string) =>
  `/${countrySlug}/${resortSlug}`

// Res-portal slug mapping (site slug → portal Region slug) for the adapter.
// Most match 1:1; differences are ASCII-folding choices. Verify against the
// portal's Region.slug when the read adapter is built.
export const PORTAL_SLUG_OVERRIDES: Record<string, string> = {}
