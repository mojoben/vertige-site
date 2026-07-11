// Destination / chalet fact chips — the at-a-glance, icon-linked facts strip
// (Ben: "airport distance with a plane icon"). ICON RULE (brand-wide): line /
// outline style only — stroke, no fill, never coloured glyphs, never emoji.
//
// The data contract anticipates the AI-enrichment flow that will live in the
// res portal: facts carry a `source` (portal feed / staff-entered / AI
// research) and a `verified` flag. THE SITE ONLY EVER RENDERS VERIFIED FACTS —
// AI-proposed values sit unverified in the portal's review queue until staff
// approve them; nothing unchecked reaches the public site.

export type FactKey =
  | 'airport' // nearest airport + transfer time
  | 'altitude' // village / skiable elevation
  | 'skiArea' // pistes km + area name
  | 'lifts' // lift count
  | 'season' // opening months
  | 'town' // nearest town / character
  | 'skiInOut' // ski-in / ski-out access

export interface FactMeta {
  label: string
  icon: FactKey // 1:1 with the icon set in FactStrip
}

export const FACT_META: Record<FactKey, FactMeta> = {
  airport: { label: 'Nearest airport', icon: 'airport' },
  altitude: { label: 'Altitude', icon: 'altitude' },
  skiArea: { label: 'Ski area', icon: 'skiArea' },
  lifts: { label: 'Lifts', icon: 'lifts' },
  season: { label: 'Season', icon: 'season' },
  town: { label: 'The town', icon: 'town' },
  skiInOut: { label: 'Ski access', icon: 'skiInOut' },
}

export type FactSource = 'portal' | 'manual' | 'ai'

export interface Fact {
  key: FactKey
  value: string
  source: FactSource
  verified: boolean
}

/** Only verified facts are ever shown publicly. */
export const visibleFacts = (facts: Fact[] | undefined): Fact[] =>
  (facts ?? []).filter((f) => f.verified)
