'use client'

import React from 'react'
import { IC, AMEN, pick } from './chalet-icon-map'

export { pick } from './chalet-icon-map'

// Line icons for the chalet detail page — the prototype's IC/ICON maps and
// pick() keyword mapper (vertige-proto-chalet-detail-alt.html), verbatim.
// Every room point / feature / amenity category gets its matching stroke
// icon; never fills, never emoji (brand icon rule).

/** Stroke icon matched to a point's label — bedroom lists, feature lists. */
export function PointIcon({ label, className = 'icn' }: { label: string; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: IC[pick(label)] ?? IC.def }} />
}

/** A room point with its icon — the prototype's `.hasic` decoration. */
export function Pt({ label }: { label: string }) {
  return <span className="hasic"><PointIcon label={label} />{label}</span>
}

/** Amenity-category icon for the features & amenities accordion rows. */
export function AmenIcon({ k }: { k: string }) {
  return <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: AMEN[k] ?? AMEN.living }} />
}
