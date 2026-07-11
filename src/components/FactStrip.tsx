import type { Fact, FactKey } from '@/lib/facts'
import { FACT_META, visibleFacts } from '@/lib/facts'

// The at-a-glance facts strip: icon-linked chips (plane for airport transfer,
// mountain for altitude, …). ICON RULE: line/outline SVGs only — stroke
// currentColor, no fill, never coloured glyphs, never emoji (brand-wide).
// Renders VERIFIED facts only (see lib/facts.ts).

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const ICONS: Record<FactKey, React.ReactNode> = {
  airport: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  ),
  altitude: <path d="m8 3 4 8 5-5 5 15H2L8 3z" />,
  skiArea: (
    <>
      <path d="M9 6 3 3v15l6 3 6-3 6 3V6l-6-3-6 3z" />
      <path d="M9 6v15M15 3v15" />
    </>
  ),
  lifts: (
    <>
      <path d="M2 5l20-2" />
      <path d="M12 4.2V9" />
      <path d="M8 9h8a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6a1 1 0 0 1 1-1z" />
      <path d="M7 13h10" />
    </>
  ),
  season: (
    <>
      <path d="M12 2v20M4 7l16 10M20 7 4 17" />
    </>
  ),
  town: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  skiInOut: (
    <>
      <path d="M4 20l16-6" />
      <path d="M6 18l2-9a2 2 0 0 1 3.9-.4" />
      <path d="M14 6.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
      <path d="M11 13l4 3" />
    </>
  ),
}

export function FactStrip({ facts, title = 'Practicalities' }: { facts: Fact[]; title?: string }) {
  const shown = visibleFacts(facts)
  if (shown.length === 0) return null
  return (
    <div className="factstrip" id="practicalities">
      <div className="fs-eye">{title}</div>
      <div className="fs-grid">
        {shown.map((f) => (
          <div key={f.key} className="fs-chip">
            <svg viewBox="0 0 24 24" aria-hidden {...STROKE}>{ICONS[FACT_META[f.key].icon]}</svg>
            <div>
              <div className="fs-label">{FACT_META[f.key].label}</div>
              <div className="fs-value">{f.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
