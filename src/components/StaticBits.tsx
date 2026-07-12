'use client'

import React, { useEffect, useRef, useState } from 'react'

// Client bits for the static pages: the legal-page TOC scroll-spy and the
// contact / owner enquiry forms (both post through /api/enquiry — store →
// portal-forward pipeline, HANDOFF 03 §3).

export function LegalToc() {
  useEffect(() => {
    const spy = () => {
      const secs = Array.from(document.querySelectorAll('.lmain section[id]'))
      let cur = secs[0]
      for (const s of secs) if (s.getBoundingClientRect().top < 170) cur = s
      document.querySelectorAll('.ltoc nav a').forEach((a) => {
        a.classList.toggle('on', a.getAttribute('href') === `#${cur?.id}`)
      })
    }
    addEventListener('scroll', spy, { passive: true })
    spy()
    return () => removeEventListener('scroll', spy)
  }, [])
  return null
}

async function submitEnquiry(data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, sourcePath: location.pathname }),
    })
    return res.ok
  } catch {
    return false
  }
}

function useEnquirySubmit(build: (fd: FormData) => Record<string, unknown>) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const okRef = useRef<HTMLDivElement>(null)
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setState('sending')
    const ok = await submitEnquiry(build(new FormData(form)))
    setState(ok ? 'ok' : 'error')
    if (ok) {
      form.reset()
      setTimeout(() => okRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
    }
  }
  return { state, okRef, onSubmit }
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim()

export function ContactForm() {
  const { state, okRef, onSubmit } = useEnquirySubmit((fd) => ({
    enquiryType: 'trip',
    firstName: str(fd, 'firstName'),
    lastName: str(fd, 'lastName'),
    email: str(fd, 'email'),
    phone: str(fd, 'phone'),
    website: str(fd, 'website'), // honeypot
    when: str(fd, 'when'),
    arrival: str(fd, 'arrival'),
    departure: str(fd, 'departure'),
    destination: str(fd, 'destination'),
    budget: str(fd, 'budget'),
    bedrooms: str(fd, 'bedrooms'),
    adults: str(fd, 'adults'),
    children: str(fd, 'children'),
    message: str(fd, 'message'),
    heardAbout: str(fd, 'heardAbout'),
    newsletterOptIn: fd.get('optin') === 'on',
  }))

  return (
    <form className="vform" onSubmit={onSubmit} noValidate={false}>
      <div className="okmsg" ref={okRef} style={state === 'ok' ? { display: 'block' } : undefined}>
        Thank you — your enquiry is with our team. We aim to reply within 24 hours, often sooner.
      </div>
      <div className="formnote">Send us an enquiry and we&rsquo;ll endeavour to respond within 24 hours. Fields marked are a guide only — tell us as much or as little as you like.</div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: -9999 }} aria-hidden="true" />
      <div className="grp"><label>When would you like to travel?</label>
        <div className="chips">
          <label><input type="radio" name="when" value="Specific dates" defaultChecked /> Specific dates</label>
          <label><input type="radio" name="when" value="Give or take a few days" /> Give or take a few days</label>
          <label><input type="radio" name="when" value="Flexible" /> Flexible</label>
        </div>
      </div>
      <div className="vrow"><div className="grp"><label>Arrival</label><input type="date" name="arrival" /></div><div className="grp"><label>Departure</label><input type="date" name="departure" /></div></div>
      <div className="vrow">
        <div className="grp"><label>Where would you like to go?</label><select name="destination" defaultValue=""><option value="">No preference / not sure yet</option><option>France</option><option>Switzerland</option><option>Austria</option><option>Italy</option></select></div>
        <div className="grp"><label>Approx. budget per week (optional)</label><select name="budget" defaultValue=""><option value="">Please choose…</option><option>Up to £15,000</option><option>£15,000–30,000</option><option>£30,000–60,000</option><option>£60,000+</option><option>Not sure yet</option></select></div>
      </div>
      <div className="vrow three">
        <div className="grp"><label>Bedrooms</label><input type="number" name="bedrooms" min={1} max={15} /></div>
        <div className="grp"><label>Adults</label><input type="number" name="adults" min={1} max={30} /></div>
        <div className="grp"><label>Children</label><input type="number" name="children" min={0} max={20} /></div>
      </div>
      <div className="grp"><label>Your message</label><textarea name="message" placeholder="Anything that will help us plan — preferred resort, occasion, dietary needs, ski ability, must-haves." /></div>
      <div className="vrow"><div className="grp"><label>First name</label><input type="text" name="firstName" required /></div><div className="grp"><label>Last name</label><input type="text" name="lastName" required /></div></div>
      <div className="vrow">
        <div className="grp"><label>Email</label><input type="email" name="email" required /></div>
        <div className="grp"><label>Phone</label><input type="tel" name="phone" /></div>
      </div>
      <div className="grp"><label>How did you hear about us?</label><select name="heardAbout" defaultValue=""><option value="">Please choose…</option><option>Returning guest</option><option>Google / online search</option><option>Social media</option><option>Friend or family recommendation</option><option>Press or magazine</option><option>Travel advisor</option><option>Other</option></select></div>
      <div className="grp"><label className="consent"><input type="checkbox" name="optin" /> Keep me updated with new chalets and seasonal inspiration.</label></div>
      <div className="grp"><label className="consent"><input type="checkbox" required /> I agree to Vertige contacting me about my enquiry and accept the privacy policy.</label></div>
      {state === 'error' && <div className="formnote" style={{ color: 'var(--rose)' }}>Something went wrong sending your enquiry — please try again, or email hello@vertigeski.com.</div>}
      <button className="btn submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send enquiry'}</button>
    </form>
  )
}

