// Authored country copy (HANDOFF 08) — extracted from generators/country_data.py.
// Used by the 4 country pages (/{country}) and the 4 country guides
// (/journal/guide/{country}-guide). Server-only (fs check for resort heroes).

import fs from 'fs'
import path from 'path'
import countries from '@/content/country_content.json'

export interface CountryContent {
  slug: string
  name: string
  cc: string // "French Alps", "Tyrol & the Arlberg" …
  sub: string
  ov1: string
  ov2: string
  g_intro: string
  g_skiing: string
  g_town: string
  g_when: string
  g_getting: string
  g_beyond: string
  g_eating: string
  g_pick: string
  resorts: { slug: string; name: string }[]
}

export const COUNTRY_CONTENT = countries as CountryContent[]

export const getCountryContent = (slug: string) => COUNTRY_CONTENT.find((c) => c.slug === slug)

/** Resort card image: the resort's own hero when we have one (Tier 1),
 *  else the country ski image — same rule as the prototype generators. */
export function resortImage(resortSlug: string, countrySlug: string): string {
  const heroPath = path.join(process.cwd(), 'public', 'images', 'destinations', `${resortSlug}-hero.jpg`)
  return fs.existsSync(heroPath)
    ? `/images/destinations/${resortSlug}-hero.jpg`
    : `/images/destinations/_ski-${countrySlug}.jpg`
}
