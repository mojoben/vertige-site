import React from 'react'
import Link from 'next/link'
import { SITE } from '@/lib/site'

// Concierge — faithful port of vertige-proto-concierge-alt.html (scoped .cgpage).

export const metadata = {
  title: 'Concierge — Vertige',
  description: 'The point of a concierge is simple: you should arrive to a week that already works. One point of contact, from your first enquiry to your last morning.',
}

export default function ConciergePage() {
  return (
    <div className="cgpage">
      {/* Hero */}
      <section className="chero">
        <div className="bg" />
        <div className="wrap"><div className="hlab">Vertige · Trip planning &amp; concierge</div><h1>Concierge</h1></div>
      </section>

      {/* Opening statement */}
      <section className="cstate"><div className="wrap">
        <div className="eyebrow">§ What a concierge is</div>
        <h2>The point of a concierge is simple: <em>you should arrive to a week that already works.</em> Passes collected, chef briefed, transfers timed — so the only decision left is which run to take first.</h2>
        <p className="supp">We arrange everything around your chalet through people we&rsquo;ve worked with for years, and stay reachable the whole time you&rsquo;re away. One point of contact, from your first enquiry to your last morning.</p>
      </div></section>

      {/* House rules */}
      <section className="rules"><div className="wrap">
        <div className="eyebrow">§ The house rules</div>
        <h2>Six things we <em>do not compromise on.</em></h2>
        <ol>
          <li><span>One point of contact. Never a call centre.</span></li>
          <li><span>A dossier kept for years, not a form filled at check-in.</span></li>
          <li><span>Answers in hours, not days — in your language.</span></li>
          <li><span>Local partners we have worked with for years, never a faceless marketplace.</span></li>
          <li><span>Nothing asked twice. Nothing forgotten.</span></li>
          <li><span>A chalet that is warm and ready before you open the door.</span></li>
        </ol>
      </div></section>

      {/* What we arrange */}
      <section className="arrange"><div className="wrap">
        <div className="ah">
          <div className="eyebrow">§ What we arrange</div>
          <h2>One call, and the whole week is <em>handled</em>.</h2>
          <p>Your concierge is a single point of contact for everything a mountain week involves — arranged with trusted local partners, most of it before you think to ask.</p>
        </div>
        <div className="agrid">
          <div className="acell"><svg viewBox="0 0 24 24"><path d="M21 15l-8-3V5.5a1.5 1.5 0 0 0-3 0V12l-8 3v2l8-2v3l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-3z" /></svg><h3>Transfers &amp; aviation</h3><p>Chauffeured airport transfers, private drivers and helicopter connections.</p></div>
          <div className="acell"><svg viewBox="0 0 24 24"><path d="M7 3v7a2 2 0 0 0 4 0V3M9 10v11" /><path d="M16 3c-1.4 0-2.2 1.6-2.2 4S15 11 16 11v10" /></svg><h3>Private chefs &amp; dining</h3><p>In-chalet chefs, catered evenings and long lunches on the mountain.</p></div>
          <div className="acell"><svg viewBox="0 0 24 24"><path d="M8 3v14M12 3v14M6 20l12-3" /></svg><h3>Instructors &amp; guides</h3><p>Private ski and off-piste instructors, and mountain guides for every level.</p></div>
          <div className="acell"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M9 6v12" /></svg><h3>Passes &amp; equipment</h3><p>Lift passes delivered, and boots and skis fitted before you arrive.</p></div>
          <div className="acell"><svg viewBox="0 0 24 24"><path d="M12 21c-4-2-7-6-7-10 3 0 5 2 7 5 2-3 4-5 7-5 0 4-3 8-7 10z" /></svg><h3>Wellness &amp; spa</h3><p>Massage therapists, treatments and in-chalet wellness on request.</p></div>
          <div className="acell"><svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2.5" /><path d="M12 8.5V15M9 21l3-4 3 4M9 12h6" /></svg><h3>Childcare &amp; nannies</h3><p>Trusted, qualified childcare so the grown-ups can take a longer run.</p></div>
          <div className="acell"><svg viewBox="0 0 24 24"><path d="M6 16h12l-1-5a5 5 0 0 0-10 0zM10 19a2 2 0 0 0 4 0" /></svg><h3>Tables &amp; reservations</h3><p>The hardest bookings in the valley, held for the nights that matter.</p></div>
          <div className="acell"><svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg><h3>Experiences &amp; celebrations</h3><p>First tracks, tastings, birthdays — the moments a week is remembered for.</p></div>
        </div>
      </div></section>

      {/* Reserve tier */}
      <section className="tier reserve"><div className="wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="tim"><img src="/images/17.jpg" alt="Arrival at a Vertige chalet" /></div>
        <div className="tx">
          <div className="badge">Included with every stay</div>
          <h2>Reserve <em>service</em>.</h2>
          <p className="lead">Every Vertige booking is fully supported. Once our specialists have matched you with the right chalet, your correspondent works with the local household so that everything runs seamlessly, from arrival to departure.</p>
          <div className="clist">
            <div className="c"><span className="tk">✓</span>Check-in &amp; check-out managed by your chalet host</div>
            <div className="c"><span className="tk">✓</span>Airport transfers arranged — or driving directions</div>
            <div className="c"><span className="tk">✓</span>Ski pass delivery &amp; lift arrangements</div>
            <div className="c"><span className="tk">✓</span>Welcome hamper &amp; first-day basics</div>
            <div className="c"><span className="tk">✓</span>In-chalet support throughout your stay</div>
            <div className="c"><span className="tk">✓</span>A curated list of trusted local suppliers</div>
          </div>
        </div>
      </div></section>

      {/* Privé tier */}
      <section className="tier prv rev"><div className="wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="tim"><img src="/images/03.jpg" alt="Privé service" /></div>
        <div className="tx">
          <div className="badge">Privé Collection · or for a service fee</div>
          <h2>Privé <em>service</em>.</h2>
          <p className="lead">For those with little time to spare, our team builds a highly personal itinerary before you travel, and your dedicated correspondent stays close throughout — so you can arrive and simply ski.</p>
          <div className="clist">
            <div className="c"><span className="tk">✓</span>Everything in Reserve, plus a dedicated concierge</div>
            <div className="c"><span className="tk">✓</span>Private chefs &amp; catered dining</div>
            <div className="c"><span className="tk">✓</span>Private ski instructors &amp; mountain guides</div>
            <div className="c"><span className="tk">✓</span>Childcare &amp; qualified nannies</div>
            <div className="c"><span className="tk">✓</span>Restaurant reservations</div>
            <div className="c"><span className="tk">✓</span>Spa treatments &amp; wellness</div>
            <div className="c"><span className="tk">✓</span>Helicopter transfers &amp; chauffeur</div>
            <div className="c"><span className="tk">✓</span>Sommelier &amp; wine delivery</div>
          </div>
        </div>
      </div></section>

      {/* On the record */}
      <section className="record"><div className="wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="rim"><img src="/images/07.jpg" alt="On the mountain" /></div>
        <div className="rtx">
          <div className="eyebrow">§ On the record</div>
          <blockquote>Our guests don&rsquo;t want to be asked what they&rsquo;d like for breakfast on the fourth morning. They want it there — the way they take it, with the paper they read. <em>That is the whole of the job.</em></blockquote>
          <div className="att">Ben Wood &amp; Oli Dannatt · Founders, Vertige</div>
        </div>
      </div></section>

      {/* In their own words */}
      <section className="words"><div className="wrap">
        <div className="wh"><div className="eyebrow">§ What guests write</div><h2>In their <em>own words.</em></h2></div>
        <div className="wgrid">
          <div className="wq"><p>&ldquo;They anticipated things we hadn&rsquo;t thought to ask for — a birthday cake carried up the mountain by ski patrol, a violinist for the last night. It felt effortless because it was theirs, not ours.&rdquo;</p><div className="by">The Whitmore family · Courchevel 1850</div></div>
          <div className="wq"><p>&ldquo;A last-minute change of plans was met with a quiet &lsquo;of course&rsquo;. New chef, new table, new guide, all inside two hours. That is what one pays for.&rdquo;</p><div className="by">H.L. · Verbier</div></div>
          <div className="wq"><p>&ldquo;Vertige do not perform hospitality. They practise it. There is a difference — and after a week you feel it in every room.&rdquo;</p><div className="by">Condé Nast Traveller · Gold List</div></div>
        </div>
      </div></section>

      {/* Closing CTA */}
      <section className="ccta">
        <div className="bg" />
        <div className="wrap">
          <div className="eyebrow">How can we help?</div>
          <h2>Let us plan <em>your week</em>.</h2>
          <div className="row">
            <Link className="btn" href="/contact">Enquire</Link>
            <Link className="btn ghost" href="/chalets">Explore the chalets</Link>
          </div>
          <div className="call">Speak to your correspondent<b>{SITE.phone}</b><small>{SITE.phoneHours}</small></div>
        </div>
      </section>
    </div>
  )
}
