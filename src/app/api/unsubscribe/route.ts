import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// POST /api/unsubscribe { email } — add the address to the suppression list.
// Idempotent; the /unsubscribe page confirms with a button so a mail
// scanner's GET prefetch never unsubscribes anyone.

const EMAIL_RE = /.+@.+\..+/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 422 })

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'suppressions', where: { email: { equals: email } }, limit: 1 })
  if (!existing.docs[0]) {
    await payload.create({ collection: 'suppressions', data: { email, source: 'unsubscribe page' }, overrideAccess: true })
  }
  return NextResponse.json({ ok: true })
}
