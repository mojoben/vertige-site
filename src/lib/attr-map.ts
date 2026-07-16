// Master filter attributes (Ben, 2026-07-16): the search filters are the
// top level — "Hot tub" must catch every variant a chalet's content uses
// ("Jacuzzi on the terrace", "Sunken hot tub", "Outdoor whirlpool"…), the
// same for cinema/movie room, bar/outdoor bar, and so on. deriveAttrs()
// runs a chalet's ENTIRE label set (key features, amenities, interior/
// exterior points, location specs) through these keyword families, and the
// result is unioned with the portal Feature-library attrs — so a chalet
// filters correctly however its source described the thing.

const FAMILIES: [string, RegExp][] = [
  ['ski-in', /ski-?in|ski-?out|skis? on at the door|door.?to.?piste/i],
  ['hot-tub', /hot ?tubs?|jacuzzi|whirlpool/i],
  ['spa', /\bspa\b|sauna|steam room|hammam|massage|treatment room|wellness/i],
  ['gym', /\bgym\b|fitness|technogym/i],
  ['cinema', /cinema|movie|screening/i],
  ['fireplace', /fire ?places?|fire ?pit|open fire|log fire|wood-?burning|hearth|stove/i],
  ['chef', /\bchef\b|fully catered|\bcatered\b/i],
  ['cellar', /wine (cellar|room|wall|fridge)|cellar/i],
  ['ski-room', /ski room|boot (room|warmers?)|ski storage|ski racks?|heated ski/i],
  ['bar', /\bbars?\b/i],
  ['near-lifts', /near (the )?lifts?|close to the lifts?|lifts? .*min|min .*lifts?/i],
]

// "Pool" needs care: pool rooms/tables are billiards, whirlpools are tubs.
const POOL = /\bpool\b|swimming/i
const NOT_POOL = /pool (room|table)|poolroom|whirlpool|pool &? ?playroom/i

export function deriveAttrs(labels: string[]): string[] {
  const out = new Set<string>()
  for (const raw of labels) {
    if (!raw) continue
    for (const [attr, re] of FAMILIES) if (re.test(raw)) out.add(attr)
    if (POOL.test(raw) && !NOT_POOL.test(raw)) out.add('indoor-pool')
  }
  return [...out]
}
