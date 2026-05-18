// Components.jsx — BuildCore Ops marketing site
// All visual decisions follow /colors_and_type.css.

const { useState, useEffect } = React;
const I = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;

const CONDENSER_URL = 'https://condenser-app-production.up.railway.app/';
const CONTACT_EMAIL = 'mailto:beltranpaige24@gmail.com';

// Stock residential-construction photos from Unsplash (free, hotlink-OK).
const HERO_IMG    = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80&auto=format&fit=crop';
const FOUNDER_IMG = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80&auto=format&fit=crop';

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' && window.innerWidth < breakpoint);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return mobile;
}

// ─────────────────────────────────────────────────────────────
// Site header — sticky, single row, generous gutters
// ─────────────────────────────────────────────────────────────
function SiteHeader() {
  const isMobile = useIsMobile();
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(250,250,247,0.92)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid var(--bc-line)',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: isMobile ? '0 20px' : '0 32px',
        height: isMobile ? 64 : 72, display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32,
      }}>
        <a href="/" aria-label="BuildCore home" style={{ display:'flex', alignItems:'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 22, background: 'var(--bc-orange)', clipPath: 'polygon(0 100%, 0 0, 70% 0, 100% 100%)' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 22, letterSpacing: '-0.03em', color: 'var(--bc-ink)',
          }}>BuildCore</span>
        </a>
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 28, marginLeft: 24 }}>
            <a href="#features" style={navLink}>Products</a>
            <a href="#deep-dive" style={navLink}>For CMs</a>
            <a href="#pricing" style={navLink}>Pricing</a>
            <a href="#founder" style={navLink}>Field notes</a>
            <a href={CONDENSER_URL} style={navLink}>Login</a>
          </nav>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isMobile && (
            <a href={CONTACT_EMAIL} style={{
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
              color: 'var(--bc-ink-2)', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>Book a walk-through</a>
          )}
          <PrimaryCTA size="sm" href={CONDENSER_URL}>Start free trial</PrimaryCTA>
        </div>
      </div>
    </header>
  );
}
const navLink = {
  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 15,
  color: 'var(--bc-ink-2)', textDecoration: 'none',
};

// ─────────────────────────────────────────────────────────────
// Primary CTA — stamped button
// ─────────────────────────────────────────────────────────────
function PrimaryCTA({ children, size = 'lg', icon = 'arrow-right', href = '#' }) {
  const h = size === 'sm' ? 40 : 56;
  const fs = size === 'sm' ? 14 : 17;
  const shadow = size === 'sm' ? '2px 2px 0 0 var(--bc-ink)' : '3px 3px 0 0 var(--bc-ink)';
  return (
    <a href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      height: h, padding: '0 22px',
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: fs,
      background: 'var(--bc-orange)', color: 'var(--bc-paper)',
      border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
      textDecoration: 'none', boxShadow: shadow,
      transition: 'transform 100ms var(--ease-out), box-shadow 100ms var(--ease-out), background 160ms var(--ease-out)',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bc-orange-press)'}
    onMouseLeave={e => e.currentTarget.style.background = 'var(--bc-orange)'}
    onMouseDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '0 0 0 0 var(--bc-ink)'; }}
    onMouseUp={e =>   { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = shadow; }}
    >{children}<img src={I(icon)} width={size==='sm'?14:18} height={size==='sm'?14:18} alt="" style={{filter:'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'}} /></a>
  );
}
function SecondaryCTA({ children, size = 'lg', href = '#' }) {
  const h = size === 'sm' ? 40 : 56;
  const fs = size === 'sm' ? 14 : 17;
  return (
    <a href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: h, padding: '0 18px',
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: fs,
      background: 'var(--bc-paper)', color: 'var(--bc-ink)',
      border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
      textDecoration: 'none', whiteSpace: 'nowrap',
    }}>{children}</a>
  );
}

