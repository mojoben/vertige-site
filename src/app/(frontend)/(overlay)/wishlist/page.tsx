import React from 'react'
import { WishlistApp } from '@/components/WishlistBits'

// My Favourites — faithful port of vertige-proto-wishlist.html (HANDOFF 09).
// Lists are guest-first in localStorage; the interactive app is client-side.

export const metadata = {
  title: 'My Favourites — Wishlist | Vertige',
  description: 'Save your favourite luxury ski chalets to a list, share it with a Vertige advisor, and we’ll confirm availability and plan your week.',
}

export default function WishlistPage() {
  return (
    <div className="wlpage">
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/destinations/_ski-france.jpg)' }} />
        <div className="wrap">
          <span className="eyebrow">Your favourites</span>
          <h1>My Favourites</h1>
          <p className="sub">Save the chalets you love to a list, share it with an advisor in a single request, and let us confirm availability and plan the week around it.</p>
        </div>
      </section>
      <WishlistApp />
    </div>
  )
}
