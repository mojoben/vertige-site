import React from 'react'
import { Chrome } from '@/components/Chrome'

export default function OverlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Chrome variant="overlay" />
      <main>{children}</main>
    </>
  )
}
