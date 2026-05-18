// voice.jsx — Voice capture (Decision F).
// Two states side-by-side:
//   IdleScreen     → big mic, tap-to-record
//   RecordingScreen → live waveform, timer, stop / pause, save / discard

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
          : color === 'muted'
          ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
          : color === 'red'
          ? 'invert(20%) sepia(96%) saturate(2900%) hue-rotate(354deg) brightness(85%) contrast(95%)'
          : 'none',
      }} />
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

  function BrandRow({ back }) {
    return (
      <div style={{
        ...RESET, padding:'6px 18px 4px',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:10,
        flexShrink:0,
      }}>
        {back ? (
          <button style={{
            height:32, padding:'0 8px 0 4px', display:'inline-flex', alignItems:'center', gap:4,
            background:'transparent', border:0, cursor:'pointer',
            fontFamily:'var(--font-body)', fontWeight:600, fontSize:13, color:INK,
          }}>
            <Ico name="chevron-left" size={18} />Cancel
          </button>
        ) : <div />}
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
        <div style={{ width:60 }} />
      </div>
    );
  }

  function SiteChip() {
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
          }}>14 Sycamore Ln</div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:9, textTransform:'uppercase',
            letterSpacing:'0.05em', color:INK3, marginTop:1,
          }}>Recording for site · SAMPLE</div>
        </div>
      </div>
    );
  }

  function TabBar() {
    return (
      <div style={{
        ...RESET, display:'grid', gridTemplateColumns:'repeat(5,1fr)',
        borderTop:'2px solid '+LINES, background:PAPER,
        paddingBottom:12, flexShrink:0,
      }}>
        {[
          { id:'today',  icon:'sun',            label:'Today' },
          { id:'sites',  icon:'home',           label:'Sites' },
          { id:'punch',  icon:'clipboard-list', label:'Punch', on:true },
          { id:'trades', icon:'hard-hat',       label:'Trades' },
          { id:'me',     icon:'user',           label:'Me' },
        ].map(t => (
          <div key={t.id} style={{
            height:52, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', gap:2,
            borderTop: t.on ? '3px solid '+ORANGE : '3px solid transparent',
            marginTop:-2,
          }}>
            <Ico name={t.icon} size={18} color={t.on ? undefined : 'muted'} />
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.04em',
              textTransform:'uppercase', fontWeight: t.on ? 600 : 500,
              color: t.on ? INK : INK3,
            }}>{t.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // IdleScreen — pre-record. Big mic, "tap to record"
  // ─────────────────────────────────────────────────────────────
  function VoiceIdleScreen() {
    return (
      <div style={{
        ...RESET, background:PAPER, height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <StatusBar />
        <BrandRow back />

        <div style={{ ...RESET, padding:'4px 18px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:2,
          }}>Voice memo</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
            letterSpacing:'-0.025em', lineHeight:1, color:INK,
          }}>Record a punch.</div>
        </div>

        <div style={{ ...RESET, padding:'10px 18px 6px', flexShrink:0 }}>
          <SiteChip />
        </div>

        <p style={{
          ...RESET, padding:'10px 22px 0', flexShrink:0,
          fontFamily:'var(--font-body)', fontSize:13, lineHeight:1.5, color:INK2, margin:0,
        }}>
          Tap the mic, describe what you see. We'll transcribe and auto-pick the trade.
          Works offline — syncs when you hit signal.
        </p>

        {/* Big record button — centered */}
        <div style={{
          flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:18,
          padding:'12px 18px',
        }}>
          {/* Outer ring */}
          <div style={{
            width:160, height:160, borderRadius:999,
            background:'transparent', border:'2px dashed '+LINES,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <div style={{
              width:128, height:128, borderRadius:999,
              background:ORANGE, color:PAPER,
              border:'3px solid '+INK,
              boxShadow:'4px 4px 0 0 '+INK,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Ico name="mic" size={48} onPrimary />
            </div>
          </div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
            letterSpacing:'0.06em', textTransform:'uppercase', color:INK,
          }}>Tap to record · up to 3 min</div>
        </div>

        <TabBar />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RecordingScreen — mid-record. Live waveform, timer, stop / pause / discard.
  // ─────────────────────────────────────────────────────────────
  function VoiceRecordingScreen() {
    return (
      <div style={{
        ...RESET, background:PAPER, height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <StatusBar />
        <BrandRow back />

        <div style={{ ...RESET, padding:'4px 18px 0', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
              letterSpacing:'0.08em', textTransform:'uppercase', color:RED, marginBottom:2,
              display:'inline-flex', alignItems:'center', gap:6,
            }}>
              <span style={{
                width:8, height:8, borderRadius:999, background:RED,
                border:'1.5px solid '+INK,
                animation:'bc-rec-pulse 1.2s ease-in-out infinite',
              }} />
              Recording
            </div>
            <div style={{
              fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
              letterSpacing:'-0.025em', lineHeight:1, color:INK,
            }}>00:18</div>
          </div>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.05em', textTransform:'uppercase', color:INK3,
          }}>03:00 max</span>
        </div>

        <div style={{ ...RESET, padding:'10px 18px 6px', flexShrink:0 }}>
          <SiteChip />
        </div>

        {/* Live waveform — scrolling bars */}
        <div style={{
          ...RESET, padding:'14px 18px', flex:1,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:18, overflow:'hidden',
        }}>
          <Waveform />
          <p style={{
            fontFamily:'var(--font-body)', fontSize:13, lineHeight:1.5,
            color:INK3, margin:0, textAlign:'center', maxWidth:240,
          }}>
            We're listening. Keep talking — the timer pauses if you stop for more than 2 seconds.
          </p>
        </div>

        {/* Action row — discard | stop | pause */}
        <div style={{
          ...RESET, padding:'10px 18px 10px',
          background:PAPER, borderTop:'1.5px solid '+LINE, flexShrink:0,
          display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12, alignItems:'center',
        }}>
          <button style={{
            height:48, padding:'0 14px', cursor:'pointer',
            border:'2px solid '+INK, background:PAPER, color:INK,
            borderRadius:'var(--r-2)',
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:13.5,
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <Ico name="trash-2" size={14} color="red" />
            Discard
          </button>

          {/* Big stop button */}
          <button style={{
            width:64, height:64, borderRadius:999, cursor:'pointer', padding:0,
            background:RED, color:PAPER,
            border:'3px solid '+INK, boxShadow:'3px 3px 0 0 '+INK,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <div style={{ width:22, height:22, background:PAPER, borderRadius:3 }} />
          </button>

          <button style={{
            height:48, padding:'0 14px', cursor:'pointer',
            border:'2px solid '+INK, background:PAPER, color:INK,
            borderRadius:'var(--r-2)',
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:13.5,
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <Ico name="pause" size={14} />
            Pause
          </button>
        </div>

        <TabBar />
      </div>
    );
  }

  // Live waveform — a horizontal strip of bars at varying heights.
  // Real impl reads from MediaRecorder; here we animate via CSS for the mock.
  function Waveform() {
    // 48 bars, height array — last 12 "active" with pulse
    const heights = [
      6, 10, 16, 22, 18, 11, 7, 14, 24, 32, 28, 20, 12, 8, 16, 26,
      30, 22, 14, 10, 18, 28, 34, 28, 20, 13, 9, 14, 22, 28, 24, 18,
      11, 8, 14, 22, 30, 34, 30, 22, 16, 12, 20, 28, 36, 32, 22, 16,
    ];
    return (
      <div style={{
        ...RESET, width:'100%', height:80,
        display:'flex', alignItems:'center', justifyContent:'center', gap:3,
      }}>
        {heights.map((h, i) => {
          const isActive = i >= heights.length - 12;
          return (
            <div key={i} style={{
              width:3, height: h,
              background: isActive ? INK : INK3,
              borderRadius:2,
              animation: isActive ? `bc-bar-pulse 0.${4 + (i % 5)}s ease-in-out infinite alternate` : 'none',
              opacity: isActive ? 1 : 0.6,
            }} />
          );
        })}
      </div>
    );
  }

  // Inject keyframes
  if (typeof document !== 'undefined' && !document.getElementById('bc-voice-anim')) {
    const s = document.createElement('style');
    s.id = 'bc-voice-anim';
    s.textContent = `
      @keyframes bc-rec-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      @keyframes bc-bar-pulse { from { transform: scaleY(0.65); } to { transform: scaleY(1.15); } }
    `;
    document.head.appendChild(s);
  }

  Object.assign(window, { VoiceIdleScreen, VoiceRecordingScreen });
})();
