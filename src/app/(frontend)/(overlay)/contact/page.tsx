import React from 'react'
import { ContactForm } from '@/components/StaticBits'
import { SITE } from '@/lib/site'

// Contact — faithful port of vertige-proto-contact.html, with the form wired
// to the live enquiry pipeline (/api/enquiry → Payload backup → res portal).
// One deviation from the prototype: the single "Name" field is split into
// First name / Last name (two-field rule; the portal expects both).

export const metadata = {
  title: 'Contact us — Vertige',
  description: 'Tell us how you like to ski and who’s coming, and we’ll take care of the rest. Our advisors are available every day, 8am–midnight.',
}

export default function ContactPage() {
  return (
    <>
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/chalets/ext-07.webp)' }} />
        <div className="wrap">
          <span className="eyebrow">Get in touch</span>
          <h1>Start the <em>conversation.</em></h1>
          <p className="sub">Tell us how you like to ski and who&rsquo;s coming, and we&rsquo;ll take care of the rest.</p>
        </div>
      </section>

      <section className="sect"><div className="wrap"><div className="csplit">
        <div className="cinfo">
          <span className="eyebrow">Speak to us</span>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', margin: '.6rem 0 1.1rem' }}>We&rsquo;re here every day</h2>
          <p>Tell us how you like to ski and who you&rsquo;re travelling with, and we&rsquo;ll hand-pick a shortlist and plan every detail around it. Prefer to talk? Our advisors are on the phone from morning until midnight.</p>
          <h3>Call us</h3><div className="big">{SITE.phone}</div><p>{SITE.phoneHours}</p>
          <h3>Email</h3><div className="big"><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
          <h3>Find us</h3><p>London &amp; the Alps<br />Concierge across France, Switzerland, Austria &amp; Italy</p>
        </div>
        <div>
          <ContactForm />
        </div>
      </div></div></section>
    </>
  )
}
