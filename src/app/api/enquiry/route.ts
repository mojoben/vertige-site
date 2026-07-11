import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// POST /api/enquiry — the single hardened submission handler every form posts
// to (HANDOFF 03 §3–§5). Pipeline, in order, so nothing is ever lost:
//   1. validate + spam checks (honeypot now; Turnstile + rate-limit at deploy)
//   2. STORE  → Payload `enquiries` (permanent backup, before anything else)
//   3. FORWARD → res portal /api/public/enquiries (creates the working lead)
//   4. EMAIL  → auto-response + internal alert (TODO: needs the transactional
//               provider creds — Resend/Postmark/SES per 03 §5)
// If the portal is unreachable the record stays `portalSync: pending` for
// retry — the submission is never dropped.

const TYPES = new Set(['trip', 'owner', 'newsletter', 'chalet-request'])
const EMAIL_RE = /.+@.+\..+/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  // ── 1. Validate + spam ────────────────────────────────────────────────
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    // Honeypot filled → silently accept and drop (03 §4).
    return NextResponse.json({ ok: true })
  }
  const enquiryType = TYPES.has(body.enquiryType) ? body.enquiryType : 'trip'
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 422 })
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : ''
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : ''
  if (enquiryType !== 'newsletter' && (!firstName || !lastName)) {
    return NextResponse.json({ error: 'First and last name are required' }, { status: 422 })
  }

  // ── 2. Store (the backup copy — always first) ─────────────────────────
  const payload = await getPayload({ config })
  const stored = await payload.create({
    collection: 'enquiries',
    data: {
      enquiryType,
      firstName,
      lastName,
      email,
      phone: typeof body.phone === 'string' ? body.phone.trim() : '',
      payload: body,
      portalSync: enquiryType === 'newsletter' ? 'n/a' : 'pending',
      sourcePath: typeof body.sourcePath === 'string' ? body.sourcePath : '',
    },
    overrideAccess: true,
  })

  // ── 3. Forward to the res portal (newsletter stays site-side/ESP) ─────
  let portalRef: string | null = null
  if (enquiryType !== 'newsletter' && process.env.PORTAL_URL && process.env.PORTAL_API_KEY) {
    try {
      const res = await fetch(`${process.env.PORTAL_URL}/api/public/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.PORTAL_API_KEY },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: body.phone,
          propertySlug: body.propertySlug,
          countryCodes: body.countryCodes,
          regions: body.regions,
          travelStart: body.travelStart,
          travelEnd: body.travelEnd,
          flexibility: body.flexibility,
          adults: body.adults,
          children: body.children,
          notes: [body.message, enquiryType === 'owner' ? '[Owner / Join the Portfolio enquiry]' : null, body.budget ? `Budget: ${body.budget}` : null]
            .filter(Boolean)
            .join('\n'),
          summary: `Website ${enquiryType} form`,
        }),
      })
      if (res.ok) {
        const j = await res.json().catch(() => ({}))
        portalRef = j.ref ?? null
        await payload.update({ collection: 'enquiries', id: stored.id, data: { portalSync: 'synced', portalRef: portalRef ?? '' }, overrideAccess: true })
      } else {
        await payload.update({ collection: 'enquiries', id: stored.id, data: { portalSync: 'failed' }, overrideAccess: true })
      }
    } catch {
      await payload.update({ collection: 'enquiries', id: stored.id, data: { portalSync: 'failed' }, overrideAccess: true })
    }
  }

  // ── 4. Email (TODO: transactional provider — Resend/Postmark/SES) ─────
  // Auto-response to the customer + internal alert to the concierge inbox.

  return NextResponse.json({ ok: true, ref: portalRef })
}
