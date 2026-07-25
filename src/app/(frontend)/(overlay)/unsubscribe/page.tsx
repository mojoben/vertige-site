import React from 'react'
import { UnsubscribeForm } from '@/components/UnsubscribeForm'

// Unsubscribe — the target of every marketing-adjacent email footer link
// (wishlist shares, newsletter). Button-confirmed, never one-click on GET.

export const metadata = {
  title: 'Unsubscribe — Vertige',
  robots: { index: false },
}

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams
  return (
    <div className="wlpage">
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/destinations/_ski-switzerland.jpg)' }} />
        <div className="wrap">
          <span className="eyebrow">Email preferences</span>
          <h1>Unsubscribe</h1>
          <p className="sub">Stop receiving shared wishlists and updates from Vertige at this address.</p>
        </div>
      </section>
      <section className="dsec" style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(2.5rem,6vw,4rem) clamp(1.3rem,4vw,3.4rem)' }}>
        <UnsubscribeForm email={email ?? ''} />
      </section>
    </div>
  )
}
