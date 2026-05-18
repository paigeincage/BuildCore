// photo.jsx — Photo capture (Decision F, continued).
// Two states:
//   ViewfinderScreen → live camera + shutter + flash/flip + multi-shot tray
//   AnnotateScreen   → single photo with draw / caption / pin tools

(function () {
  const { useState } = React;

  const ICON   = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;
  const PAPER  = 'var(--bc-paper)';
  const PAPER2 = 'var(--bc-paper-2)';
  const INK    = 'var(--bc-ink)';
  const INK2   = 'var(--bc-ink-2)';
  const INK3   = 'var(--bc-ink-3)';
  const LINE   = 'var(--bc-line)';
  const LINES  = 'var(--bc-line-strong)';
  const ORANGE = 'var(--bc-orange)';
  const RED    = 'var(--bc-red)';
  const RESET  = { boxSizing:'border-box', maxWidth:'100%', minWidth:0 };

  function Ico({ name, size = 18, onPrimary, color }) {
    return (
      <img src={ICON(name)} width={size} height={size} alt="" style={{
        display:'block', flexShrink:0,
        filter: onPrimary
          ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
          : color === 'white'
          ? 'invert(100%)'
          : color === 'muted'
          ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
          : color === 'red'
          ? 'invert(20%) sepia(96%) saturate(2900%) hue-rotate(354deg) brightness(85%) contrast(95%)'
          : 'none',
      }} />
    );
  }

  // Status bar — light (on light surface)
  function StatusBar({ dark }) {
    const color = dark ? PAPER : INK;
    return (
      <div style={{
        ...RESET, height:44, padding:'14px 18px 0',
        display:'flex', alignItems:'flex-end', justifyContent:'space-between',
        fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
        fontSize:12, fontWeight:600, color, flexShrink:0,
        position: 'relative', zIndex: 5,
      }}>
        <span>9:41</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9 }}>100%</span>
      </div>
    );
  }

  // Sample viewfinder image — render a placeholder rendering of a punch photo
  // (warm wall + tile, with a faux crack and the iOS framing brackets).
  function FauxViewfinder() {
    return (
      <div style={{
        ...RESET, position:'absolute', inset:0,
        background:
          'linear-gradient(180deg, #c8b89a 0%, #a99a7d 55%, #8c7e63 100%)',
        overflow:'hidden',
      }}>
        {/* Tile grout grid */}
        <div style={{
          position:'absolute', inset:0,
          background:
            'repeating-linear-gradient(0deg, transparent 0 60px, rgba(60,40,20,0.18) 60px 62px),' +
            'repeating-linear-gradient(90deg, transparent 0 60px, rgba(60,40,20,0.18) 60px 62px)',
          opacity: 0.9,
        }} />
        {/* The "crack" */}
        <svg style={{ position:'absolute', top:'30%', left:'18%', width:'64%' }} viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M0 14 L 12 16 L 22 8 L 38 18 L 54 12 L 70 22 L 86 14 L 100 18"
            fill="none" stroke="rgba(40,20,8,0.85)" strokeWidth="0.6" />
        </svg>
        {/* Vignette */}
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
        }} />
        {/* Focus brackets */}
        <Brackets />
      </div>
    );
  }
  function Brackets() {
    const size = 80;
    const corner = (props) => (
      <div style={{
        position:'absolute', width:size, height:size,
        ...props,
      }} />
    );
    const arm = { background: 'rgba(255,255,255,0.85)' };
    return (
      <div style={{
        position:'absolute', left:'50%', top:'50%',
        transform:'translate(-50%, -50%)',
        width:140, height:140,
      }}>
        {/* 4 corners */}
        {[
          { top:0, left:0,    rotate:'0deg' },
          { top:0, right:0,   rotate:'90deg' },
          { bottom:0, right:0, rotate:'180deg' },
          { bottom:0, left:0,  rotate:'270deg' },
        ].map((p, i) => (
          <div key={i} style={{ position:'absolute', width:20, height:20, ...p, transform:`rotate(${p.rotate})` }}>
            <div style={{ position:'absolute', top:0, left:0, width:20, height:2, ...arm }} />
            <div style={{ position:'absolute', top:0, left:0, width:2, height:20, ...arm }} />
          </div>
        ))}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ViewfinderScreen
  // ─────────────────────────────────────────────────────────────
  function PhotoViewfinderScreen() {
    return (
      <div style={{
        ...RESET, background:'#14110D', height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden', position:'relative',
      }}>
        {/* Camera viewfinder fills most of the screen */}
        <FauxViewfinder />

        {/* Top overlay row — close + flash + flip */}
        <div style={{
          ...RESET, position:'relative', zIndex:5,
          padding:'58px 18px 0',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:10,
          flexShrink:0,
        }}>
          <IconCircle name="x" />
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'5px 10px', borderRadius:999,
            background:'rgba(20,17,13,0.65)',
            backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
          }}>
            <Ico name="map-pin" size={12} color="white" />
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.05em', textTransform:'uppercase', color:PAPER,
            }}>14 Sycamore Ln</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <IconCircle name="zap" />
            <IconCircle name="refresh-cw" />
          </div>
        </div>

        <div style={{ flex:1 }} />

        {/* Bottom control plate — flat ink panel with shutter + tray */}
        <div style={{
          ...RESET, position:'relative', zIndex:5, flexShrink:0,
          background:'rgba(20,17,13,0.92)',
          backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
          padding:'14px 18px 16px',
          display:'flex', flexDirection:'column', gap:14,
          borderTop:'1.5px solid rgba(250,250,247,0.12)',
        }}>
          {/* Multi-shot tray — 3 thumbnails + counter */}
          <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.06em', textTransform:'uppercase', color:'rgba(250,250,247,0.65)',
              flexShrink:0,
            }}>3 shots</div>
            <div style={{ flex:1, display:'flex', gap:6, overflow:'hidden' }}>
              <Thumb tone="A" />
              <Thumb tone="B" />
              <Thumb tone="C" />
            </div>
            <button style={{
              height:32, padding:'0 10px', flexShrink:0, cursor:'pointer',
              border:'1.5px solid rgba(250,250,247,0.4)', background:'transparent', color:PAPER,
              borderRadius:'var(--r-2)',
              fontFamily:'var(--font-mono)', fontWeight:700, fontSize:10,
              letterSpacing:'0.05em', textTransform:'uppercase',
            }}>Done</button>
          </div>

          {/* Shutter row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:14 }}>
            <button style={{
              height:42, padding:'0 12px', justifySelf:'flex-start', cursor:'pointer',
              border:'1.5px solid rgba(250,250,247,0.35)', background:'transparent', color:PAPER,
              borderRadius:'var(--r-2)',
              fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
              letterSpacing:'0.05em', textTransform:'uppercase',
              display:'inline-flex', alignItems:'center', gap:6,
            }}>
              <Ico name="image" size={14} color="white" />
              From library
            </button>

            {/* Shutter button */}
            <button style={{
              width:72, height:72, borderRadius:999, cursor:'pointer', padding:4,
              border:'3px solid '+PAPER, background:'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{
                width:'100%', height:'100%', borderRadius:999,
                background: PAPER,
              }} />
            </button>

            <button style={{
              height:42, padding:'0 12px', justifySelf:'flex-end', cursor:'pointer',
              border:'2px solid '+INK, background:ORANGE, color:PAPER,
              borderRadius:'var(--r-2)',
              boxShadow:'2px 2px 0 0 '+INK,
              fontFamily:'var(--font-body)', fontWeight:700, fontSize:12,
              display:'inline-flex', alignItems:'center', gap:6,
            }}>
              <Ico name="edit-3" size={14} onPrimary />
              Annotate
            </button>
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ flexShrink:0, paddingBottom:8, paddingTop:6, display:'flex', justifyContent:'center', background:'rgba(20,17,13,0.92)' }}>
          <div style={{ width:120, height:4, background:PAPER, borderRadius:999, opacity:0.6 }} />
        </div>
      </div>
    );
  }

  function IconCircle({ name }) {
    return (
      <button style={{
        width:38, height:38, borderRadius:999, cursor:'pointer', padding:0,
        background:'rgba(20,17,13,0.65)',
        backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
        border:'1.5px solid rgba(250,250,247,0.35)',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
      }}>
        <Ico name={name} size={16} color="white" />
      </button>
    );
  }

  function Thumb({ tone }) {
    const grad = tone === 'A'
      ? 'linear-gradient(135deg, #c8b89a, #8c7e63)'
      : tone === 'B'
      ? 'linear-gradient(135deg, #6e6860, #2a2722)'
      : 'linear-gradient(135deg, #aa9e8b, #4a423a)';
    return (
      <div style={{
        width:40, height:40, borderRadius:'var(--r-2)',
        border:'1.5px solid '+PAPER,
        background:grad,
        flexShrink:0,
      }} />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // AnnotateScreen — single photo with draw / caption / pin
  // ─────────────────────────────────────────────────────────────
  function PhotoAnnotateScreen() {
    return (
      <div style={{
        ...RESET, background:'#14110D', height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden', position:'relative',
      }}>
        <StatusBar dark />

        {/* Top action row */}
        <div style={{
          ...RESET, padding:'4px 18px 12px', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:10,
        }}>
          <button style={{
            height:32, padding:'0 8px 0 4px', display:'inline-flex', alignItems:'center', gap:4,
            background:'transparent', border:0, cursor:'pointer',
            fontFamily:'var(--font-body)', fontWeight:600, fontSize:13, color:PAPER,
          }}>
            <Ico name="chevron-left" size={18} color="white" />Back
          </button>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.05em', textTransform:'uppercase', color:'rgba(250,250,247,0.7)',
          }}>Shot 2 of 3</span>
          <button style={{
            height:32, padding:'0 12px', cursor:'pointer',
            border:'2px solid '+INK, background:ORANGE, color:PAPER,
            borderRadius:'var(--r-2)', boxShadow:'2px 2px 0 0 '+INK,
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:12.5,
          }}>Done</button>
        </div>

        {/* Photo area — relative, holds annotations + side toolbar */}
        <div style={{
          ...RESET, position:'relative', flex:1, minHeight:0,
          margin:'0 14px', borderRadius:'var(--r-4)',
          overflow:'hidden',
          border:'2px solid '+PAPER,
        }}>
          <FauxViewfinder />

          {/* Drawn annotation — red circle around the crack */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 320 480" preserveAspectRatio="none">
            <ellipse cx="155" cy="180" rx="80" ry="35" fill="none" stroke={RED} strokeWidth="3.5" />
            <path d="M 230 180 L 290 250" fill="none" stroke={RED} strokeWidth="3" />
          </svg>

          {/* Location pin */}
          <div style={{
            position:'absolute', left:'66%', top:'56%',
            display:'flex', alignItems:'flex-start', gap:6,
          }}>
            <div style={{
              width:24, height:24, borderRadius:'50% 50% 50% 0',
              background:ORANGE, border:'2px solid '+INK,
              transform:'rotate(-45deg)',
            }} />
            <div style={{
              padding:'4px 8px', background:PAPER, border:'1.5px solid '+INK,
              borderRadius:'var(--r-2)', marginTop:2,
              fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
              letterSpacing:'0.04em', textTransform:'uppercase', color:INK,
            }}>North wall</div>
          </div>

          {/* Side toolbar */}
          <div style={{
            position:'absolute', right:8, top:'50%', transform:'translateY(-50%)',
            display:'flex', flexDirection:'column', gap:6,
            padding:6,
            background:'rgba(20,17,13,0.75)',
            backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
            border:'1.5px solid rgba(250,250,247,0.25)',
            borderRadius:'var(--r-2)',
          }}>
            <ToolBtn icon="edit-3"  active />
            <ToolBtn icon="map-pin" />
            <ToolBtn icon="type" />
            <ToolBtn icon="undo-2" />
            <ToolBtn icon="trash-2" />
          </div>
        </div>

        {/* Caption input */}
        <div style={{
          ...RESET, padding:'12px 18px', flexShrink:0,
        }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.05em', textTransform:'uppercase',
            color:'rgba(250,250,247,0.7)', marginBottom:6,
          }}>Caption</div>
          <div style={{
            ...RESET, padding:'10px 12px',
            background:'rgba(250,250,247,0.06)',
            border:'1.5px solid rgba(250,250,247,0.25)',
            borderRadius:'var(--r-2)',
            fontFamily:'var(--font-body)', fontSize:13.5, color:PAPER, lineHeight:1.4,
            minHeight:48,
          }}>Hairline crack — north wall, just above the tub deck.</div>
        </div>

        {/* Home indicator */}
        <div style={{ flexShrink:0, paddingBottom:8, display:'flex', justifyContent:'center' }}>
          <div style={{ width:120, height:4, background:PAPER, borderRadius:999, opacity:0.6 }} />
        </div>
      </div>
    );
  }

  function ToolBtn({ icon, active }) {
    return (
      <button style={{
        width:34, height:34, padding:0, cursor:'pointer',
        background: active ? ORANGE : 'transparent',
        border: '1.5px solid ' + (active ? INK : 'rgba(250,250,247,0.35)'),
        borderRadius:'var(--r-2)',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
      }}>
        <Ico name={icon} size={14} color={active ? undefined : 'white'} onPrimary={active} />
      </button>
    );
  }

  Object.assign(window, { PhotoViewfinderScreen, PhotoAnnotateScreen });
})();
