// trades-tab.jsx — Screen 5/8: Trades tab (contacts directory)
(function () {
  const { useState } = React;
  const ICON   = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;
  const PAPER  = 'var(--bc-paper)', PAPER2 = 'var(--bc-paper-2)';
  const INK    = 'var(--bc-ink)', INK2 = 'var(--bc-ink-2)', INK3 = 'var(--bc-ink-3)';
  const LINE   = 'var(--bc-line)', LINES = 'var(--bc-line-strong)';
  const ORANGE = 'var(--bc-orange)';
  const RESET  = { boxSizing:'border-box', maxWidth:'100%', minWidth:0 };

  function Ico({ name, size = 18, color, onPrimary }) {
    return <img src={ICON(name)} width={size} height={size} alt="" style={{
      display:'block', flexShrink:0,
      filter: onPrimary ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
            : color === 'muted' ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
            : color === 'orange' ? 'invert(43%) sepia(63%) saturate(835%) hue-rotate(346deg) brightness(89%) contrast(86%)'
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
        width:32, height:32, border:'2px solid '+INK, background:ORANGE,
        borderRadius:'var(--r-2)', cursor:'pointer', padding:0,
        boxShadow:'2px 2px 0 0 '+INK,
        display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}><Ico name="plus" size={14} onPrimary /></button>
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
        { id:'punch',  icon:'clipboard-list', label:'Punch' },
        { id:'trades', icon:'hard-hat', label:'Trades', on:true },
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

  function TradeChip({ children }) {
    return <span style={{
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:9.5,
      letterSpacing:'0.03em', textTransform:'uppercase',
      padding:'2px 6px', borderRadius:'var(--r-2)',
      border:'1.5px solid '+LINE, background:PAPER2, color:INK,
      flexShrink:0, whiteSpace:'nowrap',
    }}>{children}</span>;
  }

  function ChannelBadge({ kind }) {
    const map = {
      text:  { icon:'message-square', label:'Text' },
      email: { icon:'mail',           label:'Email' },
      both:  { icon:'check-circle',   label:'Both' },
    };
    const s = map[kind];
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', gap:4,
        fontFamily:'var(--font-mono)', fontWeight:600, fontSize:9,
        letterSpacing:'0.04em', textTransform:'uppercase', color:INK2,
        padding:'2px 6px', borderRadius:'var(--r-2)',
        background:PAPER2, border:'1.5px solid '+LINE,
        flexShrink:0, whiteSpace:'nowrap',
      }}>
        <Ico name={s.icon} size={11} color="muted" />{s.label}
      </span>
    );
  }

  function TradesTabScreen() {
    const contacts = [
      { initials:'JM', name:'J. Morales',  role:'Owner',             company:'Pro Tile Co.',       trades:['Tile','Stucco / Stone'],     channel:'text',  active:true },
      { initials:'RT', name:'R. Tanaka',   role:'Field supervisor',  company:'Volt Electric',      trades:['Electrical'],                channel:'both' },
      { initials:'DK', name:'D. Kowalski', role:'Foreman',           company:'Doorworks LLC',      trades:['Door Hardware','Doors'],     channel:'text' },
      { initials:'BP', name:'B. Pham',     role:'Owner',             company:'Patriot Plumbing',   trades:['Plumbing'],                  channel:'email' },
      { initials:'MA', name:'M. Alvarez',  role:'Crew lead',         company:'A1 Drywall',         trades:['Drywall','Painting'],        channel:'text' },
      { initials:'SK', name:'S. Klein',                              company:'Klein Cabinets',     trades:['Cabinets / Countertops'],    channel:'both' },
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
          }}>Trades</div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8, minWidth:0 }}>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
              letterSpacing:'-0.025em', lineHeight:1, color:INK,
            }}>32 contacts</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.05em', textTransform:'uppercase', color:INK3, whiteSpace:'nowrap',
            }}>14 trades covered</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ ...RESET, padding:'10px 18px 6px', flexShrink:0 }}>
          <div style={{
            height:38, padding:'0 12px',
            display:'flex', alignItems:'center', gap:8,
            background:PAPER, border:'1.5px solid '+LINES,
            borderRadius:'var(--r-2)',
          }}>
            <Ico name="search" size={14} color="muted" />
            <span style={{
              flex:1, fontFamily:'var(--font-body)', fontSize:13, color:INK3,
            }}>Search name, company, trade…</span>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ ...RESET, padding:'2px 18px 6px', flexShrink:0,
          display:'flex', gap:5, overflowX:'auto',
        }}>
          <FilterChip on>All</FilterChip>
          <FilterChip dropdown>By trade</FilterChip>
          <FilterChip>Active</FilterChip>
          <FilterChip>Missing email</FilterChip>
        </div>

        {/* List */}
        <div style={{
          ...RESET, flex:1, minHeight:0,
          padding:'2px 18px 12px',
          display:'flex', flexDirection:'column', gap:6,
          overflowY:'auto',
        }}>
          {contacts.map((c, i) => <ContactRow key={i} c={c} />)}
        </div>

        {/* Pinned "Import from CSV" */}
        <div style={{
          ...RESET, padding:'10px 18px 10px',
          background:PAPER, borderTop:'1.5px solid '+LINE, flexShrink:0,
        }}>
          <button style={{
            width:'100%', height:48, padding:'0 14px', cursor:'pointer',
            border:'2px solid '+INK, background:PAPER, color:INK,
            borderRadius:'var(--r-2)',
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:14,
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            <Ico name="upload" size={16} />
            Import from CSV
          </button>
        </div>

        <TabBar />
      </div>
    );
  }

  function ContactRow({ c }) {
    // Role color — Owner/PM are orange (decision-makers), supervisors/foremen ink, crew muted
    const isPrincipal = c.role && /(owner|pm|project)/i.test(c.role);
    const roleColor = isPrincipal ? ORANGE : INK;
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'flex-start', gap:10,
        padding:'10px 12px',
        background:PAPER, border:'1.5px solid '+LINES, borderRadius:'var(--r-2)',
      }}>
        <div style={{
          width:36, height:36, borderRadius:999, flexShrink:0,
          background: c.active ? ORANGE : PAPER2,
          color: c.active ? PAPER : INK,
          border:'2px solid '+INK,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          fontFamily:'var(--font-mono)', fontWeight:700, fontSize:11,
          letterSpacing:'0.02em',
        }}>{c.initials}</div>
        <div style={{ flex:1, minWidth:0 }}>
          {/* Name row — name + optional role badge inline */}
          <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
            <span style={{
              fontFamily:'var(--font-display)', fontWeight:700, fontSize:14,
              letterSpacing:'-0.015em', color:INK, lineHeight:1.15,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{c.name}</span>
            {c.role && (
              <span style={{
                flexShrink:0,
                fontFamily:'var(--font-mono)', fontWeight:700, fontSize:8.5,
                letterSpacing:'0.06em', textTransform:'uppercase',
                padding:'1px 5px', borderRadius:'var(--r-2)',
                border:'1.5px solid '+roleColor,
                background: isPrincipal ? 'var(--bc-orange-tint)' : PAPER2,
                color: roleColor,
              }}>{c.role}</span>
            )}
          </div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:9.5, fontWeight:600,
            letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
            marginTop:2,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{c.company}</div>
          <div style={{
            display:'flex', alignItems:'center', gap:4, marginTop:6, flexWrap:'wrap',
          }}>
            {c.trades.map(t => <TradeChip key={t}>{t}</TradeChip>)}
            <ChannelBadge kind={c.channel} />
          </div>
        </div>
        <Ico name="chevron-right" size={16} color="muted" />
      </div>
    );
  }

  Object.assign(window, { TradesTabScreen });
})();
