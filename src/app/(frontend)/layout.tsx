import React from 'react'
import { Footer } from '@/components/Footer'
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Cormorant Garamond = Ivy Mode fallback + <em> italic; Inter = body fallback */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Chrome (header/nav/search) is rendered by the route-group layouts:
            (overlay) = fixed transparent-over-hero; (light) = sticky white
            (destination/listing pages, so tabs/filterbar can stack beneath). */}
        {children}
        <Footer />
      </body>
    </html>
  )
}
