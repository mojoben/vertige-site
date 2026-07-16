'use client'

import { useEffect } from 'react'

// Site-wide subtle fade-in for lazily loaded images (Ben, 2026-07-16):
// anything arriving on scroll eases in instead of popping. Images already
// painted before hydration are left untouched — no flash, no layout work.
export function LazyImageFade() {
  useEffect(() => {
    const apply = (img: HTMLImageElement) => {
      if (img.dataset.lf || img.complete) return
      img.dataset.lf = '1'
      img.classList.add('lf')
      img.addEventListener('load', () => img.classList.add('lf-in'), { once: true })
      img.addEventListener('error', () => img.classList.add('lf-in'), { once: true })
    }
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(apply)
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLImageElement && n.loading === 'lazy') apply(n)
          else if (n instanceof HTMLElement) n.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(apply)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])
  return null
}
