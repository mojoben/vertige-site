'use client'

import React, { useState } from 'react'

// Confirm-button unsubscribe (never on GET — mail scanners prefetch links).

export function UnsubscribeForm({ email }: { email: string }) {
  const [value, setValue] = useState(email)
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('busy')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return <p className="lead-p">You&rsquo;re unsubscribed — {value} won&rsquo;t receive shared lists or updates from us again. Changed your mind? Just get in touch.</p>
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <input
        type="email"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="your@address.com"
        style={{ flex: '1 1 240px', padding: '.9rem 1rem', border: '1px solid var(--line)', background: '#fff', font: 'inherit' }}
      />
      <button className="btn" type="submit" disabled={state === 'busy'}>
        {state === 'busy' ? 'One moment…' : 'Unsubscribe'}
      </button>
      {state === 'error' && <span style={{ color: 'var(--rose)', fontSize: '.85rem' }}>That didn&rsquo;t work — try again.</span>}
    </form>
  )
}
