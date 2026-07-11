import type { Fact } from './facts'

// Seed facts per resort slug. Interim store: this moves to the res portal
// (staff-entered + AI-researched, reviewed before `verified: true`) and reaches
// the site through the portal read adapter. Values below are taken from the
// prototype resort-guide blocks (Verbier) or are safe placeholder
// approximations pending research — all copy is first-draft placeholder per
// the handoff.
export const RESORT_FACTS: Record<string, Fact[]> = {
  verbier: [
    { key: 'airport', value: 'Sion · 50 min (Geneva ~2 h)', source: 'manual', verified: true },
    { key: 'altitude', value: '1,500 m · skiing to 3,330 m', source: 'manual', verified: true },
    { key: 'skiArea', value: '412 km · 4 Vallées', source: 'manual', verified: true },
    { key: 'lifts', value: '~93', source: 'manual', verified: true },
    { key: 'season', value: 'Late Nov – late Apr', source: 'manual', verified: true },
    { key: 'town', value: 'Walk-everywhere village centre', source: 'manual', verified: true },
    // Example of the review-queue contract: an AI-proposed fact that has NOT
    // been approved yet — it must never render on the site.
    { key: 'skiInOut', value: 'Selected chalets ski-in/ski-out via Médran', source: 'ai', verified: false },
  ],
  chamonix: [
    { key: 'airport', value: 'Geneva · 1 h 15', source: 'manual', verified: true },
    { key: 'altitude', value: '1,035 m · skiing to 3,842 m', source: 'manual', verified: true },
    { key: 'skiArea', value: 'Vallée de Chamonix · Mont Blanc', source: 'manual', verified: true },
    { key: 'season', value: 'Dec – Apr (glacier into May)', source: 'manual', verified: true },
    { key: 'town', value: 'A working alpine town, not a purpose-built resort', source: 'manual', verified: true },
  ],
  courchevel: [
    { key: 'airport', value: 'Geneva ~2 h 15 · Chambéry 1 h 45', source: 'manual', verified: true },
    { key: 'altitude', value: '1,850 m · skiing to 3,230 m', source: 'manual', verified: true },
    { key: 'skiArea', value: '600 km · Les 3 Vallées', source: 'manual', verified: true },
    { key: 'season', value: 'Early Dec – mid Apr', source: 'manual', verified: true },
    { key: 'skiInOut', value: 'Ski-in/ski-out across much of 1850', source: 'manual', verified: true },
  ],
}
