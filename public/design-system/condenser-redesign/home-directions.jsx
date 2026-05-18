// home-directions.jsx — Three directional mockups of The Condenser's
// home/landing screen (the first thing the user sees after Clock In).
// Each direction expresses the BuildCore Ops design system in a different way.
// All three use the same brand tokens (colors_and_type.css).

(function () {
  const { useState } = React;

  // ─────────────────────────────────────────────────────────────
  // Shared atoms — tuned to BuildCore tokens
  // ─────────────────────────────────────────────────────────────
  const ICON = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;
  const PAPER  = 'var(--bc-paper)';
  const PAPER2 = 'var(--bc-paper-2)';
  const INK    = 'var(--bc-ink)';
  const INK2   = 'var(--bc-ink-2)';
  const INK3   = 'var(--bc-ink-3)';
  const LINE   = 'var(--bc-line)';
  const LINES  = 'var(--bc-line-strong)';
  const ORANGE = 'var(--bc-orange)';

  function Ico({ name, size = 18, onPrimary, color }) {
    return (
      <img
        src={ICON(name)}
        width={size}
        height={size}
        alt=""
        style={{
          display: 'block', flexShrink: 0,
          filter:
            onPrimary
              ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
              : color === 'orange'
              ? 'invert(43%) sepia(63%) saturate(835%) hue-rotate(346deg) brightness(89%) contrast(86%)'
              : color === 'muted'
              ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
              : 'none',
        }}
      />
    );
  }

  // BuildCore brand-mark — the orange wedge + small wordmark.
  // Anchors every Condenser screen to the parent brand.
  function BrandLockup({ size = 'sm' }) {
    const wedgeW = size === 'sm' ? 18 : 22;
    const wedgeH = size === 'sm' ? 14 : 18;
    const fs     = size === 'sm' ? 12 : 14;
    return (
      <div style={{ display:'inline-flex', alignItems:'center', gap: 6 }}>
        <div style={{
          width: wedgeW, height: wedgeH,
          background: ORANGE,
          clipPath: 'polygon(0 100%, 0 0, 70% 0, 100% 100%)',
        }} />
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: fs, letterSpacing: '-0.025em', color: INK, lineHeight: 1,
        }}>BuildCore</span>
      </div>
    );
  }

  function Pill({ kind, children }) {
    const map = {
      blocked: { c:'#B82A1F', bg:'#F6DDD7' },
      open:    { c:'#1F5A8A', bg:'#D9E5F0' },
      progress:{ c:'#8A6300', bg:'#FBF1CC' },
      closed:  { c:'#2E7D3A', bg:'#DEEFD8' },
      late:    { c:'#FAFAF7', bg:'#B82A1F' },
    };
    const s = map[kind] || map.open;
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', gap: 5,
        fontFamily:'var(--font-mono)', fontWeight: 600,
        fontSize: 10, textTransform:'uppercase', letterSpacing:'0.05em',
        padding:'3px 7px', borderRadius:'var(--r-2)',
        border: '1.5px solid ' + s.c, background: s.bg, color: s.c,
      }}>
        <span style={{ width: 6, height: 6, background:'currentColor', borderRadius: 999 }} />
        {children}
      </span>
    );
  }

  function Stamp({ children, dark }) {
    return (
      <span style={{
        fontFamily:'var(--font-mono)', fontWeight: 600,
        fontSize: 10, letterSpacing:'0.03em', textTransform:'uppercase',
        padding:'3px 7px', borderRadius:'var(--r-2)',
        border:'1.5px solid ' + LINE,
        background: dark ? 'var(--bc-paper-3)' : PAPER2,
        color: INK,
      }}>{children}</span>
    );
  }

  function StatusSpacer() {
    return (
      <div style={{
        height: 52, padding: '14px 20px 0', display:'flex', alignItems:'flex-end',
        justifyContent:'space-between',
        fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
        fontSize: 13, fontWeight: 600, color: INK,
      }}>
        <span>9:41</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize: 10 }}>100%</span>
      </div>
    );
  }

  function BottomTabs({ active }) {
    const tabs = [
      { id: 'today',  icon: 'sun',            label: 'Today' },
      { id: 'sites',  icon: 'home',           label: 'Sites' },
      { id: 'punch',  icon: 'clipboard-list', label: 'Punch' },
      { id: 'trades', icon: 'hard-hat',       label: 'Trades' },
      { id: 'me',     icon: 'user',           label: 'Me' },
    ];
    return (
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(5,1fr)',
        borderTop: '2px solid ' + LINES, background: PAPER,
        paddingBottom: 14,
      }}>
        {tabs.map(t => {
          const on = t.id === active;
          return (
            <div key={t.id} style={{
              height: 60, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap: 3,
              borderTop: on ? '3px solid ' + ORANGE : '3px solid transparent',
              marginTop: -2,
            }}>
              <Ico name={t.icon} size={20} color={on ? undefined : 'muted'} />
              <span style={{
                fontFamily:'var(--font-mono)', fontSize: 9, letterSpacing:'0.05em',
                textTransform:'uppercase', fontWeight: on ? 600 : 500,
                color: on ? INK : INK3,
              }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  function PrimaryButton({ children, icon, fullWidth, size = 'md' }) {
    const h = size === 'lg' ? 56 : 48;
    return (
      <div style={{
        height: h, padding: '0 18px',
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
        width: fullWidth ? '100%' : undefined,
        background: ORANGE, color: PAPER,
        border: '2px solid ' + INK,
        borderRadius: 'var(--r-2)',
        boxShadow: '3px 3px 0 0 ' + INK,
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16,
      }}>
        {icon && <Ico name={icon} size={18} onPrimary />}
        {children}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // DIRECTION A — Faithful BuildCore translation
  // Keep the dashboard structure; tighten the brand, drop "lot", crisp up.
  // ─────────────────────────────────────────────────────────────
  function HomeA() {
    return (
      <Phone>
        <StatusSpacer />
        {/* Brand-anchored header — "BuildCore · Condenser" in mono, with the wedge */}
        <div style={{
          padding: '6px 20px 14px',
          borderBottom: '1.5px solid ' + LINE,
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
            <BrandLockup />
            <span style={{
              fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
              letterSpacing:'0.06em', textTransform:'uppercase', color: INK3,
            }}>· Condenser</span>
          </div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 10, letterSpacing:'0.06em',
            textTransform:'uppercase', color: INK3, marginBottom: 2,
          }}>Friday · 05/17</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 26,
            letterSpacing:'-0.02em', color: INK,
          }}>Today, Paige.</div>
        </div>

        <Scroll>
          {/* 3 stat tiles */}
          <div style={{ display:'flex', gap: 10 }}>
            <Stat value="31" label="Open punches" accent />
            <Stat value="4"  label="Active sites" />
            <Stat value="2"  label="Late · fix today" />
          </div>

          {/* Late punches */}
          <SectionTitle right="2 items">Late · needs you today</SectionTitle>
          <PunchCard
            stamped
            id="PL-1023" addr="14 Sycamore Ln"
            title="Hairline crack — master bath tile, north wall"
            trade="Tile" due="Yesterday" status="blocked"
          />
          <PunchCard
            id="PL-1011" addr="14 Sycamore Ln"
            title="Toilet supply line — slow drip behind escutcheon"
            trade="Plumbing" due="Today" status="open"
          />

          {/* Active sites */}
          <SectionTitle right="4 sites">Active sites</SectionTitle>
          <SiteRow addr="14 Sycamore Ln"   sub="Ashford · pre-walk" open={12} closed={31} />
          <SiteRow addr="23 Birchwood Ct"  sub="Ashford · frame"    open={4}  closed={9}  />
          <SiteRow addr="11 Willow Bend"   sub="Hampton · final"    open={6}  closed={38} />

          <div style={{ height: 6 }} />
          <PrimaryButton fullWidth icon="plus" size="lg">Add punch</PrimaryButton>
        </Scroll>

        <BottomTabs active="today" />
      </Phone>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // DIRECTION B — Today's walks (sequencer)
  // Reframe the home around the ordered DAY. One big number, then a
  // timeline of walks with ONE primary action at the bottom.
  // ─────────────────────────────────────────────────────────────
  function HomeB() {
    return (
      <Phone>
        <StatusSpacer />
        <div style={{ padding: '4px 22px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14 }}>
            <BrandLockup />
            <span style={{
              fontFamily:'var(--font-mono)', fontSize: 10, fontWeight: 600,
              letterSpacing:'0.06em', textTransform:'uppercase', color: INK3,
            }}>Clocked in · 6:42 AM</span>
          </div>
          {/* Big number on top — total open punches across today */}
          <div style={{
            fontFamily:'var(--font-display)', fontWeight: 900, fontSize: 88,
            letterSpacing:'-0.04em', lineHeight: 0.9, color: INK,
          }}>23</div>
          <div style={{
            fontFamily:'var(--font-body)', fontSize: 16, color: INK2, marginTop: 6,
          }}>open punches across <b style={{ color: INK }}>3 walks today</b>.</div>
          <div style={{ display:'flex', gap: 6, marginTop: 12 }}>
            <Pill kind="late">2 late</Pill>
            <Pill kind="blocked">1 blocked</Pill>
            <Pill kind="open">20 open</Pill>
          </div>
        </div>

        <Scroll noTopGap>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 11, fontWeight: 600,
            letterSpacing:'0.06em', textTransform:'uppercase', color: INK3,
            marginBottom: 6,
          }}>Your day</div>

          {/* Vertical timeline of walks */}
          <Timeline>
            <WalkCard
              time="8:00 AM" addr="14 Sycamore Ln" sub="Ashford · pre-walk"
              meta="12 open · 1 blocked" upNext
            />
            <WalkCard
              time="11:00 AM" addr="23 Birchwood Ct" sub="Ashford · frame"
              meta="4 open"
            />
            <WalkCard
              time="2:30 PM"  addr="11 Willow Bend"  sub="Hampton · final · buyer walk"
              meta="6 open · 1 late" last
            />
          </Timeline>

          <div style={{ height: 10 }} />
          <PrimaryButton fullWidth icon="play" size="lg">Start walk · 14 Sycamore Ln</PrimaryButton>
        </Scroll>

        <BottomTabs active="today" />
      </Phone>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // DIRECTION C — Site board (foreman's whiteboard)
  // Each active site is a big glanceable card. Top 2 inline punches per
  // site. Stacked vertically, scrolls. Bigger type, fewer cards.
  // ─────────────────────────────────────────────────────────────
  function HomeC() {
    return (
      <Phone>
        <StatusSpacer />
        <div style={{
          padding: '4px 18px 14px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom: '1.5px solid ' + LINE,
        }}>
          <div>
            <BrandLockup />
            <div style={{
              fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 22,
              letterSpacing:'-0.02em', color: INK, marginTop: 6,
            }}>Site board</div>
          </div>
          <div style={{
            width: 40, height: 40, border: '1.5px solid ' + LINE, background: PAPER,
            borderRadius: 'var(--r-2)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <Ico name="search" size={18} />
          </div>
        </div>

        <Scroll>
          <SiteBoardCard
            stamped
            addr="14 Sycamore Ln"
            sub="ASHFORD · PRE-WALK"
            stats={[{ label:'open', v: 12 }, { label:'blocked', v: 1 }, { label:'walk', v: '8:00a' }]}
            punches={[
              { id:'PL-1023', title:'Hairline crack — master bath tile, north wall', trade:'Tile', status:'blocked' },
              { id:'PL-1011', title:'Toilet supply line — slow drip behind escutcheon', trade:'Plumbing', status:'open' },
            ]}
          />
          <SiteBoardCard
            addr="23 Birchwood Ct"
            sub="ASHFORD · FRAME"
            stats={[{ label:'open', v: 4 }, { label:'blocked', v: 0 }, { label:'walk', v:'11:00a' }]}
            punches={[
              { id:'PL-0987', title:'Stud out of plumb at SW corner', trade:'Framing', status:'open' },
            ]}
          />
        </Scroll>

        <BottomTabs active="sites" />
      </Phone>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Layout primitives — Phone shell + Scroll wrapper
  // ─────────────────────────────────────────────────────────────
  function Phone({ children }) {
    return (
      <div style={{
        background: PAPER, height: '100%',
        display:'flex', flexDirection:'column',
      }}>{children}</div>
    );
  }
  function Scroll({ children, noTopGap }) {
    return (
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: noTopGap ? '0 20px 16px' : '14px 20px 16px',
        display:'flex', flexDirection:'column', gap: 12,
      }}>{children}</div>
    );
  }
  function SectionTitle({ children, right }) {
    return (
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginTop: 6 }}>
        <h2 style={{
          fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 16,
          letterSpacing:'-0.015em', margin: 0, color: INK,
        }}>{children}</h2>
        {right && <span style={{
          fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase',
          letterSpacing:'0.05em', color: INK3, fontWeight: 600,
        }}>{right}</span>}
      </div>
    );
  }
  function Stat({ value, label, accent }) {
    return (
      <div style={{
        flex: 1,
        background: accent ? ORANGE : PAPER,
        color: accent ? PAPER : INK,
        border: '2px solid ' + INK,
        borderRadius: 'var(--r-4)',
        padding: '12px 12px 10px',
        boxShadow: accent ? '3px 3px 0 0 ' + INK : 'none',
      }}>
        <div style={{
          fontFamily:'var(--font-display)', fontWeight: 900, fontSize: 32,
          letterSpacing:'-0.03em', lineHeight: 1,
        }}>{value}</div>
        <div style={{
          fontFamily:'var(--font-mono)', fontSize: 9, marginTop: 6,
          textTransform:'uppercase', letterSpacing:'0.05em',
          color: accent ? 'rgba(250,250,247,0.85)' : INK3,
        }}>{label}</div>
      </div>
    );
  }

  // Compact punch card (Direction A)
  function PunchCard({ id, addr, title, trade, due, status, stamped }) {
    return (
      <div style={{
        background: PAPER,
        border: '2px solid ' + INK,
        borderRadius: 'var(--r-4)',
        boxShadow: stamped ? '3px 3px 0 0 ' + INK : 'none',
        padding: '10px 12px',
        display:'flex', flexDirection:'column', gap: 6,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 5, flexWrap:'wrap' }}>
          <Stamp>{id}</Stamp>
          <Stamp dark>{addr}</Stamp>
          <span style={{ marginLeft:'auto' }}><Pill kind={status}>{status}</Pill></span>
        </div>
        <div style={{
          fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 14,
          letterSpacing:'-0.01em', lineHeight: 1.2, color: INK,
        }}>{title}</div>
        <div style={{
          display:'flex', gap: 10,
          fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase',
          letterSpacing:'0.04em', color: INK3,
        }}>
          <span><b style={{ color: INK2 }}>{trade}</b></span>
          <span><b style={{ color: INK2 }}>Due</b> {due}</span>
        </div>
      </div>
    );
  }

  // Site row (Direction A) — compact list row
  function SiteRow({ addr, sub, open, closed }) {
    const pct = closed / (open + closed) * 100;
    return (
      <div style={{
        background: PAPER, border: '2px solid ' + LINES, borderRadius: 'var(--r-4)',
        padding: '12px 14px', display:'flex', flexDirection:'column', gap: 8,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <span style={{ color: ORANGE, fontSize: 8 }}>●</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight: 700, fontSize: 15,
              letterSpacing:'-0.01em', color: INK,
            }}>{addr}</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase',
              letterSpacing:'0.05em', color: INK3, marginTop: 1,
            }}>{sub}</div>
          </div>
          <Ico name="chevron-right" size={18} color="muted" />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <div style={{
            flex: 1, height: 6, background: 'var(--bc-paper-3)',
            border: '1.5px solid ' + LINES, borderRadius: 2, overflow:'hidden',
          }}>
            <div style={{ width: pct + '%', height: '100%', background: ORANGE }} />
          </div>
          <span style={{
            fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 10,
            textTransform:'uppercase', letterSpacing:'0.04em', color: INK2,
          }}>{open} open · {closed} closed</span>
        </div>
      </div>
    );
  }

  // Timeline (Direction B)
  function Timeline({ children }) {
    return (
      <div style={{ position:'relative' }}>
        <div style={{
          position:'absolute', left: 11, top: 18, bottom: 18,
          width: 2, background: INK,
        }} />
        <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>{children}</div>
      </div>
    );
  }
  function WalkCard({ time, addr, sub, meta, upNext, last }) {
    return (
      <div style={{
        display: 'grid', gridTemplateColumns: '24px 1fr', gap: 14, alignItems:'flex-start',
      }}>
        <div style={{ display:'flex', justifyContent:'center', paddingTop: 16 }}>
          <div style={{
            width: 16, height: 16, borderRadius: 999,
            background: upNext ? ORANGE : PAPER,
            border: '2.5px solid ' + INK,
            position:'relative', zIndex: 1,
          }} />
        </div>
        <div style={{
          background: PAPER, border: '2px solid ' + INK,
          borderRadius: 'var(--r-4)',
          boxShadow: upNext ? '3px 3px 0 0 ' + INK : 'none',
          padding: '12px 14px', display:'flex', flexDirection:'column', gap: 6,
          position:'relative',
        }}>
          {upNext && (
            <span style={{
              position:'absolute', top: -10, right: 14,
              fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 9,
              textTransform:'uppercase', letterSpacing:'0.06em',
              padding: '3px 7px', borderRadius: 'var(--r-2)',
              border: '2px solid ' + INK, background: ORANGE, color: PAPER,
            }}>Up next</span>
          )}
          <div style={{
            fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 11,
            textTransform:'uppercase', letterSpacing:'0.05em', color: INK,
          }}>{time}</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 17,
            letterSpacing:'-0.015em', color: INK, lineHeight: 1.15,
          }}>{addr}</div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase',
            letterSpacing:'0.04em', color: INK3,
          }}>{sub}</div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize: 11, color: INK2, fontWeight: 500,
            paddingTop: 4, borderTop: '1px solid ' + LINE, marginTop: 2,
          }}>{meta}</div>
        </div>
      </div>
    );
  }

  // Site board card (Direction C) — big glanceable
  function SiteBoardCard({ addr, sub, stats, punches, stamped }) {
    return (
      <div style={{
        background: PAPER, border: '2px solid ' + INK,
        borderRadius: 'var(--r-4)',
        boxShadow: stamped ? '4px 4px 0 0 ' + INK : 'none',
        padding: '16px 16px 14px',
        display:'flex', flexDirection:'column', gap: 12,
      }}>
        <div>
          <div style={{
            fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 10,
            textTransform:'uppercase', letterSpacing:'0.06em', color: INK3,
          }}>{sub}</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight: 900, fontSize: 24,
            letterSpacing:'-0.025em', lineHeight: 1, color: INK, marginTop: 4,
          }}>{addr}</div>
        </div>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 0,
          border:'2px solid ' + INK, borderRadius:'var(--r-2)', overflow:'hidden',
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              padding: '8px 10px',
              borderRight: i < stats.length - 1 ? '2px solid ' + INK : 'none',
              background: i === 0 ? 'var(--bc-orange-tint)' : PAPER2,
            }}>
              <div style={{
                fontFamily:'var(--font-display)', fontWeight: 800, fontSize: 20,
                letterSpacing:'-0.02em', color: INK, lineHeight: 1,
              }}>{s.v}</div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize: 9, marginTop: 4,
                textTransform:'uppercase', letterSpacing:'0.05em', color: INK3,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
          {punches.map(p => (
            <div key={p.id} style={{
              display:'flex', alignItems:'center', gap: 8,
              padding: '8px 10px',
              border: '1.5px solid ' + LINE, borderRadius:'var(--r-2)',
              background: PAPER,
            }}>
              <Stamp>{p.id}</Stamp>
              <span style={{
                flex: 1, fontFamily:'var(--font-body)', fontWeight: 500, fontSize: 12,
                color: INK, lineHeight: 1.2,
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              }}>{p.title}</span>
              <Pill kind={p.status}>{p.status}</Pill>
            </div>
          ))}
        </div>
        <PrimaryButton fullWidth icon="play">Walk it now</PrimaryButton>
      </div>
    );
  }

  Object.assign(window, { HomeA, HomeB, HomeC });
})();
