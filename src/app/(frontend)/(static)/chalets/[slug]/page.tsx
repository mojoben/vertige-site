import React from 'react'
import Link from 'next/link'
import { fetchPortalProperties, fetchPortalAvailability, fetchPortalContent, type PortalContent } from '@/lib/portal-client'
import { SITE } from '@/lib/site'
import { Pt, PointIcon, AmenIcon } from '@/components/ChaletIcons'
import {
  SubnavSpy, BookingCard, Availability, ReserveForm, ScheduleCall, Gallery,
} from '@/components/ChaletDetailBits'
import { mockWeeks, type Week } from '@/lib/weeks'

// Chalet detail — faithful port of vertige-proto-chalet-detail-alt.html ("the
// current, most-developed detail page", 02 §1). Live portal chalets render
// their own name/resort/stats/pricing/gallery + REAL per-week availability
// from the portal's quote-week engine.
//
// Editorial sections (overview, key features, amenities, interior, bedrooms,
// exterior, location) come from the portal's content pipeline via
// web.property_content_v — APPROVED content only. Rendering rule: a chalet
// WITH approved content shows only the sections its content truthfully fills
// (missing sections are omitted, never sample-padded — the no-false-
// representation rule); a chalet with NO approved content keeps the full
// prototype sample as the interim placeholder. Unknown slugs (incl.
// /chalets/sample) render the full prototype sample.

export const dynamic = 'force-dynamic'

const money = (sym: string, n: number) => `${sym}${n.toLocaleString('en-GB')}`

// Headlines carry one *emphasised* segment (registry contract) → <em>.
function emify(s: string): React.ReactNode {
  const parts = s.split('*')
  if (parts.length < 3) return s
  return <>{parts[0]}<em>{parts[1]}</em>{parts.slice(2).join('*')}</>
}

// Location-spec icons keyed by the registry's slot keys (prototype linework).
const LOC_ICONS: Record<string, React.ReactNode> = {
  lift: <path d="M3 5l18-2M8 8l1.5 4h5L19 8M7 12h10v6H7zM12 12v6" />,
  village: <><path d="M10 3h4l1 4a3 3 0 0 1-6 0z" /><path d="M12 11v9M9 21h6" /></>,
  restaurant: <><path d="M7 3v7a2 2 0 0 0 4 0V3M9 10v11" /><path d="M16 3c-1.4 0-2.2 1.6-2.2 4S15 11 16 11v10" /></>,
  airport: <path d="M21 15l-8-3V5.5a1.5 1.5 0 0 0-3 0V12l-8 3v2l8-2v3l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-3z" />,
  transfers: <path d="M4 6h16M12 6v3M6 12h11l2.5 4H4zM12 16v3M9 22h6" />,
  piste: <path d="M3 19l6-9 3.5 4.5L15 11l6 8z" />,
}

// The prototype's sample chalet (Chalet Aiguille, Verbier).
const SAMPLE = {
  name: 'Chalet Aiguille',
  resort: 'Verbier',
  country: 'Switzerland',
  sym: '£',
  guests: 12,
  beds: 6,
  baths: 6,
  from: 58000,
  to: 110000,
  tier: 'Privé' as const,
  hero: '/images/chalets/ext-01.webp',
  gallery: ['/images/chalets/ext-05.webp', '/images/chalets/liv-02.webp', '/images/chalets/din-01.webp', '/images/chalets/bed-05.webp', '/images/chalets/liv-24.webp', '/images/chalets/well-01.webp', '/images/chalets/bed-10.webp', '/images/chalets/din-03.webp'],
  changeover: 'Sun' as const,
}

