import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { appCors } from '../shape'

// Account wishlist, shared between the app and the website (Ben,
// 2026-07-17: one database, everything collecting and sharing). Reuses the
// Payload `wishlists` collection: an account's list is the row whose token
// is derived deterministically from the email — no schema change, and the
// website's own account flow can adopt the same row when it lands.

const tokenFor = (email: string) =>
  createHash('sha256').update(`vertige-wl:${email.trim().toLowerCase()}`).digest('hex').slice(0, 32)

const EMAIL_RE = /.+@.+\..+/

interface Item { slug: string; name?: string; loc?: string; meta?: string; price?: string; img?: string }

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email') ?? ''
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 422, headers: appCors })
  const payload = await getPayload({ config })
  const found = await payload.find({ collection: 'wishlists', where: { token: { equals: tokenFor(email) } }, limit: 1 })
  const doc = found.docs[0] as { items?: { slug: string; chaletName?: string; loc?: string; meta?: string; price?: string; img?: string }[] } | undefined
  const items = (doc?.items ?? []).map((i) => ({
    slug: i.slug, name: i.chaletName ?? '', loc: i.loc ?? '', meta: i.meta ?? '', price: i.price ?? '', img: i.img ?? '',
  }))
  return NextResponse.json({ items }, { headers: appCors })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid body' }, { status: 400, headers: appCors })
  const email = typeof body.email === 'string' ? body.email : ''
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 422, headers: appCors })

  const rawItems: Item[] = Array.isArray(body.items) ? body.items.slice(0, 40) : []
  const items = rawItems
    .filter((i) => i && typeof i.slug === 'string')
    .map((i) => ({
      slug: String(i.slug).slice(0, 120),
      chaletName: String(i.name ?? '').slice(0, 160),
      loc: String(i.loc ?? '').slice(0, 160),
      meta: String(i.meta ?? '').slice(0, 160),
      price: String(i.price ?? '').slice(0, 160),
      img: String(i.img ?? '').slice(0, 500),
    }))

  const payload = await getPayload({ config })
  const token = tokenFor(email)
  const existing = await payload.find({ collection: 'wishlists', where: { token: { equals: token } }, limit: 1 })
  if (existing.docs[0]) {
    await payload.update({ collection: 'wishlists', id: existing.docs[0].id, data: { items }, overrideAccess: true })
  } else {
    await payload.create({
      collection: 'wishlists',
      data: { token, name: 'My favourites', senderName: '', items },
      overrideAccess: true,
    })
  }
  return NextResponse.json({ ok: true, count: items.length }, { headers: appCors })
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: appCors })
}
