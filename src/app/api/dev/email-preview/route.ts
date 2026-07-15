import { NextResponse } from 'next/server'
import { renderShareWishlistEmail, renderVerifyCodeEmail, renderEnquiryAutoReply, renderInternalEnquiryAlert, renderWishlistFollowUpEmail } from '@/lib/emails'

// Dev-only preview of the transactional email templates (HANDOFF 09 §6):
// /api/dev/email-preview?t=share | verify. Sample data mirrors the mocks.

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'Not available' }, { status: 404 })
  const t = new URL(request.url).searchParams.get('t')
  const origin = new URL(request.url).origin
  const { html } =
    t === 'wishlist-saved'
      ? renderWishlistFollowUpEmail({
          firstName: 'Ben',
          listName: 'Verbier, February',
          chalets: [
            { name: 'Chalet Marmottière', location: 'Verbier, Switzerland', img: `${origin}/images/chalets/ext-07.webp`, url: `${origin}/chalets/chalet-marmottiere` },
            { name: 'Chalet Sorojasa', location: 'Verbier, Switzerland', img: `${origin}/images/chalets/ext-03.webp`, url: `${origin}/chalets/chalet-sorojasa` },
          ],
          moreCount: 1,
          wishlistUrl: `${origin}/wishlist`,
          contactUrl: `${origin}/contact`,
        })
      : t === 'enquiry'
      ? renderEnquiryAutoReply({
          firstName: 'Ben',
          chalet: { name: 'Chalet Marmottière', location: 'Verbier, Switzerland', img: `${origin}/images/chalets/ext-07.webp`, url: `${origin}/chalets/chalet-marmottiere` },
        })
      : t === 'enquiry-plain'
      ? renderEnquiryAutoReply({ firstName: 'Ben' })
      : t === 'alert'
      ? renderInternalEnquiryAlert({
          name: 'Ben Wood', email: 'ben@example.com', phone: '+44 7700 900000', enquiryType: 'chalet-request',
          chalet: { name: 'Chalet Marmottière', location: 'Verbier, Switzerland' },
          summary: 'Family of ten, February half-term, keen skiers.', portalUrl: 'https://vertige-portal.onrender.com/quotes',
        })
      : t === 'verify'
      ? renderVerifyCodeEmail('482913')
      : renderShareWishlistEmail({
          senderName: 'Ben Wood',
          note: 'Thought you’d love these for our trip — take a look and tell me your favourite.',
          listName: 'Chamonix, February',
          countLine: '3 chalets · France & Switzerland',
          coverImg: `${origin}/images/chalets/ext-07.webp`,
          thumbs: [`${origin}/images/chalets/ext-03.webp`, `${origin}/images/chalets/ext-01.webp`, `${origin}/images/chalets/ext-06.webp`],
          shareUrl: `${origin}/wishlist/s/8f2a0000000000000000000000`,
          unsubscribeUrl: `${origin}/unsubscribe`,
        })
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
