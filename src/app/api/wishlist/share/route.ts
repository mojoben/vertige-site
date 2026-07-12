import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getPayload } from 'payload'
import config from '@/payload.config'

// POST /api/wishlist/share — persist a read-only snapshot of a guest's list
// under a share token so /wishlist/s/{token} can render it (HANDOFF 09 §3).
// Re-sharing the same local list refreshes the snapshot in place.

interface ShareItem { slug: string; name?: string; loc?: string; meta?: string; price?: string; img?: string }

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 120) : 'My favourites'
  const senderName = typeof body.senderName === 'string' ? body.senderName.trim().slice(0, 120) : ''
  const rawItems: ShareItem[] = Array.isArray(body.items) ? body.items.slice(0, 40) : []
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
  if (!items.length) return NextResponse.json({ error: 'Empty list' }, { status: 422 })

  const payload = await getPayload({ config })
  const token = typeof body.token === 'string' && /^[a-f0-9]{16,}$/.test(body.token) ? body.token : randomBytes(12).toString('hex')

  const existing = await payload.find({ collection: 'wishlists', where: { token: { equals: token } }, limit: 1 })
  if (existing.docs[0]) {
    await payload.update({ collection: 'wishlists', id: existing.docs[0].id, data: { name, senderName, items }, overrideAccess: true })
  } else {
    await payload.create({ collection: 'wishlists', data: { token, name, senderName, items }, overrideAccess: true })
  }

  return NextResponse.json({ ok: true, token, url: `/wishlist/s/${token}` })
}
