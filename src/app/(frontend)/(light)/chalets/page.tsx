import React from 'react'
import { DestinationExplorer } from '@/components/DestinationExplorer'
import { getCatalogue } from '@/lib/portal-client'

// The chalet catalogue — faithful port of vertige-proto-chalets.html:
// search bar, filter bar, results grid + map at full-catalogue scope
// ("The Alps"), then the plan-with-us band.

export const metadata = { title: 'Luxury Ski Chalets — Vertige' }

export default async function ChaletsPage() {
  const { chalets } = await getCatalogue()

  return (
    <div className="dpage">
      {/* Header image in the destination-page treatment (Ben, 2026-07-13) —
          also gives the explorer's search bar its proper resting place. */}
      <section className="dhero" id="top">
        <div className="bg" style={{ backgroundImage: 'url(/images/hero.jpg)' }} />
        <div className="wrap">
          <span className="eyebrow">The collection</span>
          <h1>Our chalets</h1>
          <p className="sub">The full Vertige portfolio across the Alps — search, filter and compare every chalet we represent.</p>
          <a className="hbtn" href="#chalets">View the chalets ↓</a>
        </div>
      </section>

      <DestinationExplorer resortName={null} chalets={chalets} />

      <section className="plancta"><div className="in2">
        <div className="pcta-tx">
          <span className="eyebrow">Start your search</span>
          <h2>Not sure where to <em>begin</em>?</h2>
          <p>Tell us how your group skis, who&rsquo;s coming and the week you have in mind — our team will hand-pick a shortlist of chalets and plan every detail, from instructors and childcare to the tables worth booking.</p>
          <a className="btn" href="#">Speak to our team</a>
        </div>
        <div className="pcta-im" style={{ backgroundImage: 'url(/images/cta-man.jpg)' }} />
      </div></section>
    </div>
  )
}
