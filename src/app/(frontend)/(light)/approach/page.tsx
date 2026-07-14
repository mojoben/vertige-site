import React from 'react'
import Link from 'next/link'

// The Approach — faithful port of vertige-proto-approach.html (scoped .appage).

export const metadata = {
  title: 'The Approach — Vertige',
  description: 'The property market at this level wastes your time. Our entire approach is built to give it back.',
}

export default function ApproachPage() {
  return (
    <div className="appage">
      {/* Header in the join-the-portfolio treatment (Ben, 2026-07-14: one
          consistent pagehero across the content pages). */}
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/chalets/liv-08.webp)' }} />
        <div className="wrap">
          <span className="eyebrow">The Approach</span>
          <h1>We steer. We have an <em>opinion.</em></h1>
          <p className="sub">The property market at this level wastes your time. Our entire approach is built to give it back.</p>
        </div>
      </section>

      <section className="sec"><div className="two">
        <div className="l"><span className="eyebrow k">Curation over volume</span><h2>A portfolio worth <em>trusting</em></h2></div>
        <div className="r">
          <p>Vertige does not list every chalet available. It lists the chalets worth booking.</p>
          <p>The portfolio is deliberately selective. Every chalet is chosen for the quality of its build, its location, its aspect, and its suitability for the experience we promise. A property that does not meet the standard does not feature. The value of the name rests entirely on the rigour of that selection — so that anything carrying it has been chosen with care, not added to pad a search page.</p>
        </div>
      </div></section>

      <section className="sec alt"><div className="in">
        <div className="two">
          <div className="l"><span className="eyebrow k">The recommendation</span><h2>The match, not the <em>catalogue</em></h2></div>
          <div className="r">
            <p>When a client comes to Vertige, we do not hand them a list and wish them luck.</p>
            <p>We ask the right questions, then we make a recommendation — a considered shortlist, not an overwhelming array of options. We will tell a client when a chalet they have found themselves is not quite right for their group, and we will tell them why, and what we would suggest instead. Our business depends on getting the match right, and we take that seriously.</p>
          </div>
        </div>
        <div className="steps">
          <div className="step"><div className="no">01</div><h3>We ask the questions that matter</h3><p>Group size and composition, ability levels, the kind of week you want, the resorts you have skied before and what you loved or didn&rsquo;t.</p></div>
          <div className="step"><div className="no">02</div><h3>We make a recommendation</h3><p>A shortlist we stand behind, with reasons. We steer towards what will work and away from what will not.</p></div>
          <div className="step"><div className="no">03</div><h3>We build the week around the chalet</h3><p>Transfers, instruction, restaurant reservations, the things you didn&rsquo;t think to ask for. Handled, so the week runs without you managing it.</p></div>
        </div>
      </div></section>

      <section className="pq"><div className="wrap">
        <p>Some of the best things we do for a client will never appear on an invoice.</p>
        <div className="at">The Vertige approach</div>
      </div></section>

      <section className="sec"><div className="two">
        <div className="l"><span className="eyebrow k">No guff</span><h2>Every word earns its <em>place</em></h2></div>
        <div className="r">
          <p>The market at this level suffers from a consistent problem: chalets are either oversold with breathless copy or undersold with information-light listings. Neither serves the client; both waste their time.</p>
          <p>We present every property the way it deserves to be seen. Exceptional photography. Honest, considered descriptions that tell you exactly what a chalet is — and, just as importantly, what it is not. The detail that matters: the floorplan, the aspect, the proximity to the piste, the quality of the ski-in access, the size of the kitchen if there is a private chef. We do not use superlatives to make every listing sound the same.</p>
          <p>This clarity is itself a form of luxury. It says we respect your intelligence and your time. You are not here to be sold to. You are here to find the right chalet.</p>
        </div>
      </div></section>

      <section className="sec alt"><div className="in"><div className="two">
        <div className="l"><span className="eyebrow k">Investing in the experience</span><h2>A freedom bigger operators <em>don&rsquo;t have</em></h2></div>
        <div className="r">
          <p>Lean, founder-led and carrying minimal overhead, Vertige has a freedom that established operators — with their infrastructure, their headcount and their commercial pressures — simply do not have. That freedom is spent directly on the client experience.</p>
          <p>An unexpected touch. A gift that arrives without being asked for. An upgrade absorbed rather than charged. A concierge call that goes further than it needed to. These are not gestures — they are the difference between a stay someone enjoyed and one they talk about for years.</p>
          <p>Every pound not spent on unnecessary infrastructure is a pound available to spend on the client. A client who returns every year is worth far more than one who books once and moves on. So spending a little more to get the week right is never a cost. It is always an investment.</p>
        </div>
      </div></div></section>

      <section className="cta"><div className="in">
        <div className="im" />
        <div>
          <span className="eyebrow">Start your search</span>
          <h2>Tell us about your <em>week</em>.</h2>
          <p>Share your group, your dates and the kind of week you have in mind. We&rsquo;ll make a considered recommendation and build the week around it.</p>
          <Link className="btn" href="/concierge">Speak to a specialist</Link>
        </div>
      </div></section>
    </div>
  )
}
