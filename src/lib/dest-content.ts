import guides from '@/content/t1_guides_rich.json'
import { RESORT_FACTS } from './facts-data'
import type { Fact } from './facts'

// Per-resort destination-page content. Verbier carries the exact copy from
// vertige-proto-dest-verbier.html (the reference build); the other Tier-1
// resorts derive their sections from the rich guide content
// (t1_guides_rich.json — the same source the prototype generators used);
// Tier-2 resorts get graceful holding copy until the content phase reaches
// them. Moves to the Payload `Destinations` collection when the CMS lands.

interface Guide {
  slug: string; name: string; country: string
  intro?: string; skiing?: string; town?: string; when?: string
  getting?: string; beyond?: string; eating?: string; pick?: string
}

export interface GuideBlock { title: string; intro: string; body: string; more?: string }
export interface DestContent {
  heroEyebrowExtra?: string // e.g. "· 4 Vallées" after the country
  heroSub: string
  overviewLead: string[]
  chaletsSub: string
  guideBlocks: GuideBlock[]
  gfacts: { label: string; value: string }[]
  hasGuide: boolean
}

const FACT_LABELS: Record<string, string> = {
  altitude: 'Resort altitude', skiArea: 'Ski area', lifts: 'Lifts',
  airport: 'Nearest airport', season: 'Season', town: 'The town', skiInOut: 'Ski access',
}

const factsToG = (facts: Fact[] | undefined) =>
  (facts ?? []).filter((f) => f.verified).map((f) => ({ label: FACT_LABELS[f.key] ?? f.key, value: f.value }))

// ── Verbier — verbatim from the reference prototype ─────────────────────────
const VERBIER: DestContent = {
  heroEyebrowExtra: '· 4 Vallées',
  heroSub: 'A freeride icon and four-valley playground, wrapped around one of the most alive resort towns in the Alps.',
  overviewLead: [
    'Verbier is where serious skiing meets a town that never quite goes to bed. Perched above the Rhône valley in the Swiss canton of Valais, it opens straight onto the 4 Vallées, with 412km of linked pistes and some of the most celebrated lift-served off-piste anywhere in the Alps, then hands you back to a village of long lunches and later nights.',
    'Our Verbier collection is short and considered. Every chalet is visited and vetted, and we work only with owners and local teams we trust, from ski-in, ski-out flagships on the Médran side to quieter boltholes in Les Esserts and Sonalon. Whichever you choose, our team plans the week around it.',
  ],
  chaletsSub: 'From ski-in, ski-out flagships to quieter corners above the village; filter by size, budget, service level and features.',
  guideBlocks: [
    {
      title: 'About skiing in Verbier',
      intro: 'Part of the vast 4 Vallées, with 412km of pistes and superb lift-served off-piste.',
      body: 'Verbier has long been a freeride mecca, and confident skiers get the most from Mont-Fort, Tortin and Mont-Gelé, but there is more range than its reputation suggests, with wide, quiet pistes off Les Attelas and tree-lined runs at Bruson for bad-weather days. Beginners are well served on the nursery slopes at Les Esserts before progressing up the mountain.',
      more: 'Read the full Vertige guide to skiing in Verbier →',
    },
    {
      title: 'Where to eat & drink',
      intro: 'A town that takes its long lunches and its late nights equally seriously.',
      body: "Mountain terraces reward a slow lunch, and the village pairs Swiss classics with a genuinely international line-up; La Table d'Adrien is the reference for a special dinner. After dark the après runs from easy to legendary, with Farinet and Pub Mont Fort among the names you will hear.",
      more: 'Find the tables worth booking in our Verbier dining guide →',
    },
    {
      title: 'Beyond the slopes',
      intro: 'Snowshoeing, paragliding, spa afternoons and a packed winter calendar.',
      body: 'Off the snow there is snowshoeing, tobogganing, paragliding and dog-sledding, and the events calendar is a draw in itself, with Xtreme Verbier, the final stop of the Freeride World Tour, and a world-class summer music festival.',
      more: 'Discover what’s on in Verbier →',
    },
    {
      title: 'How to get to Verbier',
      intro: 'In the canton of Valais, easily reached by road, rail or air.',
      body: 'Most guests arrive via Geneva, around two hours by car, with Sion airport just fifty minutes away; from Le Châble a cable car or short transfer brings you into the village. We arrange every transfer, including in-resort helicopter pickups.',
    },
  ],
  gfacts: [
    { label: 'Resort altitude', value: '1,500 m' },
    { label: 'Skiable terrain', value: '1,500–3,330 m' },
    { label: 'Ski area', value: '412 km · 4 Vallées' },
    { label: 'Lifts', value: '~93' },
    { label: 'Nearest airport', value: 'Sion · 50 min' },
    { label: 'Season', value: 'Late Nov – late Apr' },
  ],
  hasGuide: true,
}

const trim = (s: string | undefined, n: number) =>
  !s ? '' : s.length <= n ? s : s.slice(0, s.lastIndexOf('.', n) + 1) || s.slice(0, n) + '…'

export function getDestContent(slug: string, name: string): DestContent {
  if (slug === 'verbier') return VERBIER
  const g = (guides as Guide[]).find((x) => x.slug === slug)
  if (g) {
    const blocks: GuideBlock[] = []
    if (g.skiing) blocks.push({ title: `About skiing in ${name}`, intro: trim(g.when ?? '', 110) || `The mountain and who it suits.`, body: trim(g.skiing, 460), more: `Read the full Vertige guide to skiing in ${name} →` })
    if (g.eating) blocks.push({ title: 'Where to eat & drink', intro: 'Long lunches on the mountain, serious tables in the village.', body: trim(g.eating, 420) })
    if (g.beyond) blocks.push({ title: 'Beyond the slopes', intro: 'Off-snow days, wellness and the winter calendar.', body: trim(g.beyond, 420) })
    if (g.getting) blocks.push({ title: `How to get to ${name}`, intro: 'Airports, transfers and arriving well.', body: trim(g.getting, 420) })
    return {
      heroSub: trim(g.intro, 150) || `Hand-picked luxury chalets in ${name}, with Vertige concierge on every stay.`,
      overviewLead: [trim(g.intro, 600) || ''].filter(Boolean).concat([`Our ${name} collection is short and considered — every chalet visited and vetted, and the week planned around it by our team.`]),
      chaletsSub: 'Filter by size, budget, service level and features.',
      guideBlocks: blocks,
      gfacts: factsToG(RESORT_FACTS[slug]),
      hasGuide: true,
    }
  }
  return {
    heroSub: `Hand-picked luxury chalets in ${name}, with Vertige concierge on every stay.`,
    overviewLead: [
      `${name} is part of the Vertige portfolio — a short, considered collection where every chalet is visited and vetted, and our team plans the week around the one you choose.`,
      'The full resort editorial for this page is being prepared by the editorial team.',
    ],
    chaletsSub: 'Filter by size, budget, service level and features.',
    guideBlocks: [],
    gfacts: factsToG(RESORT_FACTS[slug]),
    hasGuide: false,
  }
}
