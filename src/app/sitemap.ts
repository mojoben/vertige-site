import type { MetadataRoute } from 'next'
import { fetchPortalProperties, chaletPath } from '@/lib/portal-client'
import { COUNTRIES, destinationPath } from '@/lib/destinations'
import articles from '@/content/journal_articles.json'
import guides from '@/content/t1_guides_rich.json'
import inspiration from '@/content/inspiration.json'

// sitemap.xml — static pages, the destination tree (countries → resorts),
// every live chalet at its canonical /{country}/{resort}/{slug} URL, the
// journal (articles + destination guides) and the inspiration collections.

const ORIGIN = process.env.SITE_ORIGIN ?? 'https://vertigeski.com'

const STATIC_PATHS = [
  '/', '/destinations', '/chalets', '/concierge', '/approach', '/about',
  '/journal', '/owners', '/contact', '/faq', '/wishlist', '/sitemap',
  '/terms', '/privacy', '/cookies',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({ url: `${ORIGIN}${p}` }))

  for (const c of COUNTRIES) {
    urls.push({ url: `${ORIGIN}/${c.slug}` })
    for (const r of c.resorts) urls.push({ url: `${ORIGIN}${destinationPath(c.slug, r.slug)}` })
  }

  const { properties, live } = await fetchPortalProperties()
  if (live) for (const p of properties) urls.push({ url: `${ORIGIN}${chaletPath(p)}` })

  for (const a of articles as { slug: string }[]) urls.push({ url: `${ORIGIN}/journal/${a.slug}` })
  for (const g of guides as { slug: string }[]) urls.push({ url: `${ORIGIN}/journal/guide/${g.slug}-guide` })
  for (const c of COUNTRIES) urls.push({ url: `${ORIGIN}/journal/guide/${c.slug}-guide` })
  for (const i of inspiration as { slug: string }[]) urls.push({ url: `${ORIGIN}/inspiration/${i.slug}` })

  return urls
}
