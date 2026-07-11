import React from 'react'
import { Chrome } from '@/components/Chrome'

export default function LightLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Chrome variant="light" />
      <main>{children}</main>
    </>
  )
}
