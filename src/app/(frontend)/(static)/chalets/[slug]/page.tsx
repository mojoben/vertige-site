import { permanentRedirect } from 'next/navigation'
import { fetchPortalProperties, chaletPath } from '@/lib/portal-client'

// Legacy chalet URLs — /chalets/{slug} — 308 to the canonical
// /{country}/{resort}/{chalet-slug} (Ben, 2026-07-15 SEO move). Preserves
// anything indexed or bookmarked from the flat era. Unknown slugs (incl.
// the old /chalets/sample dev page) land on the catalogue.

export const dynamic = 'force-dynamic'

export default async function LegacyChaletPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { properties, live } = await fetchPortalProperties()
  const p = live ? properties.find((x) => x.slug === slug) : undefined
  permanentRedirect(p ? chaletPath(p) : '/chalets')
}
