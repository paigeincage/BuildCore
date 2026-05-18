// condenser-app.jsx — The Condenser, responsive desktop + mobile app shell.
// Direction C (Hybrid): at >=1024px, sidebar nav + content. Below, phone frame
// + bottom tab bar. Active tab managed by React state — no page reloads.
//
// Routing:
//   today  → Home (single-col centered)
//   sites  → Wide 3-up grid (desktop) · phone screen (mobile)
//   punch  → Placeholder (wide table coming next)
//   trades → Placeholder
//   me     → Single-col centered

(function () {
  const { useState, useEffect } = React;

  const ICON   = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;
  const PAPER  = 'var(--bc-paper)', PAPER2 = 'var(--bc-paper-2)', PAPER3 = 'var(--bc-paper-3)';
  const INK    = 'var(--bc-ink)', INK2 = 'var(--bc-ink-2)', INK3 = 'var(--bc-ink-3)';
  const LINE   = 'var(--bc-line)', LINES = 'var(--bc-line-strong)';
  const ORANGE = 'var(--bc-orange)', RED = 'var(--bc-red)';
  const RESET  = { boxSizing:'border-box', maxWidth:'100%', minWidth:0 };

  function Ico({ name, size = 18, color, onActive }) {
    return <img src={ICON(name)} width={size} height={size} alt="" style={{
      display:'block', flexShrink:0,
      filter: onActive ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
            : color === 'muted' ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
            : 'none',
    }} />;
  }

  // Use the same nav across mobile + desktop
  const NAV = [
    { id:'today',  icon:'sun',            label:'Today' },
    { id:'sites',  icon:'home',           label:'Sites' },
    { id:'punch',  icon:'clipboard-list', label:'Punch' },
    { id:'trades', icon:'hard-hat',       label:'Trades' },
    { id:'me',     icon:'user',           label:'Me' },
  ];

  // ─────────────────────────────────────────────────────────────
  // Root — viewport-aware shell
  // ─────────────────────────────────────────────────────────────
  function CondenserApp() {
    const [tab, setTab] = useState('today');
    const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);

    useEffect(() => {
      const mq = window.matchMedia('(min-width: 1024px)');
      const handler = (e) => setWide(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }, []);

    return wide
      ? <DesktopShell tab={tab} setTab={setTab} />
      : <MobileShell  tab={tab} setTab={setTab} />;
  }

  // ─────────────────────────────────────────────────────────────
  // DESKTOP — sidebar + topbar + content area
  // ─────────────────────────────────────────────────────────────
  function DesktopShell({ tab, setTab }) {
    const screen = NAV.find(n => n.id === tab);
    return (
      <div style={{
        ...RESET, display:'grid', gridTemplateColumns:'240px 1fr',
        height:'100%', width:'100%', background:PAPER2,
      }}>
        <Sidebar tab={tab} setTab={setTab} />
        <main style={{ ...RESET, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <Topbar title={DESKTOP_TITLES[tab].title} subtitle={DESKTOP_TITLES[tab].subtitle} />
          <div style={{ ...RESET, flex:1, overflowY:'auto', background:PAPER2 }}>
            <div style={{ padding:'24px 32px 48px' }}>
              <div style={{ maxWidth:1240, margin:'0 auto', minWidth:0 }}>
                <DesktopBody tab={tab} setTab={setTab} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const DESKTOP_TITLES = {
    today:  { title:'Today',   subtitle:'Fri · 05/17' },
    sites:  { title:'Sites',   subtitle:'4 active · 12 total' },
    punch:  { title:'Punch',   subtitle:'47 open across 4 sites' },
    trades: { title:'Trades',  subtitle:'32 contacts · 14 trades covered' },
    me:     { title:'Settings',subtitle:'Profile · Communities · Trades · Notifications' },
  };

  function Sidebar({ tab, setTab }) {
    return (
      <aside style={{
        ...RESET, width:240, height:'100%',
        background:PAPER, borderRight:'2px solid '+LINES,
        display:'flex', flexDirection:'column',
      }}>
        {/* Brand */}
        <div style={{
          padding:'18px 20px 16px', borderBottom:'1.5px solid '+LINE,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <div style={{ width:22, height:18, background:ORANGE, clipPath:'polygon(0 100%, 0 0, 70% 0, 100% 100%)' }} />
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, letterSpacing:'-0.025em', color:INK, lineHeight:1 }}>BuildCore</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:INK3, marginTop:3 }}>The Condenser</div>
          </div>
        </div>

        {/* New punch CTA */}
        <div style={{ padding:'14px 14px 8px' }}>
          <button style={{
            width:'100%', height:42, padding:'0 12px', cursor:'pointer',
            border:'2px solid '+INK, background:ORANGE, color:PAPER,
            borderRadius:'var(--r-2)', boxShadow:'2px 2px 0 0 '+INK,
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:13.5,
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <Ico name="plus" size={14} onActive /> New punch
          </button>
        </div>

        {/* Nav */}
        <nav style={{ ...RESET, padding:'8px 10px', flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          <div style={{ padding:'8px 10px 6px', fontFamily:'var(--font-mono)', fontSize:9.5, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:INK3 }}>Workspace</div>
          {NAV.map(item => {
            const active = item.id === tab;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} style={{
                ...RESET, display:'flex', alignItems:'center', gap:10,
                padding:'10px 10px 10px 12px', cursor:'pointer', textAlign:'left',
                background: active ? INK : 'transparent',
                color: active ? PAPER : INK,
                border:0, borderRadius:'var(--r-2)',
                fontFamily:'var(--font-body)', fontWeight: active ? 700 : 500, fontSize:13.5,
                position:'relative',
              }}>
                {active && <span style={{ position:'absolute', left:-10, top:6, bottom:6, width:3, background:ORANGE, borderRadius:2 }} />}
                <Ico name={item.icon} size={16} onActive={active} color={active ? undefined : 'muted'} />
                <span style={{ flex:1 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile chip */}
        <div style={{
          padding:'10px 10px 12px', borderTop:'1.5px solid '+LINE,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <div style={{ width:32, height:32, borderRadius:999, flexShrink:0, background:ORANGE, color:PAPER, border:'2px solid '+INK,
            display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)', fontWeight:700, fontSize:11 }}>—</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:'var(--font-body)', fontWeight:600, fontSize:12.5, color:INK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Your account</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:INK3 }}>SAMPLE</div>
          </div>
          <button onClick={() => setTab('me')} aria-label="Settings" style={{
            width:30, height:30, padding:0, cursor:'pointer', background:'transparent',
            border:'1.5px solid '+LINE, borderRadius:'var(--r-2)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <Ico name="settings" size={14} color="muted" />
          </button>
        </div>
      </aside>
    );
  }

  function Topbar({ title, subtitle }) {
    return (
      <div style={{
        ...RESET, height:64, padding:'0 32px',
        background:PAPER, borderBottom:'1.5px solid '+LINES,
        display:'flex', alignItems:'center', gap:18, flexShrink:0,
      }}>
        <div style={{ flex:1, minWidth:0 }}>
          {subtitle && <div style={{ fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:2 }}>{subtitle}</div>}
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, letterSpacing:'-0.025em', color:INK, lineHeight:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</div>
        </div>
        <div style={{
          height:36, width:280, padding:'0 12px', flexShrink:0,
          display:'flex', alignItems:'center', gap:8,
          background:PAPER2, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)',
        }}>
          <Ico name="search" size={14} color="muted" />
          <span style={{ flex:1, fontFamily:'var(--font-body)', fontSize:12.5, color:INK3 }}>Search sites, punches, trades</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, color:INK3, padding:'1px 5px', background:PAPER, border:'1.5px solid '+LINE, borderRadius:3 }}>⌘ K</span>
        </div>
        <button aria-label="Notifications" style={{
          width:36, height:36, padding:0, cursor:'pointer', flexShrink:0,
          background:PAPER, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)',
          display:'inline-flex', alignItems:'center', justifyContent:'center', position:'relative',
        }}>
          <Ico name="bell" size={14} color="muted" />
          <span style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:999, background:ORANGE, border:'1.5px solid '+PAPER }} />
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Desktop body — per tab
  // ─────────────────────────────────────────────────────────────
  function DesktopBody({ tab, setTab }) {
    if (tab === 'today')  return <DesktopToday  setTab={setTab} />;
    if (tab === 'sites')  return <DesktopSites  setTab={setTab} />;
    if (tab === 'punch')  return <DesktopPunch />;
    if (tab === 'trades') return <DesktopComingSoon name="Trades" hint="Contacts directory with channel preference (text / email / both) and CSV import. Mobile version is live on the phone." />;
    if (tab === 'me')     return <DesktopComingSoon name="Settings" hint="Consolidated settings — Profile · Communities · Trades · Notifications · Accessibility. Available on mobile." />;
    return null;
  }

  // TODAY — desktop single-col, centered ~720
  function DesktopToday({ setTab }) {
    return (
      <div style={{ maxWidth:760, margin:'0 auto', display:'flex', flexDirection:'column', gap:18 }}>
        {/* Hero */}
        <div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:INK3 }}>Today</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:14, marginTop:6 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:80, letterSpacing:'-0.04em', lineHeight:0.9, color:INK }}>23</div>
            <div>
              <div style={{ fontFamily:'var(--font-body)', fontSize:17, color:INK2 }}>open punches</div>
              <div style={{ fontFamily:'var(--font-body)', fontSize:17, color:INK, fontWeight:700 }}>3 walks today</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:6, marginTop:12 }}>
            <MiniPill kind="late">2 late</MiniPill>
            <MiniPill kind="blocked">1 blocked</MiniPill>
            <MiniPill kind="open">20 open</MiniPill>
          </div>
        </div>

        {/* Section heading */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:INK3 }}>
            <span style={{ width:14, height:2, background:ORANGE }} /> Your day
          </div>
          <button onClick={() => setTab('sites')} style={{
            background:'transparent', border:0, cursor:'pointer', padding:0,
            fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11,
            letterSpacing:'0.05em', textTransform:'uppercase', color:INK,
            textDecoration:'underline', textUnderlineOffset:3,
          }}>All sites →</button>
        </div>

        {/* Walk cards */}
        <WalkCard upNext time="8:00 AM" addr="14 Sycamore Ln" sub="Ashford · Pre-walk" open={12} blocked={1} top="Hairline crack — master bath tile" />
        <WalkCard time="11:00 AM" addr="23 Birchwood Ct" sub="Ashford · Frame inspection" open={4} blocked={0} />
        <WalkCard time="2:30 PM" addr="11 Willow Bend" sub="Hampton · Final · Buyer walk" open={6} blocked={0} late={1} />

        {/* Start walk CTA */}
        <div style={{ marginTop:8 }}>
          <button style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:10,
            height:56, padding:'0 22px',
            background:ORANGE, color:PAPER, cursor:'pointer',
            border:'2px solid '+INK, borderRadius:'var(--r-2)',
            boxShadow:'3px 3px 0 0 '+INK,
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:16,
          }}>
            <Ico name="play" size={18} onActive /> Start walk · 14 Sycamore Ln
          </button>
        </div>
      </div>
    );
  }

  function WalkCard({ time, addr, sub, open, blocked, late, top, upNext }) {
    return (
      <div style={{
        ...RESET, background:PAPER, border:'2px solid '+INK, borderRadius:'var(--r-4)',
        boxShadow: upNext ? '3px 3px 0 0 '+INK : 'none',
        padding:'14px 18px', display:'flex', flexDirection:'column', gap:10,
        position:'relative',
      }}>
        {upNext && (
          <span style={{
            position:'absolute', top:-10, right:18,
            fontFamily:'var(--font-mono)', fontWeight:600, fontSize:9.5,
            letterSpacing:'0.06em', textTransform:'uppercase',
            padding:'2px 7px', borderRadius:'var(--r-2)',
            border:'1.5px solid '+LINES, background:PAPER2, color:INK,
          }}>Up next</span>
        )}
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase', color:INK }}>{time}</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:INK3 }}>{sub}</span>
        </div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, letterSpacing:'-0.02em', color:INK, lineHeight:1.1 }}>{addr}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 12px', background:PAPER2, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:INK }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, marginRight:5 }}>{open}</span>open
          </span>
          <span style={{ width:1, height:14, background:LINE }} />
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color: blocked > 0 ? RED : INK }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, marginRight:5 }}>{blocked}</span>blocked
          </span>
          {late > 0 && (
            <>
              <span style={{ width:1, height:14, background:LINE }} />
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:RED }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, marginRight:5 }}>{late}</span>late
              </span>
            </>
          )}
        </div>
        {top && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:PAPER2, border:'1.5px solid '+LINE, borderLeft:'3px solid '+RED, borderRadius:'var(--r-2)' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:INK, padding:'2px 7px', background:PAPER, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)' }}>Top</span>
            <span style={{ flex:1, fontFamily:'var(--font-body)', fontWeight:500, fontSize:13.5, color:INK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{top}</span>
          </div>
        )}
      </div>
    );
  }

  // SITES — desktop 3-up grid (wide treatment)
  function DesktopSites() {
    const sites = [
      { addr:'14 Sycamore Ln',  sub:'ASHFORD · PRE-WALK',  open:12, blocked:1, pct:72, stamp:true },
      { addr:'23 Birchwood Ct', sub:'ASHFORD · FRAME',     open:4,  blocked:0, pct:69 },
      { addr:'11 Willow Bend',  sub:'HAMPTON · FINAL',     open:6,  late:1,    pct:86 },
      { addr:'57 Cedar Hollow', sub:'HAMPTON · ROUGH-IN',  open:9,  blocked:0, pct:61 },
      { addr:'802 Maple Crest', sub:'MAPLE RIDGE · PRE-WALK', open:2, blocked:0, pct:94 },
      { addr:'318 Oakdale Pl',  sub:'MAPLE RIDGE · FRAME', open:5,  blocked:0, pct:52 },
    ];
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        {/* Filter chips */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          <FilterChip on>Active · 4</FilterChip>
          <FilterChip dropdown>By community</FilterChip>
          <FilterChip>Pre-walk · 1</FilterChip>
          <FilterChip>Frame · 1</FilterChip>
          <FilterChip>Final · 2</FilterChip>
          <FilterChip>Closed · 8</FilterChip>
        </div>

        {/* 3-up grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))',
          gap:14,
        }}>
          {sites.map(s => <SiteCard key={s.addr} s={s} />)}
        </div>
      </div>
    );
  }

  function SiteCard({ s }) {
    return (
      <div style={{
        ...RESET, background:PAPER, border:'2px solid '+INK, borderRadius:'var(--r-4)',
        boxShadow: s.stamp ? '3px 3px 0 0 '+INK : 'none',
        padding:'14px 16px', display:'flex', flexDirection:'column', gap:10,
        cursor:'pointer',
      }}>
        <div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:INK3 }}>{s.sub}</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, letterSpacing:'-0.02em', color:INK, marginTop:4, lineHeight:1.1 }}>{s.addr}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 12px', background:PAPER2, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:INK }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, marginRight:5 }}>{s.open}</span>open
          </span>
          {s.blocked != null && (
            <>
              <span style={{ width:1, height:14, background:LINE }} />
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color: s.blocked > 0 ? RED : INK }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, marginRight:5 }}>{s.blocked}</span>blocked
              </span>
            </>
          )}
          {s.late > 0 && (
            <>
              <span style={{ width:1, height:14, background:LINE }} />
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:RED }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, marginRight:5 }}>{s.late}</span>late
              </span>
            </>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ flex:1, height:6, background:PAPER3, border:'1.5px solid '+LINES, borderRadius:2, overflow:'hidden' }}>
            <div style={{ width:s.pct+'%', height:'100%', background:ORANGE }} />
          </div>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:10, letterSpacing:'0.04em', textTransform:'uppercase', color:INK2 }}>{s.pct}% done</span>
        </div>
      </div>
    );
  }

  // PUNCH — desktop table (wide treatment)
  function DesktopPunch() {
    const items = [
      { addr:'14 Sycamore Ln', text:'Hairline crack — master bath tile, north wall', trade:'Tile', pri:'hot', due:'05/19', late:true },
      { addr:'14 Sycamore Ln', text:'Toilet supply line — slow drip behind escutcheon', trade:'Plumbing', pri:'elev', due:'Today' },
      { addr:'11 Willow Bend', text:'Touch-up paint — stair stringer, 2nd flight', trade:'Painting & Touch-Up', pri:'elev', due:'Today' },
      { addr:'14 Sycamore Ln', text:'Outlet missing cover plate — powder room', trade:'Electrical', pri:'norm', due:'05/18' },
      { addr:'23 Birchwood Ct', text:'Stud out of plumb at SW corner', trade:'Framing / Siding', pri:'norm', due:'05/20' },
      { addr:'14 Sycamore Ln', text:'Door rub on master closet', trade:'Door Hardware', pri:'norm', due:'05/18' },
    ];
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {/* Filter chips */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          <FilterChip dropdown>All sites · 4</FilterChip>
          <FilterChip dropdown>All trades</FilterChip>
          <FilterChip on>Open</FilterChip>
          <FilterChip>Hot</FilterChip>
          <FilterChip>Late</FilterChip>
        </div>

        {/* Table */}
        <div style={{ background:PAPER, border:'2px solid '+INK, borderRadius:'var(--r-4)', overflow:'hidden' }}>
          {/* Head */}
          <div style={{
            display:'grid', gridTemplateColumns:'30px 200px 1fr 160px 110px 110px',
            gap:0, background:INK, color:PAPER,
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase',
          }}>
            <Cell head></Cell>
            <Cell head>Address</Cell>
            <Cell head>Item</Cell>
            <Cell head>Trade</Cell>
            <Cell head>Due</Cell>
            <Cell head right>Status</Cell>
          </div>
          {items.map((it, i) => <PunchRow key={i} it={it} />)}
        </div>
      </div>
    );
  }

  function Cell({ children, head, right }) {
    return (
      <div style={{
        padding: head ? '10px 14px' : '12px 14px',
        borderRight: head ? '1.5px solid rgba(250,250,247,0.18)' : '1.5px solid '+LINE,
        borderBottom: head ? 'none' : '1.5px solid '+LINE,
        textAlign: right ? 'right' : 'left',
        minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        display:'flex', alignItems:'center', justifyContent: right ? 'flex-end' : 'flex-start',
      }}>{children}</div>
    );
  }

  function PunchRow({ it }) {
    const priColor = it.pri === 'hot' ? RED : it.pri === 'elev' ? ORANGE : INK3;
    return (
      <div style={{
        display:'grid', gridTemplateColumns:'30px 200px 1fr 160px 110px 110px',
        gap:0, background:PAPER, cursor:'pointer',
      }}>
        <Cell>
          <span style={{ width:10, height:10, borderRadius:999, background:priColor, border:'1.5px solid '+INK }} />
        </Cell>
        <Cell>
          <span style={{ fontFamily:'var(--font-body)', fontWeight:600, fontSize:13, color:INK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{it.addr}</span>
        </Cell>
        <Cell>
          <span style={{ fontFamily:'var(--font-body)', fontWeight:500, fontSize:13, color:INK2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{it.text}</span>
        </Cell>
        <Cell>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10, letterSpacing:'0.04em', textTransform:'uppercase', color:INK, padding:'2px 7px', background:PAPER2, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)' }}>{it.trade}</span>
        </Cell>
        <Cell>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11, letterSpacing:'0.04em', textTransform:'uppercase', color: it.late ? RED : INK2 }}>{it.due}{it.late ? ' · LATE' : ''}</span>
        </Cell>
        <Cell right>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10, letterSpacing:'0.05em', textTransform:'uppercase', color: priColor }}>{it.pri === 'hot' ? 'Hot' : it.pri === 'elev' ? 'Elevated' : 'Normal'}</span>
        </Cell>
      </div>
    );
  }

  // PLACEHOLDER for screens not yet adapted to desktop
  function DesktopComingSoon({ name, hint }) {
    return (
      <div style={{ maxWidth:560, margin:'80px auto 0' }}>
        <div style={{
          ...RESET, background:PAPER, border:'2px dashed '+LINES, borderRadius:'var(--r-4)',
          padding:'40px 28px', textAlign:'center',
          display:'flex', flexDirection:'column', alignItems:'center', gap:14,
        }}>
          <div style={{
            width:64, height:64, borderRadius:'var(--r-4)',
            background:'var(--bc-orange-tint)', border:'2px solid '+INK,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <Ico name="hammer" size={28} />
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, letterSpacing:'-0.02em', color:INK }}>{name} · desktop view coming next</div>
          <p style={{ fontFamily:'var(--font-body)', fontSize:14, lineHeight:1.55, color:INK2, margin:0, maxWidth:420 }}>{hint}</p>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:INK3, marginTop:8 }}>Resize browser below 1024px to see the mobile version</div>
        </div>
      </div>
    );
  }

  function MiniPill({ kind, children }) {
    const map = { blocked:{c:'#B82A1F',bg:'#F6DDD7'}, open:{c:'#1F5A8A',bg:'#D9E5F0'}, late:{c:'#FAFAF7',bg:'#B82A1F'} };
    const s = map[kind] || map.open;
    return <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11,
      textTransform:'uppercase', letterSpacing:'0.05em',
      padding:'3px 8px', borderRadius:'var(--r-2)',
      border:'1.5px solid '+s.c, background:s.bg, color:s.c,
    }}><span style={{ width:6, height:6, background:'currentColor', borderRadius:999 }}/>{children}</span>;
  }

  function FilterChip({ children, on, dropdown }) {
    return <button style={{
      height:32, padding:'0 12px', cursor:'pointer',
      border:'1.5px solid '+(on ? INK : LINE),
      background: on ? INK : PAPER, color: on ? PAPER : INK,
      borderRadius:'var(--r-2)',
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11,
      letterSpacing:'0.04em', textTransform:'uppercase', whiteSpace:'nowrap',
      display:'inline-flex', alignItems:'center', gap:4,
    }}>{children}{dropdown && <span style={{fontSize:9, marginLeft:2}}>▾</span>}</button>;
  }

  // ─────────────────────────────────────────────────────────────
  // MOBILE — phone frame, screens render in place
  // ─────────────────────────────────────────────────────────────
  function MobileShell({ tab, setTab }) {
    // Mobile reuses the existing screen components which already include
    // their own bottom tab bars. We pass setTab via context if needed; for
    // now the bottom-bar inside each screen is decorative, sidebar controls.
    return (
      <div style={{
        ...RESET, height:'100%', width:'100%',
        background:PAPER2, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'14px 12px',
        overflow:'hidden',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, flexShrink:0 }}>
          {NAV.map(n => {
            const on = n.id === tab;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} style={{
                height:28, padding:'0 10px', cursor:'pointer',
                border:'1.5px solid '+(on ? INK : LINE),
                background: on ? INK : PAPER, color: on ? PAPER : INK,
                borderRadius:'var(--r-2)',
                fontFamily:'var(--font-mono)', fontWeight:600, fontSize:9.5,
                letterSpacing:'0.05em', textTransform:'uppercase',
                display:'inline-flex', alignItems:'center', gap:5,
              }}>
                <Ico name={n.icon} size={11} onActive={on} color={on ? undefined : 'muted'} />
                {n.label}
              </button>
            );
          })}
        </div>
        <MobilePhone tab={tab} />
      </div>
    );
  }

  function MobilePhone({ tab }) {
    // Render the active mobile screen inside the phone frame.
    // Falls back gracefully if the component isn't loaded.
    const ScreenMap = {
      today:  window.HomeLocked,
      sites:  window.SitesScreen,
      punch:  window.PunchTabScreen,
      trades: window.TradesTabScreen,
      me:     window.MeTabScreen,
    };
    const Screen = ScreenMap[tab];

    const [scale, setScale] = useState(1);
    useEffect(() => {
      const fit = () => {
        const w = Math.max(280, window.innerWidth - 24);
        const h = Math.max(420, window.innerHeight - 130);
        setScale(Math.min(1, w / 360, h / 720));
      };
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }, []);

    return (
      <div style={{
        width: 360 * scale, height: 720 * scale,
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          width:360, height:720, background:'#14110D',
          borderRadius:42, padding:8,
          boxShadow:'0 30px 60px rgba(20,17,13,0.18), 0 0 0 2px '+INK,
          position:'absolute', top:0, left:0,
          transform:`scale(${scale})`, transformOrigin:'top left',
        }}>
          <div style={{
            position:'absolute', top:12, left:'50%', transform:'translateX(-50%)',
            width:100, height:26, background:'#000', borderRadius:18, zIndex:5,
          }} />
          <div style={{
            width:'100%', height:'100%', background:PAPER,
            borderRadius:34, overflow:'hidden', position:'relative',
            display:'flex', flexDirection:'column',
          }}>
            {Screen ? <Screen /> : (
              <div style={{
                padding:'40px 24px', textAlign:'center',
                fontFamily:'var(--font-mono)', fontSize:12, color:INK3,
              }}>Loading {tab}…</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { CondenserApp });
})();
