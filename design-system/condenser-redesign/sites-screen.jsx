// sites-screen.jsx — Condenser "Sites" tab.
// Same mobile-fit discipline as home-locked.jsx:
//   - Every layout child has box-sizing + min-width:0 so text can shrink
//   - Card text uses overflow:hidden + textOverflow:ellipsis where it might run long
//   - Compact summary at top; scrollable list in the middle; pinned tab bar
//   - The scroll area carries enough bottom padding so the last card clears the tabs
//   - No visible scrollbars (the host page hides them with ::-webkit-scrollbar)

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

  const RESET = { boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 };

  function Ico({ name, size = 18, color }) {
    return (
      <img src={ICON(name)} width={size} height={size} alt="" style={{
        display: 'block', flexShrink: 0,
        filter: color === 'muted'
          ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
          : 'none',
      }} />
    );
  }

  function BrandLockup() {
    return (
      <div style={{ display:'inline-flex', alignItems:'center', gap: 6, minWidth: 0 }}>
        <div style={{
          width: 18, height: 14, background: ORANGE, flexShrink: 0,
          clipPath: 'polygon(0 100%, 0 0, 70% 0, 100% 100%)',
        }} />
        <span style={{
          fontFamily:'var(--font-display)', fontWeight: 900,
          fontSize: 12, letterSpacing:'-0.025em', color: INK, lineHeight: 1,
        }}>BuildCore</span>
        <span style={{
          fontFamily:'var(--font-mono)', fontSize: 9, letterSpacing:'0.05em',
          textTransform:'uppercase', color: INK3, marginLeft: 4,
        }}>· Condenser</span>
      </div>
    );
  }

  function Stamp({ children, tone }) {
    const c = tone === 'red' ? '#B82A1F' : tone === 'blue' ? '#1F5A8A' : INK;
    return (
      <span style={{
        fontFamily:'var(--font-mono)', fontWeight: 600,
        fontSize: 9.5, letterSpacing:'0.03em', textTransform:'uppercase',
        padding:'2px 6px', borderRadius:'var(--r-2)',
        border:'1.5px solid ' + LINE, background: PAPER2, color: c,
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>{children}</span>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SitesScreen
  // ─────────────────────────────────────────────────────────────
  function SitesScreen() {
    const [filter, setFilter] = useState('active');

    const sites = [
      { id: '14sycamore', addr: '14 Sycamore Ln', community: 'Ashford',
        walk: 'Pre-walk', open: 12, blocked: 1, nextLabel: 'Pre-walk · 8:00 AM',
        top: 'Hairline crack — master bath tile, north wall' },
      { id: '23birch',    addr: '23 Birchwood Ct', community: 'Ashford',
        walk: 'Frame', open: 4, blocked: 0, nextLabel: 'Frame insp · 11:00 AM' },
      { id: '11willow',   addr: '11 Willow Bend', community: 'Hampton',
        walk: 'Final · Buyer', open: 6, blocked: 0, late: 1, nextLabel: 'Buyer walk · 2:30 PM',
        top: 'Touch-up paint — stair stringer, second flight' },
      { id: '57cedar',    addr: '57 Cedar Hollow', community: 'Hampton',
        walk: 'Rough-in', open: 9, blocked: 0, nextLabel: 'Walked Tue · 05/14' },
    ];

    return (
      <div style={{
        ...RESET,
        background: PAPER, height: '100%', width: '100%',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* iOS status bar */}
        <div style={{
          ...RESET, height: 44, padding: '14px 18px 0',
          display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
          fontSize: 12, fontWeight: 600, color: INK,
          flexShrink: 0,
        }}>
          <span>9:41</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize: 9 }}>100%</span>
        </div>

        {/* Brand row */}
        <div style={{
          ...RESET, padding: '6px 18px 4px',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10,
          flexShrink: 0,
        }}>
          <BrandLockup />
          <span style={{
            fontFamily:'var(--font-mono)', fontSize: 9, fontWeight: 600,
            letterSpacing:'0.05em', textTransform:'uppercase', color: INK3,
            whiteSpace: 'nowrap',
          }}>Ashford · Hampton</span>
        </div>

        {/* Title row — "Sites" + total count */}
        <div style={{ ...RESET, padding: '8px 18px 0', flexShrink: 0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing:'0.08em', textTransform:'uppercase', color: INK3,
            marginBottom: 2,
          }}>Sites</div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 8, minWidth: 0 }}>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight: 900, fontSize: 28,
              letterSpacing:'-0.03em', lineHeight: 1, color: INK, flexShrink: 0,
            }}>4 active</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
              letterSpacing:'0.05em', textTransform:'uppercase', color: INK3,
              whiteSpace: 'nowrap',
            }}>of 12 total</div>
          </div>
        </div>

        {/* Summary strip — Active / Open / Blocked */}
        <div style={{
          ...RESET, padding: '10px 18px 8px', flexShrink: 0,
          display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8,
        }}>
          <SummaryCell value="4"  label="Active" />
          <SummaryCell value="31" label="Open punches" />
          <SummaryCell value="2"  label="Blocked" warn />
        </div>

        {/* Filter chips — horizontal scroll, single line, only IF user wants more phases */}
        <div style={{
          ...RESET, padding: '0 18px 8px',
          display:'flex', gap: 5, overflowX: 'auto',
          flexShrink: 0,
        }}>
          {[
            { id:'active',   label:'Active · 4' },
            { id:'pre-walk', label:'Pre-walk' },
            { id:'frame',    label:'Frame' },
            { id:'final',    label:'Final' },
            { id:'closed',   label:'Closed' },
          ].map(f => {
            const on = f.id === filter;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                height: 28, padding: '0 10px', flexShrink: 0,
                fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 10,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                border: '1.5px solid ' + (on ? INK : LINE),
                background: on ? INK : PAPER, color: on ? PAPER : INK3,
                borderRadius: 'var(--r-2)', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{f.label}</button>
            );
          })}
        </div>

        {/* Scrollable list — flex:1, padded so last card clears the tab bar.
            Scrollbar visually hidden by the host page CSS. */}
        <div style={{
          ...RESET, flex: 1, minHeight: 0,
          padding: '4px 18px 14px',
          display:'flex', flexDirection:'column', gap: 8,
          overflowY: 'auto',
        }}>
          {sites.map(s => <SiteCard key={s.id} s={s} />)}
          {/* Extra spacer so the last card never touches the tab bar */}
          <div style={{ height: 4, flexShrink: 0 }} />
        </div>

        {/* Bottom tabs */}
        <div style={{
          ...RESET,
          display:'grid', gridTemplateColumns:'repeat(5,1fr)',
          borderTop: '2px solid ' + LINES, background: PAPER,
          paddingBottom: 12,
          flexShrink: 0,
        }}>
          {[
            { id:'today',  icon:'sun',            label:'Today' },
            { id:'sites',  icon:'home',           label:'Sites', on: true },
            { id:'punch',  icon:'clipboard-list', label:'Punch' },
            { id:'trades', icon:'hard-hat',       label:'Trades' },
            { id:'me',     icon:'user',           label:'Me' },
          ].map(t => (
            <div key={t.id} style={{
              height: 52, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap: 2,
              borderTop: t.on ? '3px solid ' + ORANGE : '3px solid transparent',
              marginTop: -2,
            }}>
              <Ico name={t.icon} size={18} color={t.on ? undefined : 'muted'} />
              <span style={{
                fontFamily:'var(--font-mono)', fontSize: 8.5, letterSpacing:'0.04em',
                textTransform:'uppercase', fontWeight: t.on ? 600 : 500,
                color: t.on ? INK : INK3,
              }}>{t.label}</span>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Compact summary cell (Active / Open / Blocked)
  // ─────────────────────────────────────────────────────────────
  function SummaryCell({ value, label, warn }) {
    return (
      <div style={{
        ...RESET,
        background: PAPER, border: '1.5px solid ' + LINES,
        borderRadius: 'var(--r-2)', padding: '6px 8px',
        display:'flex', flexDirection:'column', gap: 2,
      }}>
        <div style={{
          fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 18,
          letterSpacing:'-0.02em', lineHeight: 1,
          color: warn ? 'var(--bc-red)' : INK,
        }}>{value}</div>
        <div style={{
          fontFamily:'var(--font-mono)', fontSize: 8.5, fontWeight: 600,
          letterSpacing:'0.05em', textTransform:'uppercase', color: INK3,
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>{label}</div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SiteCard — clean tappable card. Width 100%, all text safe.
  // ─────────────────────────────────────────────────────────────
  function SiteCard({ s }) {
    const blockedColor = s.blocked > 0 ? 'var(--bc-red)' : INK;
    const lateColor    = s.late    > 0 ? 'var(--bc-red)' : INK;
    return (
      <div style={{
        ...RESET, width: '100%',
        background: PAPER,
        border: '2px solid ' + INK,
        borderRadius: 'var(--r-4)',
        padding: '10px 12px',
        display:'flex', flexDirection:'column', gap: 6,
      }}>
        {/* Top row — address + chevron */}
        <div style={{ display:'flex', alignItems:'flex-start', gap: 8, minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 16,
              letterSpacing:'-0.02em', color: INK, lineHeight: 1.15,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{s.addr}</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize: 9.5, textTransform:'uppercase',
              letterSpacing:'0.05em', color: INK3, marginTop: 2,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{s.community} · {s.walk}</div>
          </div>
          <Ico name="chevron-right" size={16} color="muted" />
        </div>

        {/* Stat line — open · blocked · late (only what's present) */}
        <div style={{
          display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap',
          fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
          letterSpacing:'0.05em', textTransform:'uppercase', color: INK,
        }}>
          <span>
            <span style={{
              fontFamily:'var(--font-display)', fontSize: 13, fontWeight: 800,
              letterSpacing:'-0.015em', marginRight: 4,
            }}>{s.open}</span>open
          </span>
          {s.blocked > 0 && (
            <>
              <span style={{ width: 1, height: 10, background: LINE }} />
              <span style={{ color: blockedColor }}>
                <span style={{
                  fontFamily:'var(--font-display)', fontSize: 13, fontWeight: 800,
                  letterSpacing:'-0.015em', marginRight: 4,
                }}>{s.blocked}</span>blocked
              </span>
            </>
          )}
          {s.late > 0 && (
            <>
              <span style={{ width: 1, height: 10, background: LINE }} />
              <span style={{ color: lateColor }}>
                <span style={{
                  fontFamily:'var(--font-display)', fontSize: 13, fontWeight: 800,
                  letterSpacing:'-0.015em', marginRight: 4,
                }}>{s.late}</span>late
              </span>
            </>
          )}
        </div>

        {/* Next action — labeled, single line, ellipsis-safe */}
        <div style={{
          display:'flex', alignItems:'center', gap: 6,
          padding: '4px 8px',
          background: PAPER2, border: '1.5px solid ' + LINE,
          borderRadius: 'var(--r-2)',
          minWidth: 0,
        }}>
          <Stamp>Next</Stamp>
          <span style={{
            flex: 1, minWidth: 0,
            fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing:'0.04em', textTransform:'uppercase', color: INK,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{s.nextLabel}</span>
        </div>

        {/* Top item — ONLY if present. Single line, truncated. */}
        {s.top && (
          <div style={{
            display:'flex', alignItems:'center', gap: 6, minWidth: 0,
            paddingTop: 4,
            borderTop: '1px dashed ' + LINE,
          }}>
            <Stamp tone="red">Top</Stamp>
            <span style={{
              flex: 1, minWidth: 0,
              fontFamily:'var(--font-body)', fontWeight: 500, fontSize: 11.5,
              color: INK2, lineHeight: 1.3,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{s.top}</span>
          </div>
        )}
      </div>
    );
  }

  Object.assign(window, { SitesScreen });
})();