export default async function ChaletDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Live portal chalet when the slug matches; the prototype sample otherwise.
  const { properties, live } = await fetchPortalProperties()
  const p = live ? properties.find((x) => x.slug === slug) : undefined

  const c = p
    ? {
        name: p.name,
        resort: p.resort ?? '—',
        country: p.country ?? '—',
        sym: p.currency === 'CHF' ? 'CHF ' : p.currency === 'GBP' ? '£' : '€',
        guests: p.sleeps,
        beds: p.bedrooms,
        baths: p.bathrooms ?? p.bedrooms,
        from: p.weeklyFrom ?? 0,
        to: p.weeklyTo ?? p.weeklyFrom ?? 0,
        tier: p.tier,
        hero: p.images[0]?.url ?? SAMPLE.hero,
        gallery: p.images.length >= 3 ? p.images.map((i) => i.url) : SAMPLE.gallery,
        changeover: (p.changeoverDay === 'sun' ? 'Sun' : 'Sat') as 'Sat' | 'Sun',
      }
    : SAMPLE

  // Approved editorial content (null → interim sample throughout).
  const content: PortalContent | null = p ? await fetchPortalContent(p.slug) : null
  const rooms = content?.rooms?.length ? content.rooms : null
  // Section images: live gallery shots where available, prototype otherwise.
  const gimg = (i: number, fallback: string) => (p && c.gallery[i]) || fallback

  // Weeks: REAL availability + pricing from the portal engine for live
  // chalets (Dec 2026 → mid-Apr 2027 season window); prototype mock otherwise.
  let weeks: Week[] = []
  if (p) {
    const av = await fetchPortalAvailability(p.slug, '2026-12-01', '2027-04-18')
    if (av?.weeks?.length) {
      weeks = av.weeks.map((w) => ({
        s: w.startISO,
        e: w.endISO,
        price: w.price,
        status: !w.available ? 'un' : w.price == null ? 'req' : 'a',
      }))
    }
  }
  if (!weeks.length) weeks = mockWeeks(c.changeover)

  // Chalets without rates yet (portal onboarding in progress) show On request.
  const priced = c.from > 0
  const priceFrom = priced ? money(c.sym, c.from) : 'On request'
  const priceTo = priced ? money(c.sym, c.to) : ''
  const isPrive = c.tier === 'Privé'

  return (
    <div className="cdpage">
      <SubnavSpy />

      {/* HERO */}
      <section className="chero">
        <div className="bg" style={{ backgroundImage: `url(${c.hero})` }} />
        <div className="htitle"><div className="lab">{c.resort} · {c.country}</div><h1>{c.name}</h1></div>
        <div className="statbar"><div className="in">
          <div className="s"><b>{c.guests}</b><span>Guests</span></div>
          <div className="s"><b>{c.beds}</b><span>Bedrooms</span></div>
          <div className="s"><b>{c.baths}</b><span>En suites</span></div>
          {priced
            ? <div className="s price"><span>From</span><b>{priceFrom}</b><span>per week</span></div>
            : <div className="s price"><b>On request</b><span>weekly rate</span></div>}
        </div></div>
      </section>

      {/* SUBNAV */}
      <nav className="subnav"><div className="in">
        <div className="links">
          <a href="#overview" className="on">Overview</a><a href="#keyfeatures">Features</a><a href="#interior">Interior</a><a href="#bedrooms">Bedrooms</a><a href="#exterior">Exterior</a><a href="#location">Location</a><a href="#gallery">Gallery</a><a href="#prices">Availability</a>
        </div>
        <a className="btn rd" href="#letter">Enquire</a>
      </div></nav>

      <div className="fadewrap">
        {/* CHAPTER I — OVERVIEW */}
        <section id="overview"><div className="wrap"><div className="grid2">
          <div className="ov">
            <div className="chapter">Overview</div>
            {content?.overview ? (
              <>
                <h2>{emify(content.overview.headline)}</h2>
                {content.overview.paragraphs.map((para, i) => <p key={i}>{para}</p>)}
              </>
            ) : (
              <>
                <h2>Alpine grandeur, held <em>above the valley</em>.</h2>
                <p>{c.name} blends handcrafted timber and stone with a contemporary sensibility. High ceilings, hand-hewn beams and carefully curated interiors create a refined yet welcoming atmosphere throughout the chalet.</p>
                <p>The double-height sitting room opens directly onto the terrace, letting the mountains take centre stage, while an open fire lends warmth on colder evenings. A formal dining room frames the peaks through floor-to-ceiling glass — a stunning backdrop for memorable meals with family and friends.</p>
                <p>The chalet accommodates {c.guests} guests across {c.beds} en suite bedrooms. The master claims the top floor with its own balcony and panoramic views; the further rooms sit below, each opening to the light.</p>
              </>
            )}
            <div className="clevel top">
              <div className="ic"><span className="dia f" /><span className="dia f" /><span className={`dia${isPrive ? ' f' : ' t'}`} /></div>
              <div><h3>{isPrive ? 'Privé' : 'Reserve'} Service</h3><p>{isPrive ? 'Timeless luxury with a dedicated concierge at your side from the moment you book to the moment you leave — every transfer, reservation and detail handled.' : 'All the essentials for a seamless stay — check-in and check-out managed, transfers arranged, and any additional service organised and billed on request.'}</p><Link className="lm" href="/concierge">Learn more</Link></div>
            </div>
            {(p ? p.exclusive : true) && (
              <div className="clevel">
                <div className="ic" style={{ justifyContent: 'center' }}><span className="circmark">V</span></div>
                <div><h3>A Vertige Exclusive</h3><p>This chalet is only available with Vertige.</p></div>
              </div>
            )}
          </div>
          <BookingCard
            name={c.name} resort={c.resort} country={c.country}
            priceFrom={priceFrom} priceTo={priceTo} sym={c.sym}
            guests={c.guests} beds={c.beds} baths={c.baths}
            weeks={weeks} slug={slug} phone={SITE.phone} img={c.hero}
          />
        </div></div></section>

        {/* KEY FEATURES */}
        {(content ? !!content.keyFeatures?.length || !!content.amenities?.length : true) && (
        <section id="keyfeatures"><div className="wrap">
          <h2 className="kf-title">Key features</h2>
          {content?.keyFeatures?.length ? (
            <div className="kf">
              {content.keyFeatures.map((f) => (
                <div key={f.label} className="k"><PointIcon label={f.label} className="" /><span>{f.label}{f.sub && <small>{f.sub}</small>}</span></div>
              ))}
            </div>
          ) : !content && (
            <div className="kf">
              <div className="k"><svg viewBox="0 0 24 24"><path d="M4 17l14-4M4 15l14-4" /><path d="M15 6l1 3M18 5l1 3" /><path d="M3 20h6l1-2" /></svg><span>Ski-in / ski-out<small>{c.resort} side</small></span></div>
              <div className="k"><svg viewBox="0 0 24 24"><path d="M3 14h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" /><path d="M6 14V8a2 2 0 0 1 2-2h1" /><path d="M9 4v2M13 3c0 1-1 1-1 2s1 1 1 2M16 3c0 1-1 1-1 2s1 1 1 2" /></svg><span>Outdoor hot tub</span></div>
              <div className="k"><svg viewBox="0 0 24 24"><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /><path d="M8 21v-5a4 4 0 0 1 8 0v5" /><path d="M12 12c1-1 1-2 0-3s-1-2 0-3" /></svg><span>Open fireplace</span></div>
              <div className="k"><svg viewBox="0 0 24 24"><path d="M4 18h16M4 14h16" /><path d="M8 10c1-1 1-2 0-3M12 10c1-1 1-2 0-3M16 10c1-1 1-2 0-3" /></svg><span>Underfloor heating</span></div>
              <div className="k"><svg viewBox="0 0 24 24"><path d="M8 3v13M11 3v13" /><path d="M6 20l14-3" /><path d="M8 16l-2 4M11 16l1 3" /></svg><span>Ski room<small>Heated, private</small></span></div>
              <div className="k"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M12 12v4M8 20c0-2 2-3 4-3s4 1 4 3" /></svg><span>Hammam &amp; sauna</span></div>
              <div className="k"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="1" /><path d="M7 21h10M9 17v4M15 17v4" /></svg><span>Cinema room</span></div>
              <div className="k"><svg viewBox="0 0 24 24"><path d="M7 3v6a5 5 0 0 0 10 0V3" /><path d="M12 14v5M8 21h8" /></svg><span>Wine cellar</span></div>
            </div>
          )}
          {(content ? !!content.amenities?.length : true) && (
          <details className="amtoggle">
            <summary>View full features &amp; amenities <span className="pm">+</span></summary>
            <div className="amwrap">
              {(content?.amenities?.map((g) => ({ ic: g.icon, n: g.name, items: g.items })) ?? [
                { ic: 'living', n: 'Living room', items: ['Double-height ceiling', 'Open fireplace', '5 armchairs', 'Balcony access'] },
                { ic: 'dining', n: 'Dining room', items: ['Table, 14 seats', 'Wine display'] },
                { ic: 'kitchen', n: 'Kitchen', items: ['Range oven', 'Wine fridge', 'Coffee machine', 'Full appliances'] },
                { ic: 'cinema', n: 'Cinema room', items: ['Projector', '8 seats', 'Surround sound'] },
                { ic: 'bath', n: 'Master bathroom', items: ['Bathtub', 'Walk-in shower', 'Double basin'] },
                { ic: 'bath', n: 'Bathrooms 2–6', items: ['Bath or shower', 'Basin', 'WC'] },
                { ic: 'spa', n: 'Wellness floor', items: ['Hammam', 'Sauna', 'Steam room', 'Massage room'] },
                { ic: 'ski', n: 'Ski room', items: ['Boot warmers', 'Private ski storage'] },
                { ic: 'laundry', n: 'Utility', items: ['Washer & dryer', 'Drying room'] },
              ]).map((r) => (
                <div key={r.n} className="ra">
                  <div className="ra-h"><AmenIcon k={r.ic} /><h4>{r.n}</h4></div>
                  <div className="ra-items">{r.items.map((i) => <span key={i}>{i}</span>)}</div>
                </div>
              ))}
            </div>
          </details>
          )}
        </div></section>
        )}

        {/* CHAPTER II — INTERIOR */}
        {(content ? !!content.interior : true) && (
        <section id="interior"><div className="wrap"><div className="grid2">
          <div className="plate">
            <div className="ph"><div className="im" style={{ backgroundImage: `url(${gimg(1, '/images/chalets/liv-08.webp')})` }} /></div>
          </div>
          <div className="chtx">
            <div className="chapter">Interior</div>
            {content?.interior ? (
              <>
                <h2>{emify(content.interior.headline)}</h2>
                <p>{content.interior.paragraph}</p>
                <div className="feats">
                  {content.interior.groups.map((g) => (
                    <div key={g.title}><h4>{g.title}</h4><ul>{g.points.map((l) => <li key={l} className="hasic"><PointIcon label={l} />{l}</li>)}</ul></div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2>Living spaces warmed <em>by the fire</em>.</h2>
                <p>Six interconnected spaces flow between the double-height salon and the terrace. An open fire anchors the room; the dining room frames the mountains through floor-to-ceiling glass; the wellness floor and cinema sit below, warm underfoot.</p>
                <div className="feats">
                  <div><h4>Living</h4><ul>{['Formal dining · 14', 'Sitting room with hearth', "Chef's kitchen", 'Cinema room'].map((l) => <li key={l} className="hasic"><PointIcon label={l} />{l}</li>)}</ul></div>
                  <div><h4>Features</h4><ul>{['Open fireplace', 'Double-height glass', 'Underfloor heating', 'Wine cellar'].map((l) => <li key={l} className="hasic"><PointIcon label={l} />{l}</li>)}</ul></div>
                </div>
              </>
            )}
          </div>
        </div></div></section>
        )}

        {/* CHAPTER III — BEDROOMS */}
        {(content ? !!rooms : true) && (
        <section id="bedrooms"><div className="wrap">
          <div className="centerhead">
            <div className="chapter c">Bedrooms</div>
            <h2>{c.beds} suites, <em>{c.beds} aspects</em> on the mountains.</h2>
            <div className="rule-c" />
            <p>{content?.bedroomsIntro ?? 'Every bedroom is en suite and oriented to the light. The master claims the top floor with a private balcony above the pistes.'}</p>
          </div>
          {rooms ? (
            <>
              <div className="suitefeat">
                <div className="im" style={{ backgroundImage: `url(${gimg(3, '/images/chalets/bed-04.webp')})` }} />
                <div className="tx">
                  <h3>{rooms[0].name}</h3>
                  {rooms[0].description && <p className="d">{rooms[0].description}</p>}
                  <div className="slist">{rooms[0].points.map((l) => <Pt key={l} label={l} />)}</div>
                </div>
              </div>
              {rooms.length > 1 && (
                <div className="suiterow">
                  {rooms.slice(1).map((r) => (
                    <div key={r.name} className="scard"><h3>{r.name}</h3><div className="slist">{r.points.map((l) => <Pt key={l} label={l} />)}</div></div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="suitefeat">
                <div className="im" style={{ backgroundImage: 'url(/images/chalets/bed-04.webp)' }} />
                <div className="tx">
                  <h3>Bedroom One</h3>
                  <p className="d">A double bedroom opening to a private balcony — the pistes below, the peaks stretching to the horizon.</p>
                  <div className="slist">{['Super-king', 'En suite', 'Dressing room', 'Private balcony', 'Open fire', 'Piste view'].map((l) => <Pt key={l} label={l} />)}</div>
                </div>
              </div>
              <div className="suiterow">
                <div className="scard"><h3>Bedroom Two</h3><div className="slist">{['Super-king', 'En suite', 'Rain shower', 'Balcony'].map((l) => <Pt key={l} label={l} />)}</div></div>
                <div className="scard"><h3>Bedroom Three</h3><div className="slist">{['King', 'En suite', 'Bath & shower', 'Mountain view'].map((l) => <Pt key={l} label={l} />)}</div></div>
                <div className="scard"><h3>Bedroom Four</h3><div className="slist">{['Twin / double', 'En suite', 'Freestanding bath', 'Terrace'].map((l) => <Pt key={l} label={l} />)}</div></div>
                <div className="scard"><h3>Bedroom Five</h3><div className="slist">{['Bunk room', 'En suite', 'Shower', 'For children'].map((l) => <Pt key={l} label={l} />)}</div></div>
              </div>
            </>
          )}
        </div></section>
        )}
      </div>

      {/* CHAPTER IV — EXTERIOR */}
      {(content ? !!content.exterior : true) && (
      <section className="exhero" id="exterior">
        <div className="bg" style={{ backgroundImage: `url(${gimg(2, '/images/chalets/liv-19.webp')})` }} />
        <div className="tx"><div className="expanel">
          <div className="chapter">Exterior</div>
          {content?.exterior ? (
            <>
              <h2>{emify(content.exterior.headline)}</h2>
              <p>{content.exterior.paragraph}</p>
              <div className="exfeats">
                {content.exterior.points.map((l) => <span key={l}><PointIcon label={l} className="" />{l}</span>)}
              </div>
            </>
          ) : (
            <>
              <h2>Where the terrace <em>meets the sky</em>.</h2>
              <p>A south-facing terrace runs the width of the chalet — sun through the afternoon, the pistes dropping away below, and space to gather once the lifts have closed.</p>
              <div className="exfeats">
                <span><svg viewBox="0 0 24 24"><path d="M4 10h16v10H4zM4 14h16M9 14v6M15 14v6M6 10V6l6-3 6 3v4" /></svg>South-facing terrace</span>
                <span><svg viewBox="0 0 24 24"><path d="M4 13h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM9 6c0 1-1 1-1 2s1 1 1 2M13 5c0 1-1 1-1 2s1 1 1 2M6 20l-1 2M18 20l1 2" /></svg>Outdoor hot tub</span>
                <span><svg viewBox="0 0 24 24"><path d="M12 3c2 3 4 4 4 7a4 4 0 0 1-8 0c0-1.2.6-2.2 1.3-2.8" /></svg>Firepit &amp; lounge</span>
                <span><svg viewBox="0 0 24 24"><path d="M5 18l14-5M8 5v10M11 4v10M8 15l1 3M11 14l1 3" /></svg>Ski-in / ski-out</span>
              </div>
            </>
          )}
        </div></div>
      </section>
      )}

      {/* SERVICES */}
      <section className="household" id="services"><div className="wrap"><div className="grid2">
        <div>
          <div className="chapter">Services</div>
          <h2>Included <em>services</em>.</h2>
          <p className="intro-p">Every Vertige stay includes a core of hands-on service; the Privé Collection adds a dedicated concierge and private chef, with further support available on request.</p>
        </div>
        <div className="svc">
          <div className="svcgroup"><p className="gh">In-home services</p><div className="svclist"><div className="s"><span className="tk">✓</span>Ski pass delivery</div><div className="s"><span className="tk">✓</span>Welcome hamper &amp; first-day basics</div></div></div>
          <div className="svcgroup"><p className="gh">Privé Collection services</p><div className="svclist"><div className="s"><span className="tk">✓</span>Dedicated concierge, before &amp; during</div><div className="s"><span className="tk">✓</span>Private chef (catered basis)</div><div className="s"><span className="tk">✓</span>Daily housekeeping</div><div className="s"><span className="tk">✓</span>Personalised welcome</div><div className="s"><span className="tk">✓</span>Airport transfers</div><div className="s"><span className="tk">✓</span>Restaurant reservations</div></div></div>
        </div>
      </div></div></section>

      <div className="fadewrap2">
        {/* ADVISOR CTA */}
        <section className="plancta"><div className="wrap"><div className="pcta-in">
          <div className="pcta-tx">
            <div className="chapter">Plan your stay</div>
            <h2>Have questions about <em>{c.name}</em>?</h2>
            <p>Every stay with Vertige includes hands-on support from our passionate, industry-leading team. Let us guide you through every step of your booking — from ski instructors to childcare, the finest tables to the moments that stay with you — and plan an experience you&rsquo;ll remember long after you&rsquo;ve left the mountain.</p>
            <ScheduleCall slug={slug} name={c.name} />
          </div>
          <div className="pcta-im" style={{ backgroundImage: 'url(/images/cta-man.jpg)' }} />
        </div></div></section>

        {/* LOCATION */}
        <section id="location"><div className="wrap"><div className="locgrid">
          <div>
            <h2>Location</h2>
            <p>{content?.locationIntro ?? `A quiet position in ${c.resort} — skis on at the door, the village a short walk below.`}</p>
            {content?.locationSpecs?.length ? (
              <div className="locspecs">
                {content.locationSpecs.map((s) => (
                  <div key={s.key}><svg className="licn" viewBox="0 0 24 24">{LOC_ICONS[s.key] ?? LOC_ICONS.piste}</svg><div className="sl">{s.label}</div><div className="sv">{s.value}</div></div>
                ))}
              </div>
            ) : !content && (
              <div className="locspecs">
                <div><svg className="licn" viewBox="0 0 24 24">{LOC_ICONS.lift}</svg><div className="sl">Nearest lift</div><div className="sv">3-min walk</div></div>
                <div><svg className="licn" viewBox="0 0 24 24">{LOC_ICONS.village}</svg><div className="sl">Village centre</div><div className="sv">8-min walk · 3-min drive</div></div>
                <div><svg className="licn" viewBox="0 0 24 24">{LOC_ICONS.restaurant}</svg><div className="sl">Nearest restaurant</div><div className="sv">5-min walk</div></div>
                <div><svg className="licn" viewBox="0 0 24 24">{LOC_ICONS.airport}</svg><div className="sl">Nearest airport</div><div className="sv">~2h drive</div></div>
                <div><svg className="licn" viewBox="0 0 24 24">{LOC_ICONS.transfers}</svg><div className="sl">Transfers</div><div className="sv">Arranged by Vertige</div></div>
                <div><svg className="licn" viewBox="0 0 24 24">{LOC_ICONS.piste}</svg><div className="sl">Nearest piste</div><div className="sv">On the doorstep</div></div>
              </div>
            )}
          </div>
          <div className="mapcard">
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY && p?.latitude != null && p?.longitude != null ? (
              <iframe
                className="gembed"
                title={`Map — ${c.name}`}
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY}&q=${p.latitude},${p.longitude}&zoom=13&maptype=roadmap`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="mk">✦</div>
            )}
            <a
              className="gmap"
              href={`https://www.google.com/maps/search/?api=1&query=${
                p?.latitude != null && p?.longitude != null
                  ? `${p.latitude},${p.longitude}`
                  : encodeURIComponent(`${c.name}, ${c.resort}, ${c.country}`)
              }`}
              target="_blank"
              rel="noopener"
            >Open in Google Maps ↗</a>
          </div>
        </div></div></section>

        {/* GALLERY */}
        <section id="gallery"><div className="wrap">
          <Gallery images={c.gallery} name={c.name} />
        </div></section>

        {/* PRICES & AVAILABILITY */}
        <section id="prices"><div className="wrap">
          <Availability weeks={weeks} sym={c.sym} />
        </div></section>

        {/* RESERVE */}
        <section className="corr" id="letter"><div className="wrap"><div className="grid2">
          <div>
            <h2>Reserve <em>{c.name}</em></h2>
            <p className="lead">Peak weeks (Christmas, New Year, February half-term) release each spring and are held on a first-enquiry basis. Complete the form opposite, or call us on the number below, and our team will arrange your stay.</p>
            <div className="speccard">
              <div className="sc-lab">Speak to a specialist</div>
              <a className="sc-ph" href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}>{SITE.phone}</a>
              <div className="sc-hrs">Every day, 8am–midnight</div>
              <div className="sc-links">
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </div>
            </div>
          </div>
          <ReserveForm slug={slug} name={c.name} />
        </div></div></section>
      </div>

      {/* BOOKING CONDITIONS */}
      <section id="conditions"><div className="wrap">
        <div className="chapter">Booking conditions</div>
        <h2>Good to <em>know</em>.</h2>
        <div className="acc">
          <details><summary>How does the booking process work? <span className="pm">+</span></summary><div className="ac"><p>Choose a chalet, then speak to your Vertige advisor. Once we confirm availability, you confirm the booking and its terms. A deposit secures it; from there the concierge builds the week around you.</p></div></details>
          <details><summary>How do I pay for my stay? <span className="pm">+</span></summary><div className="ac"><p>A deposit is due within three business days of confirming. The balance is due 84 days before the start of your stay.</p></div></details>
          <details><summary>Will I be asked for a security deposit? <span className="pm">+</span></summary><div className="ac"><p>Yes — a refundable security deposit, specified in your agreement, held against any damage and returned after a full inspection.</p></div></details>
          <details><summary>Early check-in or late check-out? <span className="pm">+</span></summary><div className="ac"><p>Standard check-in is 4pm and check-out 10am. Earlier or later may be possible depending on the week — ask your advisor in advance.</p></div></details>
          <details><summary>What are the cancellation terms? <span className="pm">+</span></summary><div className="ac"><p>Up to 84 days before arrival: 25% of the total. Between 83 days and check-in: 100%. Speak to your advisor for the full terms.</p></div></details>
        </div>
      </div></section>

      {/* APPENDIX — SIGNATURE RESIDENCES */}
      <section className="appendix"><div className="wrap">
        <div className="ah">
          <div><h2>Signature residences.</h2><p className="sub">Four chalets singled out this season by our house curators — offered strictly by invitation.</p></div>
        </div>
        <div className="acards">
          {(live && properties.length > 1
            ? properties.filter((x) => x.slug !== slug).slice(0, 4).map((x) => ({
                href: `/chalets/${x.slug}`, img: x.images[0]?.url ?? '/images/chalets/ext-02.webp',
                tag: x.resort ?? '—', name: x.name, meta: `${x.sleeps} guests · ${x.bedrooms} beds`,
                pr: x.weeklyFrom ? `${x.currency === 'CHF' ? 'CHF ' : '€'}${Math.round(x.weeklyFrom / 1000)}k` : '—',
              }))
            : [
                { href: '/chalets/sample', img: '/images/chalets/ext-02.webp', tag: "Val d'Isère", name: 'Chalet Bellevarde', meta: '14 guests · 7 beds', pr: '£59k' },
                { href: '/chalets/sample', img: '/images/chalets/ext-04.webp', tag: 'Zermatt', name: 'Chalet Cervin', meta: '10 guests · 5 beds', pr: '£30k' },
                { href: '/chalets/sample', img: '/images/chalets/ext-03.webp', tag: 'Lech', name: 'Chalet Arlberg', meta: '12 guests · 6 beds', pr: '£25k' },
                { href: '/chalets/sample', img: '/images/chalets/ext-08.webp', tag: 'Cortina', name: 'Chalet Ampezzo', meta: '12 guests · 6 beds', pr: '£40k' },
              ]
          ).map((a) => (
            <Link key={a.name} className="acard" href={a.href}>
              <div className="im" style={{ backgroundImage: `url(${a.img})` }} />
              <span className="tag">{a.tag}</span>
              <div className="b"><h3>{a.name}</h3><div className="mt"><span>{a.meta}</span><span>{a.pr}</span></div></div>
            </Link>
          ))}
        </div>
      </div></section>
    </div>
  )
}
