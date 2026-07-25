import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sharedDb } from '@/lib/shared-db'

// Re-drive enquiries whose web.leads INSERT failed (portalSync "failed") —
// the retry the enquiry pipeline promises. Hit by a Render cron (or by hand)
// with the shared CRON_SECRET; safe to run any time, idempotent per lead
// (each success flips the record to "synced" so it never re-sends).

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization') ?? ''
  const key = new URL(request.url).searchParams.get('key') ?? ''
  if (secret && auth !== `Bearer ${secret}` && key !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const failed = await payload.find({
    collection: 'enquiries',
    where: { portalSync: { equals: 'failed' } },
    limit: 50,
    sort: 'createdAt',
  })

  let retried = 0
  let stillFailing = 0
  for (const doc of failed.docs as { id: string | number; enquiryType: string; firstName: string; lastName: string; email: string; phone?: string; payload?: Record<string, unknown> }[]) {
    const body = doc.payload ?? {}
    const lead = {
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      propertySlug: body.propertySlug,
      countryCodes: body.countryCodes,
      regions: body.regions,
      travelStart: body.travelStart,
      travelEnd: body.travelEnd,
      flexibility: body.flexibility,
      adults: body.adults,
      children: body.children,
      notes: typeof body.message === 'string' ? body.message : '',
      summary: `Website ${doc.enquiryType} form (retried)`,
    }
    try {
      await sharedDb().query('INSERT INTO web.leads (payload) VALUES ($1)', [JSON.stringify(lead)])
      await payload.update({ collection: 'enquiries', id: doc.id, data: { portalSync: 'synced' }, overrideAccess: true })
      retried++
    } catch {
      stillFailing++
    }
  }

  return NextResponse.json({ ok: true, retried, stillFailing, pending: failed.totalDocs - retried })
}
