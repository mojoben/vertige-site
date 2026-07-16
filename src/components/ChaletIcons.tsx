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
 elevator:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18"/><path d="M8 14v-4M8 10l-1.5 1.5M8 10l1.5 1.5M16 10v4M16 14l-1.5-1.5M16 14l1.5-1.5"/>',
 towels:'<path d="M4 4h10a2.5 2.5 0 0 1 0 5H4zM4 6.5h7.5"/><path d="M20 9.5H10a2.5 2.5 0 0 0 0 5h10zM20 12h-7.5"/><path d="M4 15h10a2.5 2.5 0 0 1 0 5H4zM4 17.5h7.5"/>',
 gym:'<rect x="2" y="9" width="3" height="6" rx="1"/><rect x="6" y="6.5" width="3.5" height="11" rx="1"/><rect x="14.5" y="6.5" width="3.5" height="11" rx="1"/><rect x="19" y="9" width="3" height="6" rx="1"/><path d="M9.5 12h5"/>',
 games:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8.5 8.5v.01M15.5 8.5v.01M12 12v.01M8.5 15.5v.01M15.5 15.5v.01"/>',
 bowling:'<circle cx="12" cy="12" r="8"/><path d="M10 8v.01M13.5 7.5v.01M13.5 11v.01"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 0-2 2z"/><path d="M20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 1 2 2z"/>',
 garden:'<path d="M12 21v-8"/><path d="M12 13c0-3-2-5-5-5 0 3 2 5 5 5z"/><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5z"/>',
 music:'<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',
 link:'<path d="M11 5l1.5-1.5a4 4 0 0 1 5.7 5.7L16.5 11"/><path d="M13 19l-1.5 1.5a4 4 0 0 1-5.7-5.7L7.5 13"/><path d="M9 15l6-6"/>',
 sofa:'<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M3 11h18v6H3z"/><path d="M5 17v2M19 17v2"/>',
 snow:'<path d="M12 3v18M5 6.5l14 11M19 6.5l-14 11"/>',
 art:'<rect x="4" y="4" width="16" height="16"/><path d="M7 15l3-4 2 2.5L14 11l3 4"/><path d="M9 8v.01"/>',
 car:'<path d="M3 17v-4l2-5h14l2 5v4"/><path d="M3 13h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/>',
 desk:'<path d="M3 8h18M4 8v10M20 8v10M13 8v10M13 11h7M13 14h7"/>',
 tv:'<rect x="3" y="5" width="18" height="12" rx="1"/><path d="M9 21h6M12 17v4"/>',
 wifi:'<path d="M4 9a12 12 0 0 1 16 0"/><path d="M7 12.5a8 8 0 0 1 10 0"/><path d="M10 16a4 4 0 0 1 4 0"/><path d="M12 19v.01"/>',
 safe:'<rect x="4" y="4" width="16" height="16" rx="1"/><circle cx="12" cy="12" r="4"/><path d="M12 8v2M12 14v2M8 12h2M14 12h2"/>',
 piano:'<rect x="3" y="8" width="18" height="8"/><path d="M7 8v5M11 8v5M15 8v5"/>',
 laundry:'<rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M11 6h.01"/>',
 coffee:'<path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/><path d="M8.5 5c0-1 .5-1 .5-2M12 5c0-1 .5-1 .5-2"/>',
 sound:'<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="12" cy="15" r="3.5"/><circle cx="12" cy="7.5" r="1.5"/>',
 cube:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
 spa:'<path d="M12 12.5c-1.6-2.4-1.6-4.9 0-7.5 1.6 2.6 1.6 5.1 0 7.5z"/><path d="M12 12.5c-3-.8-4.7-2.6-5-5.3 2.7.3 4.4 2 5 5.3z"/><path d="M12 12.5c3-.8 4.7-2.6 5-5.3-2.7.3-4.4 2-5 5.3z"/><path d="M4.5 15.5c1.7 3 4.3 4.5 7.5 4.5s5.8-1.5 7.5-4.5"/>',
 pool:'<path d="M8.5 13V5a1.5 1.5 0 0 1 3 0M14 13V5a1.5 1.5 0 0 1 3 0"/><path d="M8.5 7.5H14M8.5 10.5H14"/><path d="M3 16c1.5 1.1 3 1.1 4.5 0s3-1.1 4.5 0 3 1.1 4.5 0 3-1.1 4.5 0"/><path d="M3 19.5c1.5 1.1 3 1.1 4.5 0s3-1.1 4.5 0 3 1.1 4.5 0 3-1.1 4.5 0"/>',
 hottub:'<rect x="4" y="11" width="16" height="7" rx="1"/><path d="M7.5 11v7M11.5 11v7M15.5 11v7"/><path d="M8 8c.6-1 .6-2 0-3M12 8c.6-1 .6-2 0-3M16 8c.6-1 .6-2 0-3"/>',
 hiddeneye:'<path d="M3 12c2.5-4 6-6 9-6s6.5 2 9 6c-2.5 4-6 6-9 6s-6.5-2-9-6z"/><circle cx="12" cy="12" r="2.8"/><path d="M4.5 20L19.5 4"/>',
 pin:'<path d="M12 21s-7-6.6-7-11a7 7 0 0 1 14 0c0 4.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
 massage:'<path d="M8 6c0-1.7 1.2-2.8 2.8-2.8 1.2 0 1.9.7 3 .7 1 0 1.7-.4 2.4-1.1.5 1.8-.1 3.3-1.8 4.1L10 9.2"/><path d="M3 16c4.5-2.8 13.5-2.8 18 0"/><path d="M9.5 19c1.7.4 3.3.4 5 0"/>',
 meditation:'<circle cx="12" cy="5" r="1.9"/><path d="M8.5 13c.7-2.5 1.9-3.8 3.5-3.8s2.8 1.3 3.5 3.8"/><path d="M4.5 13.5c1.5.9 2.7.5 4-1.5M19.5 13.5c-1.5.9-2.7.5-4-1.5"/><path d="M8 18.7c-.9-1.4 0-2.7 1.8-3l2.2 1 2.2-1c1.8.3 2.7 1.6 1.8 3-2.6.7-5.4.7-8 0z"/>',
 wc:'<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M6.5 10l1 4 1.2-3 1.2 3 1-4"/><path d="M17.3 10.7a2.2 2.2 0 1 0 0 2.6"/>',
 chefhat:'<path d="M8 9.8a3.6 3.6 0 1 1 .5-7.1 4.6 4.6 0 0 1 7 0 3.6 3.6 0 1 1 .5 7.1V14H8z"/><path d="M8 17h8M10.5 10.8v1.8M13.5 10.8v1.8"/><path d="M8 14h8"/>',
 bunk:'<path d="M4 3v18M20 3v18"/><path d="M4 8h16M4 11h16M4 16h16M4 19h16"/><path d="M6.5 6.5h3M6.5 14.5h3"/>',
 familybed:'<path d="M2 19v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M2 17h12M2 19v1M14 19v1"/><path d="M17.5 4v16M22 4v16M17.5 7.5H22M17.5 12H22M17.5 16.5H22"/>',
 van:'<path d="M2 7h12l6 4v5h-2.5M2 7v9h2.5M2 12h18"/><circle cx="7" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/><path d="M9 16.5h5"/>',
 skier:'<circle cx="15" cy="4.3" r="1.8"/><path d="M13.5 7l-4.5 2.8 3.5 2.6-3 4.2"/><path d="M13.5 7l3.4 1.4-1.4 4-3-1"/><path d="M5.5 12.5l2 5.5"/><path d="M2.5 18.3c6.5 2.7 13 2.4 19-1.3"/>',
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
  if (t.includes('pool room') || t.includes('playroom') || t.includes('play room')) return 'cube'
  if (t.includes('car lift') || t.includes('turning plate')) return 'car'
  if (t.includes('family suite')) return 'familybed'
  if (t.includes('bunk')) return 'bunk'
  if (t.includes('hot tub') || t.includes('jacuzzi')) return 'hottub'
  if (t.includes('pool') || t.includes('swimming')) return 'pool'
  if (t.includes('massage')) return 'massage'
  if (t.includes('meditation') || t.includes('yoga')) return 'meditation'
  if (t.includes('neighbour')) return 'hiddeneye'
  if (t.includes('heart of')) return 'pin'
  if (t.includes('in-town') || t.includes('village') || t.includes('centre') || t.includes('center')) return 'map'
  if (/\bwc\b/.test(t) || t.includes('toilet')) return 'wc'
  if (t.includes('ski-in') || t.includes('ski in') || t.includes('ski-out') || t.includes('ski out')) return 'skier'
  if (t.includes('panoramic') && (t.includes('view') || t.includes('mountain'))) return 'mountain'
  if (t.includes('glass lift')) return 'elevator'
  if (t.includes('glass')) return 'window'
  if (t.includes('wine') || t.includes('cellar') || /\bbar\b/.test(t)) return 'bottle'
  if (t.includes('bowling')) return 'bowling'
  if (t.includes('casino') || t.includes('poker') || t.includes('games') || t.includes('gaming') || t.includes('snooker') || t.includes('billiard') || t.includes('chess') || t.includes('foosball') || t.includes('xbox')) return 'games'
  if (t.includes('library') || t.includes('reading') || t.includes('book')) return 'book'
  if (t.includes('nightclub') || t.includes('disco') || t.includes('music')) return 'music'
  if (t.includes('pairs with') || t.includes('connected') || t.includes('two of')) return 'link'
  if (t.includes('garden')) return 'garden'
  if (t.includes('snow machine') || t.includes('snow-making')) return 'snow'
  if (/\bart\b/.test(t)) return 'art'
  if (t.includes('cinema') || t.includes('movie')) return 'cinema'
  if (t.includes('kitchen')) return 'kitchen'
  if (t.includes('dining')) return 'dining'
  if (t.includes('sitting') || t.includes('hearth') || t.includes('fire')) return 'fire'
  if (t.includes('underfloor') || t.includes('heating')) return 'heat'
  if (t.includes('gym') || t.includes('fitness') || t.includes('wellbeing') || t.includes('well-being')) return 'gym'
  if (t.includes('housekeep') || t.includes('linen') || t.includes('towel') || t.includes('turndown')) return 'towels'
  if (t.includes('spa') || t.includes('wellness')) return 'spa'
  if (t.includes('sauna') || t.includes('hammam') || t.includes('steam') || t.includes('relaxation')) return 'heat'
  if (t.includes('ski room') || t.includes('ski-in') || t.includes('ski in') || t.includes('ski-out') || t.includes('ski out') || t.includes('ski pass') || t.includes('boot')) return 'ski'
  if (t.includes('chef') || t.includes('butler') || t.includes('catered') || t.includes('cook')) return 'chefhat'
  if (t.includes('garage') || t.includes('parking')) return 'car'
  if (t.includes('office') || t.includes('bureau') || t.includes('desk') || t.includes('study') || t.includes('conference')) return 'desk'
  if (/\btv\b/.test(t) || t.includes('television') || t.includes('projector') || t.includes('flat-screen')) return 'tv'
  if (t.includes('wi-fi') || t.includes('wifi')) return 'wifi'
  if (/\bsafe/.test(t)) return 'safe'
  if (t.includes('piano')) return 'piano'
  if (t.includes('laundry') || t.includes('washer') || t.includes('dryer') || t.includes('drying room')) return 'laundry'
  if (t.includes('coffee') || t.includes('nespresso')) return 'coffee'
  if (t.includes('sound') || t.includes('dolby') || t.includes('sonos') || t.includes('speaker') || t.includes('surround')) return 'sound'
  if (t.includes('table tennis') || t.includes('table football') || t.includes('pinball') || t.includes('ping')) return 'games'
  if (t.includes('ski rack') || t.includes('ski storage') || t.includes('ski-pass') || t.includes('slope access') || t.includes('equipment storage')) return 'ski'
  if (t.includes('closet') || t.includes('wardrobe') || t.includes('storage')) return 'hanger'
  if (t.includes('armchair') || t.includes('sofa') || t.includes('nook') || t.includes('corner') || t.includes('open-plan') || t.includes('split-level') || t.includes('mezzanine') || t.includes('layout')) return 'sofa'
  if (t.includes('seats') || /\btable\b/.test(t)) return 'dining'
  if (t.includes('appliance') || t.includes('equipped') || t.includes('oven')) return 'kitchen'
  if (t.includes('in-town')) return 'lamp'
  if (t.includes('forest') || t.includes('nature') || t.includes('natural') || t.includes('valley') || t.includes('panorama') || t.includes('outlook') || t.includes('standalone') || t.includes('neighbour') || t.includes('setting')) return 'mountain'
  if (t.includes('exterior access') || t.includes('opens into')) return 'balcony'
  if (t.includes('window')) return 'window'
  if (t.includes('service')) return 'towels'
  if (t.includes('dressing')) return 'hanger'
  if (t.includes('shower') || t.includes('rain')) return 'shower'
  if (t.includes('bath') || t.includes('suite') || t.includes('wc') || t.includes('basin')) return 'bath'
  if (t.includes('balcon') || t.includes('terrace')) return 'balcony'
  if (t.includes('panoramic') || t.includes('bay window')) return 'window'
  if (t.includes('vaulted') || t.includes('salon') || t.includes('living') || t.includes('lounge') || t.includes('snug')) return 'sofa'
  if (t.includes('newly') || t.includes('renovat') || t.includes('rated')) return 'child'
  if (t.includes('view') || t.includes('mountain') || t.includes('piste')) return 'mountain'
  if (t.includes('child') || t.includes('nanny')) return 'child'
  if (t.includes('king') || t.includes('queen') || t.includes('bed') || t.includes('twin') || t.includes('double') || t.includes('super')) return 'bed'
  if (t.includes('restaurant')) return 'restaurant'
  if (t.includes('aerodrome') || t.includes('airport') || t.includes('sion') || t.includes('geneva') || t.includes('gva')) return 'plane'
  if (t.includes('heli')) return 'heli'
  if (t.includes('cable car') || t.includes('cablecar')) return 'gondola'
  // "Lift" on a chalet page is the in-chalet elevator unless the wording is
  // clearly the ski infrastructure (nearest lift, chairlift, ski lift…).
  if (t.includes('elevator') || (t.includes('lift') && !/ski|chair|drag|nearest|close|walk|gondola|pass/.test(t))) return 'elevator'
  if (t.includes('lift') || t.includes('gondola') || t.includes('médran') || t.includes('medran')) return 'gondola'
  if (t.includes('route des')) return 'lamp'
  if (t.includes('shuttle') || t.includes('bus') || t.includes('chauffeur') || t.includes('driver') || t.includes('transfer')) return 'van'
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
