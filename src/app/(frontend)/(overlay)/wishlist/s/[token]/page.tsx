import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Shared wishlist — the read-only tokenised view a friend receives
// (HANDOFF 09 §3): the list without account access, plus a route into the
// advisor conversation.

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const doc = await findList(token)
  return doc
    ? { title: `${doc.name} — a shared Vertige wishlist`, description: 'A hand-picked selection of luxury ski chalets, shared with you on Vertige.' }
    : {}
}

async function findList(token: string) {
  if (!/^[a-f0-9]{16,}$/.test(token)) return null
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'wishlists', where: { token: { equals: token } }, limit: 1 })
  return res.docs[0] ?? null
}

export default async function SharedWishlistPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const doc = await findList(token)
  if (!doc) notFound()
  const items = (doc.items ?? []) as { slug: string; chaletName?: string; loc?: string; meta?: string; price?: string; img?: string }[]

  return (
    <div className="wlpage">
      <section className="pagehero"><div className="bg" style={{ backgroundImage: `url(${items[0]?.img || '/images/destinations/_ski-france.jpg'})` }} />
        <div className="wrap">
          <span className="eyebrow">A shared wishlist{doc.senderName ? ` · from ${doc.senderName}` : ''}</span>
          <h1>{doc.name}</h1>
          <p className="sub">A hand-picked selection of Vertige chalets, shared with you. If anything catches your eye, our team can confirm availability and plan the week around it.</p>
        </div>
      </section>

      <section className="wlsec"><div className="wrap">
        <div className="wldetail">
          <div>
            {items.map((it) => (
              <Link key={it.slug} className="propcard" href={`/chalets/${it.slug}`} style={{ display: 'grid' }}>
                <div className="im" style={{ backgroundImage: `url(${it.img})` }} />
                <div className="b">
                  <h3>{it.chaletName}</h3>
                  <div className="loc">{it.loc}</div>
                  <div className="meta">{it.meta}</div>
                  <div className="price">{it.price}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="reqpanel">
            <span className="eyebrow">This selection</span>
            <h3>Like the look of these?</h3>
            <div className="cnt">{items.length}{items.length === 1 ? ' chalet in this list' : ' chalets in this list'}</div>
            <p>Tell us your dates and who&rsquo;s coming, and we&rsquo;ll confirm availability and pricing across the selection — then help you choose and plan the week.</p>
            <Link className="btn" href="/contact" style={{ width: '100%', textAlign: 'center' }}>Speak to an advisor</Link>
          </div>
        </div>
      </div></section>
    </div>
  )
}