// ─────────────────────────────────────────────────────────────
// Section primitives
// ─────────────────────────────────────────────────────────────
function Section({ children, bg, pad = 'lg', id }) {
  const isMobile = useIsMobile();
  const padY = pad === 'lg' ? (isMobile ? 64 : 96) : (isMobile ? 40 : 56);
  const padX = isMobile ? 20 : 32;
  return (
    <section id={id} style={{
      background: bg || 'var(--bc-paper)',
      padding: `${padY}px ${padX}px`,
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
// Hero
// ─────────────────────────────────────────────────────────────
function Hero() {
  const isMobile = useIsMobile();
  return (
    <Section pad="lg">
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
        gap: isMobile ? 40 : 56,
        alignItems: 'center',
      }}>
        <div>
          <Eyebrow>BuildCore Ops · v2026.5</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: isMobile ? 44 : 72,
            lineHeight: 0.95, letterSpacing: '-0.035em',
            margin: '20px 0 0', color: 'var(--bc-ink)', textWrap: 'balance',
          }}>
            Built in the field.<br />
            <span style={{ color: 'var(--bc-orange)' }}>Not in a meeting.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: isMobile ? 17 : 19, lineHeight: 1.5,
            color: 'var(--bc-ink-2)', maxWidth: 560, margin: '24px 0 0',
            textWrap: 'pretty',
          }}>
            Punch lists, daily reports, and trade comms — one mobile app, offline-first,
            made by a CM who's tired of spreadsheets and group texts.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <PrimaryCTA href={CONDENSER_URL}>Start free for 60 days</PrimaryCTA>
            <SecondaryCTA href="#deep-dive">See it on a jobsite</SecondaryCTA>
          </div>
          <div style={{
            display: 'flex', gap: isMobile ? 16 : 22, marginTop: 32, flexWrap: 'wrap',
            fontFamily: 'var(--font-mono)', fontSize: 12,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            color: 'var(--bc-ink-3)',
          }}>
            <span><span style={{color:'var(--bc-ink)', fontWeight:600}}>3,200+</span> punches closed weekly</span>
            <span><span style={{color:'var(--bc-ink)', fontWeight:600}}>14</span> communities live</span>
            <span><span style={{color:'var(--bc-ink)', fontWeight:600}}>Pulte · KB · Lennar</span></span>
          </div>
        </div>
        <HeroVisual />
      </div>
    </Section>
  );
}

// Illustrative hero — real construction photo + floating punch ticket.
function HeroVisual() {
  const isMobile = useIsMobile();
  return (
    <div style={{
      position: 'relative',
      height: isMobile ? 380 : 520,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        inset: isMobile ? '0 20px 0 0' : '0 40px 0 0',
        borderRadius: 'var(--r-4)',
        border: '2px solid var(--bc-ink)',
        boxShadow: isMobile ? '4px 4px 0 0 var(--bc-ink)' : '6px 6px 0 0 var(--bc-ink)',
        overflow: 'hidden',
        background: '#2A2722',
      }}>
        <img src={HERO_IMG} alt="Residential construction jobsite"
             style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        <div style={{
          position:'absolute', inset:0,
          background: 'linear-gradient(180deg, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0.05) 40%, rgba(20,17,13,0.6) 100%)',
        }} />
        <div style={{
          position:'absolute', bottom: 14, left: 20,
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(250,250,247,0.85)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>Final walk · 09:42</div>
        <div style={{
          position:'absolute', top: 18, left: 20, right: 20,
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: isMobile ? 24 : 32, letterSpacing: '-0.02em', lineHeight: 1.05,
          color: '#FAFAF7',
        }}>
          Lot 247 · Ashford
        </div>
      </div>
      <FloatingTicket />
    </div>
  );
}
function FloatingTicket() {
  const isMobile = useIsMobile();
  return (
    <div style={{
      position: 'absolute',
      right: 0, bottom: isMobile ? 20 : 40,
      width: isMobile ? 260 : 320,
      background: 'var(--bc-paper)',
      border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-4)',
      boxShadow: isMobile ? '4px 4px 0 0 var(--bc-ink)' : '6px 6px 0 0 var(--bc-ink)',
      padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap' }}>
        <Stamp>PL-1023</Stamp>
        <Stamp dark>Lot 247</Stamp>
        <span style={{ marginLeft:'auto' }}><Pill kind="blocked">Blocked</Pill></span>
      </div>
      <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:isMobile?16:18, letterSpacing:'-0.015em', lineHeight:1.2 }}>
        Hairline crack — master bath tile, north wall
      </div>
      <div style={{ display:'flex', gap: 12, fontFamily:'var(--font-mono)', fontSize: 11, textTransform:'uppercase', letterSpacing: '0.05em', color:'var(--bc-ink-3)' }}>
        <span><b style={{color:'var(--bc-ink-2)'}}>Tile</b></span>
        <span><b style={{color:'var(--bc-ink-2)'}}>Due</b> 05/19</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}><img src={I('camera')} width={12} height={12} /> 3</span>
      </div>
    </div>
  );
}
function Stamp({ children, dark }) {
  return (
    <span style={{
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11, letterSpacing:'0.03em', textTransform:'uppercase',
      padding:'3px 8px', borderRadius:'var(--r-2)', border:'1.5px solid var(--bc-line)',
      background: dark ? 'var(--bc-paper-3)' : 'var(--bc-paper-2)',
    }}>{children}</span>
  );
}
function Pill({ children, kind }) {
  const map = {
    blocked: { c:'#B82A1F', bg:'#F6DDD7' },
    open:    { c:'#1F5A8A', bg:'#D9E5F0' },
    closed:  { c:'#2E7D3A', bg:'#DEEFD8' },
  };
  const s = map[kind] || map.open;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11,
      textTransform:'uppercase', letterSpacing:'0.05em',
      padding:'4px 8px', borderRadius:'var(--r-2)',
      border:'1.5px solid '+s.c, background:s.bg, color:s.c,
    }}>
      <span style={{ width:7, height:7, background:'currentColor', borderRadius:999 }}/>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo strip — "Used by"
