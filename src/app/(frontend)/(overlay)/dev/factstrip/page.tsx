import { FactStrip } from '@/components/FactStrip'
import { RESORT_FACTS } from '@/lib/facts-data'

// DEV-ONLY component preview (not linked from anywhere): renders the fact
// strip at the top of the page for design review. Remove before deploy or
// gate behind an env flag.
export default function FactStripPreview() {
  return (
    <div style={{ padding: '120px 0 60px' }}>
      <div className="wrap">
        <h2 style={{ fontSize: '1.6rem', marginBottom: '2rem' }}>Fact chips — Verbier</h2>
        <FactStrip facts={RESORT_FACTS.verbier} />
        <h2 style={{ fontSize: '1.6rem', margin: '3rem 0 2rem' }}>Fact chips — Courchevel</h2>
        <FactStrip facts={RESORT_FACTS.courchevel} />
      </div>
    </div>
  )
}
