import React from 'react'
import Link from 'next/link'
import { LegalToc } from '@/components/StaticBits'

// Booking terms & conditions — faithful port of vertige-proto-terms.html.

export const metadata = {
  title: 'Booking terms & conditions — Vertige',
  description: 'The essential terms behind every Vertige booking — what we do, what you can expect, and how a reservation works.',
}

export default function TermsPage() {
  return (
    <>
      <section className="lhead"><div className="wrap">
        <div className="eyebrow">§ The small print</div>
        <h1>Booking terms &amp; <em>conditions</em></h1>
        <p className="lead">The essential terms behind every Vertige booking — what we do, what you can expect, and how a reservation works from first enquiry to the last morning.</p>
        <div className="upd">Last updated July 2026</div>
      </div></section>

      <div className="lbody"><div className="wrap">
        <aside className="ltoc">
          <LegalToc />
          <div className="th">§ On this page</div>
          <nav>
            <a href="#who" className="on">01 &nbsp;Who we are</a>
            <a href="#booking">02 &nbsp;Making a booking</a>
            <a href="#contract">03 &nbsp;Your contract</a>
            <a href="#cost">04 &nbsp;The cost of your stay</a>
            <a href="#requests">05 &nbsp;Special requests</a>
            <a href="#cancel-you">06 &nbsp;Cancellations by you</a>
            <a href="#cancel-owner">07 &nbsp;Cancellations by the owner</a>
            <a href="#using">08 &nbsp;Using the chalet</a>
            <a href="#insurance">09 &nbsp;Responsibilities &amp; insurance</a>
            <a href="#liability">10 &nbsp;Our liability</a>
            <a href="#force">11 &nbsp;Exceptional circumstances</a>
            <a href="#complaints">12 &nbsp;Complaints</a>
            <a href="#arrival">13 &nbsp;Arrival &amp; departure</a>
          </nav>
        </aside>
        <main className="lmain">
          <p className="intro">These conditions form the basis of your contract with Vertige. We have written them as plainly as we can, but they matter — by making a booking with us, you accept them in full.</p>

          <section id="who">
            <h2><span className="n">01</span> Who we are &amp; how these terms work</h2>
            <p>Vertige is a trading name of Vertige Ltd, a company registered in England &amp; Wales (registered office: 14 Grafton Mews, London W1; company number to be confirmed). For most bookings we act as a disclosed booking agent, arranging the chalet and any additional services on your behalf. Occasionally we act as the organiser of a package holiday under the Package Travel and Linked Travel Arrangements Regulations 2018 — where we do, we will tell you before your booking is confirmed.</p>
            <p>Where we act as agent, your contract for the chalet is with the owner (the &ldquo;principal&rdquo;), and their own terms apply alongside ours. Where those terms conflict with these, the owner&rsquo;s terms take precedence for the arrangements they provide.</p>
            <h3>A few definitions</h3>
            <div className="dl">
              <div className="row"><div className="k">Lead guest</div><div className="v">The person who makes the booking, who must be at least 18 and is responsible for all payments and for the party.</div></div>
              <div className="row"><div className="k">Deposit</div><div className="v">The sum payable to secure your booking, as set out in your booking summary.</div></div>
              <div className="row"><div className="k">Security deposit</div><div className="v">A refundable sum held against damage, breakages or exceptional use, returned after inspection.</div></div>
              <div className="row"><div className="k">Owner</div><div className="v">The legal owner of the chalet, or anyone with authority to let it.</div></div>
            </div>
          </section>

          <section id="booking">
            <h2><span className="n">02</span> Making a booking</h2>
            <p>To book, the lead guest provides the party&rsquo;s details and the requested dates. We confirm your request in a booking summary setting out the price, the deposit and the applicable security deposit. Once the owner confirms availability, your deposit is payable to hold the chalet.</p>
            <p>When your deposit is received we send a booking confirmation on the owner&rsquo;s behalf. Please check it immediately — if anything is incorrect, tell us straight away, as changes may not be possible later. The balance of the price is due 84 days before the start of your stay; peak weeks may fall due earlier, as stated in your booking summary.</p>
            <p>If we do not receive payment in full and on time, the owner may treat your booking as cancelled and retain deposits paid or due.</p>
          </section>

          <section id="contract">
            <h2><span className="n">03</span> Your contract</h2>
            <p>A binding contract comes into existence when we send a booking confirmation to the lead guest. Where we act as agent, that contract is between you and the owner, and is subject to the law referred to in the owner&rsquo;s conditions. Where we are the organiser of a package, your contract is with us and is governed by English law, with any dispute dealt with by the courts of England &amp; Wales (or, if you live in Scotland or Northern Ireland, the courts of your home country).</p>
          </section>

          <section id="cost">
            <h2><span className="n">04</span> The cost of your stay</h2>
            <p>Please check the price of your chosen week at the time of booking, as changes and errors occasionally occur. The owner reserves the right to correct errors and to adjust advertised or confirmed prices before your booking is confirmed; we will tell you the applicable price at the time of booking. As agent, all monies you pay us for arrangements are passed to the owner concerned within 48 hours.</p>
          </section>

          <section id="requests">
            <h2><span className="n">05</span> Special requests &amp; requirements</h2>
            <p>Tell us about any special requests when you book. We will pass reasonable requests to the owner, but cannot guarantee they will be met, and confirmation that a request has been noted is not confirmation it will be fulfilled. We cannot accept bookings made conditional on a request being met.</p>
            <p>If you or anyone in your party has a medical condition, reduced mobility or a significant allergy that may affect your stay, please tell us before you confirm so we can help you consider whether the chalet is suitable and inform the owner. If the owner cannot reasonably meet a need, they may decline or cancel the booking; we will do our best to help you find an alternative.</p>
          </section>

          <section id="cancel-you">
            <h2><span className="n">06</span> Changes &amp; cancellations by you</h2>
            <p>If you need to cancel or amend a confirmed booking, cancellation or amendment charges are likely to apply. Send any cancellation request in writing to <a className="inl" href="mailto:hello@vertigeski.com">hello@vertigeski.com</a>; we will pass it to the owner. Unless your booking summary states otherwise, the following applies:</p>
            <ul>
              <li>More than 84 days before arrival: you lose your deposit, with no further liability — and, where a peak week can be re-let, a cancellation charge of 25% of the total may apply.</li>
              <li>84 days or fewer before arrival: a charge of up to 100% of the total price, unless the chalet can be re-let for the same period, in which case we will reimburse you accordingly.</li>
            </ul>
          </section>

          <section id="cancel-owner">
            <h2><span className="n">07</span> Changes &amp; cancellations by the owner</h2>
            <p>Owners reserve the right to make changes or, rarely, to cancel where necessary for reasons outside their control. Most changes are insignificant (for example, a single facility being temporarily unavailable). Where we act as agent we have no liability for a cancellation or change by the owner, and no responsibility for costs you incur as a result, such as flights or transfers — but we will always do our best to find you a suitable alternative chalet.</p>
          </section>

          <section id="using">
            <h2><span className="n">08</span> Using the chalet</h2>
            <p>The chalet is let for holiday purposes only, and occupancy must not exceed the published capacity. Descriptions and photographs are provided in good faith, but decoration, furnishings and local amenities may change by the time of your stay. If the chalet is damaged on arrival, or falls short of what you were led to expect, tell us as soon as possible.</p>
            <p>You accept responsibility for any damage or loss caused by your party; costs may be taken from the security deposit. If, in the reasonable opinion of the owner or of us, any guest behaves in a way likely to cause danger, distress or damage — including illegal activity, excessive noise, or unapproved additional guests or parties — your stay may be terminated without notice and without refund.</p>
          </section>

          <section id="insurance">
            <h2><span className="n">09</span> Your responsibilities &amp; insurance</h2>
            <p>It is your responsibility to hold valid travel documents, passports and any visas, and to meet any health requirements for your destination. It is a condition of booking that every member of your party is covered by comprehensive travel insurance appropriate to a winter-sports holiday.</p>
            <div className="call"><div className="k">Please note</div><p>You are responsible for keeping everyone in your party safe around the chalet — particularly children in and around pools, hot tubs and on the mountain. Children must be supervised by a responsible adult at all times.</p></div>
          </section>

          <section id="liability">
            <h2><span className="n">10</span> Our liability</h2>
            <p>Where we act as agent, our role is limited to providing information, facilitating your booking and communicating between you and the owner. We are not liable for the performance of your contract by the owner, or for the acts or omissions of the owner or their staff. Our maximum liability, if we are found to be at fault for a service we provide, is limited to the commission we earn on the booking. Nothing in these conditions limits our liability for death or personal injury caused by our negligence.</p>
            <p>Neither we nor the owner can be held responsible for noise or disturbance beyond the chalet&rsquo;s boundaries, or for the temporary breakdown of equipment such as boilers, hot tubs or heating, or the interruption of utilities.</p>
          </section>

          <section id="force">
            <h2><span className="n">11</span> Exceptional circumstances</h2>
            <p>Neither we nor the owner accept liability where performance of your contract is prevented or affected by unavoidable and extraordinary circumstances — situations beyond our control whose consequences could not have been avoided even with all reasonable measures. These may include war, civil unrest, terrorism, industrial dispute, natural disaster, exceptional weather (including a lack of snow), fire, flood, epidemic or pandemic, and restrictions imposed by any authority.</p>
          </section>

          <section id="complaints">
            <h2><span className="n">12</span> Complaints</h2>
            <p>If something disappoints you during your stay, tell us at once so we can liaise with the owner and give them the chance to put it right. If a complaint cannot be resolved on the mountain, write to us within 28 days of the end of your stay so we can help. We regret we cannot accept liability if we are not notified in good time.</p>
          </section>

          <section id="arrival">
            <h2><span className="n">13</span> Arrival &amp; departure</h2>
            <p>Before you travel we will confirm arrival and departure times for your chalet. Standard check-in is from 4pm and check-out by 10am; earlier or later may be possible depending on the week — ask your advisor in advance. If you expect to arrive much later than the time given, please let the resort manager know so they can look after you.</p>
            <p className="end">Questions about these terms? Write to <a href="mailto:hello@vertigeski.com">hello@vertigeski.com</a> or call +44 20 7131 0270. See also our <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link>.</p>
          </section>
        </main>
      </div></div>
    </>
  )
}