export function OwnerForm() {
  const { state, okRef, onSubmit } = useEnquirySubmit((fd) => ({
    enquiryType: 'owner',
    firstName: str(fd, 'firstName'),
    lastName: str(fd, 'lastName'),
    email: str(fd, 'email'),
    phone: str(fd, 'phone'),
    website: str(fd, 'website'), // honeypot
    resort: str(fd, 'resort'),
    country: str(fd, 'country'),
    bedrooms: str(fd, 'bedrooms'),
    sleeps: str(fd, 'sleeps'),
    weeklyRate: str(fd, 'weeklyRate'),
    message: str(fd, 'message'),
  }))

  return (
    <form className="vform" onSubmit={onSubmit} style={{ marginTop: 'clamp(1.8rem,3vw,2.6rem)' }}>
      <div className="okmsg" ref={okRef} style={state === 'ok' ? { display: 'block' } : undefined}>
        Thank you — your details are with our owner relations team. We&rsquo;ll be in touch shortly to arrange a conversation about your chalet.
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: -9999 }} aria-hidden="true" />
      <div className="vrow"><div className="grp"><label>First name</label><input type="text" name="firstName" required /></div><div className="grp"><label>Last name</label><input type="text" name="lastName" required /></div></div>
      <div className="vrow"><div className="grp"><label>Email</label><input type="email" name="email" required /></div><div className="grp"><label>Phone</label><input type="tel" name="phone" /></div></div>
      <div className="vrow">
        <div className="grp"><label>Resort / location</label><input type="text" name="resort" placeholder="e.g. Verbier" /></div>
        <div className="grp"><label>Country</label><select name="country" defaultValue=""><option value="">No preference / not sure yet</option><option>France</option><option>Switzerland</option><option>Austria</option><option>Italy</option></select></div>
      </div>
      <div className="vrow three">
        <div className="grp"><label>Bedrooms</label><input type="number" name="bedrooms" min={1} max={20} /></div>
        <div className="grp"><label>Sleeps</label><input type="number" name="sleeps" min={1} max={40} /></div>
        <div className="grp"><label>Approx. weekly rate (optional)</label><input type="text" name="weeklyRate" placeholder="e.g. £25,000" /></div>
      </div>
      <div className="grp"><label>About your chalet</label><textarea name="message" placeholder="Tell us about the chalet, its position, staffing, and how you currently let it (if at all)." /></div>
      <div className="grp"><label className="consent"><input type="checkbox" required /> I agree to Vertige contacting me about my enquiry and accept the privacy policy.</label></div>
      {state === 'error' && <div className="formnote" style={{ color: 'var(--rose)' }}>Something went wrong sending your details — please try again, or email hello@vertigeski.com.</div>}
      <button className="btn submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit your chalet'}</button>
    </form>
  )
}
