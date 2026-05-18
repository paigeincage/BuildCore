// site-detail.jsx — Screen 7/8: Site detail
(function () {
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

  function HeaderRow() {
    return <div style={{
      ...RESET, padding:'4px 18px 6px',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexShrink:0,
    }}>
      <button style={{
        height:32, padding:'0 8px 0 4px', display:'inline-flex', alignItems:'center', gap:4,
        background:'transparent', border:0, cursor:'pointer',
        fontFamily:'var(--font-body)', fontWeight:600, fontSize:13, color:INK,
      }}>
        <Ico name="chevron-left" size={18} />Sites
      </button>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, minWidth:0 }}>
        <div style={{ width:16, height:12, background:ORANGE, clipPath:'polygon(0 100%, 0 0, 70% 0, 100% 100%)', flexShrink:0 }} />
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.05em', textTransform:'uppercase', color:INK3 }}>Condenser</span>
      </div>
      <button style={{
        width:32, height:32, border:'1.5px solid '+LINE, background:PAPER,
        borderRadius:'var(--r-2)', cursor:'pointer', padding:0,
        display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}><Ico name="more-horizontal" size={14} color="muted" /></button>
    </div>;
  }

  function TabBar() {
    return <div style={{
      ...RESET, display:'grid', gridTemplateColumns:'repeat(5,1fr)',
      borderTop:'2px solid '+LINES, background:PAPER, paddingBottom:12, flexShrink:0,
    }}>
      {[
        { id:'today',  icon:'sun', label:'Today' },
        { id:'sites',  icon:'home', label:'Sites', on:true },
        { id:'punch',  icon:'clipboard-list', label:'Punch' },
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

  function PunchRow({ it }) {
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'center', gap:10,
        padding:'10px 12px',
        background:PAPER, border:'1.5px solid '+LINES, borderRadius:'var(--r-2)',
        borderLeft: it.pri === 'hot' ? '3px solid '+RED : '1.5px solid '+LINES,
      }}>
        <PriorityDot pri={it.pri} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontFamily:'var(--font-body)', fontWeight:600, fontSize:13,
            color:INK, lineHeight:1.25,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{it.text}</div>
          <div style={{
            display:'flex', alignItems:'center', gap:6, marginTop:4, flexWrap:'wrap',
          }}>
            <Stamp>{it.trade}</Stamp>
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:9.5, fontWeight:600,
              letterSpacing:'0.04em', textTransform:'uppercase',
              color: it.overdue ? RED : INK3, whiteSpace:'nowrap',
            }}>Due {it.due}{it.overdue ? ' · LATE' : ''}</span>
          </div>
        </div>
      </div>
    );
  }

  function SiteDetailScreen() {
    const items = [
      { text:'Hairline crack — master bath tile, north wall',  trade:'Tile',       pri:'hot',  due:'05/19', overdue:true },
      { text:'Toilet supply line — slow drip behind escutch.', trade:'Plumbing',   pri:'elev', due:'Today' },
      { text:'Outlet missing cover plate — powder room',        trade:'Electrical', pri:'norm', due:'05/18' },
      { text:'Door rub on master closet',                       trade:'Doors',      pri:'norm', due:'05/18' },
    ];
    return (
      <div style={{ ...RESET, background:PAPER, height:'100%', width:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <StatusBar />
        <HeaderRow />

        {/* Scrollable body */}
        <div style={{
          ...RESET, flex:1, minHeight:0, padding:'4px 18px 12px',
          display:'flex', flexDirection:'column', gap:14,
          overflowY:'auto',
        }}>
          {/* Address hero */}
          <div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.06em', textTransform:'uppercase', color:INK3, marginBottom:4,
            }}>Ashford community · SAMPLE</div>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight:900, fontSize:26,
              letterSpacing:'-0.03em', lineHeight:1, color:INK,
            }}>14 Sycamore Ln</div>
            <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
              <span style={{
                fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
                letterSpacing:'0.05em', textTransform:'uppercase',
                padding:'3px 8px', borderRadius:'var(--r-2)',
                background:ORANGE, color:PAPER, border:'1.5px solid '+INK,
              }}>Pre-walk</span>
              <Stamp>Plan: Cypress B</Stamp>
              <Stamp>3 BR · 2.5 BA</Stamp>
            </div>
          </div>

          {/* Stat strip */}
          <div style={{
            ...RESET, display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            border:'2px solid '+INK, borderRadius:'var(--r-2)', overflow:'hidden',
            boxShadow:'3px 3px 0 0 '+INK,
          }}>
            <StatCell big="12"  small="open"     accent />
            <StatCell big="1"   small="blocked"  warn />
            <StatCell big="4"   small="due today" />
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <span style={{
                fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
                letterSpacing:'0.06em', textTransform:'uppercase', color:INK3,
                flex:1,
              }}>Walk progress · 72%</span>
              <span style={{
                fontFamily:'var(--font-mono)', fontWeight:700, fontSize:10,
                letterSpacing:'0.04em', textTransform:'uppercase', color:INK,
              }}>31 / 43 closed</span>
            </div>
            <div style={{
              height:8, background:PAPER3, border:'1.5px solid '+LINES,
              borderRadius:2, overflow:'hidden',
            }}>
              <div style={{ width:'72%', height:'100%', background:ORANGE }} />
            </div>
          </div>

          {/* Action row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <button style={{
              height:48, padding:'0 12px', cursor:'pointer',
              border:'2px solid '+INK, background:PAPER, color:INK,
              borderRadius:'var(--r-2)',
              fontFamily:'var(--font-body)', fontWeight:700, fontSize:13.5,
              display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>
              <Ico name="upload" size={14} />
              Add files
            </button>
            <button style={{
              height:48, padding:'0 12px', cursor:'pointer',
              border:'2px solid '+INK, background:ORANGE, color:PAPER,
              borderRadius:'var(--r-2)', boxShadow:'3px 3px 0 0 '+INK,
              fontFamily:'var(--font-body)', fontWeight:700, fontSize:13.5,
              display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>
              <Ico name="send" size={14} onPrimary />
              Send list
            </button>
          </div>

          {/* Punch list summary */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{
                fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
                letterSpacing:'0.08em', textTransform:'uppercase', color:INK3,
                display:'inline-flex', alignItems:'center', gap:7,
              }}>
                <span style={{ display:'inline-block', width:12, height:2, background:ORANGE }} />
                Open punches
              </span>
              <button style={{
                background:'transparent', border:0, padding:0, cursor:'pointer',
                fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
                letterSpacing:'0.05em', textTransform:'uppercase', color:INK,
              }}>View all · 12</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {items.map((it, i) => <PunchRow key={i} it={it} />)}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <div style={{
              fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
              letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:8,
              display:'inline-flex', alignItems:'center', gap:7,
            }}>
              <span style={{ display:'inline-block', width:12, height:2, background:ORANGE }} />
              Recent activity
            </div>
            <div style={{
              ...RESET, padding:'10px 12px',
              background:PAPER, border:'1.5px solid '+LINES, borderRadius:'var(--r-2)',
              display:'flex', flexDirection:'column', gap:8,
            }}>
              <ActivityLine icon="send"  text="Sent 2 items to J. Morales · Tile" when="9:14a" />
              <ActivityLine icon="check" text="Closed: Caulk gap at tub deck" when="Yest" />
              <ActivityLine icon="mic"   text="Voice memo · 0:32" when="Yest" />
            </div>
          </div>

          <div style={{ height:4 }} />
        </div>

        <TabBar />
      </div>
    );
  }

  function StatCell({ big, small, accent, warn }) {
    return (
      <div style={{
        padding:'10px 10px',
        background: accent ? 'var(--bc-orange-tint)' : PAPER,
        borderRight: small === 'due today' ? 'none' : '2px solid '+INK,
      }}>
        <div style={{
          fontFamily:'var(--font-display)', fontWeight:900, fontSize:22,
          letterSpacing:'-0.025em', lineHeight:1,
          color: warn ? RED : INK,
        }}>{big}</div>
        <div style={{
          fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
          letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
          marginTop:4,
        }}>{small}</div>
      </div>
    );
  }

  function ActivityLine({ icon, text, when }) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
        <div style={{
          width:24, height:24, borderRadius:'var(--r-2)',
          background:PAPER2, border:'1.5px solid '+LINE,
          display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <Ico name={icon} size={11} color="muted" />
        </div>
        <span style={{
          flex:1, minWidth:0,
          fontFamily:'var(--font-body)', fontSize:12.5, color:INK,
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>{text}</span>
        <span style={{
          fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
          letterSpacing:'0.04em', textTransform:'uppercase', color:INK3, flexShrink:0,
        }}>{when}</span>
      </div>
    );
  }

  Object.assign(window, { SiteDetailScreen });
})();
