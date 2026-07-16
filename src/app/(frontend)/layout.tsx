import React from 'react'
import { Footer } from '@/components/Footer'
import { LazyImageFade } from '@/components/LazyImageFade'
import './globals.css'

export const metadata = {
  title: 'Vertige — Luxury ski chalets & concierge',
  description:
    'Hand-picked luxury ski chalets across France, Switzerland, Austria and Italy, with concierge on every stay. Brokered on behalf of owners; enquiry-led.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      {/* All fonts self-hosted via @font-face in globals.css (HANDOFF 01 §2) —
          no runtime dependency on Google Fonts. */}
      <body>
        {/* Chrome (header/nav/search) is rendered by the route-group layouts:
            (overlay) = fixed transparent-over-hero; (light) = sticky white
            (destination/listing pages, so tabs/filterbar can stack beneath). */}
        <LazyImageFade />
        {children}
        <Footer />
      </body>
    </html>
  )
}
