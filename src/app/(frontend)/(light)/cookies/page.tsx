import React from 'react'
import Link from 'next/link'
import { LegalToc } from '@/components/StaticBits'

// Cookie policy — faithful port of vertige-proto-cookies.html.

export const metadata = {
  title: 'Cookie policy — Vertige',
  description: 'The cookies that keep our site working, and the ones you can choose to allow.',
}

export default function CookiesPage() {
  return (
    <>
      <section className="lhead"><div className="wrap">
        <div className="eyebrow">§ Cookies</div>
        <h1>Cookie <em>policy</em></h1>
        <p className="lead">The cookies that keep our site working, and the ones you can choose to allow.</p>
        <div className="upd">Last updated July 2026</div>
      </div></section>

      <div className="lbody"><div className="wrap">
        <aside className="ltoc">
          <LegalToc />
          <div className="th">§ On this page</div>
          <nav>
            <a href="#what" className="on">01 &nbsp;What cookies are</a>
            <a href="#how">02 &nbsp;How we use cookies</a>
            <a href="#managing">03 &nbsp;Managing cookies</a>
            <a href="#changes">04 &nbsp;Changes to this policy</a>
            <a href="#contact">05 &nbsp;Contact</a>
          </nav>
        </aside>
        <main className="lmain">
          <p className="intro">Cookies help our website work and help us understand how it is used. This notice explains what they are, which we use, and how you can control them.</p>

          <section id="what">
            <h2><span className="n">01</span> What cookies are</h2>
            <p>A cookie is a small text file placed on your device when you visit a website. Cookies let a site remember your actions and preferences over time, and provide information to the site&rsquo;s owners. Some are essential; others are optional and set only with your consent.</p>
          </section>

          <section id="how">
            <h2><span className="n">02</span> How we use cookies</h2>
            <p>We use the following categories of cookie:</p>
            <table>
              <thead><tr><th>Type</th><th>What it does</th><th>Consent</th></tr></thead>
              <tbody>
                <tr><td>Strictly necessary</td><td>Enable core functions such as page navigation, secure areas and remembering items in your wishlist. The site cannot work properly without them.</td><td>Always on</td></tr>
                <tr><td>Performance</td><td>Collect anonymous, aggregated information about how visitors use the site, so we can improve it (for example, via Google Analytics).</td><td>Optional</td></tr>
                <tr><td>Functional</td><td>Remember choices you make — such as your preferred resort or currency — to give you a more personal experience.</td><td>Optional</td></tr>
                <tr><td>Targeting</td><td>Used by us and our advertising partners to make marketing more relevant and to measure its effectiveness.</td><td>Optional</td></tr>
              </tbody>
            </table>
          </section>

          <section id="managing">
            <h2><span className="n">03</span> Managing cookies</h2>
            <p>When you first visit, our cookie banner lets you accept or decline optional cookies, and you can change your preferences at any time. You can also set your browser to refuse some or all cookies, or to alert you when a site sets one. Please note that if you disable cookies, parts of this website may not function properly.</p>
            <div className="call"><div className="k">Browser controls</div><p>Most browsers explain how to manage cookies in their Help or Settings menu — look for &ldquo;Privacy&rdquo; or &ldquo;Cookies&rdquo;.</p></div>
          </section>

          <section id="changes">
            <h2><span className="n">04</span> Changes to this policy</h2>
            <p>We may update this cookie policy from time to time to reflect changes to the cookies we use or for operational, legal or regulatory reasons. Please revisit this page periodically to stay informed.</p>
          </section>

          <section id="contact">
            <h2><span className="n">05</span> Contact</h2>
            <p>Questions about our use of cookies? Write to <a className="inl" href="mailto:privacy@vertigeski.com">privacy@vertigeski.com</a>.</p>
            <p className="end">See also our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Booking Terms</Link>.</p>
          </section>
        </main>
      </div></div>
    </>
  )
}
