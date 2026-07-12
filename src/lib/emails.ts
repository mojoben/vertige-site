// Branded transactional email templates (HANDOFF 09 §6) — faithful builds of
// prototype/vertige-proto-email-share.html and vertige-proto-email-verify.html
// as email-safe HTML: table-free simple blocks, ALL styles inline, and
// system-safe font stacks (Georgia fallback carries the serif; webfonts are
// unreliable in mail clients). Sent via the transactional provider when its
// creds land (03 §5) — until then callers store the rendered HTML with the
// lead so nothing is lost.

const NAVY = '#4e3855'
const ROSE = '#a35858'
const INK = '#2e2a33'
const PAPER = '#fcf9f5'
const WARM = '#f0ece3'
const WARM2 = '#f6f2ea'
const LINE = '#e5e0d6'
const MUTED = '#6f7680'

const SANS = "'Inter', Helvetica, Arial, sans-serif"
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function shell(inner: string, opts: { legal?: string } = {}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:${WARM};font-family:${SANS};color:${INK};line-height:1.6;-webkit-font-smoothing:antialiased">
  <div style="max-width:600px;margin:0 auto;background:${PAPER};border:1px solid ${LINE}">
    <div style="text-align:center;padding:35px 0 22px;border-bottom:1px solid ${LINE}">
      <img src="https://vertigeski.com/images/vertige-logo.png" alt="Vertige" style="height:30px;border:0">
    </div>
    ${inner}
    <div style="border-top:1px solid ${LINE};text-align:center;padding:29px 32px 35px;color:${MUTED}">
      <img src="https://vertigeski.com/images/vertige-logo.png" alt="Vertige" style="height:24px;border:0;opacity:.9;margin-bottom:14px"><br>
      <span style="font-family:${SERIF};font-style:italic;color:${NAVY};font-size:16px">See you on the mountain.</span>
      <div style="font-size:11.5px;line-height:1.7;margin-top:11px">Vertige &middot; luxury ski chalet rentals across the Alps<br>London &amp; the Alps &middot; <a href="mailto:hello@vertigeski.com" style="color:${NAVY}">hello@vertigeski.com</a> &middot; +44 20 7131 0270</div>
      ${opts.legal ? `<div style="font-size:10px;color:#9a9aa0;margin-top:16px">${opts.legal}</div>` : ''}
    </div>
  </div>
</body>
</html>`
}

export interface ShareEmailInput {
  senderName: string
  note?: string
  listName: string
  countLine: string // e.g. "3 chalets · France & Switzerland"
  coverImg: string // absolute URL
  thumbs: string[] // absolute URLs, up to 3
  shareUrl: string
  unsubscribeUrl: string
}

export function renderShareWishlistEmail(o: ShareEmailInput): { subject: string; html: string } {
  const sender = esc(o.senderName || 'A friend')
  const thumbs = o.thumbs
    .slice(0, 3)
    .map(
      (t) =>
        `<td style="width:33%;padding:0 4px"><div style="height:74px;background:url(${t}) center/cover"></div></td>`
    )
    .join('')
  const inner = `
    <div style="padding:32px">
      <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${ROSE};font-weight:600;margin-bottom:16px">A shared wishlist</div>
      <h1 style="font-family:${SERIF};font-weight:500;color:${NAVY};font-size:30px;line-height:1.2;margin:0 0 16px;letter-spacing:.2px">${sender} has shared a wishlist with you</h1>
      <p style="color:#4a4450;font-size:15.5px;margin:0 0 18px">${sender} has been putting together a selection of luxury ski chalets on Vertige, and thought you&rsquo;d like to see it. Take a look, and if anything catches your eye, our team can confirm availability and plan the week around it.</p>
      ${o.note ? `<div style="border-left:3px solid ${ROSE};background:${WARM2};padding:14px 18px;font-family:${SERIF};font-style:italic;color:${NAVY};font-size:17.5px;margin:0 0 26px">&ldquo;${esc(o.note)}&rdquo;</div>` : ''}
      <div style="border:1px solid ${LINE};margin:22px 0 29px">
        <div style="height:200px;background:url(${o.coverImg}) center/cover"></div>
        <div style="padding:18px 21px 21px">
          <div style="font-family:${SERIF};font-size:21.5px;color:${NAVY};margin-bottom:2px">${esc(o.listName)}</div>
          <div style="font-size:11.5px;letter-spacing:1px;text-transform:uppercase;color:${MUTED}">${esc(o.countLine)}</div>
          ${thumbs ? `<table role="presentation" style="width:100%;border-collapse:collapse;margin-top:16px"><tr>${thumbs}</tr></table>` : ''}
        </div>
      </div>
      <a href="${o.shareUrl}" style="display:block;background:${NAVY};color:#ffffff;text-decoration:none;text-align:center;padding:16px 26px;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">View the wishlist &rarr;</a>
      <p style="font-size:13px;color:${MUTED};margin:0">Or copy this link into your browser:<br><span style="color:${NAVY}">${o.shareUrl}</span></p>
    </div>`
  return {
    subject: `${o.senderName || 'A friend'} has shared a wishlist with you`,
    html: shell(inner, {
      legal: `You&rsquo;ve received this because a Vertige user shared a wishlist with you. Prefer not to hear from us? <a href="${o.unsubscribeUrl}" style="color:#9a9aa0">Unsubscribe</a>.`,
    }),
  }
}

export function renderVerifyCodeEmail(code: string): { subject: string; html: string } {
  const inner = `
    <div style="padding:32px">
      <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${ROSE};font-weight:600;margin-bottom:16px">Verify your email</div>
      <p style="color:#4a4450;font-size:15.5px;margin:0 0 18px">Use this code to complete your verification:</p>
      <div style="font-family:${SERIF};font-weight:500;color:${NAVY};font-size:45px;letter-spacing:.35em;text-align:center;background:${WARM2};border:1px solid ${LINE};padding:19px 0 19px .35em;margin:22px 0 26px">${esc(code)}</div>
      <p style="color:${MUTED};font-size:13.5px;margin:0 0 18px">This code is valid for one hour and can only be used once.</p>
      <p style="color:${MUTED};font-size:13.5px;margin:0">If you didn&rsquo;t request this, you can safely ignore and delete this email.</p>
    </div>`
  return { subject: 'Your Vertige verification code', html: shell(inner) }
}
