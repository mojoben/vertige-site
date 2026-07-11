import React from 'react'
import Link from 'next/link'
import { OwnerForm } from '@/components/StaticBits'

// Join the portfolio — faithful port of vertige-proto-owners.html, with the
// owner form wired to the live enquiry pipeline (enquiryType: owner).

export const metadata = {
  title: 'Join the portfolio — Vertige',
  description: 'List your chalet with a brokerage built on the return — a considered collection, a dedicated relationship and complete peace of mind.',
}

export default function OwnersPage() {
  return (
    <>
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/chalets/ext-02.webp)' }} />
        <div className="wrap">
          <span className="eyebrow">For chalet owners</span>
          <h1>Join the <em>portfolio.</em></h1>
          <p className="sub">List your chalet with a brokerage built on the return — a considered collection, a dedicated relationship and complete peace of mind.</p>
          <div className="hcta"><a className="btn" href="#ownersForm">Submit your chalet</a><Link className="btn ghost" href="/contact">Speak to our team</Link></div>
        </div>
      </section>

      <section className="sect"><div className="wrap"><div className="lede">
        <span className="eyebrow">A business built on the return</span>
        <h2>Renting your chalet with Vertige</h2>
        <p>We are a small, deliberately selective chalet brokerage and concierge. We do not chase volume; we look after a considered collection of exceptional chalets and the owners behind them, and we build relationships for the long term. If your chalet belongs in that company, we would love to hear from you.</p>
      </div></div></section>

      <section className="sect warm"><div className="wrap">
        <div className="lede"><span className="eyebrow">Why owners choose us</span><h2>Your chalet, in considered hands</h2></div>
        <div className="vgrid">
          <div className="vcard"><div className="vim" style={{ backgroundImage: 'url(/images/chalets/ext-01.webp)' }} /><h3>A considered collection</h3><p>Every chalet we represent has real character. We are selective about what we take on, which keeps the collection small, distinctive and genuinely desirable to the guests we look after.</p></div>
          <div className="vcard"><div className="vim" style={{ backgroundImage: 'url(/images/chalets/liv-11.webp)' }} /><h3>A relationship, not a listing</h3><p>You work with a dedicated contact who knows your chalet. We invest in marketing it properly and tailor everything we do to your property and your wishes for it.</p></div>
          <div className="vcard"><div className="vim" style={{ backgroundImage: 'url(/images/chalets/ext-06.webp)' }} /><h3>Guests you can trust</h3><p>We get to know our clients so we can be confident they are right for your chalet, and our people on the mountain make sure every stay is looked after from arrival to departure.</p></div>
        </div>
      </div></section>

      <section className="sect"><div className="wrap">
        <div className="lede"><span className="eyebrow">A personalised relationship</span><h2>Looked after, end to end</h2></div>
        <div className="vfeat">
          <div><div className="k">A human connection</div><h3>One dedicated contact</h3><p>A single account manager who knows your chalet and is on hand to answer anything, so you always speak to someone who understands your property.</p></div>
          <div><div className="k">A tailored strategy</div><h3>A plan for your chalet</h3><p>We build a marketing and occupancy strategy around your specific chalet and the calendar you want, rather than a one-size-fits-all approach.</p></div>
          <div><div className="k">On the mountain</div><h3>Management on site</h3><p>Our local people oversee your chalet: preparation and inspection, coordination with your staff and suppliers, and a presence throughout each stay.</p></div>
        </div>
      </div></section>

      <section className="sect warm"><div className="wrap">
        <div className="lede"><span className="eyebrow">Don&rsquo;t worry about a thing</span><h2>How it works</h2></div>
        <div className="steps">
          <div className="step"><div className="no">01</div><div><h3>We handle the whole rental process</h3><p>From presenting your chalet online to preparing it, welcoming guests and looking after them throughout their stay.</p></div></div>
          <div className="step"><div className="no">02</div><div><h3>We manage all the formalities</h3><p>Payments, contracts and insurances — handled properly and securely, so you don&rsquo;t have to.</p></div></div>
          <div className="step"><div className="no">03</div><div><h3>Your chalet is overseen on the mountain</h3><p>Our local representative prepares and inspects your chalet before, during and after every stay.</p></div></div>
        </div>
      </div></section>

      <section className="sect" id="ownersForm"><div className="wrap">
        <div className="lede"><span className="eyebrow">Get in touch</span><h2>Tell us about your chalet</h2><p>Share as much as you can — the more detail you give, the sooner we can come back to you. We operate across France, Switzerland, Austria and Italy.</p></div>
        <OwnerForm />
      </div></section>
    </>
  )
}
