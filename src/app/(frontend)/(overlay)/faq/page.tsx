import React from 'react'
import Link from 'next/link'

// FAQ & help — faithful port of vertige-proto-faq.html. Content is static
// authored copy; answers keep the prototype's cross-links, rewritten to the
// live routes.

export const metadata = {
  title: 'FAQ & help — Vertige',
  description: 'Answers to the questions we’re asked most about booking a luxury ski chalet with Vertige — and if yours isn’t here, just ask.',
}

interface QA { q: string; a: React.ReactNode }
interface Cat { id: string; title: string; intro: string; qas: QA[] }

const CATS: Cat[] = [
  {
    id: 'about', title: 'About Vertige', intro: 'Who we are and how we work.',
    qas: [
      { q: 'Who are Vertige?', a: <>Vertige is a luxury ski chalet brokerage and concierge. We hand-pick exceptional chalets across the Alps and look after every detail of the stay — from the first enquiry to the last morning on the mountain. We were founded by Ben Wood and Oli Dannatt, who between them bring a background in brand and design and many winters living and working in the mountains.</> },
      { q: 'What makes you different?', a: <>We don&rsquo;t own the chalets we represent, so our advice is honest: we match you to the right property rather than the one we need to fill. It&rsquo;s a business built on the return — guests and owners who come back — so everything is geared to getting it right, not to volume.</> },
      { q: 'Where do you operate?', a: <>Across the four great alpine nations: France, Switzerland, Austria and Italy, spanning more than fifty resorts. You can browse them all on our <Link href="/chalets">chalets page</Link> or by <Link href="/sitemap">destination</Link>.</> },
      { q: 'Is the concierge service an extra?', a: <>Our planning and advice come as part of booking a chalet with us. Bespoke additions — private chefs, instructors, transfers, experiences — are arranged on your behalf and quoted transparently before anything is confirmed.</> },
    ],
  },
  {
    id: 'booking', title: 'Booking your chalet', intro: 'From first enquiry to confirmed stay.',
    qas: [
      { q: 'How do I book a chalet?', a: <>Send us an <Link href="/contact">enquiry</Link> or call us, and a specialist will confirm availability, hold the chalet for you and guide you through the details. We&rsquo;ll only ask you to commit once you&rsquo;re happy with everything.</> },
      { q: 'Is there a minimum stay?', a: <>Most chalets are booked by the week. Changeover falls on a Saturday or a Sunday depending on the resort and the property — our search lets you pick either. Shorter and tailored stays are sometimes possible outside the peak weeks; just ask.</> },
      { q: 'What’s included in the price?', a: <>It varies by chalet. Many come fully staffed — a chef, a host, daily housekeeping and often driving — while others are self-catered. We set out exactly what&rsquo;s included for each property before you book, so there are no surprises.</> },
      { q: 'How do I pay, and is my booking protected?', a: <>A deposit secures the booking, with the balance due before you travel. Contracts and payments are handled securely, and we&rsquo;ll walk you through the terms for your particular chalet and season.</> },
      { q: 'I’m not sure which resort suits us — can you help?', a: <>That&rsquo;s exactly what we&rsquo;re for. Tell us how your group skis, who&rsquo;s coming and what matters most, and we&rsquo;ll suggest the resorts and chalets that fit — often ones you wouldn&rsquo;t have found yourself.</> },
    ],
  },
  {
    id: 'prepare', title: 'Before you travel', intro: 'Getting everything ready for the week.',
    qas: [
      { q: 'Can you arrange transfers and flights?', a: <>Yes. We arrange private airport transfers as standard, and can advise on flights, rail and even helicopter for the final leg where it makes sense.</> },
      { q: 'Can you organise lift passes, equipment and instructors?', a: <>We can take care of lift passes, ski and boot hire fitted at the chalet, and private or group instruction with the resort&rsquo;s best instructors — all arranged before you arrive.</> },
      { q: 'Can you cater for dietary requirements?', a: <>Our chefs routinely accommodate allergies, intolerances and preferences. Let us know in advance and we&rsquo;ll brief the chalet team.</> },
      { q: 'What about childcare and nannies?', a: <>We arrange qualified nannies and children&rsquo;s ski instruction so parents can enjoy the mountain too. Tell us the ages of your children and we&rsquo;ll tailor it.</> },
    ],
  },
  {
    id: 'enjoy', title: 'During your stay', intro: 'While you’re on the mountain.',
    qas: [
      { q: 'Will there be staff in the chalet?', a: <>Most of our chalets come with a host and/or chef, and larger properties have a fuller team. We confirm the staffing for each chalet when you book so you know exactly who will be looking after you.</> },
      { q: 'Can you book restaurants and experiences?', a: <>Yes — the tables worth booking, plus off-mountain experiences from wellness and tastings to heli-skiing. Your concierge keeps recommendations current and secures the reservations that are otherwise hard to get.</> },
      { q: 'What if something isn’t right during our stay?', a: <>Your concierge and our on-mountain team are reachable throughout the week. If something isn&rsquo;t right, we&rsquo;ll put it right quickly — that&rsquo;s the point of the service.</> },
    ],
  },
  {
    id: 'practical', title: 'Practical questions', intro: 'The details worth knowing.',
    qas: [
      { q: 'When is the ski season?', a: <>Broadly December to April. The highest and glacier resorts open from late November and run into early May, which is why we often recommend them for early- and late-season trips.</> },
      { q: 'What are changeover days?', a: <>The day your week begins and ends. Depending on the chalet and resort this is a Saturday or a Sunday — our search surfaces both so you&rsquo;re not limited to one.</> },
      { q: 'Do I need travel insurance?', a: <>Yes — we strongly recommend comprehensive travel and winter-sports insurance for every guest, including off-piste cover if you plan to ski off the marked runs.</> },
      { q: 'What is your cancellation policy?', a: <>It depends on the chalet and the season, and we set it out clearly at the time of booking so you know where you stand before you commit.</> },
    ],
  },
  {
    id: 'owners', title: 'For chalet owners', intro: 'Letting your chalet with us.',
    qas: [
      { q: 'Can I list my chalet with Vertige?', a: <>Yes. We curate a small, considered collection and manage the rental end to end. You can read more and get in touch on our <Link href="/owners">Join the Portfolio</Link> page.</> },
      { q: 'How do you market my chalet?', a: <>Through our website, our journal and our private client list, with a strategy built around your specific chalet and the calendar you want — not a generic listing.</> },
      { q: 'Who looks after my chalet and guests?', a: <>Our people on the mountain vet guests, prepare and inspect the chalet, and oversee each stay, so your property is in careful hands throughout the season.</> },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/chalets/ext-12.webp)' }} />
        <div className="wrap">
          <span className="eyebrow">Help &amp; FAQs</span>
          <h1>Everything you need to <em>know.</em></h1>
          <p className="sub">Answers to the questions we&rsquo;re asked most — and if yours isn&rsquo;t here, just ask.</p>
        </div>
      </section>

      <section className="sect"><div className="wrap">
        {CATS.map((cat) => (
          <section key={cat.id} className="faqcat" id={cat.id}>
            <h2>{cat.title}</h2>
            <p className="cintro">{cat.intro}</p>
            {cat.qas.map((qa) => (
              <details key={qa.q} className="faq">
                <summary>{qa.q}</summary>
                <div className="a">{qa.a}</div>
              </details>
            ))}
          </section>
        ))}
      </div></section>

      <section className="sect warm"><div className="wrap"><div className="lede">
        <span className="eyebrow">Still have a question?</span>
        <h2>We&rsquo;re happy to help</h2>
        <p>If you can&rsquo;t find what you&rsquo;re looking for, our advisors are on hand every day.</p>
        <div style={{ marginTop: '1.6rem' }}><Link className="btn" href="/contact">Contact us</Link></div>
      </div></div></section>
    </>
  )
}
