import React from 'react'
import { sharedDb } from '@/lib/shared-db'
import { PointIcon } from '@/components/ChaletIcons'
import { pick } from '@/components/chalet-icon-map'

// Icon & label audit — every bullet-point label used across every live
// chalet (key features, amenities, interior/exterior points, bedroom
// points, location specs), grouped by the icon it maps to, with usage
// counts and the chalets it appears on. One page to review the lot
// instead of walking 26 chalets (Ben, 2026-07-16). Unlisted; noindex.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Icon & label audit — Vertige', robots: { index: false, follow: false } }

interface Row {
  slug: string
  key_features: { label: string }[] | null
  amenities: { name: string; items: string[] }[] | null
  interior: { groups?: { title: string; points: string[] }[] } | null
  exterior: { points?: string[] } | null
  location_specs: { key: string; label: string; value: string }[] | null
}

interface Usage { count: number; chalets: Set<string>; surfaces: Set<string> }

export default async function IconAuditPage() {
  let rows: Row[] = []
  let rooms: { slug: string; points: string[] }[] = []
  try {
    rows = (await sharedDb().query<Row>(
      `SELECT c.slug, c.key_features, c.amenities, c.interior, c.exterior, c.location_specs
         FROM web.property_content_v c`,
    )).rows
    rooms = (await sharedDb().query<{ slug: string; points: string[] }>(
      'SELECT slug, points FROM web.property_rooms_v',
    )).rows
  } catch {
    return <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>Portal feed unreachable — no data to audit.</div>
  }

  const labels = new Map<string, Usage>()
  const add = (label: string | undefined | null, slug: string, surface: string) => {
    if (!label) return
    const u = labels.get(label) ?? { count: 0, chalets: new Set(), surfaces: new Set() }
    u.count += 1
    u.chalets.add(slug)
    u.surfaces.add(surface)
    labels.set(label, u)
  }
  for (const r of rows) {
    for (const f of r.key_features ?? []) add(f.label, r.slug, 'key features')
    for (const a of r.amenities ?? []) for (const i of a.items ?? []) add(i, r.slug, `amenities · ${a.name}`)
    for (const g of r.interior?.groups ?? []) for (const p of g.points ?? []) add(p, r.slug, 'interior')
    for (const p of r.exterior?.points ?? []) add(p, r.slug, 'exterior')
    for (const l of r.location_specs ?? []) add(l.label, r.slug, 'location specs')
  }
  for (const r of rooms) for (const p of r.points) add(p, r.slug, 'bedrooms')

  // Group by mapped icon; def (the dash) floats to the top as the problem bucket.
  const groups = new Map<string, { label: string; u: Usage }[]>()
  for (const [label, u] of labels) {
    const k = pick(label)
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k)!.push({ label, u })
  }
  const ordered = [...groups.entries()].sort((a, b) =>
    a[0] === 'def' ? -1 : b[0] === 'def' ? 1 : b[1].length - a[1].length)
  for (const [, list] of ordered) list.sort((a, b) => a.label.localeCompare(b.label))

  const mono: React.CSSProperties = { fontFamily: "'Proxima Nova','Inter'", fontSize: '.7rem', color: 'var(--muted)' }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '7rem 2rem 5rem' }}>
      <h1 style={{ fontFamily: "'Ivy Mode','Cormorant Garamond',serif", fontSize: '2.4rem', color: 'var(--plum)', marginBottom: '.4rem' }}>
        Icon &amp; label audit
      </h1>
      <p style={{ ...mono, fontSize: '.85rem', marginBottom: '3rem' }}>
        {labels.size} distinct labels across {rows.length} chalets, grouped by the icon each maps to.
        Anything under &ldquo;unmapped&rdquo; renders as a dash and needs a rule.
      </p>

      {ordered.map(([iconKey, list]) => (
        <section key={iconKey} style={{ marginBottom: '2.6rem', borderTop: '1px solid var(--line)', paddingTop: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem' }}>
            <PointIcon label={list[0].label} className={iconKey === 'def' ? 'audit-icn lg bad' : 'audit-icn lg'} />
            <h2 style={{ fontFamily: "'Proxima Nova','Inter'", fontSize: '.75rem', letterSpacing: '.12em', color: iconKey === 'def' ? '#c0392b' : 'var(--rose)', fontWeight: 500 }}>
              {iconKey === 'def' ? `unmapped — renders as a dash (${list.length})` : `${iconKey} (${list.length} label${list.length === 1 ? '' : 's'})`}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '.4rem 2rem' }}>
            {list.map(({ label, u }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '.6rem', padding: '.3rem 0', borderBottom: '1px dotted var(--line)' }}>
                <PointIcon label={label} className="audit-icn" />
                <span style={{ fontSize: '.9rem', color: 'var(--ink)' }}>{label}</span>
                <span style={{ ...mono, marginLeft: 'auto', whiteSpace: 'nowrap' }} title={`${[...u.chalets].join(', ')}\n${[...u.surfaces].join(', ')}`}>
                  ×{u.count} · {u.chalets.size} chalet{u.chalets.size === 1 ? '' : 's'} · {[...u.surfaces].map((x) => x.split(' ·')[0]).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
