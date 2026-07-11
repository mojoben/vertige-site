import React from 'react'
import { Chrome } from '@/components/Chrome'

// Chalet-detail pages: the header is absolute (scrolls away with the hero) so
// the page's own sticky subnav can take over at top: 0 — as the prototype.
export default function StaticHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Chrome variant="static" />
      <main>{children}</main>
    </>
  )
}
