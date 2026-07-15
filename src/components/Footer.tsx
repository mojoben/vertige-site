import Link from 'next/link'
import { SITE } from '@/lib/site'

// Dark footer — ported from the flagship prototype. Links normalised to real
// routes site-wide (HANDOFF 07 "Footer link tidy"). Newsletter input is a
// front-end mock until the enquiry pipeline lands (enquiry_type: "newsletter").
export function Footer() {
  return (
    <footer className="foot">
      <div className="finner">
        <div className="fleft">
          <div className="ftop">
            <div className="c1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="flogo" src="/images/vertige-logo-white.png" alt="Vertige" />
            </div>
            <div className="c2">
              <div className="flabel">Address</div>
              <div className="fval">London &amp; the Alps<br />Concierge across France,<br />Switzerland, Austria &amp; Italy</div>
            </div>
            <div className="c3">
              <div className="email"><div className="flabel">Email</div><div className="fval">{SITE.email}</div></div>
              <div className="phone"><div className="flabel">Phone</div><div className="fval">{SITE.phone}</div></div>
            </div>
          </div>
          <div className="fbot">
            <div className="fgroup">
              <div className="flabel">Quick Links</div>
              <div className="flist">
                <Link href="/chalets">Chalets</Link>
                <Link href="/sitemap">Destinations</Link>
                <Link href="/concierge">Reserve &amp; Privé</Link>
                <Link href="/journal">The Journal</Link>
                <Link href="/about">Our Story</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
            <div className="fgroup">
              <div className="flabel">Social Media</div>
              <div className="flist">
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">LinkedIn</a>
                <a href="#">YouTube</a>
              </div>
            </div>
          </div>
        </div>
        <div className="fpanel2">
          <div className="fp-top">
            <h3>Begin your ascent with <em>Vertige</em>.</h3>
            <p>Join our private circle for first access to new seasonal collections.</p>
          </div>
          <div className="fp-bot">
            <div className="field"><label>Email</label><input placeholder="" /></div>
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div className="fbottom">
        <span>© 2026 Vertige. All rights reserved.</span>
        <span className="legal">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </span>
      </div>
    </footer>
  )
}
