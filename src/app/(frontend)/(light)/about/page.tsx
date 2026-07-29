import React from 'react'
import Link from 'next/link'

// Our story — faithful port of vertige-proto-about-alt.html (scoped .abpage),
// reworked to the single-founder story (Ben, 2026-07-26: Vertige is founded
// purely by Ben Wood).
// Route: /about (the nav's "Our story" / "Meet the founder" target).

export const metadata = {
  title: 'Our story — Vertige',
  description: 'Vertige is a short, hand-picked collection of the finest chalets across the Alps — every one visited and vetted — founded by Ben Wood.',
}

export default function AboutPage() {
  return (
    <div className="abpage">
      {/* Header in the join-the-portfolio treatment (Ben, 2026-07-14). */}
      <section className="pagehero"><div className="bg" style={{ backgroundImage: 'url(/images/hero.jpg)' }} />
        <div className="wrap">
          <span className="eyebrow">Our story</span>
          <h1>One founder, one <em>standard.</em></h1>
          <p className="sub">A short, hand-picked collection of the finest chalets across the Alps — every one visited and vetted — founded by Ben Wood.</p>
        </div>
      </section>

      {/* Belief statement */}
      <section className="believe"><div className="wrap">
        <div className="eyebrow">§ · What we believe</div>
        <div className="grid">
          <h2>The Alps do not need improving. <em>They need someone paying attention.</em></h2>
          <p className="supp">Vertige is not a directory. It is a short, hand-picked collection of the finest chalets across the Alps — every one visited and vetted — matched to your group and looked after from the first enquiry to the last morning on the mountain.</p>
        </div>
      </div></section>

      {/* Founder */}
      <section className="fdrs"><div className="wrap">
        <div className="fhead">
          <div>
            <div className="eyebrow">§ · The founder</div>
            <h2>One name <em>on the door.</em></h2>
          </div>
          <div className="note">One founder, one obsession: the mountains, and the chalets worth crossing a continent for.</div>
        </div>
        <div className="fgrid">
          <div className="fcard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="fimg"><img src="/images/07.jpg" alt="Ben Wood" /><span className="rn">I</span></div>
            <div className="role">Founder</div>
            <h3>Ben Wood</h3>
            <p>Ben came to skiing later and fell for it completely — for the mountains, and just as hard for the chalets that make a week in them worth taking. A career in brand and design shaped strong opinions about how a stay should look and feel, from the first enquiry to the last morning; the chalets shaped everything else. He visits and vets every property before it joins the collection — if he wouldn&rsquo;t send his own family, it doesn&rsquo;t make the list. He works from London, and he answers his phone.</p>
          </div>
        </div>
      </div></section>

      {/* Founder quote */}
      <section className="fq"><div className="wrap">
        <p>&ldquo;I keep the list short on purpose — short enough that I have skied from, and personally chosen, every chalet on it.&rdquo;</p>
        <div className="att">Ben Wood · Founder of Vertige</div>
      </div></section>

      {/* Timeline */}
      <section className="tl"><div className="wrap">
        <div className="th">
          <div className="eyebrow">§ · Our story</div>
          <h2>From first lift, <em>in three chapters.</em></h2>
        </div>

        <div className="chap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="cim"><img src="/images/13.jpg" alt="The convert" /></div>
          <div className="ctx">
            <div className="yr">The convert</div>
            <h3>Late to snow, all in.</h3>
            <p>Ben found skiing in his thirties and fell hard — for the mountains, and for the handful of chalets that ruined him for ordinary hotels. A career in brand and design left him with firm ideas about how a week away should look, feel and be looked after.</p>
          </div>
        </div>

        <div className="chap rev">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="cim"><img src="/images/16.jpg" alt="The frustration" /></div>
          <div className="ctx">
            <div className="yr">The frustration</div>
            <h3>Sold like spreadsheets.</h3>
            <p>The more winters he booked, the clearer one thing became: the best chalets in the Alps were being sold like spreadsheets, often by people who had never set foot in them. The knowledge that mattered — which house suits which group, which week, which village — never seemed to reach the person paying for it.</p>
          </div>
        </div>

        <div className="chap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="cim"><img src="/images/chalets/ext-05.webp" alt="Today" /></div>
          <div className="ctx">
            <div className="yr">Today</div>
            <h3>One short, hand-picked list.</h3>
            <p>So he built the company he had wanted as a guest: a curated collection of the finest chalets across the Alps — each one chosen by hand, matched to you, and looked after from first enquiry to last morning.</p>
          </div>
        </div>
      </div></section>

      {/* House rules */}
      <section className="hr"><div className="wrap">
        <div className="hh">
          <div className="eyebrow">§ · The unspoken way</div>
          <h2>Four house rules <em>we will not bend.</em></h2>
        </div>
        <div className="hrgrid">
          <div className="rule"><div className="rn">I</div><div><h3>A short list, on purpose</h3><p>We would rather represent thirty chalets we know inside out than three hundred we don&rsquo;t. Curation is the whole job — a hand-picked collection, never a directory.</p></div></div>
          <div className="rule"><div className="rn">II</div><div><h3>We&rsquo;ve been there</h3><p>We don&rsquo;t list a chalet we haven&rsquo;t visited and vetted. And if a house isn&rsquo;t right for your group, we&rsquo;ll say so — and point you to one that is.</p></div></div>
          <div className="rule"><div className="rn">III</div><div><h3>People, not portals</h3><p>From your first enquiry to the last morning, you deal with us and a small team — not a call centre, not a ticket, not a handover.</p></div></div>
          <div className="rule"><div className="rn">IV</div><div><h3>On your side of the table</h3><p>We work for you, not the chalet. Our job is honest guidance and a week that lands exactly the way you hoped it would.</p></div></div>
        </div>
      </div></section>

      {/* Stats */}
      <section className="stats"><div className="wrap">
        <div className="st"><b>40+</b><span>Chalets in the collection</span></div>
        <div className="st"><b>04</b><span>Alpine countries</span></div>
        <div className="st"><b>14</b><span>Resorts we know well</span></div>
        <div className="st"><b>9 in 10</b><span>Guests who return</span></div>
      </div></section>

      {/* Closing */}
      <section className="close"><div className="wrap">
        <div className="rule-c" />
        <p>&ldquo;If you have read this far, you already know how I feel about the mountains. Write to us — a real person, every time — and we answer, always, within the day.&rdquo;</p>
        <div className="att">Ben</div>
        <div className="row">
          <Link className="btn rose" href="/contact">Speak to the bureau →</Link>
          <Link className="btn ghost" href="/chalets">See the collection</Link>
        </div>
      </div></section>
    </div>
  )
}
