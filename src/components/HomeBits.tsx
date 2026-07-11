'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// Home page interactivity, ported from vertige-proto-home-mockup.html:
// cross-fading hero slider, scroll-snap carousels, the full-width CTA
// slider, and the parallax + reveal effects.

export function HeroSlides({ images }: { images: string[] }) {
  const [on, setOn] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setOn((i) => (i + 1) % images.length), 6000)
    return () => clearInterval(t)
  }, [images.length])
  return (
    <>
      {images.map((im, i) => (
        <div key={im} className={`hslide${i === on ? ' on' : ''}`} style={{ backgroundImage: `url(${im})` }} />
      ))}
    </>
  )
}

export function CarouselRow({ step, children }: { step: number; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null)
  const go = (d: number) => row.current?.scrollBy({ left: d * step, behavior: 'smooth' })
  return (
    <div className="carwrap">
      <button className="carbtn prev" onClick={() => go(-1)}>‹</button>
      <div className="carrow" ref={row}>{children}</div>
      <button className="carbtn next" onClick={() => go(1)}>›</button>
    </div>
  )
}

export interface CtaSlide {
  img: string
  eyebrow: string
  title: string
  cta: { label: string; href: string }
}

export function CtaBand({ slides }: { slides: CtaSlide[] }) {
  const [on, setOn] = useState(0)
  const go = (d: number) => setOn((i) => (i + d + slides.length) % slides.length)
  useEffect(() => {
    const t = setInterval(() => setOn((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(t)
  }, [slides.length])
  return (
    <section className="ctaband">
      {slides.map((s, i) => (
        <div key={s.title} className={`ctaslide${i === on ? ' on' : ''}`}>
          <div className="bg" style={{ backgroundImage: `url(${s.img})` }} />
          <div className="ov" />
          <div className="inner">
            <span className="cta-eyebrow">{s.eyebrow}</span>
            <h2>{s.title}</h2>
            <Link className="cta-book" href={s.cta.href}>{s.cta.label}</Link>
          </div>
        </div>
      ))}
      <button className="ctabtn2 prev" onClick={() => go(-1)}>‹</button>
      <button className="ctabtn2 next" onClick={() => go(1)}>›</button>
    </section>
  )
}

// Parallax on .px images + intersection reveals — the prototype's scroll FX.
export function HomeFx() {
  useEffect(() => {
    const pxEls = [...document.querySelectorAll<HTMLElement>('.homepage .px')]
    const parallax = () => {
      const vh = innerHeight
      for (const el of pxEls) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -60 || r.top > vh + 60) continue
        const center = r.top + r.height / 2
        const prog = (center - vh / 2) / (vh / 2 + r.height / 2)
        const img = el.querySelector<HTMLElement>('.pxi')
        if (img) img.style.transform = `translateY(${(prog * -10).toFixed(2)}%)`
      }
    }
    const onScroll = () => requestAnimationFrame(parallax)
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', parallax)
    parallax()

    const io = new IntersectionObserver((entries) => entries.forEach((x) => {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) }
    }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    document.querySelectorAll<HTMLElement>('.homepage .reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 60}ms`
      io.observe(el)
    })

    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', parallax)
      io.disconnect()
    }
  }, [])
  return null
}
