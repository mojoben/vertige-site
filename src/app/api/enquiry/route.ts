import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sharedDb } from '@/lib/shared-db'
import { renderEnquiryAutoReply, renderInternalEnquiryAlert } from '@/lib/emails'
import { sendEmail } from '@/lib/send-email'

// POST /api/enquiry — the single hardened submission handler every form posts
// to (HANDOFF 03 §3–§5). Pipeline, in order, so nothing is ever lost:
//   1. validate + spam checks (honeypot now; Turnstile + rate-limit at deploy)
//   2. STORE  → Payload `enquiries` (permanent backup, before anything else)
//   3. LEAD   → INSERT into the shared web.leads mailbox (doc 10 §2: the
//               site's ONLY write into portal territory, insert-only grant;
//               the portal ingests it into a working enquiry). Supersedes
//               the earlier HTTP forward to /api/public/enquiries.
//   4. EMAIL  → auto-response + internal alert (TODO: needs the transactional
//               provider creds — Resend/Postmark/SES per 03 §5)
// If the database is unreachable the record stays `portalSync: pending` for
// retry — the submission is never dropped.

const TYPES = new Set(['trip', 'owner', 'newsletter', 'chalet-request', 'wishlist', 'wishlist-share'])
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

  // ── 3. Lead → shared web.leads mailbox (newsletter stays site-side/ESP) ─
  if (enquiryType !== 'newsletter') {
    const lead = {
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
    }
    try {
      await sharedDb().query('INSERT INTO web.leads (payload) VALUES ($1)', [JSON.stringify(lead)])
      await payload.update({ collection: 'enquiries', id: stored.id, data: { portalSync: 'synced' }, overrideAccess: true })
    } catch {
      await payload.update({ collection: 'enquiries', id: stored.id, data: { portalSync: 'failed' }, overrideAccess: true })
    }
  }

  // ── 4. Email — branded auto-reply to the client + internal new-enquiry
  // alert (Ben, 2026-07-15). Rendered + stored on the enquiry record first,
  // then sent via Microsoft Graph when the AZURE_*/MAIL_SENDER env vars are
  // present; without them the send is a recorded no-op and can be replayed.
  if (enquiryType !== 'newsletter' && enquiryType !== 'wishlist-share') {
    const origin = process.env.SITE_ORIGIN ?? 'https://vertigeski.com'
    // Chalet context when the form came from a chalet page.
    let chalet: { name: string; location: string; img?: string; url?: string } | null = null
    if (typeof body.propertySlug === 'string' && body.propertySlug) {
      try {
        const { rows } = await sharedDb().query<{ name: string; resort: string | null; country: string | null; hero: string | null }>(
          `SELECT p.name, p.resort, p.country, p.images->0->>'url' AS hero
             FROM web.property_public_v p WHERE p.slug = $1`,
          [body.propertySlug],
        )
        if (rows[0]) {
          const img = rows[0].hero ?? undefined
          chalet = {
            name: rows[0].name,
            location: [rows[0].resort, rows[0].country].filter(Boolean).join(', '),
            img: img && !img.startsWith('http') ? `${origin}${img}` : img,
            url: `${origin}/chalets/${body.propertySlug}`,
          }
        }
      } catch {
        // chalet context is best-effort — the emails still go without it
      }
    }
    const reply = renderEnquiryAutoReply({ firstName, chalet })
    const alert = renderInternalEnquiryAlert({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      enquiryType,
      chalet,
      summary: typeof body.message === 'string' ? body.message.slice(0, 500) : undefined,
      portalUrl: `${process.env.PORTAL_ORIGIN ?? 'https://vertige-portal.onrender.com'}/quotes`,
    })
    const [replyRes, alertRes] = await Promise.all([
      sendEmail({ to: email, subject: reply.subject, html: reply.html }),
      sendEmail({ to: process.env.ENQUIRY_ALERT_TO ?? 'hello@vertigeski.com', subject: alert.subject, html: alert.html }),
    ])
    await payload
      .update({
        collection: 'enquiries',
        id: stored.id,
        data: {
          payload: {
            ...body,
            autoReply: { subject: reply.subject, html: reply.html, sent: replyRes.sent, detail: replyRes.detail },
            internalAlert: { sent: alertRes.sent, detail: alertRes.detail },
          },
        },
        overrideAccess: true,
      })
      .catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
