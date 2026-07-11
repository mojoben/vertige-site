// MOCK chalet data — lifted verbatim from the prototype listing/destination
// pages. This is the contract-first placeholder (HANDOFF 03 §2): the real feed
// comes from the res-portal adapter; nothing in the UI may depend on these
// values existing. `co` is the chalet's changeover day — the Sat/Sun flexible
// search rule (05 §2) runs on it. `mx`/`my` are fractional positions on the
// placeholder map image; real pins will come from lat/lng via Google Maps.

export interface MockChalet {
  name: string
  resort: string
  country: string
  ptype: 'Chalet' | 'Apartment' | 'Penthouse' | 'Lodge'
  guests: number
  beds: number
  baths: number
  from: number
  to: number
  tier: 'Reserve' | 'Privé'
  img: string
  co: 'Sat' | 'Sun'
  chips: string[]
  attrs: string[]
  mx: number
  my: number
}

const POS: Record<string, [number, number]> = {
  'Chalet Aiguille': [0.66, 0.12], 'Penthouse Aurore': [0.61, 0.17],
  'Chalet Cervin': [0.74, 0.27], 'Lodge Powder': [0.7, 0.34], 'Chalet Arlberg': [0.73, 0.41],
  'Chalet Bellevarde': [0.6, 0.56], 'Chalet Ampezzo': [0.66, 0.73],
  'Chalet Belvédère': [0.45, 0.62], 'Résidence Ophélie': [0.5, 0.585], 'Chalet Isatis': [0.4, 0.67],
}

const raw: Omit<MockChalet, 'mx' | 'my'>[] = [
  { name: 'Chalet Aiguille', resort: 'Verbier', country: 'Switzerland', ptype: 'Chalet', guests: 12, beds: 6, baths: 6, from: 58000, to: 110000, tier: 'Privé', img: '/images/chalets/ext-01.webp', co: 'Sat', chips: ['Ski-in / ski-out', 'Hot tub'], attrs: ['ski-in', 'hot-tub', 'spa', 'chef', 'ski-room', 'piste-view'] },
  { name: 'Chalet Bellevarde', resort: "Val d'Isère", country: 'France', ptype: 'Chalet', guests: 14, beds: 7, baths: 7, from: 59000, to: 147000, tier: 'Privé', img: '/images/chalets/ext-02.webp', co: 'Sat', chips: ['Indoor pool', 'Piste views'], attrs: ['indoor-pool', 'piste-view', 'chef', 'cinema', 'spa', 'near-slopes'] },
  { name: 'Chalet Arlberg', resort: 'Lech', country: 'Austria', ptype: 'Chalet', guests: 12, beds: 6, baths: 6, from: 25000, to: 90000, tier: 'Reserve', img: '/images/chalets/ext-03.webp', co: 'Sun', chips: ['Spa & sauna', 'Near lifts'], attrs: ['spa', 'near-lifts', 'fireplace', 'ski-room'] },
  { name: 'Chalet Cervin', resort: 'Zermatt', country: 'Switzerland', ptype: 'Chalet', guests: 10, beds: 5, baths: 5, from: 30000, to: 95000, tier: 'Reserve', img: '/images/chalets/ext-04.webp', co: 'Sat', chips: ['Matterhorn view', 'Hot tub'], attrs: ['piste-view', 'hot-tub', 'fireplace', 'near-slopes'] },
  { name: 'Chalet Belvédère', resort: 'Courchevel 1850', country: 'France', ptype: 'Chalet', guests: 14, beds: 7, baths: 7, from: 70000, to: 160000, tier: 'Privé', img: '/images/chalets/ext-05.webp', co: 'Sat', chips: ['Ski-in / ski-out', 'Cinema'], attrs: ['ski-in', 'indoor-pool', 'cinema', 'chef', 'spa', 'gym', 'cellar', 'ski-room'] },
  { name: 'Chalet Isatis', resort: 'Méribel', country: 'France', ptype: 'Chalet', guests: 10, beds: 5, baths: 5, from: 22000, to: 68000, tier: 'Reserve', img: '/images/chalets/ext-06.webp', co: 'Sun', chips: ['Ski-in / ski-out', 'Fireplace'], attrs: ['ski-in', 'fireplace', 'hot-tub', 'ski-room'] },
  { name: 'Lodge Powder', resort: 'St Anton', country: 'Austria', ptype: 'Lodge', guests: 8, beds: 4, baths: 4, from: 18000, to: 52000, tier: 'Reserve', img: '/images/chalets/ext-07.webp', co: 'Sat', chips: ['Near lifts', 'Ski room'], attrs: ['near-lifts', 'ski-room', 'near-slopes', 'fireplace'] },
  { name: 'Chalet Ampezzo', resort: 'Cortina', country: 'Italy', ptype: 'Chalet', guests: 12, beds: 6, baths: 6, from: 40000, to: 120000, tier: 'Privé', img: '/images/chalets/ext-08.webp', co: 'Sun', chips: ['Spa', 'Wine cellar'], attrs: ['spa', 'cellar', 'chef', 'piste-view', 'gym'] },
  { name: 'Résidence Ophélie', resort: 'Courchevel 1650', country: 'France', ptype: 'Apartment', guests: 8, beds: 4, baths: 4, from: 16000, to: 44000, tier: 'Reserve', img: '/images/chalets/ext-12.webp', co: 'Sat', chips: ['Near lifts', 'Mountain view'], attrs: ['near-lifts', 'piste-view', 'ski-room'] },
  { name: 'Penthouse Aurore', resort: 'Verbier', country: 'Switzerland', ptype: 'Penthouse', guests: 6, beds: 3, baths: 3, from: 28000, to: 72000, tier: 'Privé', img: '/images/chalets/ext-13.webp', co: 'Sun', chips: ['Piste views', 'Spa'], attrs: ['piste-view', 'spa', 'hot-tub', 'near-lifts', 'chef'] },
]

export const MOCK_CHALETS: MockChalet[] = raw.map((c) => {
  const p = POS[c.name] ?? [0.5, 0.5]
  return { ...c, mx: p[0], my: p[1] }
})

export const gbp = (n: number) => '£' + (n >= 1000 ? (n / 1000).toFixed(0) + 'k' : String(n))
