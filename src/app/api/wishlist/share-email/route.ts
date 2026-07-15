import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { renderShareWishlistEmail } from '@/lib/emails'

// POST /api/wishlist/share-email — the direct send (HANDOFF 09 §6): Vertige
// emails the friend a branded message (not the user's mail client) and
// captures the friend's address as a marketing lead (source "wishlist
// share", soft opt-in / legitimate interest with unsubscribe in every email
// — flagged for the privacy policy). Pipeline mirrors /api/enquiry: STORE
// the lead first (with the rendered email), then SEND via the transactional
// provider once its creds land (03 §5 — same TODO as the enquiry emails).

const EMAIL_RE = /.+@.+\..+/
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? 'https://vertigeski.com'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  if (typeof body.website === 'string' && body.website.trim() !== '') return NextResponse.json({ ok: true }) // honeypot

  const friendEmail = typeof body.friendEmail === 'string' ? body.friendEmail.trim() : ''
  if (!EMAIL_RE.test(friendEmail)) return NextResponse.json({ error: 'A valid email is required' }, { status: 422 })
  const senderName = typeof body.senderName === 'string' ? body.senderName.trim().slice(0, 120) : ''
  const senderFirstName = typeof body.senderFirstName === 'string' ? body.senderFirstName.trim().slice(0, 60) : ''
  const senderLastName = typeof body.senderLastName === 'string' ? body.senderLastName.trim().slice(0, 60) : ''
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 600) : ''
  const listName = typeof body.listName === 'string' ? body.listName.trim().slice(0, 120) : 'My favourites'
  const countLine = typeof body.countLine === 'string' ? body.countLine.trim().slice(0, 160) : ''
  const shareToken = typeof body.shareToken === 'string' ? body.shareToken : ''
  if (!shareToken) return NextResponse.json({ error: 'Missing share token' }, { status: 422 })

  const abs = (p: unknown) => (typeof p === 'string' && p ? (p.startsWith('http') ? p : `${SITE_ORIGIN}${p}`) : '')
  const shareUrl = `${SITE_ORIGIN}/wishlist/s/${shareToken}`
  const { subject, html } = renderShareWishlistEmail({
    senderName,
    note,
    listName,
    countLine,
    coverImg: abs(body.coverImg) || `${SITE_ORIGIN}/images/hero.jpg`,
    thumbs: (Array.isArray(body.thumbs) ? body.thumbs.slice(0, 3) : []).map(abs).filter(Boolean),
    shareUrl,
    unsubscribeUrl: `${SITE_ORIGIN}/unsubscribe?email=${encodeURIComponent(friendEmail)}`,
  })

  // 1. STORE — the marketing lead + rendered email, before any send attempt.
  const payload = await getPayload({ config })
  await payload.create({
    collection: 'enquiries',
    data: {
      enquiryType: 'wishlist-share',
      firstName: senderFirstName || senderName || 'Wishlist',
      lastName: senderLastName || 'Share',
      email: friendEmail,
      phone: '',
      payload: { source: 'wishlist share', senderName, note, listName, shareToken, shareUrl, subject, renderedEmail: html },
      portalSync: 'n/a',
      sourcePath: typeof body.sourcePath === 'string' ? body.sourcePath : '/wishlist',
    },
    overrideAccess: true,
  })

  // 2. SEND — transactional provider pending creds (03 §5). The rendered
  // email is stored above so the send can be replayed once wired.
  // TODO(resend/postmark/ses): send { to: friendEmail, from: hello@vertigeski.com, subject, html }

  return NextResponse.json({ ok: true })
}
