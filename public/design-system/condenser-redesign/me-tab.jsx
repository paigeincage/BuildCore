// me-tab.jsx — Screen 6/8: Me / Settings (consolidated)
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
      <span style={{
        fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
        letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
      }}>v2026.5</span>
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
        { id:'trades', icon:'hard-hat', label:'Trades' },
        { id:'me',     icon:'user', label:'Me', on:true },
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

  function GroupHeader({ children }) {
    return <div style={{
      fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
      letterSpacing:'0.08em', textTransform:'uppercase', color:INK3,
      padding:'0 4px 6px',
      display:'inline-flex', alignItems:'center', gap:7,
    }}>
      <span style={{ display:'inline-block', width:12, height:2, background:ORANGE }} />
      {children}
    </div>;
  }

  function Row({ icon, label, value, last, chevron = true, danger }) {
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'center', gap:10,
        padding:'12px 12px',
        borderBottom: last ? 'none' : '1px solid '+LINE,
        minHeight:48,
      }}>
        <div style={{
          width:28, height:28, borderRadius:'var(--r-2)',
          background: danger ? '#F6DDD7' : PAPER2,
          border:'1.5px solid '+LINE,
          display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <Ico name={icon} size={14} color={danger ? 'red' : 'muted'} />
        </div>
        <div style={{
          flex:1, fontFamily:'var(--font-body)', fontWeight:500, fontSize:13.5,
          color: danger ? RED : INK,
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>{label}</div>
        {value && <span style={{
          fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
          letterSpacing:'0.04em', textTransform:'uppercase', color:INK3,
          maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>{value}</span>}
        {chevron && <Ico name="chevron-right" size={14} color="muted" />}
      </div>
    );
  }

  function Toggle({ on }) {
    return (
      <div style={{
        width:36, height:22, borderRadius:999,
        background: on ? ORANGE : PAPER3,
        border:'1.5px solid '+INK,
        position:'relative', flexShrink:0,
      }}>
        <div style={{
          position:'absolute', top:1, left: on ? 14 : 1,
          width:16, height:16, borderRadius:999, background:PAPER,
          border:'1.5px solid '+INK,
        }} />
      </div>
    );
  }

  function ToggleRow({ icon, label, on, last }) {
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'center', gap:10,
        padding:'12px 12px',
        borderBottom: last ? 'none' : '1px solid '+LINE,
        minHeight:48,
      }}>
        <div style={{
          width:28, height:28, borderRadius:'var(--r-2)',
          background:PAPER2, border:'1.5px solid '+LINE,
          display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <Ico name={icon} size={14} color="muted" />
        </div>
        <div style={{
          flex:1, fontFamily:'var(--font-body)', fontWeight:500, fontSize:13.5, color:INK,
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>{label}</div>
        <Toggle on={on} />
      </div>
    );
  }

  function GroupCard({ children }) {
    return (
      <div style={{
        ...RESET, background:PAPER, border:'1.5px solid '+LINES,
        borderRadius:'var(--r-2)', overflow:'hidden',
      }}>{children}</div>
    );
  }

  function MeTabScreen() {
    return (
      <div style={{ ...RESET, background:PAPER, height:'100%', width:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <StatusBar />
        <BrandRow />

        {/* Title */}
        <div style={{ ...RESET, padding:'4px 18px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:2,
          }}>Me</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
            letterSpacing:'-0.025em', lineHeight:1, color:INK,
          }}>Settings</div>
        </div>

        {/* Scrollable content */}
        <div style={{
          ...RESET, flex:1, minHeight:0,
          padding:'14px 18px 12px',
          display:'flex', flexDirection:'column', gap:18,
          overflowY:'auto',
        }}>

          {/* Profile card — stamped */}
          <div style={{
            ...RESET, background:PAPER, border:'2px solid '+INK,
            borderRadius:'var(--r-4)', boxShadow:'3px 3px 0 0 '+INK,
            padding:'12px 14px',
            display:'flex', alignItems:'center', gap:12,
          }}>
            <div style={{
              width:44, height:44, borderRadius:999, flexShrink:0,
              background:ORANGE, color:PAPER, border:'2px solid '+INK,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13,
            }}>—</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{
                fontFamily:'var(--font-display)', fontWeight:800, fontSize:15,
                letterSpacing:'-0.015em', color:INK,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>Your name</div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:9.5, fontWeight:600,
                letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
                marginTop:2,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>+1 (555) 123-4567 · SAMPLE</div>
            </div>
            <button style={{
              height:32, padding:'0 10px', cursor:'pointer',
              border:'1.5px solid '+LINE, background:PAPER2, color:INK,
              borderRadius:'var(--r-2)',
              fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
              letterSpacing:'0.04em', textTransform:'uppercase',
            }}>Edit</button>
          </div>

          {/* PROFILE group */}
          <div>
            <GroupHeader>Profile</GroupHeader>
            <GroupCard>
              <Row icon="user"     label="Display name"      value="Set name" />
              <Row icon="briefcase" label="Role · company"   value="CM" />
              <Row icon="phone"    label="Mobile"            value="(555) 123-4567" last />
            </GroupCard>
          </div>

          {/* COMMUNITIES group */}
          <div>
            <GroupHeader>Communities</GroupHeader>
            <GroupCard>
              <Row icon="map"  label="Active communities" value="2 · Ashford · Hampton" />
              <Row icon="plus" label="Add community"      chevron last />
            </GroupCard>
          </div>

          {/* TRADES & CONTACTS group */}
          <div>
            <GroupHeader>Trades &amp; contacts</GroupHeader>
            <GroupCard>
              <Row icon="hard-hat" label="Manage trades"          value="14 covered" />
              <Row icon="users"    label="Contact directory"      value="32 contacts" />
              <Row icon="upload"   label="Import from CSV"        chevron last />
            </GroupCard>
          </div>

          {/* FIELD LANGUAGE group */}
          <div>
            <GroupHeader>Field language</GroupHeader>
            <GroupCard>
              <Row icon="globe"      label="Default language"  value="English" />
              <Row icon="message-square" label="Trade SMS template" chevron last />
            </GroupCard>
          </div>

          {/* NOTIFICATIONS group */}
          <div>
            <GroupHeader>Notifications</GroupHeader>
            <GroupCard>
              <ToggleRow icon="bell"            label="Daily report ready"    on />
              <ToggleRow icon="alert-triangle"  label="Blocker on a site"     on />
              <ToggleRow icon="clock"           label="Walk reminder · 6:30a" on />
              <ToggleRow icon="message-square"  label="Trade replied to text" last />
            </GroupCard>
          </div>

          {/* ACCESSIBILITY group */}
          <div>
            <GroupHeader>Accessibility</GroupHeader>
            <GroupCard>
              <ToggleRow icon="type"            label="Larger text"           />
              <ToggleRow icon="contrast"        label="Higher contrast"       on />
              <ToggleRow icon="vibrate"         label="Haptic feedback"  on  last />
            </GroupCard>
          </div>

          {/* DANGER zone */}
          <div>
            <GroupHeader>Account</GroupHeader>
            <GroupCard>
              <Row icon="life-buoy" label="Help &amp; support" />
              <Row icon="file-text" label="Privacy &amp; terms" />
              <Row icon="log-out"   label="Sign out" danger chevron={false} last />
            </GroupCard>
          </div>

          <div style={{ height:4 }} />
        </div>

        <TabBar />
      </div>
    );
  }

  Object.assign(window, { MeTabScreen });
})();
