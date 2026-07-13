import React from 'react'
import Link from 'next/link'
import { getCatalogue } from '@/lib/portal-client'
import { HeroSlides, CarouselRow, CtaBand, HomeFx } from '@/components/HomeBits'

// Home — faithful port of vertige-proto-home-mockup.html (confirmed as the
// canonical home, Ben 2026-07-11). Featured chalet + chalet carousel are fed
// from the portal catalogue; the journal band links the worked-up articles.

export default async function HomePage() {
  const { chalets } = await getCatalogue()
  const featured = chalets[0]
  const carousel = chalets.slice(0, 4)
  const countOf = (country: string) => chalets.filter((c) => c.country === country).length

  const chaletHref = (c: { slug?: string }) => (c.slug ? `/chalets/${c.slug}` : '/chalets/sample')

  return (
    <div className="homepage">
      <HomeFx />

      {/* HERO */}
      <section className="hero">
        <HeroSlides images={['/images/hero.jpg', '/images/chalets/ext-05.webp', '/images/chalets/ext-06.webp']} />
        <div className="wrap">
          <h1>The mountain,<br />made <em>yours</em>.</h1>
          <p className="snip">A curated portfolio of the finest ski chalets across the Alps — designed for families, groups of friends, and the weeks you come back for.</p>
        </div>
        <div className="hbottom"><div className="wrap">
          <Link className="hprev" href={featured ? chaletHref(featured) : '/chalets/sample'}>
            <div className="thumb" style={{ backgroundImage: `url(${featured?.img ?? '/images/chalets/ext-01.webp'})` }} />
            <div className="in"><div className="k">Featured chalet</div><div className="n">{featured?.name ?? 'Chalet Aiguille'} <span>→</span></div></div>
          </Link>
          <div className="hsearch">
            <div className="f"><label>Destination</label><span>Any resort</span></div>
            <div className="f"><label>Guests</label><span>8 guests</span></div>
            <div className="f"><label>Bedrooms</label><span>4+</span></div>
            <Link className="hgo" href="/chalets">Search</Link>
          </div>
        </div></div>
      </section>

      <div className="fadewrap">
        {/* CENTRED INTRO */}
        <section><div className="wrap"><div className="cintro reveal">
          <h2>The height of Alpine living,<br />in a setting that <em>earns it</em></h2>
          <div className="rule" />
          <p>You can book a chalet with anyone. The reason people come back is everything that happens after — the chalet, the mountain, and the people you share it with.</p>
        </div></div></section>

        {/* OFFSET DUO */}
        <section style={{ paddingTop: 0 }}><div className="wrap"><div className="duo reveal">
          <div className="leftimg px"><div className="pxi" style={{ backgroundImage: 'url(/images/chalets/liv-02.webp)' }} /></div>
          <div className="right">
            <div className="topimg px"><div className="pxi" style={{ backgroundImage: 'url(/images/chalets/ext-13.webp)' }} /></div>
            <div className="tx">
              <p>We don&rsquo;t hand you a list and wish you luck. We ask the questions that matter — how you ski, who&rsquo;s coming, what you loved last time — and make a recommendation you can trust.</p>
              <p>Curation over volume, insider knowledge, and a level of service you feel in the small things. Some of the best things we do never appear on an invoice.</p>
              <a className="arrowlink" href="#">Discover the Vertige approach ›</a>
            </div>
          </div>
        </div></div></section>
      </div>

      {/* DISCOVER YOUR PERFECT */}
      <section><div className="wrap">
        <div className="disc-head reveal"><h2>Discover your <em>perfect</em> destination</h2><p className="sub">Resorts and chalets matched to how your group skis and the week you want to have.</p></div>
        <div className="reveal">
          <CarouselRow step={300}>
            {([
              ['Switzerland', '/images/chalets/ext-04.webp'],
              ['France', '/images/chalets/ext-08.webp'],
              ['Austria', '/images/chalets/ext-11.webp'],
              ['Italy', '/images/chalets/ext-12.webp'],
            ] as const).map(([name, img]) => (
              <Link key={name} className="dcard" href={`/${name.toLowerCase()}`}>
                <div className="im" style={{ backgroundImage: `url(${img})` }} />
                <div className="t"><h3>{name}</h3><div className="c">{countOf(name)} chalets</div></div>
              </Link>
            ))}
          </CarouselRow>
        </div>
      </div></section>

      {/* CHALETS CAROUSEL */}
      <section className="chalets"><div className="wrap">
        <div className="gold-head reveal">
          <h2>Chalets you will <em>fall in love</em> with</h2>
          <p>A selection of the chalets worth booking — across <Link href="/switzerland">Switzerland</Link>, <Link href="/france">France</Link> and <Link href="/austria">Austria</Link>, from grand catered chalets to modern apartments. Let us find your match.</p>
        </div>
        <div className="reveal">
          <CarouselRow step={460}>
            {carousel.map((c) => (
              <Link key={c.name} className="ccard" href={chaletHref(c)}>
                <div className="im" style={{ backgroundImage: `url(${c.img})` }} />
                <h3>{c.name}</h3>
                <div className="specs">{c.resort} · {c.country} · Sleeps {c.guests}{c.chips?.[0] ? ` · ${c.chips[0]}` : ''}</div>
              </Link>
            ))}
          </CarouselRow>
        </div>
      </div></section>

      {/* FULL-WIDTH CTA SLIDER */}
      <CtaBand slides={[
        { img: '/images/hero.jpg', eyebrow: 'Now booking', title: 'Winter 2026 / 2027', cta: { label: 'Book your stay', href: '/chalets' } },
        { img: '/images/chalets/ext-07.webp', eyebrow: 'Privé service', title: 'A private chef, included', cta: { label: 'Explore Privé', href: featured ? chaletHref(featured) : '/chalets/sample' } },
        { img: '/images/chalets/ext-09.webp', eyebrow: 'Ski-in, ski-out', title: 'Doorstep to the piste', cta: { label: 'See the chalets', href: '/chalets' } },
      ]} />

      {/* PRIVATE CHEF */}
      <section><div className="wrap"><div className="chef reveal">
        <div className="im px"><div className="pxi" style={{ backgroundImage: 'url(/images/chalets/liv-08.webp)' }} /></div>
        <div className="tx">
          <span className="eyebrow">Private dining</span>
          <h2>The table,<br />in your <em>chalet</em></h2>
          <p>A private chef who cooks around your day, not the kitchen&rsquo;s hours. Breakfast when the first skiers are up, children fed early, a proper dinner once they&rsquo;re down — no reservations, no dressing for the dining room.</p>
          <p>The friction of feeding a big group across three generations and two bedtimes, quietly removed.</p>
          <div className="label">Privé Service</div>
          <div style={{ marginTop: '1.3rem' }}><Link className="arrowlink" href={featured ? chaletHref(featured) : '/chalets/sample'}>Explore Privé Service ›</Link></div>
        </div>
      </div></div></section>

      {/* OUR STORY (geometric) */}
      <section className="story">
        <div className="wrap"><div className="stage">
          <div className="im reveal px"><div className="pxi" style={{ backgroundImage: 'url(/images/founders.jpg)', backgroundPosition: '42% center' }} /></div>
          <div className="panel reveal">
            <span className="eyebrow">Our story</span>
            <h2>Two founders, one standard</h2>
            <p>Vertige was founded by Oli Dannatt and Ben Wood — one who learned the mountain the only way you can, as an instructor in Verbier; the other who builds the brand, the platform and the concierge systems that make a service genuinely seamless rather than merely promised.</p>
            <p className="quote">&ldquo;We&rsquo;d rather have tens of clients who come back every year than hundreds who book once.&rdquo;</p>
            <div className="sig">Oli &amp; Ben</div>
            <a className="arrowlink" href="#">Meet Oli &amp; Ben ›</a>
          </div>
        </div></div>
      </section>

      <div className="fadewrap2">
        {/* YOUR HOME IN THE MOUNTAINS */}
        <section><div className="wrap">
          <div className="gold-head reveal">
            <h2>Your <em>home</em> in the mountains</h2>
            <p>Chalets with private pools and hot tubs, layouts built for families, and homes for groups and celebrations — curated to match the week you want. <Link href="/chalets">Discover our chalet collections</Link></p>
          </div>
          <div className="ctiles">
            {([
              ['Ski-in Ski-out', 'Ski right to your door.', '/images/chalets/ext-10.webp'],
              ['Wellness', 'Soak tired legs after a day on the slopes.', '/images/chalets/well-01.webp'],
              ['Families & groups', 'Space enough for everyone under one roof.', '/images/chalets/liv-11.webp'],
              ['Chef’s table', 'Built around a private chef and a long table.', '/images/chalets/din-01.webp'],
            ] as const).map(([title, sub, img]) => (
              <Link key={title} className="ctile reveal" href="/chalets">
                <div className="im" style={{ backgroundImage: `url(${img})` }} />
                <h3>{title}</h3><p>{sub}</p>
              </Link>
            ))}
          </div>
        </div></section>

        {/* JOURNAL */}
        <section><div className="wrap">
          <div className="jhead reveal"><h2>Journal &amp;<br /><em>inspiration</em></h2><Link className="btn" href="/journal">See all articles</Link></div>
          <div className="jrow">
            {([
              ['Why a chalet, not a hotel', 'September 21, 2026', '/images/09.jpg', '/journal/journal-chalet-vs-hotel'],
              ['Verbier or Zermatt? Two Swiss icons compared', 'September 12, 2026', '/images/03.jpg', '/journal/g4-verbier-vs-zermatt'],
              ['The multi-generational ski week, done properly', 'September 4, 2026', '/images/16.jpg', '/journal/journal-multi-generational-ski-holidays'],
            ] as const).map(([title, date, img, href]) => (
              <Link key={href} className="jart reveal" href={href}>
                <h3>{title}</h3><div className="date">{date}</div>
                <div className="im" style={{ backgroundImage: `url(${img})` }}><span className="va">View article →</span></div>
              </Link>
            ))}
          </div>
        </div></section>
      </div>
    </div>
  )
}
