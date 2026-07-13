'use client'

import React from 'react'

// Line icons for the chalet detail page — the prototype's IC/ICON maps and
// pick() keyword mapper (vertige-proto-chalet-detail-alt.html), verbatim.
// Every room point / feature / amenity category gets its matching stroke
// icon; never fills, never emoji (brand icon rule).

// eslint-disable-next-line prettier/prettier
const IC: Record<string, string> = {
 bed:'<path d="M3 18v-5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v5"/><path d="M3 14h18M3 18v2M21 18v2"/><path d="M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>',
 bath:'<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 3-1.7"/><path d="M6 20l-1 2M18 20l1 2"/>',
 shower:'<path d="M8 4h4a4 4 0 0 1 4 4M16 4v6M6 12h12"/><path d="M8 15v.01M11 17v.01M14 15v.01"/>',
 hanger:'<path d="M12 5a1.8 1.8 0 1 1 1.4 3L21 15H3l7.6-7"/>',
 balcony:'<path d="M4 10h16v10H4zM4 14h16M9 14v6M15 14v6"/><path d="M6 10V6l6-3 6 3v4"/>',
 mountain:'<path d="M3 19l6-9 3.5 4.5L15 11l6 8z"/>',
 fire:'<path d="M12 3c2 3 4 4 4 7a4 4 0 0 1-8 0c0-1.2.6-2.2 1.3-2.8"/>',
 dining:'<path d="M6 3v8a3 3 0 0 1-3 3M6 3v18M9 3v8M17 3c-1.6 0-2.6 2-2.6 4.5S15.4 12 17 12v9"/>',
 kitchen:'<path d="M4 4h16v6H4zM4 10v10M20 10v10M8 4v6M4 14h16"/>',
 cinema:'<path d="M3 6h18v12H3zM7 6v12M17 6v12M3 12h4M17 12h4"/>',
 window:'<path d="M4 4h16v16H4zM12 4v16M4 12h16"/>',
 bottle:'<path d="M10 3h4v3l1 3v11a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V9l1-3z"/>',
 heat:'<path d="M6 20V11M6 11c-1-1-1-2 0-3M12 20V11M12 11c-1-1-1-2 0-3M18 20V11M18 11c-1-1-1-2 0-3"/>',
 child:'<path d="M12 4l1.7 3.5 3.8.5-2.7 2.7.6 3.8L12 12.7 8.6 14.5l.6-3.8L6.5 8l3.8-.5z"/>',
 plane:'<path d="M21 15l-8-3V5.5a1.5 1.5 0 0 0-3 0V12l-8 3v2l8-2v3l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-3z"/>',
 heli:'<path d="M4 6h16M12 6v3M6 12h11l2.5 4H4zM12 16v3M9 22h6"/>',
 gondola:'<path d="M3 5l18-2M8 8l1.5 4h5L19 8M7 12h10v6H7zM12 12v6"/>',
 restaurant:'<path d="M7 3v7a2 2 0 0 0 4 0V3M9 10v11"/><path d="M16 3c-1.4 0-2.2 1.6-2.2 4S15 11 16 11v10"/>',
 lamp:'<path d="M10 3h4l1 4a3 3 0 0 1-6 0z"/><path d="M12 11v9M9 21h6"/>',
 shuttle:'<path d="M4 6h16v9H4zM4 15v3M20 15v3M4 11h16M7 18v.01M17 18v.01"/>',
 ski:'<path d="M8 3v14M12 3v14M6 20l12-3"/>',
 def:'<path d="M5 12h14"/>'
}

// Amenity-category icons (the accordion rows)
const AMEN: Record<string, string> = {
 living:'<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M3 11h18v6H3z"/><path d="M5 17v3M19 17v3"/>',
 dining:'<path d="M6 3v7M6 10c1.5 0 2-1 2-3V3M9 3v18"/><path d="M17 3c-2 0-3 2-3 5s1 3 3 3v10"/>',
 kitchen:'<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8 4v6M12 4v6M8 7h4"/><circle cx="16" cy="8" r="1.5"/>',
 bath:'<path d="M4 12h16v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M6 21l1-1M18 21l-1-1"/>',
 spa:'<circle cx="12" cy="10" r="3"/><path d="M12 13v5M7 21c0-2 2-3 5-3s5 1 5 3"/><path d="M9 6c0-1 1-2 3-2s3 1 3 2"/>',
 ski:'<path d="M8 3v14M12 3v14M6 20l12-3"/>',
 laundry:'<rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M11 6h.01"/>',
 cinema:'<rect x="3" y="5" width="18" height="12" rx="1"/><path d="M7 21h10M9 11l4-2v4z"/>'
}

export function pick(t: string): string {
  t = t.toLowerCase()
  if (t.includes('glass')) return 'window'
  if (t.includes('wine') || t.includes('cellar')) return 'bottle'
  if (t.includes('cinema')) return 'cinema'
  if (t.includes('kitchen')) return 'kitchen'
  if (t.includes('dining')) return 'dining'
  if (t.includes('sitting') || t.includes('hearth') || t.includes('fire')) return 'fire'
  if (t.includes('underfloor') || t.includes('heating')) return 'heat'
  if (t.includes('hot tub') || t.includes('jacuzzi') || t.includes('pool')) return 'bath'
  if (t.includes('sauna') || t.includes('hammam') || t.includes('steam') || t.includes('spa') || t.includes('wellness') || t.includes('massage')) return 'heat'
  if (t.includes('ski room') || t.includes('ski-in') || t.includes('ski in') || t.includes('boot')) return 'ski'
  if (t.includes('dressing')) return 'hanger'
  if (t.includes('shower') || t.includes('rain')) return 'shower'
  if (t.includes('bath') || t.includes('suite') || t.includes('wc') || t.includes('basin')) return 'bath'
  if (t.includes('balcony') || t.includes('terrace')) return 'balcony'
  if (t.includes('view') || t.includes('mountain') || t.includes('piste')) return 'mountain'
  if (t.includes('child') || t.includes('nanny')) return 'child'
  if (t.includes('king') || t.includes('bed') || t.includes('bunk') || t.includes('twin') || t.includes('double') || t.includes('super')) return 'bed'
  if (t.includes('restaurant')) return 'restaurant'
  if (t.includes('aerodrome') || t.includes('airport') || t.includes('sion') || t.includes('geneva') || t.includes('gva')) return 'plane'
  if (t.includes('heli')) return 'heli'
  if (t.includes('lift') || t.includes('gondola') || t.includes('médran') || t.includes('medran')) return 'gondola'
  if (t.includes('village') || t.includes('centre') || t.includes('center')) return 'lamp'
  if (t.includes('shuttle') || t.includes('bus')) return 'shuttle'
  return 'def'
}

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