// ─────────────────────────────────────────────────────────────
function LogoStrip() {
  return (
    <Section pad="md" bg="var(--bc-paper-2)">
      <div style={{ display:'flex', alignItems:'center', gap: 28, justifyContent:'center', flexWrap:'wrap' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize: 12, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--bc-ink-3)', fontWeight:600 }}>
          Built for builders like
        </div>
        {['PULTE', 'LENNAR', 'KB HOME', 'D.R. HORTON', 'TOLL BROTHERS', 'M/I HOMES'].map(n => (
          <div key={n} style={{
            fontFamily:'var(--font-display)', fontWeight:800, fontSize: 18,
            letterSpacing:'-0.015em', color:'var(--bc-ink-2)',
            opacity: 0.65,
          }}>{n}</div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Feature trio
// ─────────────────────────────────────────────────────────────
function FeatureTrio() {
  const isMobile = useIsMobile();
  const items = [
    { icon:'clipboard-list', title: 'The Condenser', sub: 'Punch list, in your pocket',
      body: "Voice-capture a defect while you're standing in the room. Auto-classify by trade. Send to the sub with one tap. Close out without ever opening a spreadsheet." },
    { icon:'file-text',      title: 'Daily reports', sub: 'Filed by 7:01am',
      body: 'Crews, weather, deliveries, blockers, photos. Auto-pulls from punches closed and trades on site. You walk; the report writes itself.' },
    { icon:'shield-check',   title: 'Safety + comms', sub: 'One thread per lot',
      body: 'Safety incidents, trade conversations, and superintendent notes — one thread per lot, time-stamped, exportable for warranty + legal.' },
  ];
  return (
    <Section id="features">
      <Eyebrow>The suite</Eyebrow>
      <h2 style={{
        fontFamily:'var(--font-display)', fontWeight:900,
        fontSize: isMobile ? 32 : 48, letterSpacing:'-0.03em', lineHeight: 1,
        margin: '18px 0 12px', color:'var(--bc-ink)', maxWidth: 760, textWrap:'balance',
      }}>
        Three tools. One job. The one in your truck.
      </h2>
      <p style={{ fontSize: isMobile ? 16 : 18, color:'var(--bc-ink-2)', maxWidth: 640, margin: 0 }}>
        BuildCore Ops replaces the spreadsheets, sticky notes, and group texts that run most jobsites today.
      </p>
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
        gap: 18, marginTop: isMobile ? 32 : 48,
      }}>
        {items.map(it => (
          <div key={it.title} style={{
            background: 'var(--bc-paper)',
            border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-4)',
            padding: 24, display: 'flex', flexDirection: 'column', gap: 14, height: '100%',
            boxShadow: '4px 4px 0 0 var(--bc-ink)',
          }}>
            <div style={{
              width: 48, height: 48, border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
              background: 'var(--bc-orange-tint)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={I(it.icon)} width={24} height={24} alt="" style={{filter:'invert(33%) sepia(89%) saturate(395%) hue-rotate(346deg) brightness(91%) contrast(82%)'}}/>
            </div>
            <div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize: 22, letterSpacing:'-0.02em', margin: 0 }}>{it.title}</h3>
              <div style={{ fontFamily:'var(--font-mono)', fontSize: 12, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--bc-ink-3)', marginTop: 4 }}>{it.sub}</div>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--bc-ink-2)', margin: 0, textWrap:'pretty' }}>{it.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat band
// ─────────────────────────────────────────────────────────────
function StatBand() {
  const isMobile = useIsMobile();
  const stats = [
    { v: '2.3 min', l: 'Average time to log a punch' },
    { v: '63%',     l: 'Fewer overdue items in first 90 days' },
    { v: '0',       l: 'Spreadsheets needed' },
    { v: '100%',    l: 'Offline-first' },
  ];
  return (
    <Section bg="var(--bc-ink)">
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: isMobile ? 24 : 36,
      }}>
        {stats.map(s => (
          <div key={s.l} style={{ borderLeft:'2px solid var(--bc-orange)', paddingLeft: 18 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize: isMobile ? 40 : 56, letterSpacing:'-0.035em', lineHeight: 1, color:'var(--bc-paper)' }}>{s.v}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 12, textTransform:'uppercase', letterSpacing:'0.06em', color:'rgba(250,250,247,0.7)', marginTop: 10 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Founder note
// ─────────────────────────────────────────────────────────────
function FounderNote() {
  const isMobile = useIsMobile();
  return (
    <Section id="founder">
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
        gap: isMobile ? 32 : 56, alignItems:'flex-start',
      }}>
        <div>
          <Eyebrow>Why this exists</Eyebrow>
          <div style={{ marginTop: 22 }}>
            <div style={{
              width: 88, height: 88, borderRadius: 999,
              border: '2px solid var(--bc-ink)', overflow: 'hidden',
              background: 'var(--bc-paper-3)',
            }}>
              <img src={FOUNDER_IMG} alt="Founder" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            </div>
            <div style={{ marginTop: 14, fontFamily:'var(--font-display)', fontWeight:800, fontSize: 18 }}>
              Mike Salerno
            </div>
            <div className="meta" style={{ marginTop: 4 }}>CM · Pulte Homes · Northern VA</div>
          </div>
        </div>
        <div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight: 700,
            fontSize: isMobile ? 22 : 34, letterSpacing:'-0.02em', lineHeight: 1.2,
            color: 'var(--bc-ink)', textWrap:'balance',
          }}>
            "I built The Condenser on lunch breaks because the tools we had were either bloated office software or somebody's group text.
            Field guys need <span style={{color:'var(--bc-orange)'}}>one screen, one tap, in sunlight</span>.
            That's all this is."
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Condenser deep-dive + phone mockup
// ─────────────────────────────────────────────────────────────
function ConDeepDive() {
  const isMobile = useIsMobile();
  return (
    <Section bg="var(--bc-paper-2)" id="deep-dive">
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 40 : 56, alignItems:'center',
      }}>
        <div>
          <Eyebrow>The Condenser · in action</Eyebrow>
          <h2 style={{
            fontFamily:'var(--font-display)', fontWeight:900,
            fontSize: isMobile ? 32 : 44, letterSpacing:'-0.03em', lineHeight:1,
            margin:'18px 0 16px', color:'var(--bc-ink)', maxWidth: 520, textWrap:'balance',
          }}>
            A punch list that closes itself out.
          </h2>
          <ul style={{ listStyle:'none', padding:0, margin:'24px 0 0', display:'flex', flexDirection:'column', gap: 14 }}>
            {[
              ['mic',           'Voice-capture defects', "Tap, talk, walk away. We transcribe and pick the trade for you."],
              ['camera',        'Tag photos to a lot',  "Photos auto-attach with EXIF + lot. No naming, no folders."],
              ['send',          'One-tap to the trade', "Trade contact, message, due date — sent and tracked in the same thread."],
              ['cloud-off',     'Offline-first',        "Works in the basement of an unfinished house. Syncs when you hit signal."],
            ].map(([ic, h, b]) => (
              <li key={h} style={{ display:'flex', gap: 14, alignItems:'flex-start' }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0,
                  border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
                  background: 'var(--bc-paper)',
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                }}>
                  <img src={I(ic)} width={20} height={20} />
                </div>
                <div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--bc-ink)' }}>{h}</div>
                  <div style={{ fontSize:15, color:'var(--bc-ink-2)', marginTop: 2 }}>{b}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <PhoneMockup />
      </div>
    </Section>
  );
}

function PhoneMockup() {
  const isMobile = useIsMobile();
  const w = isMobile ? 280 : 360;
  const h = isMobile ? 560 : 720;
  return (
    <div style={{
      width: w, height: h, margin: '0 auto',
      background: '#14110D', borderRadius: 42, padding: 8,
      boxShadow: '0 30px 60px rgba(20,17,13,0.25), 0 0 0 2px var(--bc-ink)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: '50%', transform:'translateX(-50%)',
        width: 110, height: 28, background: '#000', borderRadius: 18, zIndex: 5,
      }}/>
      <div style={{
        width: '100%', height: '100%', background: 'var(--bc-paper)',
        borderRadius: 34, overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ height: 52 }}/>
        <div style={{ padding: '8px 16px' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize: 11, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--bc-ink-3)' }}>Lot 247 · 14 Sycamore</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize: 24, letterSpacing:'-0.02em', color:'var(--bc-ink)' }}>Punch list</div>
        </div>
        <div style={{ display:'flex', gap: 8, padding: '0 16px 12px' }}>
          <SegOn>Open · 4</SegOn>
          <SegOff>Closed · 1</SegOff>
          <SegOff>All</SegOff>
        </div>
        <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap: 10 }}>
          <Ticket id="PL-1023" lot="247" title="Hairline crack — master bath tile, north wall" trade="Tile" due="05/19" pill="blocked" stamped/>
          <Ticket id="PL-1020" lot="247" title="Outlet missing cover plate — powder rm" trade="Electrical" due="05/18" pill="open" />
          <Ticket id="PL-1018" lot="247" title="Door rub on master closet" trade="Doors" due="05/18" pill="open" />
        </div>
      </div>
    </div>
  );
}
function SegOn({ children }) {
  return <span style={{ flex:1, height: 36, display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-body)', fontWeight:600, fontSize:12, letterSpacing:'0.04em', textTransform:'uppercase', background:'var(--bc-ink)', color:'var(--bc-paper)', borderRadius: 'var(--r-2)', border: '1.5px solid var(--bc-ink)' }}>{children}</span>;
}
function SegOff({ children }) {
  return <span style={{ flex:1, height: 36, display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-body)', fontWeight:600, fontSize:12, letterSpacing:'0.04em', textTransform:'uppercase', background:'var(--bc-paper)', color:'var(--bc-ink-3)', borderRadius: 'var(--r-2)', border: '1.5px solid var(--bc-line)' }}>{children}</span>;
}
function Ticket({ id, lot, title, trade, due, pill, stamped }) {
  return (
    <div style={{
      background:'var(--bc-paper)', border:'2px solid var(--bc-ink)',
      borderRadius:'var(--r-4)', padding: '10px 12px',
      display:'flex', flexDirection:'column', gap: 6,
      boxShadow: stamped ? '3px 3px 0 0 var(--bc-ink)' : 'none',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap' }}>
        <Stamp>{id}</Stamp><Stamp dark>Lot {lot}</Stamp>
        <span style={{ marginLeft:'auto' }}><Pill kind={pill}>{pill}</Pill></span>
      </div>
      <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:14, letterSpacing:'-0.01em', lineHeight:1.2 }}>{title}</div>
      <div style={{ display:'flex', gap: 10, fontFamily:'var(--font-mono)', fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--bc-ink-3)' }}>
        <span><b style={{color:'var(--bc-ink-2)'}}>{trade}</b></span>
        <span><b style={{color:'var(--bc-ink-2)'}}>Due</b> {due}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────
function Pricing() {
  const isMobile = useIsMobile();
  const tiers = [
    { name: 'Solo',     price: '$29',  per: 'per user / month', sub: 'For the one-man-band CM',
      f: ['Unlimited punches','Voice + photo capture','Offline sync','Trade SMS'],
      cta: { kind:'secondary', label:'Try it', href: CONDENSER_URL } },
    { name: 'Crew',     price: '$24',  per: 'per user / month', sub: 'Most teams pick this',
      f: ['Everything in Solo','Daily reports','Multi-community','Warranty export','Slack / Teams hooks'], on: true,
      cta: { kind:'primary', label:'Start 60-day trial', href: CONDENSER_URL } },
    { name: 'Builder',  price: 'Talk', per: 'volume pricing',   sub: 'Production builders, 10+ communities',
      f: ['Everything in Crew','SSO + role-based access','API + Sitecast integration','White-glove onboarding'],
      cta: { kind:'secondary', label:'Talk to sales', href: CONTACT_EMAIL } },
  ];
  return (
    <Section id="pricing">
      <Eyebrow>Pricing · honest</Eyebrow>
      <h2 style={{
        fontFamily:'var(--font-display)', fontWeight:900,
        fontSize: isMobile ? 32 : 44, letterSpacing:'-0.03em', lineHeight:1, margin:'18px 0 12px',
      }}>Pays for itself by Tuesday.</h2>
      <p style={{ fontSize: isMobile ? 16 : 18, color:'var(--bc-ink-2)', margin: 0, maxWidth: 560 }}>
        60-day trial, no card. Cancel from your phone. The truck-driving CM was the customer; pricing is too.
      </p>
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
        gap: 18, marginTop: 40,
      }}>
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
              {t.cta.kind === 'primary'
                ? <PrimaryCTA size="lg" href={t.cta.href}>{t.cta.label}</PrimaryCTA>
                : <SecondaryCTA size="lg" href={t.cta.href}>{t.cta.label}</SecondaryCTA>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// CTA band
// ─────────────────────────────────────────────────────────────
function CtaBand() {
  const isMobile = useIsMobile();
  return (
    <Section bg="var(--bc-orange)">
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
        gap: isMobile ? 28 : 56, alignItems:'center',
      }}>
        <h2 style={{
          fontFamily:'var(--font-display)', fontWeight:900,
          fontSize: isMobile ? 34 : 52, letterSpacing:'-0.035em', lineHeight: 0.98,
          color: 'var(--bc-paper)', margin: 0, textWrap:'balance',
        }}>
          Stop running your jobsite from a group text.
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap: 12, alignItems:'flex-start' }}>
          <a href={CONDENSER_URL} style={{
            display:'inline-flex', alignItems:'center', gap: 10,
            height: 60, padding:'0 22px',
            fontFamily:'var(--font-body)', fontWeight: 600, fontSize: 17,
            background:'var(--bc-paper)', color:'var(--bc-ink)',
            border: '2px solid var(--bc-ink)', borderRadius:'var(--r-2)',
            textDecoration:'none', boxShadow:'4px 4px 0 0 var(--bc-ink)',
          }}>Start free for 60 days <img src={I('arrow-right')} width={18} height={18}/></a>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.06em', color:'rgba(250,250,247,0.85)' }}>
            No card. No demo. No call from sales.
          </span>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: 'var(--bc-ink)', color: 'var(--bc-on-dark)' }}>
      <div style={{
        maxWidth: 1240, margin:'0 auto',
        padding: isMobile ? '48px 20px 24px' : '64px 32px 32px',
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
        gap: isMobile ? 28 : 36,
      }}>
        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 28, height: 22, background: 'var(--bc-orange)', clipPath: 'polygon(0 100%, 0 0, 70% 0, 100% 100%)' }} />
            <span style={{ fontFamily:'var(--font-display)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em' }}>BuildCore</span>
          </div>
          <p style={{ color:'var(--bc-on-dark-2)', maxWidth: 360, marginTop: 14, fontSize: 15 }}>
            Software for residential construction managers. Built from the inside, in the field, by people who run jobsites.
          </p>
        </div>
        {[
          { h:'Product', l:[['The Condenser', CONDENSER_URL],['Daily reports','#features'],['Trade comms','#features'],['Roadmap','#']] },
          { h:'Company', l:[['About','#founder'],['Field notes','#founder'],['Press', CONTACT_EMAIL],['Contact', CONTACT_EMAIL]] },
          { h:'Legal',   l:[['Privacy','#'],['Terms','#'],['DPA','#'],['Status','#']] },
        ].map(col => (
          <div key={col.h}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--bc-on-dark-2)', fontWeight:600 }}>{col.h}</div>
            <ul style={{ listStyle:'none', padding: 0, margin: '14px 0 0', display:'flex', flexDirection:'column', gap: 10 }}>
              {col.l.map(([label, href]) => <li key={label}><a href={href} style={{ color:'var(--bc-on-dark)', textDecoration:'none', fontSize: 15 }}>{label}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{
        borderTop:'1px solid rgba(250,250,247,0.12)',
        padding: isMobile ? '16px 20px' : '18px 32px',
        maxWidth: 1240, margin:'0 auto',
        display:'flex', justifyContent:'space-between', gap: 12, flexWrap:'wrap',
        fontFamily:'var(--font-mono)', fontSize: 11, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--bc-on-dark-2)',
      }}>
        <span>© 2026 BuildCore Inc.</span>
        <span>Made in the field · Northern VA</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  SiteHeader, PrimaryCTA, SecondaryCTA, Section, Eyebrow,
  Hero, LogoStrip, FeatureTrio, StatBand, FounderNote,
  ConDeepDive, Pricing, CtaBand, Footer,
});
