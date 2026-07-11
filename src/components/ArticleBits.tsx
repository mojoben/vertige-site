'use client'

// Client-side bits of the flagship article layout: the working social share
// (X / Facebook / LinkedIn / Copy-link with plum toast — 01 §7) and the
// sticky-TOC scroll-spy. Ported from the prototype vShare/toast + spy JS.

import { useEffect, useState } from 'react'

export function Share({ title }: { title: string }) {
  const [toast, setToast] = useState<string | null>(null)

  function share(net: 'x' | 'fb' | 'in' | 'copy') {
    const url = location.href
    const u = encodeURIComponent(url)
    const t = encodeURIComponent(title)
    const win = 'vshare'
    const opts = 'noopener,noreferrer,width=640,height=560'
    if (net === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, win, opts)
    else if (net === 'x') window.open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`, win, opts)
    else if (net === 'in') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`, win, opts)
    else if (net === 'copy') {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => showToast('Link copied'), () => showToast(url))
      } else showToast(url)
    }
  }
  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <>
      <div className="share">
        Share{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); share('x') }} title="Share on X">X</a>
        <a href="#" onClick={(e) => { e.preventDefault(); share('fb') }} title="Share on Facebook">Fb</a>
        <a href="#" onClick={(e) => { e.preventDefault(); share('in') }} title="Share on LinkedIn">In</a>
        <a href="#" onClick={(e) => { e.preventDefault(); share('copy') }} title="Copy link">Copy</a>
      </div>
      <div className={`vtoast${toast ? ' on' : ''}`}>{toast}</div>
    </>
  )
}

/** Scroll-spy for the sticky Contents TOC (highlights the section in view). */
export function TocSpy() {
  useEffect(() => {
    const spy = () => {
      const secs = Array.from(document.querySelectorAll('.artmain section[id]'))
      let cur = secs[0]
      for (const s of secs) if (s.getBoundingClientRect().top < 170) cur = s
      document.querySelectorAll('.toc nav a').forEach((a) => {
        a.classList.toggle('on', a.getAttribute('href') === `#${cur?.id}`)
      })
    }
    addEventListener('scroll', spy, { passive: true })
    spy()
    return () => removeEventListener('scroll', spy)
  }, [])
  return null
}
