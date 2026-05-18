// desktop-shell.jsx — The Condenser desktop shell (Direction C · Hybrid)
// Defines the rules for adapting the mobile-first app to desktop width.
// Reused by every desktop screen — sidebar nav + topbar + content area.

(function () {
  const { useState } = React;

  const ICON   = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;
  const PAPER  = 'var(--bc-paper)';
  const PAPER2 = 'var(--bc-paper-2)';
  const PAPER3 = 'var(--bc-paper-3)';
  const INK    = 'var(--bc-ink)';
  const INK2   = 'var(--bc-ink-2)';
  const INK3   = 'var(--bc-ink-3)';
  const LINE   = 'var(--bc-line)';
  const LINES  = 'var(--bc-line-strong)';
  const ORANGE = 'var(--bc-orange)';
  const RESET  = { boxSizing:'border-box', maxWidth:'100%', minWidth:0 };

  function Ico({ name, size = 18, color, onActive }) {
    return <img src={ICON(name)} width={size} height={size} alt="" style={{
      display:'block', flexShrink:0,
      filter: onActive ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
            : color === 'muted' ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
            : 'none',
    }} />;
  }

  // ─────────────────────────────────────────────────────────────
  // DesktopShell — sidebar + topbar + content frame
  // ─────────────────────────────────────────────────────────────
  function DesktopShell({ active = 'sites', title, subtitle, actions, children }) {
    return (
      <div style={{
        ...RESET, display:'grid', gridTemplateColumns:'240px 1fr',
        height:'100%', width:'100%', background:PAPER2,
      }}>
        <Sidebar active={active} />
        <main style={{ ...RESET, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <Topbar title={title} subtitle={subtitle} actions={actions} />
          <div style={{ ...RESET, flex:1, overflowY:'auto', background:PAPER2, padding:'24px 32px 48px' }}>
            <div style={{ maxWidth:1240, margin:'0 auto', minWidth:0 }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Sidebar — fixed 240px
  // ─────────────────────────────────────────────────────────────
  function Sidebar({ active }) {
    const nav = [
      { id:'today',  icon:'sun',            label:'Today' },
      { id:'sites',  icon:'home',           label:'Sites' },
      { id:'punch',  icon:'clipboard-list', label:'Punch list' },
      { id:'trades', icon:'hard-hat',       label:'Trades' },
    ];
    return (
      <aside style={{
        ...RESET, width:240, height:'100%',
        background:PAPER, borderRight:'2px solid '+LINES,
        display:'flex', flexDirection:'column',
      }}>
        {/* Brand */}
        <div style={{
          padding:'18px 20px 16px',
          borderBottom:'1.5px solid '+LINE,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <div style={{ width:22, height:18, background:ORANGE, clipPath:'polygon(0 100%, 0 0, 70% 0, 100% 100%)' }} />
          <div style={{ minWidth:0 }}>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight:900, fontSize:15,
              letterSpacing:'-0.025em', color:INK, lineHeight:1,
            }}>BuildCore</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
              letterSpacing:'0.06em', textTransform:'uppercase', color:INK3,
              marginTop:3,
            }}>The Condenser</div>
          </div>
        </div>

        {/* New punch CTA — top-anchored orange action, mirrors the mobile pinned CTA */}
        <div style={{ padding:'14px 14px 8px' }}>
          <button style={{
            width:'100%', height:42, padding:'0 12px', cursor:'pointer',
            border:'2px solid '+INK, background:ORANGE, color:PAPER,
            borderRadius:'var(--r-2)', boxShadow:'2px 2px 0 0 '+INK,
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:13.5,
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <Ico name="plus" size={14} onActive />
            New punch
          </button>
        </div>

        {/* Nav */}
        <nav style={{ ...RESET, padding:'8px 10px', flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          <div style={{
            padding:'8px 10px 6px',
            fontFamily:'var(--font-mono)', fontSize:9.5, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3,
          }}>Workspace</div>
          {nav.map(item => <NavItem key={item.id} item={item} active={active === item.id} />)}
        </nav>

        {/* Bottom: profile chip */}
        <div style={{
          padding:'10px 10px 12px',
          borderTop:'1.5px solid '+LINE,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <div style={{
            width:32, height:32, borderRadius:999, flexShrink:0,
            background:ORANGE, color:PAPER, border:'2px solid '+INK,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--font-mono)', fontWeight:700, fontSize:11,
          }}>—</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{
              fontFamily:'var(--font-body)', fontWeight:600, fontSize:12.5,
              color:INK,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>Your account</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
              letterSpacing:'0.04em', textTransform:'uppercase', color:INK3,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>SAMPLE</div>
          </div>
          <button aria-label="Settings" style={{
            width:30, height:30, padding:0, cursor:'pointer',
            background:'transparent', border:'1.5px solid '+LINE,
            borderRadius:'var(--r-2)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <Ico name="settings" size={14} color="muted" />
          </button>
        </div>
      </aside>
    );
  }

  function NavItem({ item, active }) {
    return (
      <a href="#" style={{
        ...RESET, display:'flex', alignItems:'center', gap:10,
        padding:'10px 10px 10px 12px', textDecoration:'none',
        background: active ? INK : 'transparent',
        color: active ? PAPER : INK,
        borderRadius:'var(--r-2)',
        fontFamily:'var(--font-body)', fontWeight: active ? 700 : 500, fontSize:13.5,
        position:'relative',
      }}>
        {active && (
          <span style={{
            position:'absolute', left:-10, top:6, bottom:6, width:3,
            background:ORANGE, borderRadius:2,
          }} />
        )}
        <Ico name={item.icon} size={16} onActive={active} color={active ? undefined : 'muted'} />
        <span style={{
          flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>{item.label}</span>
      </a>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Topbar — slim, contextual title + actions
  // ─────────────────────────────────────────────────────────────
  function Topbar({ title, subtitle, actions }) {
    return (
      <div style={{
        ...RESET, height:64, padding:'0 32px',
        background:PAPER, borderBottom:'1.5px solid '+LINES,
        display:'flex', alignItems:'center', gap:18, flexShrink:0,
      }}>
        <div style={{ flex:1, minWidth:0 }}>
          {subtitle && (
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.08em', textTransform:'uppercase', color:INK3,
              marginBottom:2,
            }}>{subtitle}</div>
          )}
          {title && (
            <div style={{
              fontFamily:'var(--font-display)', fontWeight:800, fontSize:20,
              letterSpacing:'-0.025em', color:INK, lineHeight:1,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{title}</div>
          )}
        </div>

        {/* Search */}
        <div style={{
          height:36, width:280, padding:'0 12px', flexShrink:0,
          display:'flex', alignItems:'center', gap:8,
          background:PAPER2, border:'1.5px solid '+LINE,
          borderRadius:'var(--r-2)',
        }}>
          <Ico name="search" size={14} color="muted" />
          <span style={{
            flex:1, fontFamily:'var(--font-body)', fontSize:12.5, color:INK3,
          }}>Search sites, punches, trades</span>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            color:INK3, padding:'1px 5px',
            background:PAPER, border:'1.5px solid '+LINE, borderRadius:3,
          }}>⌘ K</span>
        </div>

        {actions || (
          <button aria-label="Notifications" style={{
            width:36, height:36, padding:0, cursor:'pointer', flexShrink:0,
            background:PAPER, border:'1.5px solid '+LINE,
            borderRadius:'var(--r-2)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            position:'relative',
          }}>
            <Ico name="bell" size={14} color="muted" />
            <span style={{
              position:'absolute', top:5, right:5,
              width:7, height:7, borderRadius:999, background:ORANGE,
              border:'1.5px solid '+PAPER,
            }} />
          </button>
        )}
      </div>
    );
  }

  Object.assign(window, { DesktopShell, Sidebar, Topbar });
})();
