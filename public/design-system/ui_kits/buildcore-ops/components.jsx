// Components.jsx — BuildCore Ops marketing site (revised, field-focused)
// All visual decisions follow ../../colors_and_type.css.
// NOTE: No real builder names appear anywhere in copy or imagery on this page.

const { useState } = React;
// Icon URL resolver. In standalone-bundled builds, icons are inlined into
// window.__resources keyed by their lucide name. In the source/dev build we
// fall back to the unpkg CDN.
const I = (n) => (typeof window !== 'undefined' && window.__resources && window.__resources[n]) || `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;

// ─────────────────────────────────────────────────────────────
// Site header — sticky, single row
// ─────────────────────────────────────────────────────────────
function SiteHeader() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(250,250,247,0.92)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid var(--bc-line)',
    }}>
      <div className="bc-header-row" style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 32px',
        height: 72, display: 'flex', alignItems: 'center', gap: 32,
      }}>
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="BuildCore home"
          style={{ display:'flex', alignItems:'center', gap: 10, textDecoration: 'none' }}
        >
          <div style={{ width: 28, height: 22, background: 'var(--bc-orange)', clipPath: 'polygon(0 100%, 0 0, 70% 0, 100% 100%)' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 22, letterSpacing: '-0.03em', color: 'var(--bc-ink)',
          }}>BuildCore</span>
        </a>
        <nav className="bc-nav" style={{ display: 'flex', gap: 28, marginLeft: 24 }}>
          {[
            { label: 'What it does', href: '#what' },
            { label: 'A CM\u2019s day', href: '#day' },
            { label: 'Get access',    href: '#get-access' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 15,
              color: 'var(--bc-ink-2)', textDecoration: 'none',
            }}>{l.label}</a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href={CONDENSER_URL} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
            color: 'var(--bc-ink-2)', textDecoration: 'none',
            textTransform: 'uppercase', letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}>Log in</a>
          <PrimaryCTA size="sm">Clock In</PrimaryCTA>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Wired destinations — single source of truth
// ─────────────────────────────────────────────────────────────
// Clock In now routes to the in-project Condenser app preview.
// When we ship the desktop/web Condenser, swap this for the
// production URL (was: https://condenser-app-production.up.railway.app/).
const CONDENSER_URL = '../../pages/The Condenser App.html';
const CONTACT_EMAIL = 'hello@buildcore.io';

// ─────────────────────────────────────────────────────────────
// Primary / secondary CTAs (stamped buttons)
// ─────────────────────────────────────────────────────────────
function PrimaryCTA({ children, size = 'lg', icon = 'arrow-right', href = CONDENSER_URL, external = true }) {
  const h = size === 'sm' ? 40 : 60;
  const fs = size === 'sm' ? 14 : 18;
  const shadow = size === 'sm' ? '2px 2px 0 0 var(--bc-ink)' : '4px 4px 0 0 var(--bc-ink)';
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      height: h, padding: '0 24px',
      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: fs,
      background: 'var(--bc-orange)', color: 'var(--bc-paper)',
      border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
      textDecoration: 'none', boxShadow: shadow,
      transition: 'transform 100ms var(--ease-out), box-shadow 100ms var(--ease-out), background 160ms var(--ease-out)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bc-orange-press)'}
    onMouseLeave={e => e.currentTarget.style.background = 'var(--bc-orange)'}
    onMouseDown={e => { e.currentTarget.style.transform = 'translate(' + (size==='sm'?2:4) + 'px,' + (size==='sm'?2:4) + 'px)'; e.currentTarget.style.boxShadow = '0 0 0 0 var(--bc-ink)'; }}
    onMouseUp={e =>   { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = shadow; }}
    >{children}<img src={I(icon)} width={size==='sm'?14:20} height={size==='sm'?14:20} alt="" style={{filter:'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'}} /></a>
  );
}
function SecondaryCTA({ children, size = 'lg', href = '#', external = false }) {
  const h = size === 'sm' ? 40 : 60;
  const fs = size === 'sm' ? 14 : 17;
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: h, padding: '0 22px',
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: fs,
      background: 'var(--bc-paper)', color: 'var(--bc-ink)',
      border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
      textDecoration: 'none',
    }}>{children}</a>
  );
}

// ─────────────────────────────────────────────────────────────
// Section primitives
// ─────────────────────────────────────────────────────────────
function Section({ children, bg, pad = 'lg', id }) {
  return (
    <section id={id} style={{
      background: bg || 'var(--bc-paper)',
      padding: pad === 'lg' ? '96px 32px' : '56px 32px',
      borderBottom: '1.5px solid var(--bc-line)',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>{children}</div>
    </section>
  );
}
function Eyebrow({ children, color }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: color || 'var(--bc-orange)',
      display: 'inline-flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ width: 18, height: 2, background: 'currentColor' }} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — iPhone mockup on the right, "Clock In" primary CTA
// ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Section pad="lg">
      <div className="bc-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
        <div>
          <Eyebrow>For residential construction managers</Eyebrow>
          <h1 className="bc-hero-headline" style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 80, lineHeight: 0.92, letterSpacing: '-0.035em',
            margin: '20px 0 0', color: 'var(--bc-ink)', textWrap: 'balance',
          }}>
            Walk it.<br />
            Log it.<br />
            <span style={{ color: 'var(--bc-orange)' }}>Close it out.</span>
          </h1>
          <p className="bc-hero-subhead" style={{
            fontFamily: 'var(--font-body)', fontSize: 20, lineHeight: 1.5,
            color: 'var(--bc-ink-2)', maxWidth: 540, margin: '24px 0 0',
            textWrap: 'pretty',
          }}>
            Punch lists, daily reports, and trade comms — one app you can actually use
            standing in a half-finished garage with one glove off.
          </p>
          <div className="bc-hero-ctas" style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center' }}>
            <PrimaryCTA icon="arrow-right">Clock In</PrimaryCTA>
            <SecondaryCTA href="#day">See it run a walk</SecondaryCTA>
          </div>
          <p className="bc-hero-note" style={{
            marginTop: 28, maxWidth: 520,
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: 'var(--bc-ink-3)', lineHeight: 1.6,
          }}>
            Built by a working CM · in active use on residential jobsites · 60-day trial
          </p>
        </div>
        <div className="bc-phone-wrap" style={{ display:'flex', justifyContent:'center' }}>
          <PhoneMockup />
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Phone mockup — INTERACTIVE version is in phone.jsx, which assigns
// window.PhoneMockup after this script loads. Hero references PhoneMockup
// as a global; do not re-declare it here.
// ─────────────────────────────────────────────────────────────

// (PhoneMockup, SegOn, SegOff, Ticket, Stamp, Pill — see ./phone.jsx)

// ─────────────────────────────────────────────────────────────
// "What it does" — 4 plain-language capability blocks
// ─────────────────────────────────────────────────────────────
function WhatItDoes() {
  const items = [
    { icon:'mic',
      h: 'Capture a punch in 10 seconds',
      b: 'Tap, talk, walk away. Photo and voice get the address, trade, and timestamp attached for you — no typing, no folder-naming, no spreadsheet.' },
    { icon:'send',
      h: 'Send it to the trade. One tap.',
      b: 'Their phone gets the photo, the address, the door code, and the due date. You don\u2019t have to chase them in a group text.' },
    { icon:'check-circle',
      h: 'Close it out from the doorway.',
      b: 'Inspect, snap a closeout photo, sign it. Done before you walk to the next house. Buyer sees a clean punch list at handoff.' },
    { icon:'file-text',
      h: 'Daily report writes itself.',
      b: 'Pulls from punches closed, trades on site, and walks logged. Filed before your coffee\u2019s gone. Exportable for warranty and legal.' },
  ];
  return (
    <Section id="what">
      <Eyebrow>What it does</Eyebrow>
      <h2 className="bc-section-h2" style={{
        fontFamily:'var(--font-display)', fontWeight:900,
        fontSize: 48, letterSpacing:'-0.03em', lineHeight: 1,
        margin: '18px 0 12px', color:'var(--bc-ink)', maxWidth: 760, textWrap:'balance',
      }}>
        Four things. Done before lunch.
      </h2>
      <p style={{ fontSize: 18, color:'var(--bc-ink-2)', maxWidth: 640, margin: 0 }}>
        BuildCore replaces the spreadsheets, sticky notes, and group texts that run most jobsites today.
        It doesn\u2019t replace your judgment. It just stops you from typing.
      </p>
      <div className="bc-features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap: 18, marginTop: 48 }}>
        {items.map(it => (
          <div key={it.h} className="bc-feature-card" style={{
            background: 'var(--bc-paper)',
            border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-4)',
            padding: 26, display: 'flex', gap: 18, alignItems:'flex-start',
            boxShadow: '4px 4px 0 0 var(--bc-ink)',
          }}>
            <div style={{
              width: 56, height: 56, flexShrink: 0,
              border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
              background: 'var(--bc-orange-tint)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={I(it.icon)} width={28} height={28} alt="" style={{filter:'invert(33%) sepia(89%) saturate(395%) hue-rotate(346deg) brightness(91%) contrast(82%)'}}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize: 22, letterSpacing:'-0.02em', margin: 0, lineHeight: 1.15 }}>{it.h}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--bc-ink-2)', margin: '8px 0 0', textWrap:'pretty' }}>{it.b}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// "A CM's day" — vertical timeline showing the app in use
// ─────────────────────────────────────────────────────────────
function DayInTheLife() {
  const steps = [
    { t: '6:30 am', h: 'Coffee. Open the app.',
      b: 'See yesterday\u2019s open punches sorted by address. Two are late. You know what today looks like before you finish the cup.' },
    { t: '7:30 am', h: 'Pre-walk 14 Sycamore Ln.',
      b: 'Voice-capture 9 punches as you walk. Trade auto-tags. Photos auto-attach. You never stop moving.' },
    { t: '10:00 am', h: 'Trade pulls up.',
      b: 'They already have the photo, the address, the door code, and the due date on their phone. No "where do I park" call.' },
    { t: '1:30 pm', h: 'Quick walk · 2208 Ashford Dr.',
      b: 'One hand on the phone, one on a flashlight. Three new punches, two photos, sent before you\u2019re back to the truck.' },
    { t: '3:45 pm', h: 'Final walk with the buyer.',
      b: 'They see a clean digital punch list on your phone. Sign off in the doorway. Closed out in the time it used to take to find the binder.' },
    { t: '5:15 pm', h: 'Daily report\u2019s already filed.',
      b: 'It pulled itself together from what you did all day. You drive home.' },
  ];
  return (
    <Section bg="var(--bc-paper-2)" id="day">
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <Eyebrow>A day, in one app</Eyebrow>
        <h2 className="bc-section-h2" style={{
          fontFamily:'var(--font-display)', fontWeight:900,
          fontSize:48, letterSpacing:'-0.03em', lineHeight:1,
          margin:'18px 0 12px', color:'var(--bc-ink)', textWrap:'balance',
        }}>
          What a Tuesday looks like.
        </h2>
        <p style={{ fontSize: 18, color: 'var(--bc-ink-2)', margin: 0, maxWidth: 600 }}>
          Built around how a residential CM actually moves through a day — not how a software company imagines it.
        </p>

        <ol className="bc-day-list" style={{
          listStyle: 'none', padding: 0, margin: '48px 0 0',
          display: 'flex', flexDirection: 'column', gap: 0,
          position: 'relative',
        }}>
          {/* Vertical rail */}
          <div style={{
            position: 'absolute', left: 81, top: 18, bottom: 18,
            width: 2, background: 'var(--bc-ink)', zIndex: 0,
          }} />
          {steps.map((s, i) => (
            <li key={s.t} className="bc-day-step" style={{
              display: 'grid',
              gridTemplateColumns: '110px 24px 1fr',
              gap: 20, alignItems: 'flex-start',
              padding: '18px 0',
              position: 'relative', zIndex: 1,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontWeight: 600,
                fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase',
                color: 'var(--bc-ink)',
                textAlign: 'right', paddingTop: 4,
              }}>{s.t}</div>
              <div style={{ display:'flex', justifyContent:'center', paddingTop: 6 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 999,
                  background: i === steps.length - 1 ? 'var(--bc-orange)' : 'var(--bc-paper)',
                  border: '2.5px solid var(--bc-ink)',
                }} />
              </div>
              <div style={{
                background: 'var(--bc-paper)',
                border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-4)',
                padding: '14px 18px',
                boxShadow: '3px 3px 0 0 var(--bc-ink)',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 20, letterSpacing: '-0.02em', margin: 0,
                  color: 'var(--bc-ink)',
                }}>{s.h}</h3>
                <p style={{ margin: '6px 0 0', fontSize: 15, color: 'var(--bc-ink-2)', lineHeight: 1.5, textWrap:'pretty' }}>{s.b}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Pricing / Get access
// ─────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    { name: 'Solo',  price: '$29',  per: 'per user / month',
      sub: 'For the one-truck CM',
      f: ['Unlimited punches','Voice + photo capture','Offline sync','Trade SMS / call from a punch'] },
    { name: 'Crew',  price: '$24',  per: 'per user / month',
      sub: 'Most teams pick this',
      f: ['Everything in Solo','Daily reports','Multiple communities','Warranty export','Slack / Teams hooks'], on: true },
    { name: 'Builder', price: 'Talk',  per: 'volume pricing',
      sub: 'For large-volume residential builders',
      f: ['Everything in Crew','SSO + role-based access','API + Sitecast integration','White-glove onboarding'] },
  ];
  return (
    <Section id="get-access">
      <Eyebrow>Get access · honest pricing</Eyebrow>
      <h2 className="bc-section-h2" style={{
        fontFamily:'var(--font-display)', fontWeight:900,
        fontSize:48, letterSpacing:'-0.03em', lineHeight:1, margin:'18px 0 12px',
      }}>Pays for itself by Tuesday.</h2>
      <p style={{ fontSize:18, color:'var(--bc-ink-2)', margin: 0, maxWidth: 560 }}>
        60-day trial, no card. Cancel from your phone. The truck-driving CM was the customer; the pricing is too.
      </p>
      <div className="bc-pricing-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 18, marginTop: 40 }}>
        {tiers.map(t => (
          <div key={t.name} style={{
            background: t.on ? 'var(--bc-ink)' : 'var(--bc-paper)',
            color: t.on ? 'var(--bc-paper)' : 'var(--bc-ink)',
            border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-4)',
            padding: 26, display: 'flex', flexDirection: 'column', gap: 16,
            boxShadow: t.on ? '4px 4px 0 0 var(--bc-orange)' : 'none', position:'relative',
          }}>
            {t.on && (
              <div style={{
                position:'absolute', top: -12, right: 18,
                background:'var(--bc-orange)', color:'var(--bc-paper)',
                fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
                textTransform:'uppercase', letterSpacing:'0.06em',
                padding:'5px 10px', borderRadius:'var(--r-2)', border:'2px solid var(--bc-ink)',
              }}>Most picked</div>
            )}
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize: 22 }}>{t.name}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.05em', color: t.on ? 'rgba(250,250,247,0.7)' : 'var(--bc-ink-3)', marginTop: 4 }}>{t.sub}</div>
            </div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize: 56, letterSpacing:'-0.035em', lineHeight: 1 }}>{t.price}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.05em', color: t.on ? 'rgba(250,250,247,0.7)' : 'var(--bc-ink-3)', marginTop: 6 }}>{t.per}</div>
            </div>
            <ul style={{ listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10 }}>
              {t.f.map(item => (
                <li key={item} style={{ display:'flex', gap: 10, alignItems:'flex-start', fontSize: 15 }}>
                  <img src={I('check')} width={18} height={18} alt="" style={{ marginTop: 2, filter: t.on ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)' : 'none' }}/>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto' }}>
              {t.on
                ? <PrimaryCTA size="lg">Clock In</PrimaryCTA>
                : t.name === 'Builder'
                  ? <SecondaryCTA size="lg" href={`mailto:${CONTACT_EMAIL}?subject=BuildCore Builder tier inquiry`}>Talk to us</SecondaryCTA>
                  : <SecondaryCTA size="lg" href={CONDENSER_URL} external>Try it</SecondaryCTA>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer — generic, email + copyright only
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: 'var(--bc-ink)', color: 'var(--bc-on-dark)' }}>
      <div className="bc-footer-row" style={{
        maxWidth: 1240, margin:'0 auto', padding:'56px 32px 28px',
        display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap: 32, flexWrap:'wrap',
      }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 28, height: 22, background: 'var(--bc-orange)', clipPath: 'polygon(0 100%, 0 0, 70% 0, 100% 100%)' }} />
            <span style={{ fontFamily:'var(--font-display)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em' }}>BuildCore</span>
          </div>
          <p style={{ color:'var(--bc-on-dark-2)', marginTop: 14, fontSize: 15, lineHeight: 1.55 }}>
            Software for residential construction managers. Built from the inside, in the field, by people who run jobsites.
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 8, alignItems:'flex-start' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--bc-on-dark-2)', fontWeight:600 }}>Get in touch</div>
          <a href="mailto:hello@buildcore.io" style={{
            fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 22,
            letterSpacing: '-0.02em', color: 'var(--bc-on-dark)',
            textDecoration: 'none', borderBottom: '2px solid var(--bc-orange)', paddingBottom: 2,
          }}>hello@buildcore.io</a>
        </div>
      </div>
      <div className="bc-footer-meta" style={{
        borderTop:'1px solid rgba(250,250,247,0.12)',
        padding:'18px 32px', maxWidth: 1240, margin:'0 auto',
        display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap: 12,
        fontFamily:'var(--font-mono)', fontSize: 11, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--bc-on-dark-2)',
      }}>
        <span>© 2026 BuildCore Inc.</span>
        <span style={{ color: 'var(--bc-on-dark-2)', opacity: 0.7 }}>Privacy · Terms · Status — coming soon</span>
      </div>
    </footer>
  );
}

// Export — only the sections actually used on the page
Object.assign(window, {
  SiteHeader, PrimaryCTA, SecondaryCTA, Section, Eyebrow,
  Hero, WhatItDoes, DayInTheLife, Pricing, Footer,
});
