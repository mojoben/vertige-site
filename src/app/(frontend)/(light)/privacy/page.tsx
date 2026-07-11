import React from 'react'
import Link from 'next/link'
import { LegalToc } from '@/components/StaticBits'

// Privacy policy — faithful port of vertige-proto-privacy.html.

export const metadata = {
  title: 'Privacy policy — Vertige',
  description: 'How Vertige collects, uses and protects your personal data — and the rights you have over it.',
}

export default function PrivacyPage() {
  return (
    <>
      <section className="lhead"><div className="wrap">
        <div className="eyebrow">§ Your data</div>
        <h1>Privacy <em>policy</em></h1>
        <p className="lead">How Vertige collects, uses and protects your personal data — and the rights you have over it.</p>
        <div className="upd">Last updated July 2026</div>
      </div></section>

      <div className="lbody"><div className="wrap">
        <aside className="ltoc">
          <LegalToc />
          <div className="th">§ On this page</div>
          <nav>
            <a href="#who" className="on">01 &nbsp;Who we are</a>
            <a href="#data">02 &nbsp;The data we collect</a>
            <a href="#how-collect">03 &nbsp;How it&rsquo;s collected</a>
            <a href="#how-use">04 &nbsp;How we use it</a>
            <a href="#marketing">05 &nbsp;Marketing choices</a>
            <a href="#share">06 &nbsp;Who we share it with</a>
            <a href="#overseas">07 &nbsp;International transfers</a>
            <a href="#secure">08 &nbsp;Keeping it secure</a>
            <a href="#retain">09 &nbsp;How long we keep it</a>
            <a href="#rights">10 &nbsp;Your rights</a>
          </nav>
        </aside>
        <main className="lmain">
          <p className="intro">Vertige respects your privacy and is committed to protecting your personal data. This notice explains how we look after it when you visit our website or deal with us by other means — and sets out your rights and how the law protects you.</p>

          <section id="who">
            <h2><span className="n">01</span> Important information &amp; who we are</h2>
            <p>Vertige Ltd is the controller responsible for your personal data (&ldquo;Vertige&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We have appointed a data privacy manager who oversees questions about this notice. This notice sits alongside any other privacy notice we may give on specific occasions, and does not override it.</p>
            <div className="call"><div className="k">Contact details</div><p>Vertige Ltd, 14 Grafton Mews, London W1 · <a className="inl" href="mailto:privacy@vertigoski.com">privacy@vertigoski.com</a> · +44 20 7131 0270. You have the right to complain to the Information Commissioner&rsquo;s Office (ico.org.uk), though we&rsquo;d appreciate the chance to resolve your concern first.</p></div>
            <p>Our website is not intended for children; the only time we collect data about children is where you include them in a booking. Please keep us informed if the details we hold about you change.</p>
          </section>

          <section id="data">
            <h2><span className="n">02</span> The data we collect about you</h2>
            <p>Personal data means any information from which you can be identified. We may collect, use and store the following, grouped together:</p>
            <div className="dl">
              <div className="row"><div className="k">Identity Data</div><div className="v">First and last name, title, date of birth, and similar.</div></div>
              <div className="row"><div className="k">Contact Data</div><div className="v">Billing address, email address and telephone numbers.</div></div>
              <div className="row"><div className="k">Financial Data</div><div className="v">Bank account and payment-card details.</div></div>
              <div className="row"><div className="k">Transaction Data</div><div className="v">Details of payments and of the services you have booked with us.</div></div>
              <div className="row"><div className="k">Technical Data</div><div className="v">IP address, browser type, time zone and the technology you use to reach our site.</div></div>
              <div className="row"><div className="k">Usage Data</div><div className="v">Information about how you use our website and services.</div></div>
              <div className="row"><div className="k">Marketing Data</div><div className="v">Your preferences for receiving marketing from us.</div></div>
            </div>
            <h3>Special categories</h3>
            <p>Where strictly necessary to deliver your stay — for example, dietary requirements (which may reveal beliefs) or health information — we process special-category data only with your explicit consent. You may withdraw that consent at any time, though without it we may be unable to arrange your booking, and we would treat any withdrawal as a cancellation under our Booking Terms.</p>
          </section>

          <section id="how-collect">
            <h2><span className="n">03</span> How your data is collected</h2>
            <p>We collect data through <em>direct interactions</em> (when you make a booking, enquire, subscribe to the Journal, enter a competition or give feedback), through <em>automated technologies</em> such as cookies as you use our site, and from <em>third parties</em> such as analytics and advertising providers and search-information providers.</p>
          </section>

          <section id="how-use">
            <h2><span className="n">04</span> How we use your data</h2>
            <p>We only use your personal data where the law allows: to perform our contract with you, where it is in our legitimate interests (and your rights don&rsquo;t override them), or to comply with a legal obligation. We rely on consent chiefly for direct marketing by email or text, which you can withdraw at any time.</p>
            <table>
              <thead><tr><th>Purpose</th><th>Data used</th><th>Lawful basis</th></tr></thead>
              <tbody>
                <tr><td>To register you and process your booking, including payments</td><td>Identity, Contact, Financial, Transaction</td><td>Performance of a contract; legitimate interests (recovering monies due)</td></tr>
                <tr><td>To manage our relationship — notifying you of changes, inviting reviews</td><td>Identity, Contact, Marketing</td><td>Performance of a contract; legal obligation; legitimate interests</td></tr>
                <tr><td>To improve our website and services through data analytics</td><td>Technical, Usage</td><td>Legitimate interests (to keep our site relevant and grow our business)</td></tr>
                <tr><td>To make recommendations and send relevant marketing</td><td>Identity, Contact, Usage, Marketing</td><td>Legitimate interests; consent for email/SMS marketing</td></tr>
              </tbody>
            </table>
          </section>

          <section id="marketing">
            <h2><span className="n">05</span> Marketing choices</h2>
            <p>We may use your data to form a view on what may interest you. You&rsquo;ll receive marketing only if you&rsquo;ve requested it or booked with us and haven&rsquo;t opted out. We seek your express opt-in before sharing your data with anyone outside Vertige for their own marketing. You can stop marketing at any time via the opt-out link on any message, or by contacting us.</p>
          </section>

          <section id="share">
            <h2><span className="n">06</span> Who we share it with</h2>
            <p>We may share your data with the chalet owners and managers, on-resort service providers, our professional advisers, and authorities where the law requires. We require all third parties to protect your data and to use it only on our instructions, never for their own purposes.</p>
          </section>

          <section id="overseas">
            <h2><span className="n">07</span> International transfers</h2>
            <p>Where your stay is outside the UK, we transfer the data needed to fulfil it to the relevant owner or supplier. Whenever we transfer data internationally we ensure a similar level of protection through adequacy decisions or approved contractual safeguards. Contact us for details of the mechanism used.</p>
          </section>

          <section id="secure">
            <h2><span className="n">08</span> How we keep it secure</h2>
            <p>We use appropriate measures to prevent your data being lost, misused or accessed without authorisation, and limit access to those with a business need who are bound by confidentiality. We have procedures to deal with any suspected breach and will notify you and the regulator where legally required.</p>
          </section>

          <section id="retain">
            <h2><span className="n">09</span> How long we keep it</h2>
            <p>We keep your data only as long as necessary for the purposes we collected it for, including legal, accounting and reporting requirements. By law we retain basic information about customers for six years after they stop being customers. In some cases we may anonymise your data for research or statistics and use it indefinitely.</p>
          </section>

          <section id="rights">
            <h2><span className="n">10</span> Your rights</h2>
            <p>Under data-protection law you have the right to request access to, correction or erasure of your data; to object to or restrict its processing; to request its transfer; and to withdraw consent. There is usually no fee, and we aim to respond within one month. To exercise any of these rights, contact <a className="inl" href="mailto:privacy@vertigoski.com">privacy@vertigoski.com</a>.</p>
            <p className="end">See also our <Link href="/terms">Booking Terms</Link> and <Link href="/cookies">Cookie Policy</Link>.</p>
          </section>
        </main>
      </div></div>
    </>
  )
}
