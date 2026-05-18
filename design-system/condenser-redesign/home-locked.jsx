// home-locked.jsx — Condenser home, mobile-fit revision.
// Designed to ALL FIT inside a 360×720 phone frame with no overflow:
//   1) Compact brand row (28px)
//   2) Compact hero — number sits inline with its label (no stacked block)
//   3) "Your day" label
//   4) ONE detailed "Up next" card (the one walk that matters right now)
//   5) Two slim walk ROWS for the rest of the day (not full cards)
//   6) Pinned primary CTA
//   7) Bottom tab bar
//
// Rules: box-sizing: border-box on everything. Every flex/grid child that
// holds text gets `min-width: 0` so ellipsis works. Cards are max-width:100%.
// No horizontal scroll anywhere.

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

  function Ico({ name, size = 18, onPrimary, color }) {
    return (
      <img src={ICON(name)} width={size} height={size} alt="" style={{
        display: 'block', flexShrink: 0,
        filter:
          onPrimary
            ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
            : color === 'muted'
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

  function MiniPill({ kind, children }) {
    const map = {
      blocked: { c:'#B82A1F', bg:'#F6DDD7' },
      open:    { c:'#1F5A8A', bg:'#D9E5F0' },
      late:    { c:'#FAFAF7', bg:'#B82A1F' },
    };
    const s = map[kind] || map.open;
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', gap: 4,
        fontFamily:'var(--font-mono)', fontWeight: 600,
        fontSize: 9.5, textTransform:'uppercase', letterSpacing:'0.04em',
        padding:'2px 6px', borderRadius:'var(--r-2)',
        border: '1.5px solid ' + s.c, background: s.bg, color: s.c,
        whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 5, height: 5, background:'currentColor', borderRadius: 999 }} />
        {children}
      </span>
    );
  }

  function Stamp({ children }) {
    return (
      <span style={{
        fontFamily:'var(--font-mono)', fontWeight: 600,
        fontSize: 9.5, letterSpacing:'0.03em', textTransform:'uppercase',
        padding:'2px 6px', borderRadius:'var(--r-2)',
        border:'1.5px solid ' + LINE, background: PAPER2, color: INK,
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>{children}</span>
    );
  }

  // Reset that lives inside the phone screen — guarantees no overflow leaks.
  const RESET = {
    boxSizing: 'border-box',
    maxWidth: '100%',
    minWidth: 0,
  };

  // ─────────────────────────────────────────────────────────────
  // HomeLocked — pinned single-page layout
  // ─────────────────────────────────────────────────────────────
  function HomeLocked() {
    return (
      <div style={{
        ...RESET,
        background: PAPER, height: '100%', width: '100%',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* iOS status bar — fixed height, doesn't grow */}
        <div style={{
          ...RESET,
          height: 44, padding: '14px 18px 0',
          display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
          fontSize: 12, fontWeight: 600, color: INK,
          flexShrink: 0,
        }}>
          <span>9:41</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize: 9 }}>100%</span>
        </div>

        {/* Brand row — compact, single line */}
        <div style={{
          ...RESET,
          padding: '6px 18px 4px',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10,
          flexShrink: 0,
        }}>
          <BrandLockup />
          <span style={{
            fontFamily:'var(--font-mono)', fontSize: 9, fontWeight: 600,
            letterSpacing:'0.05em', textTransform:'uppercase', color: INK3,
            whiteSpace: 'nowrap',
          }}>Clocked in · 6:42a</span>
        </div>

        {/* HERO — number sits inline with its label, no big stacked block */}
        <div style={{ ...RESET, padding: '8px 18px 10px', flexShrink: 0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing:'0.08em', textTransform:'uppercase', color: INK3,
            marginBottom: 2,
          }}>Today</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 10, minWidth: 0 }}>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight: 900, fontSize: 56,
              letterSpacing:'-0.035em', lineHeight: 0.9, color: INK,
              flexShrink: 0,
            }}>23</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontFamily:'var(--font-body)', fontSize: 13, color: INK2,
                lineHeight: 1.25, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>open punches</div>
              <div style={{
                fontFamily:'var(--font-body)', fontSize: 13, color: INK,
                fontWeight: 600, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>3 walks today</div>
            </div>
          </div>
          <div style={{ display:'flex', gap: 5, marginTop: 10, flexWrap:'wrap' }}>
            <MiniPill kind="late">2 late</MiniPill>
            <MiniPill kind="blocked">1 blocked</MiniPill>
            <MiniPill kind="open">20 open</MiniPill>
          </div>
        </div>

        {/* "Your day" label */}
        <div style={{
          ...RESET,
          padding: '4px 18px 6px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing:'0.08em', textTransform:'uppercase', color: INK3,
            display:'inline-flex', alignItems:'center', gap: 7,
          }}>
            <span style={{ display:'inline-block', width: 12, height: 2, background: ORANGE }} />
            Your day
          </div>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize: 9, fontWeight: 600,
            letterSpacing:'0.05em', textTransform:'uppercase', color: INK3,
          }}>Fri · 05/17</span>
        </div>

        {/* Main content — flex:1, fills remaining space, no scrollbar */}
        <div style={{
          ...RESET, flex: 1, minHeight: 0,
          padding: '4px 18px 6px',
          display:'flex', flexDirection:'column', gap: 8,
          overflow:'hidden',  // no scroll — content is tuned to fit
        }}>

          {/* Up next — the ONE detailed card */}
          <UpNextCard
            time="8:00 AM"
            addr="14 Sycamore Ln"
            walkType="Pre-walk"
            community="Ashford"
            open={12}
            blocked={1}
            topItem="Hairline crack — master bath tile, north wall"
          />

          {/* Two slim "next up" rows — addr + time + meta only */}
          <WalkRow
            time="11:00a"
            addr="23 Birchwood Ct"
            walkType="Frame"
            meta="4 open"
          />
          <WalkRow
            time="2:30p"
            addr="11 Willow Bend"
            walkType="Final · Buyer"
            meta="6 open · 1 late"
            warn
          />
        </div>

        {/* Primary CTA — pinned just above tab bar */}
        <div style={{
          ...RESET,
          padding: '10px 18px 10px',
          background: PAPER,
          borderTop: '1.5px solid ' + LINE,
          flexShrink: 0,
        }}>
          <div style={{
            ...RESET,
            display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
            height: 50, padding: '0 14px', width: '100%',
            background: ORANGE, color: PAPER,
            border: '2px solid ' + INK, borderRadius: 'var(--r-2)',
            boxShadow: '3px 3px 0 0 ' + INK,
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14.5,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            <Ico name="play" size={16} onPrimary />
            <span style={{
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth: 0,
            }}>Start walk · 14 Sycamore Ln</span>
          </div>
        </div>

        {/* Bottom tabs — fixed height */}
        <div style={{
          ...RESET,
          display:'grid', gridTemplateColumns:'repeat(5,1fr)',
          borderTop: '2px solid ' + LINES, background: PAPER,
          paddingBottom: 12,
          flexShrink: 0,
        }}>
          {[
            { id:'today',  icon:'sun',            label:'Today', on: true },
            { id:'sites',  icon:'home',           label:'Sites' },
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
  // Up-next card — the only detailed card on this screen
  // ─────────────────────────────────────────────────────────────
  function UpNextCard({ time, addr, walkType, community, open, blocked, topItem }) {
    return (
      <div style={{
        ...RESET,
        background: PAPER,
        border: '2px solid ' + INK,
        borderRadius: 'var(--r-4)',
        boxShadow: '3px 3px 0 0 ' + INK,
        padding: '10px 12px',
        display:'flex', flexDirection:'column', gap: 8,
        position:'relative',
      }}>
        {/* Up-next badge — neutral chip, sits inside the card (no clipping) */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          gap: 8, minWidth: 0,
        }}>
          <span style={{
            fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 9,
            textTransform:'uppercase', letterSpacing:'0.06em',
            padding: '2px 6px', borderRadius: 'var(--r-2)',
            border: '1.5px solid ' + LINES, background: PAPER2, color: INK,
          }}>Up next</span>
          <span style={{
            fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 10,
            textTransform:'uppercase', letterSpacing:'0.06em', color: INK,
            whiteSpace: 'nowrap',
          }}>{time}</span>
        </div>

        {/* Address — biggest type. Ellipsis if it ever needs it. */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 18,
            letterSpacing:'-0.02em', color: INK, lineHeight: 1.1,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{addr}</div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 9.5, textTransform:'uppercase',
            letterSpacing:'0.05em', color: INK3, marginTop: 3,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{community} · {walkType}</div>
        </div>

        {/* Simple summary line — no nested stat-strip */}
        <div style={{
          display:'flex', alignItems:'center', gap: 12, flexWrap:'wrap',
          padding: '6px 10px',
          background: PAPER2, border: '1.5px solid ' + LINE,
          borderRadius: 'var(--r-2)',
        }}>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
            textTransform:'uppercase', letterSpacing:'0.05em', color: INK,
          }}>
            <span style={{
              fontFamily:'var(--font-display)', fontSize: 14, fontWeight: 800,
              marginRight: 4, letterSpacing:'-0.015em',
            }}>{open}</span>open
          </span>
          <span style={{ width: 1, height: 12, background: LINE }} />
          <span style={{
            fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
            textTransform:'uppercase', letterSpacing:'0.05em',
            color: blocked > 0 ? 'var(--bc-red)' : INK,
          }}>
            <span style={{
              fontFamily:'var(--font-display)', fontSize: 14, fontWeight: 800,
              marginRight: 4, letterSpacing:'-0.015em',
            }}>{blocked}</span>blocked
          </span>
        </div>

        {/* Top item — single line, ellipsis on overflow. No fixed widths. */}
        <div style={{
          display:'flex', alignItems:'center', gap: 8, minWidth: 0,
          paddingTop: 2,
          borderTop: '1px dashed ' + LINE,
        }}>
          <Stamp>Top</Stamp>
          <span style={{
            flex: 1, minWidth: 0,
            fontFamily:'var(--font-body)', fontWeight: 500, fontSize: 12,
            color: INK, lineHeight: 1.3,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{topItem}</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Slim walk row — for the rest of the day's walks
  // ─────────────────────────────────────────────────────────────
  function WalkRow({ time, addr, walkType, meta, warn }) {
    return (
      <div style={{
        ...RESET,
        display:'flex', alignItems:'center', gap: 10,
        padding: '10px 12px',
        background: PAPER,
        border: '1.5px solid ' + LINES,
        borderRadius: 'var(--r-2)',
      }}>
        <div style={{
          fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
          letterSpacing:'0.05em', textTransform:'uppercase', color: INK,
          width: 50, flexShrink: 0,
        }}>{time}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight: 700, fontSize: 13.5,
            letterSpacing:'-0.015em', color: INK, lineHeight: 1.2,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{addr}</div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 9, textTransform:'uppercase',
            letterSpacing:'0.05em', color: INK3, marginTop: 2,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{walkType} · {meta}</div>
        </div>
        <Ico name="chevron-right" size={16} color="muted" />
      </div>
    );
  }

  Object.assign(window, { HomeLocked });
})();
