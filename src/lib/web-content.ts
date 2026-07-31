import 'server-only'
import { unstable_cache } from 'next/cache'
import { sharedDb } from './shared-db'
import articlesSeed from '@/content/journal_articles.json'
import guidesSeed from '@/content/t1_guides_rich.json'
import { COUNTRY_CONTENT } from './country-content'
import { RESORT_FACTS } from './facts-data'
import type { Fact } from './facts'

// Editorial content readers — CMS Phase 1 (Ben, 2026-07-26). The portal's
// Website section owns journal articles, guides and resort facts; the site
// reads them LIVE via web.* views with the original bundled JSON as the
// fallback whenever the shared DB is unreachable or a table is empty (so a
// suspended DB or a fresh environment renders exactly what it did before).

export interface ArticleSection { id?: string; title: string; paras: string[]; figure?: { src: string; cap?: string; alt?: string } | null }
export interface Article {
  slug: string; cat: string; title: string; dek: string; hero: string; read: number
  h1?: string; sub?: string; lead?: string
  sections: ArticleSection[]
  pick?: { text: string; att?: string } | null
  pickAfter?: string | number | null
}
export interface GuideSection { key: string; title: string; body: string }
export interface GuideDoc {
  slug: string; kind: 'resort' | 'country'; name: string; country: string; cslug: string
  intro: string; skiing: string; town: string; when: string; getting: string
  beyond: string; eating: string; pick: string
  /** Ordered, CMS-editable sections (headings included). The keyed fields
   *  above are conveniences derived from this array. */
  sections: GuideSection[]
}

const GUIDE_DEFAULT_TITLES: Record<string, string> = {
  skiing: 'The skiing', town: 'The village and the chalets', when: 'When to visit',
  getting: 'Getting there', beyond: 'Beyond the slopes', eating: 'Eating and après',
  pick: 'The Vertige pick',
}
const toSectionArr = (src: Record<string, string>): GuideSection[] =>
  Object.entries(GUIDE_DEFAULT_TITLES)
    .map(([key, title]) => ({ key, title, body: src[key] ?? '' }))
    .filter((x) => x.body)
const fromSectionArr = (arr: GuideSection[]) => {
  const by = (k: string) => arr.find((x) => x.key === k)?.body ?? ''
  return { skiing: by('skiing'), town: by('town'), when: by('when'), getting: by('getting'), beyond: by('beyond'), eating: by('eating'), pick: by('pick') }
}

const seedArticles = (articlesSeed as unknown as Article[]).map((a) => ({ ...a, read: Number(a.read) || 5 }))

const seedGuides: GuideDoc[] = [
  ...(guidesSeed as unknown as Record<string, string>[]).map((g) => ({
    slug: g.slug, kind: 'resort' as const, name: g.name, country: g.country ?? '', cslug: g.cslug ?? '',
    intro: g.intro ?? '', skiing: g.skiing ?? '', town: g.town ?? '', when: g.when ?? '',
    getting: g.getting ?? '', beyond: g.beyond ?? '', eating: g.eating ?? '', pick: g.pick ?? '',
    sections: toSectionArr(g),
  })),
  ...COUNTRY_CONTENT.map((c) => ({
    slug: c.slug, kind: 'country' as const, name: c.name, country: c.name, cslug: c.slug,
    intro: c.g_intro ?? '', skiing: c.g_skiing ?? '', town: c.g_town ?? '', when: c.g_when ?? '',
    getting: c.g_getting ?? '', beyond: c.g_beyond ?? '', eating: c.g_eating ?? '', pick: c.g_pick ?? '',
    sections: toSectionArr({ skiing: c.g_skiing ?? '', town: c.g_town ?? '', when: c.g_when ?? '', getting: c.g_getting ?? '', beyond: c.g_beyond ?? '', eating: c.g_eating ?? '', pick: c.g_pick ?? '' }),
  })),
]

type ArticleRow = {
  slug: string; cat: string; title: string; dek: string | null; hero: string | null; read_mins: number
  h1: string | null; sub: string | null; lead: string | null
  sections: ArticleSection[]; pick: { text: string; att?: string } | null; pick_after: string | null; sort_order: number
}
type GuideRow = { slug: string; kind: string; name: string; country: string | null; cslug: string | null; intro: string | null; sections: GuideSection[] }

export const loadArticles = unstable_cache(
  async (): Promise<Article[]> => {
    try {
      const { rows } = await sharedDb().query<ArticleRow>('SELECT * FROM web.articles_v ORDER BY sort_order, slug')
      if (!rows.length) return seedArticles
      return rows.map((r) => ({
        slug: r.slug, cat: r.cat, title: r.title, dek: r.dek ?? '', hero: r.hero ?? '', read: r.read_mins,
        h1: r.h1 ?? undefined, sub: r.sub ?? undefined, lead: r.lead ?? undefined,
        sections: r.sections ?? [], pick: r.pick, pickAfter: r.pick_after,
      }))
    } catch {
      return seedArticles
    }
  },
  ['web-articles'],
  { revalidate: 300 },
)

export const loadGuides = unstable_cache(
  async (): Promise<GuideDoc[]> => {
    try {
      const { rows } = await sharedDb().query<GuideRow>('SELECT * FROM web.guides_v')
      if (!rows.length) return seedGuides
      return rows.map((r) => {
        const arr = Array.isArray(r.sections) ? r.sections : []
        return {
          slug: r.slug, kind: (r.kind === 'country' ? 'country' : 'resort') as 'country' | 'resort', name: r.name,
          country: r.country ?? '', cslug: r.cslug ?? '', intro: r.intro ?? '',
          ...fromSectionArr(arr),
          sections: arr,
        }
      })
    } catch {
      return seedGuides
    }
  },
  ['web-guides'],
  { revalidate: 300 },
)

export const loadResortFacts = unstable_cache(
  async (): Promise<Record<string, Fact[]>> => {
    try {
      const { rows } = await sharedDb().query<{ slug: string; facts: Fact[] }>('SELECT slug, facts FROM web.resort_facts_v')
      if (!rows.length) return RESORT_FACTS
      return Object.fromEntries(rows.map((r) => [r.slug, r.facts ?? []]))
    } catch {
      return RESORT_FACTS
    }
  },
  ['web-resort-facts'],
  { revalidate: 300 },
)

export const loadArticle = async (slug: string) => (await loadArticles()).find((a) => a.slug === slug) ?? null
export const loadResortGuides = async () => (await loadGuides()).filter((g) => g.kind === 'resort')
export const loadGuide = async (slug: string) => (await loadGuides()).find((g) => g.slug === slug) ?? null


// ── Page copy (site-map CMS) ─────────────────────────────────────────────────
type PageRow = { slug: string; blocks: { key: string; value: string }[] }

export const loadPageCopy = unstable_cache(
  async (): Promise<Record<string, Record<string, string>>> => {
    try {
      const { rows } = await sharedDb().query<PageRow>('SELECT slug, blocks FROM web.pages_v')
      return Object.fromEntries(rows.map((r) => [r.slug, Object.fromEntries((r.blocks ?? []).map((b) => [b.key, b.value]))]))
    } catch {
      return {}
    }
  },
  ['web-page-copy'],
  { revalidate: 300 },
)

/** Copy slot with code fallback: pageCopy('home', 'hero.snip', 'default…'). */
export async function pageCopy(page: string, key: string, fallback: string): Promise<string> {
  const all = await loadPageCopy()
  const v = all[page]?.[key]
  return v && v.trim() ? v : fallback
}
