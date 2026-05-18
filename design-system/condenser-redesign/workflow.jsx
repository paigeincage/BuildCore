// workflow.jsx — The Condenser, critical workflow screens.
// Three screens that ship together as one user journey:
//   IntakeScreen    → upload PDFs / docs / photos
//   ReviewScreen    → extracted items, grouped by trade, edit + commit
//   SendSheet       → bottom sheet over the punch list — send to trade
//
// ⚠️ GENERIC PRODUCT — all visible names, addresses, and contacts inside
// these mockups are SAMPLE DATA that gets replaced at runtime from the
// signed-in user's profile / sites / contacts. Postit notes on the canvas
// flag every spot where this happens.
//
// Style discipline matches home-locked.jsx + sites-screen.jsx:
//   - box-sizing: border-box everywhere
//   - min-width: 0 on flex/grid children
//   - text-overflow: ellipsis for any field a user could type long copy into
//   - tap targets ≥ 48px (56px on primaries)
//   - stamp shadow only on the active primary card or CTA

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
  const RED    = 'var(--bc-red)';

  const RESET = { boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 };

  // ─────────────────────────────────────────────────────────────
  // Shared atoms
  // ─────────────────────────────────────────────────────────────
  function Ico({ name, size = 18, onPrimary, color }) {
    return (
      <img src={ICON(name)} width={size} height={size} alt="" style={{
        display:'block', flexShrink:0,
        filter:
          onPrimary
            ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
            : color === 'muted'
            ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
            : color === 'red'
            ? 'invert(20%) sepia(96%) saturate(2900%) hue-rotate(354deg) brightness(85%) contrast(95%)'
            : 'none',
      }} />
    );
  }

  function BrandRow({ right }) {
    return (
      <div style={{
        ...RESET, padding:'6px 18px 4px',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:10,
        flexShrink:0,
      }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, minWidth:0 }}>
          <div style={{
            width:18, height:14, background:ORANGE, flexShrink:0,
            clipPath:'polygon(0 100%, 0 0, 70% 0, 100% 100%)',
          }} />
          <span style={{
            fontFamily:'var(--font-display)', fontWeight:900,
            fontSize:12, letterSpacing:'-0.025em', color:INK, lineHeight:1,
          }}>BuildCore</span>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.05em',
            textTransform:'uppercase', color:INK3, marginLeft:4,
          }}>· Condenser</span>
        </div>
        {right}
      </div>
    );
  }

  function StatusBar() {
    return (
      <div style={{
        ...RESET, height:44, padding:'14px 18px 0',
        display:'flex', alignItems:'flex-end', justifyContent:'space-between',
        fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
        fontSize:12, fontWeight:600, color:INK, flexShrink:0,
      }}>
        <span>9:41</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9 }}>100%</span>
      </div>
    );
  }

  function TabBar({ active = 'punch' }) {
    return (
      <div style={{
        ...RESET, display:'grid', gridTemplateColumns:'repeat(5,1fr)',
        borderTop:'2px solid '+LINES, background:PAPER,
        paddingBottom:12, flexShrink:0,
      }}>
        {[
          { id:'today',  icon:'sun',            label:'Today' },
          { id:'sites',  icon:'home',           label:'Sites' },
          { id:'punch',  icon:'clipboard-list', label:'Punch' },
          { id:'trades', icon:'hard-hat',       label:'Trades' },
          { id:'me',     icon:'user',           label:'Me' },
        ].map(t => {
          const on = t.id === active;
          return (
            <div key={t.id} style={{
              height:52, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:2,
              borderTop: on ? '3px solid '+ORANGE : '3px solid transparent',
              marginTop:-2,
            }}>
              <Ico name={t.icon} size={18} color={on ? undefined : 'muted'} />
              <span style={{
                fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.04em',
                textTransform:'uppercase', fontWeight: on ? 600 : 500,
                color: on ? INK : INK3,
              }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  function BackBtn({ label = 'Back' }) {
    return (
      <button style={{
        height:32, padding:'0 10px 0 6px', display:'inline-flex', alignItems:'center', gap:4,
        background:'transparent', border:0, cursor:'pointer',
        fontFamily:'var(--font-body)', fontWeight:600, fontSize:13, color:INK,
      }}>
        <Ico name="chevron-left" size={18} />
        {label}
      </button>
    );
  }

  function Stamp({ children, tone }) {
    const c = tone === 'red' ? RED : tone === 'blue' ? '#1F5A8A' : INK;
    return (
      <span style={{
        fontFamily:'var(--font-mono)', fontWeight:600,
        fontSize:9.5, letterSpacing:'0.03em', textTransform:'uppercase',
        padding:'2px 6px', borderRadius:'var(--r-2)',
        border:'1.5px solid '+LINE, background:PAPER2, color:c,
        flexShrink:0, whiteSpace:'nowrap',
      }}>{children}</span>
    );
  }

  // Reusable big orange pinned CTA inside the phone
  function PinnedCTA({ icon, label, disabled, secondary }) {
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        height:50, padding:'0 14px', width:'100%',
        background: disabled ? PAPER3 : (secondary ? PAPER : ORANGE),
        color: disabled ? INK3 : (secondary ? INK : PAPER),
        border:'2px solid '+INK, borderRadius:'var(--r-2)',
        boxShadow: disabled ? 'none' : '3px 3px 0 0 '+INK,
        fontFamily:'var(--font-body)', fontWeight:700, fontSize:14.5,
        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
      }}>
        {icon && <Ico name={icon} size={16} onPrimary={!disabled && !secondary} />}
        <span style={{
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0,
        }}>{label}</span>
      </div>
    );
  }

  // Site context chip — sticky across the workflow.
  // Renders the current site address. SAMPLE: "14 Sycamore Ln · Ashford"
  function SiteChip({ addr, sub }) {
    return (
      <div style={{
        ...RESET, padding:'8px 12px',
        display:'flex', alignItems:'center', gap:8,
        background:PAPER2, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)',
      }}>
        <Ico name="map-pin" size={14} color="muted" />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:700, fontSize:13,
            letterSpacing:'-0.015em', color:INK, lineHeight:1.15,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{addr}</div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:9, textTransform:'uppercase',
            letterSpacing:'0.05em', color:INK3, marginTop:1,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{sub}</div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 1 — IntakeScreen (Upload)
  // ─────────────────────────────────────────────────────────────
  function IntakeScreen() {
    // SAMPLE files — replaced at runtime by user's actual queue.
    const queued = [
      { name:'Pre-walk_punchlist.pdf', size:'420 KB',  type:'PDF' },
      { name:'IMG_5821.jpg',            size:'2.1 MB', type:'JPG' },
      { name:'site-notes.docx',         size:'48 KB',  type:'DOC' },
    ];
    return (
      <div style={{
        ...RESET, background:PAPER, height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <StatusBar />
        <BrandRow right={<BackBtn label="Site" />} />

        {/* Title row */}
        <div style={{ ...RESET, padding:'4px 18px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:2,
          }}>Upload</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
            letterSpacing:'-0.025em', lineHeight:1, color:INK,
          }}>Add files to site</div>
        </div>

        {/* Site context */}
        <div style={{ ...RESET, padding:'10px 18px 8px', flexShrink:0 }}>
          <SiteChip addr="14 Sycamore Ln" sub="Ashford · Pre-walk · SAMPLE DATA" />
        </div>

        {/* Drop zone */}
        <div style={{ ...RESET, padding:'4px 18px 6px', flexShrink:0 }}>
          <div style={{
            ...RESET,
            border:'2px dashed '+LINES, borderRadius:'var(--r-4)',
            background:PAPER2, padding:'18px 14px',
            display:'flex', flexDirection:'column', alignItems:'center', gap:8,
            textAlign:'center',
          }}>
            <div style={{
              width:44, height:44, border:'2px solid '+INK, borderRadius:'var(--r-2)',
              background:PAPER, display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}>
              <Ico name="upload" size={20} />
            </div>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight:800, fontSize:15,
              letterSpacing:'-0.015em', color:INK,
            }}>Tap to pick files or photos</div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:9, textTransform:'uppercase',
              letterSpacing:'0.05em', color:INK3,
            }}>PDF · DOC · XLS · CSV · TXT · JPG · PNG</div>
          </div>
        </div>

        {/* Queued list — flex:1 so it absorbs remaining height */}
        <div style={{ ...RESET, padding:'2px 18px 0', flexShrink:0,
          display:'flex', alignItems:'baseline', justifyContent:'space-between',
        }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3,
          }}>Queued · 3</div>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
            letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
          }}>Total 2.5 MB</span>
        </div>
        <div style={{
          ...RESET, flex:1, minHeight:0,
          padding:'6px 18px 6px',
          display:'flex', flexDirection:'column', gap:6,
          overflowY:'auto',
        }}>
          {queued.map(f => <FileRow key={f.name} f={f} />)}
        </div>

        {/* Primary CTA */}
        <div style={{
          ...RESET, padding:'10px 18px 10px',
          background:PAPER, borderTop:'1.5px solid '+LINE, flexShrink:0,
        }}>
          <PinnedCTA icon="sparkles" label="Extract items" />
        </div>

        <TabBar active="punch" />
      </div>
    );
  }

  function FileRow({ f }) {
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'center', gap:10,
        padding:'8px 10px',
        background:PAPER, border:'1.5px solid '+LINES, borderRadius:'var(--r-2)',
      }}>
        <Stamp>{f.type}</Stamp>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontFamily:'var(--font-body)', fontWeight:600, fontSize:12.5,
            color:INK, lineHeight:1.2,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{f.name}</div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:9, textTransform:'uppercase',
            letterSpacing:'0.05em', color:INK3, marginTop:1,
          }}>{f.size}</div>
        </div>
        <button aria-label="Remove" style={{
          width:28, height:28, border:'1.5px solid '+LINE, background:PAPER,
          borderRadius:'var(--r-2)', display:'inline-flex',
          alignItems:'center', justifyContent:'center', padding:0, cursor:'pointer',
          flexShrink:0,
        }}>
          <Ico name="x" size={14} color="muted" />
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 2 — ReviewScreen (Extraction Review)
  // ─────────────────────────────────────────────────────────────
  function ReviewScreen() {
    // SAMPLE extracted items — at runtime this is generated by the document parser.
    const trades = [
      { trade:'Tile',     count:2, items:[
        { sel:true,  text:'Hairline crack — master bath tile, north wall',  pri:'hot',  loc:'Master bath', src:'Pre-walk_punchlist.pdf' },
        { sel:true,  text:'Grout discoloration around tub deck',             pri:'elev', loc:'Master bath', src:'Pre-walk_punchlist.pdf' },
      ]},
      { trade:'Electrical', count:2, items:[
        { sel:true,  text:'Outlet missing cover plate — powder room',        pri:'norm', loc:'Powder rm',   src:'site-notes.docx' },
        { sel:false, text:'Living rm pendant flicker — already repaired',    pri:'norm', loc:'Living rm',   src:'site-notes.docx', repaired:true },
      ]},
      { trade:'Doors', count:1, items:[
        { sel:true,  text:'Door rub on master closet',                       pri:'norm', loc:'Master closet', src:'IMG_5821.jpg' },
      ]},
    ];
    const selectedCount = trades.reduce((n, t) => n + t.items.filter(i => i.sel).length, 0);
    const totalCount    = trades.reduce((n, t) => n + t.items.length, 0);

    return (
      <div style={{
        ...RESET, background:PAPER, height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <StatusBar />
        <BrandRow right={<BackBtn label="Upload" />} />

        <div style={{ ...RESET, padding:'4px 18px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:2,
          }}>Review · auto-sorted by trade</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
            letterSpacing:'-0.025em', lineHeight:1, color:INK,
          }}>{totalCount} items found</div>
        </div>

        {/* Selection bar */}
        <div style={{
          ...RESET, padding:'10px 18px 6px', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
        }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.05em', textTransform:'uppercase', color:INK,
          }}>
            <span style={{
              fontFamily:'var(--font-display)', fontSize:14, fontWeight:800,
              marginRight:4, letterSpacing:'-0.015em',
            }}>{selectedCount}</span>of {totalCount} selected
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <SmallBtn>Select all</SmallBtn>
            <SmallBtn>Deselect</SmallBtn>
          </div>
        </div>

        {/* Scrollable item list, grouped by trade */}
        <div style={{
          ...RESET, flex:1, minHeight:0,
          padding:'2px 18px 6px',
          display:'flex', flexDirection:'column', gap:10,
          overflowY:'auto',
        }}>
          {trades.map(g => (
            <div key={g.trade} style={{ ...RESET, display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'2px 4px',
              }}>
                <div style={{
                  fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
                  letterSpacing:'0.06em', textTransform:'uppercase', color:INK,
                }}>{g.trade}</div>
                <div style={{
                  fontFamily:'var(--font-mono)', fontSize:9, fontWeight:600,
                  letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
                }}>{g.count} item{g.count===1?'':'s'}</div>
              </div>
              {g.items.map((it, i) => <ItemRow key={i} it={it} />)}
            </div>
          ))}
        </div>

        {/* Secondary actions */}
        <div style={{
          ...RESET, padding:'6px 18px 0', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-around', gap:6,
        }}>
          <MicroAction icon="copy"     label="Copy" />
          <MicroAction icon="download" label="Download" />
          <MicroAction icon="mail"     label="Email" />
        </div>

        {/* Primary CTA */}
        <div style={{
          ...RESET, padding:'8px 18px 10px',
          background:PAPER, borderTop:'1.5px solid '+LINE, flexShrink:0,
        }}>
          <PinnedCTA icon="check" label={`Add ${selectedCount} items to site`} />
        </div>

        <TabBar active="punch" />
      </div>
    );
  }

  function ItemRow({ it }) {
    const priColor = it.pri === 'hot' ? RED : it.pri === 'elev' ? ORANGE : INK3;
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'flex-start', gap:8,
        padding:'8px 10px',
        background:PAPER, border:'1.5px solid '+LINES, borderRadius:'var(--r-2)',
        opacity: it.repaired ? 0.5 : 1,
      }}>
        {/* Checkbox */}
        <div style={{
          width:18, height:18, marginTop:2,
          border:'2px solid '+INK, borderRadius:3, flexShrink:0,
          background: it.sel ? INK : PAPER,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>
          {it.sel && <Ico name="check" size={12} onPrimary />}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontFamily:'var(--font-body)', fontWeight:500, fontSize:12.5,
            color:INK, lineHeight:1.3, textWrap:'pretty',
          }}>{it.text}</div>
          <div style={{
            display:'flex', alignItems:'center', gap:6, marginTop:4, flexWrap:'wrap',
          }}>
            {/* Priority dot */}
            <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
              <span style={{
                width:8, height:8, borderRadius:999, background:priColor,
                border:'1.5px solid '+INK,
              }} />
              <span style={{
                fontFamily:'var(--font-mono)', fontSize:8.5, fontWeight:600,
                letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
              }}>
                {it.pri === 'hot' ? 'Hot' : it.pri === 'elev' ? 'Elevated' : 'Normal'}
              </span>
            </span>
            <Stamp>{it.loc}</Stamp>
            {it.repaired && <Stamp tone="red">Repaired</Stamp>}
          </div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:8.5, fontWeight:500,
            letterSpacing:'0.04em', textTransform:'uppercase', color:INK3,
            marginTop:4,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>From {it.src}</div>
        </div>
      </div>
    );
  }

  function SmallBtn({ children }) {
    return (
      <button style={{
        height:26, padding:'0 8px', cursor:'pointer',
        border:'1.5px solid '+LINE, background:PAPER, color:INK,
        borderRadius:'var(--r-2)',
        fontFamily:'var(--font-mono)', fontWeight:600, fontSize:9.5,
        letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap',
      }}>{children}</button>
    );
  }

  function MicroAction({ icon, label }) {
    return (
      <button style={{
        flex:1, minHeight:36, padding:'6px 8px', cursor:'pointer',
        border:'1.5px solid '+LINE, background:PAPER, color:INK,
        borderRadius:'var(--r-2)',
        display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
        letterSpacing:'0.05em', textTransform:'uppercase',
      }}>
        <Ico name={icon} size={13} color="muted" />
        {label}
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 3 — SendSheet (bottom sheet, iOS)
  // ─────────────────────────────────────────────────────────────
  function SendSheet() {
    const [mode, setMode] = useState('matched');  // 'matched' | 'manual'
    return (
      <div style={{
        ...RESET, background:PAPER, height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden', position:'relative',
      }}>
        {/* Dimmed backdrop — pretend the punch list is behind */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(180deg, #14110D 0%, #2A2722 100%)',
          opacity:0.55,
        }} />
        {/* faux content peeking from behind */}
        <div style={{ position:'absolute', inset:0, opacity:0.18, padding:'60px 20px 0' }}>
          <div style={{ height:18, background:PAPER, borderRadius:3, marginBottom:8 }} />
          <div style={{ height:14, background:PAPER, borderRadius:3, width:'70%', marginBottom:14 }} />
          <div style={{ height:64, background:PAPER, borderRadius:8, marginBottom:8 }} />
          <div style={{ height:64, background:PAPER, borderRadius:8 }} />
        </div>

        {/* The bottom sheet itself */}
        <div style={{
          position:'absolute', left:0, right:0, bottom:0,
          background:PAPER,
          borderTop:'2px solid '+INK,
          borderTopLeftRadius:18, borderTopRightRadius:18,
          padding:'10px 18px 16px',
          display:'flex', flexDirection:'column', gap:10,
          boxShadow:'0 -16px 32px rgba(0,0,0,0.18)',
          maxHeight:'88%',
          overflow:'hidden',
        }}>
          {/* Drag handle */}
          <div style={{
            alignSelf:'center', width:44, height:5, background:INK3,
            borderRadius:999, opacity:0.4, marginBottom:2,
          }} />

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            <div style={{ minWidth:0 }}>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
                letterSpacing:'0.08em', textTransform:'uppercase', color:INK3,
              }}>Send punch list</div>
              <div style={{
                fontFamily:'var(--font-display)', fontWeight:800, fontSize:17,
                letterSpacing:'-0.02em', color:INK, lineHeight:1.1, marginTop:2,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>14 Sycamore Ln</div>
            </div>
            <button aria-label="Close" style={{
              width:30, height:30, border:'1.5px solid '+LINE, background:PAPER,
              borderRadius:'var(--r-2)', cursor:'pointer', padding:0,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              flexShrink:0,
            }}>
              <Ico name="x" size={14} color="muted" />
            </button>
          </div>

          {/* Trade selector chips */}
          <div style={{
            display:'flex', gap:5, overflowX:'auto', paddingBottom:2,
            scrollbarWidth:'none',
          }}>
            <TradeChip on>Tile · 2</TradeChip>
            <TradeChip>Electrical · 1</TradeChip>
            <TradeChip>Doors · 1</TradeChip>
          </div>

          {/* Contact match card */}
          <div style={{
            ...RESET, padding:'10px 12px',
            background:PAPER, border:'2px solid '+INK, borderRadius:'var(--r-4)',
            boxShadow:'3px 3px 0 0 '+INK,
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{
              width:34, height:34, flexShrink:0,
              background:ORANGE, color:PAPER,
              border:'2px solid '+INK, borderRadius:999,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-mono)', fontWeight:700, fontSize:11,
            }}>JM</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{
                fontFamily:'var(--font-display)', fontWeight:700, fontSize:13.5,
                letterSpacing:'-0.015em', color:INK,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>J. Morales · Pro Tile Co.</div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:9, textTransform:'uppercase',
                letterSpacing:'0.05em', color:INK3, marginTop:2,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>Auto-matched · text preferred · SAMPLE</div>
            </div>
            <button onClick={() => setMode(mode==='manual' ? 'matched' : 'manual')} style={{
              height:30, padding:'0 8px', flexShrink:0, cursor:'pointer',
              border:'1.5px solid '+LINE, background:PAPER2, color:INK,
              borderRadius:'var(--r-2)',
              fontFamily:'var(--font-mono)', fontWeight:600, fontSize:9,
              letterSpacing:'0.05em', textTransform:'uppercase',
            }}>{mode==='manual' ? 'Use match' : 'Someone else'}</button>
          </div>

          {/* Preview pane */}
          <div style={{
            ...RESET, padding:'10px 12px',
            background:PAPER2, border:'1.5px solid '+LINE, borderRadius:'var(--r-2)',
            fontFamily:'var(--font-mono)', fontSize:10.5, color:INK, lineHeight:1.45,
            maxHeight:120, overflowY:'auto',
          }}>
            <div style={{ fontWeight:700, marginBottom:4 }}>14 Sycamore Ln — Tile</div>
            <div>1. Hairline crack — master bath tile, north wall <span style={{color:RED}}>· HOT</span></div>
            <div>2. Grout discoloration around tub deck <span style={{color:ORANGE}}>· ELEV</span></div>
            <div style={{ color:INK3, marginTop:6 }}>— Sent via The Condenser</div>
          </div>

          {/* Primary actions — 2-up */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <PinnedCTA icon="mail"          label="Email" />
            <PinnedCTA icon="message-square" label="Text" />
          </div>

          {/* Secondary row */}
          <div style={{ display:'flex', gap:6 }}>
            <MicroAction icon="copy"     label="Copy" />
            <MicroAction icon="download" label="Download" />
            <MicroAction icon="share-2"  label="Share" />
          </div>
        </div>
      </div>
    );
  }

  function TradeChip({ children, on }) {
    return (
      <button style={{
        height:30, padding:'0 10px', cursor:'pointer', flexShrink:0,
        border:'1.5px solid '+(on ? INK : LINE),
        background:on ? INK : PAPER, color:on ? PAPER : INK3,
        borderRadius:'var(--r-2)',
        fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
        letterSpacing:'0.04em', textTransform:'uppercase', whiteSpace:'nowrap',
      }}>{children}</button>
    );
  }

  Object.assign(window, { IntakeScreen, ReviewScreen, SendSheet });
})();
