'use client'

import React, { useState } from 'react'

// Newsletter capture — posts to the enquiry pipeline (enquiryType
// "newsletter") which stores the lead and syncs it to the portal. Used by
// the footer panel and the Journal "by post" bands.

export function NewsletterForm({ variant = 'footer' }: { variant?: 'footer' | 'journal' }) {
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('') // honeypot
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hp) return // bot
    setState('busy')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: 'newsletter',
          firstName: 'Newsletter',
          lastName: 'Signup',
          email: email.trim(),
          message: 'Newsletter signup',
          sourcePath: typeof location !== 'undefined' ? location.pathname : '/',
          website: hp,
        }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return variant === 'footer'
      ? <div className="fp-bot"><p style={{ fontSize: '.85rem', opacity: 0.85 }}>Welcome to the circle — you&rsquo;re on the list.</p></div>
      : <p className="jn-done">Welcome to the circle — you&rsquo;re on the list.</p>
  }

  const fields = (
    <>
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />
    </>
  )

  if (variant === 'journal') {
    return (
      <form className="jn-form" onSubmit={submit}>
        {fields}
        <input type="email" required placeholder="your@address.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn" type="submit" disabled={state === 'busy'}>{state === 'busy' ? 'One moment…' : 'Subscribe →'}</button>
        {state === 'error' && <span style={{ fontSize: '.8rem', color: 'var(--rose)' }}>Try again</span>}
      </form>
    )
  }
  return (
    <form className="fp-bot" onSubmit={submit}>
      {fields}
      <div className="field"><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <button type="submit" disabled={state === 'busy'}>{state === 'busy' ? 'One moment…' : 'Subscribe'}</button>
      {state === 'error' && <span style={{ fontSize: '.8rem' }}>Try again</span>}
    </form>
  )
}
