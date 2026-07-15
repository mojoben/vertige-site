// Transactional sending via Microsoft Graph (Exchange) — client-credentials
// flow, no packages. Activates when the four env vars are present:
//   AZURE_TENANT_ID  AZURE_CLIENT_ID  AZURE_CLIENT_SECRET  MAIL_SENDER
// (MAIL_SENDER is the Exchange mailbox we send as, e.g. hello@vertigeski.com;
// the app registration needs the Mail.Send application permission with admin
// consent.) Without creds every call is a recorded no-op — callers already
// store the rendered HTML with the lead, so nothing is lost and the send can
// be replayed once the keys land.

let cachedToken: { value: string; expiresAt: number } | null = null

function creds() {
  const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, MAIL_SENDER } = process.env
  if (!AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET || !MAIL_SENDER) return null
  return { tenant: AZURE_TENANT_ID, client: AZURE_CLIENT_ID, secret: AZURE_CLIENT_SECRET, sender: MAIL_SENDER }
}

export const emailConfigured = () => creds() !== null

async function graphToken(c: NonNullable<ReturnType<typeof creds>>): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value
  const res = await fetch(`https://login.microsoftonline.com/${c.tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: c.client,
      client_secret: c.secret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`Graph token ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

export interface SendResult {
  sent: boolean
  detail: string // "graph" when sent; the reason when not
}

/** Send one HTML email as MAIL_SENDER. Never throws — enquiry storage must
 *  succeed even when mail fails; the result is recorded on the lead. */
export async function sendEmail(o: { to: string; subject: string; html: string }): Promise<SendResult> {
  const c = creds()
  if (!c) return { sent: false, detail: 'email transport not configured (AZURE_* / MAIL_SENDER env vars missing)' }
  try {
    const token = await graphToken(c)
    const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(c.sender)}/sendMail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          subject: o.subject,
          body: { contentType: 'HTML', content: o.html },
          toRecipients: [{ emailAddress: { address: o.to } }],
        },
        saveToSentItems: true,
      }),
    })
    if (res.status === 202) return { sent: true, detail: 'graph' }
    return { sent: false, detail: `graph ${res.status}: ${(await res.text()).slice(0, 200)}` }
  } catch (e) {
    return { sent: false, detail: e instanceof Error ? e.message : String(e) }
  }
}
