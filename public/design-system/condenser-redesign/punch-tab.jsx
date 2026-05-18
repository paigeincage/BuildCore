// punch-tab.jsx — Screen 4/8: Punch tab (all items, cross-site)
(function () {
  const { useState } = React;
  const ICON   = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;
  const PAPER  = 'var(--bc-paper)', PAPER2 = 'var(--bc-paper-2)', PAPER3 = 'var(--bc-paper-3)';
  const INK    = 'var(--bc-ink)', INK2 = 'var(--bc-ink-2)', INK3 = 'var(--bc-ink-3)';
  const LINE   = 'var(--bc-line)', LINES = 'var(--bc-line-strong)';
  const ORANGE = 'var(--bc-orange)', RED = 'var(--bc-red)';
  const RESET  = { boxSizing:'border-box', maxWidth:'100%', minWidth:0 };

  function Ico({ name, size = 18, color, onPrimary }) {
    return <img src={ICON(name)} width={size} height={size} alt="" style={{
      display:'block', flexShrink:0,
      filter: onPrimary ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
            : color === 'muted' ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
            : color === 'red'   ? 'invert(20%) sepia(96%) saturate(2900%) hue-rotate(354deg) brightness(85%) contrast(95%)'
            : 'none',
    }} />;
  }

  function StatusBar() {
    return <div style={{
      ...RESET, height:44, padding:'14px 18px 0',
      display:'flex', alignItems:'flex-end', justifyContent:'space-between',
      fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
      fontSize:12, fontWeight:600, color:INK, flexShrink:0,
    }}><span>9:41</span><span style={{ fontFamily:'var(--font-mono)', fontSize:9 }}>100%</span></div>;
  }

  function BrandRow() {
    return <div style={{
      ...RESET, padding:'6px 18px 4px',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexShrink:0,
    }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, minWidth:0 }}>
        <div style={{ width:18, height:14, background:ORANGE, clipPath:'polygon(0 100%, 0 0, 70% 0, 100% 100%)', flexShrink:0 }} />
        <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:12, letterSpacing:'-0.025em', color:INK, lineHeight:1 }}>BuildCore</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.05em', textTransform:'uppercase', color:INK3, marginLeft:4 }}>· Condenser</span>
      </div>
      <button style={{
        width:32, height:32, border:'1.5px solid '+LINE, background:PAPER,
        borderRadius:'var(--r-2)', cursor:'pointer', padding:0,
        display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}><Ico name="search" size={14} color="muted" /></button>
    </div>;
  }

  function TabBar() {
    return <div style={{
      ...RESET, display:'grid', gridTemplateColumns:'repeat(5,1fr)',
      borderTop:'2px solid '+LINES, background:PAPER, paddingBottom:12, flexShrink:0,
    }}>
      {[
        { id:'today',  icon:'sun', label:'Today' },
        { id:'sites',  icon:'home', label:'Sites' },
        { id:'punch',  icon:'clipboard-list', label:'Punch', on:true },
        { id:'trades', icon:'hard-hat', label:'Trades' },
        { id:'me',     icon:'user', label:'Me' },
      ].map(t => (
        <div key={t.id} style={{
          height:52, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:2,
          borderTop: t.on ? '3px solid '+ORANGE : '3px solid transparent', marginTop:-2,
        }}>
          <Ico name={t.icon} size={18} color={t.on ? undefined : 'muted'} />
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.04em',
            textTransform:'uppercase', fontWeight: t.on ? 600 : 500, color: t.on ? INK : INK3,
          }}>{t.label}</span>
        </div>
      ))}
    </div>;
  }

  function Stamp({ children, tone }) {
    const c = tone === 'red' ? RED : INK;
    return <span style={{
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:9.5, letterSpacing:'0.03em', textTransform:'uppercase',
      padding:'2px 6px', borderRadius:'var(--r-2)', border:'1.5px solid '+LINE,
      background:PAPER2, color:c, flexShrink:0, whiteSpace:'nowrap',
    }}>{children}</span>;
  }

  function PriorityDot({ pri }) {
    const c = pri === 'hot' ? RED : pri === 'elev' ? ORANGE : INK3;
    return <span style={{
      width:10, height:10, borderRadius:999, background:c,
      border:'1.5px solid '+INK, flexShrink:0,
    }} />;
  }

  function FilterChip({ children, dropdown, on }) {
    return <button style={{
      height:30, padding:'0 10px', cursor:'pointer', flexShrink:0,
      border:'1.5px solid '+(on ? INK : LINE),
      background: on ? INK : PAPER, color: on ? PAPER : INK,
      borderRadius:'var(--r-2)',
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
      letterSpacing:'0.04em', textTransform:'uppercase', whiteSpace:'nowrap',
      display:'inline-flex', alignItems:'center', gap:4,
    }}>
      {children}
      {dropdown && <span style={{ fontSize:8, marginLeft:2 }}>▾</span>}
    </button>;
  }

  function PunchTabScreen() {
    const items = [
      { addr:'14 Sycamore Ln', site:'Ashford', text:'Hairline crack — master bath tile, north wall',  trade:'Tile',       pri:'hot',  due:'05/19', overdue:true },
      { addr:'14 Sycamore Ln', site:'Ashford', text:'Toilet supply line — slow drip behind escutch.', trade:'Plumbing',   pri:'elev', due:'Today' },
      { addr:'11 Willow Bend', site:'Hampton', text:'Touch-up paint — stair stringer, 2nd flight',     trade:'Painting',   pri:'elev', due:'Today' },
      { addr:'14 Sycamore Ln', site:'Ashford', text:'Outlet missing cover plate — powder room',        trade:'Electrical', pri:'norm', due:'05/18' },
      { addr:'23 Birchwood Ct',site:'Ashford', text:'Stud out of plumb at SW corner',                  trade:'Framing',    pri:'norm', due:'05/20' },
      { addr:'14 Sycamore Ln', site:'Ashford', text:'Door rub on master closet',                       trade:'Doors',      pri:'norm', due:'05/18' },
    ];
    return (
      <div style={{ ...RESET, background:PAPER, height:'100%', width:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <StatusBar />
        <BrandRow />

        {/* Title row */}
        <div style={{ ...RESET, padding:'4px 18px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:2,
          }}>Punch</div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8, minWidth:0 }}>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
              letterSpacing:'-0.025em', lineHeight:1, color:INK, flexShrink:0,
            }}>47 open</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
              whiteSpace:'nowrap',
            }}>across 4 sites</div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ ...RESET, padding:'12px 18px 6px', flexShrink:0,
          display:'flex', gap:5, overflowX:'auto',
        }}>
          <FilterChip dropdown>All sites · 4</FilterChip>
          <FilterChip dropdown>All trades</FilterChip>
          <FilterChip on>Open</FilterChip>
          <FilterChip>Hot</FilterChip>
          <FilterChip>Late</FilterChip>
        </div>

        {/* Summary line */}
        <div style={{ ...RESET, padding:'2px 18px 8px', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.06em', textTransform:'uppercase', color:INK3,
            display:'inline-flex', alignItems:'center', gap:7,
          }}>
            <span style={{ display:'inline-block', width:12, height:2, background:ORANGE }} />
            6 of 47 · sorted by priority
          </div>
          <button style={{
            background:'transparent', border:0, padding:0, cursor:'pointer',
            fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
            letterSpacing:'0.05em', textTransform:'uppercase', color:INK,
            display:'inline-flex', alignItems:'center', gap:4,
          }}>
            <Ico name="sliders-horizontal" size={12} color="muted" />
            Sort
          </button>
        </div>

        {/* Scrollable list */}
        <div style={{
          ...RESET, flex:1, minHeight:0,
          padding:'2px 18px 12px',
          display:'flex', flexDirection:'column', gap:6,
          overflowY:'auto',
        }}>
          {items.map((it, i) => <PunchRow key={i} it={it} />)}
        </div>

        <TabBar />
      </div>
    );
  }

  function PunchRow({ it }) {
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'flex-start', gap:10,
        padding:'10px 12px',
        background:PAPER, border:'1.5px solid '+LINES, borderRadius:'var(--r-2)',
        borderLeft: it.pri === 'hot' ? '3px solid '+RED : '1.5px solid '+LINES,
      }}>
        <PriorityDot pri={it.pri} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:9.5, fontWeight:600,
            letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{it.addr} · {it.site}</div>
          <div style={{
            fontFamily:'var(--font-body)', fontWeight:600, fontSize:13,
            color:INK, lineHeight:1.25, marginTop:2,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{it.text}</div>
          <div style={{
            display:'flex', alignItems:'center', gap:6, marginTop:5, flexWrap:'wrap',
          }}>
            <Stamp>{it.trade}</Stamp>
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:9.5, fontWeight:600,
              letterSpacing:'0.04em', textTransform:'uppercase',
              color: it.overdue ? RED : INK3,
              whiteSpace:'nowrap',
            }}>Due {it.due}{it.overdue ? ' · LATE' : ''}</span>
          </div>
        </div>
        <Ico name="chevron-right" size={16} color="muted" />
      </div>
    );
  }

  Object.assign(window, { PunchTabScreen });
})();
