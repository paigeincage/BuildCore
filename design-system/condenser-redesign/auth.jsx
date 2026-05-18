// auth.jsx — Phone sign-up + SMS verification (Decision E)
// Two screens, native iOS feel:
//   PhoneEntryScreen → big number-led input + "Send code"
//   CodeVerifyScreen → 6-digit segmented input + "Verify"
//
// No tab bar — these are pre-auth, before the user lands in the app.
// Sample placeholders only ("(555) 123-4567" is clearly fake).

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
  const RESET  = { boxSizing:'border-box', maxWidth:'100%', minWidth:0 };

  function Ico({ name, size = 18, onPrimary, color }) {
    return (
      <img src={ICON(name)} width={size} height={size} alt="" style={{
        display:'block', flexShrink:0,
        filter: onPrimary
          ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
          : color === 'muted'
          ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
          : 'none',
      }} />
    );
  }

  function StatusBar() {
    return (
      <div style={{
        ...RESET, height:44, padding:'14px 22px 0',
        display:'flex', alignItems:'flex-end', justifyContent:'space-between',
        fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
        fontSize:12, fontWeight:600, color:INK, flexShrink:0,
      }}>
        <span>9:41</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9 }}>100%</span>
      </div>
    );
  }

  function BrandLockup({ size = 'md' }) {
    const wedgeW = size === 'lg' ? 26 : 18;
    const wedgeH = size === 'lg' ? 20 : 14;
    const fs     = size === 'lg' ? 18 : 12;
    return (
      <div style={{ display:'inline-flex', alignItems:'center', gap:7, minWidth:0 }}>
        <div style={{
          width: wedgeW, height: wedgeH, background: ORANGE, flexShrink:0,
          clipPath: 'polygon(0 100%, 0 0, 70% 0, 100% 100%)',
        }} />
        <span style={{
          fontFamily:'var(--font-display)', fontWeight:900,
          fontSize: fs, letterSpacing:'-0.025em', color:INK, lineHeight:1,
        }}>BuildCore</span>
        <span style={{
          fontFamily:'var(--font-mono)', fontSize: size === 'lg' ? 11 : 9,
          letterSpacing:'0.05em', textTransform:'uppercase', color:INK3, marginLeft:4,
        }}>· Condenser</span>
      </div>
    );
  }

  function PrimaryCTA({ icon, label, disabled }) {
    return (
      <div style={{
        ...RESET, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        height:54, padding:'0 18px', width:'100%',
        background: disabled ? 'var(--bc-paper-3)' : ORANGE,
        color: disabled ? INK3 : PAPER,
        border:'2px solid '+INK, borderRadius:'var(--r-2)',
        boxShadow: disabled ? 'none' : '3px 3px 0 0 '+INK,
        fontFamily:'var(--font-body)', fontWeight:700, fontSize:15.5,
        whiteSpace:'nowrap', cursor: disabled ? 'default' : 'pointer',
      }}>
        {icon && <Ico name={icon} size={16} onPrimary={!disabled} />}
        {label}
      </div>
    );
  }

  function GhostBtn({ children }) {
    return (
      <button style={{
        background:'transparent', border:0, padding:'8px 4px', cursor:'pointer',
        fontFamily:'var(--font-body)', fontWeight:600, fontSize:13.5,
        color:INK2, textDecoration:'underline', textUnderlineOffset:3,
      }}>{children}</button>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 1 — Phone entry
  // ─────────────────────────────────────────────────────────────
  function PhoneEntryScreen() {
    return (
      <div style={{
        ...RESET, background:PAPER, height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <StatusBar />

        {/* Brand — centered, generous top */}
        <div style={{ ...RESET, padding:'28px 22px 0', flexShrink:0,
          display:'flex', justifyContent:'center',
        }}>
          <BrandLockup size="lg" />
        </div>

        {/* Hero copy */}
        <div style={{ ...RESET, padding:'48px 22px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:6,
          }}>Sign in</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:28,
            letterSpacing:'-0.03em', lineHeight:1.02, color:INK, textWrap:'balance',
          }}>What's your<br />number?</div>
          <p style={{
            fontFamily:'var(--font-body)', fontSize:14, lineHeight:1.5,
            color:INK2, margin:'10px 0 0', maxWidth:280,
          }}>
            We'll text you a 6-digit code to verify. No password to remember.
          </p>
        </div>

        {/* Phone input */}
        <div style={{ ...RESET, padding:'24px 22px 0', flexShrink:0 }}>
          <label style={{
            fontFamily:'var(--font-body)', fontWeight:600, fontSize:11.5,
            letterSpacing:'0.04em', textTransform:'uppercase', color:INK,
            display:'block', marginBottom:6,
          }}>Mobile number</label>
          <div style={{
            ...RESET,
            display:'flex', alignItems:'stretch',
            border:'2px solid '+LINES, borderRadius:'var(--r-2)', background:PAPER,
            height:54, overflow:'hidden',
          }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'0 12px',
              borderRight:'2px solid '+LINES, background:PAPER2,
              fontFamily:'var(--font-mono)', fontWeight:700, fontSize:14,
              color:INK, flexShrink:0,
            }}>
              <span>🇺🇸 +1</span>
            </div>
            <input
              type="tel" inputMode="tel" autoComplete="tel"
              placeholder="(555) 123-4567"
              defaultValue=""
              style={{
                flex:1, minWidth:0, border:0, outline:'none',
                padding:'0 14px',
                background:'transparent', color:INK,
                fontFamily:'var(--font-body)', fontWeight:600, fontSize:18,
                letterSpacing:'-0.01em',
              }} />
          </div>
          <p style={{
            fontFamily:'var(--font-mono)', fontSize:9.5, lineHeight:1.5,
            letterSpacing:'0.04em', textTransform:'uppercase',
            color:INK3, margin:'10px 0 0',
          }}>Standard SMS rates apply · sample data shown</p>
        </div>

        {/* Spacer pushes the CTA to the bottom */}
        <div style={{ flex:1 }} />

        {/* Disclaimer */}
        <div style={{ ...RESET, padding:'0 22px 10px', flexShrink:0 }}>
          <p style={{
            fontFamily:'var(--font-body)', fontSize:11.5, color:INK3,
            lineHeight:1.5, margin:0, textWrap:'pretty',
          }}>
            By continuing you agree to our <span style={{ color:INK, fontWeight:600, textDecoration:'underline' }}>Terms</span> and <span style={{ color:INK, fontWeight:600, textDecoration:'underline' }}>Privacy</span>.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          ...RESET, padding:'8px 22px 16px',
          background:PAPER, borderTop:'1.5px solid '+LINE, flexShrink:0,
        }}>
          <PrimaryCTA icon="message-square" label="Send code" />
        </div>

        {/* Home indicator */}
        <div style={{ flexShrink:0, paddingBottom:8, display:'flex', justifyContent:'center' }}>
          <div style={{ width:120, height:4, background:INK, borderRadius:999, opacity:0.5 }} />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 2 — SMS verification
  // ─────────────────────────────────────────────────────────────
  function CodeVerifyScreen() {
    // Show 3 of 6 digits filled, mid-entry feel
    const slots = ['8', '2', '5', '', '', ''];
    return (
      <div style={{
        ...RESET, background:PAPER, height:'100%', width:'100%',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        <StatusBar />

        {/* Top row — back + step */}
        <div style={{ ...RESET, padding:'8px 18px 0', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <button style={{
            height:32, padding:'0 8px 0 4px', display:'inline-flex', alignItems:'center', gap:4,
            background:'transparent', border:0, cursor:'pointer',
            fontFamily:'var(--font-body)', fontWeight:600, fontSize:13, color:INK,
          }}>
            <Ico name="chevron-left" size={18} />
            Back
          </button>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3,
          }}>Step 2 of 2</span>
        </div>

        {/* Brand row */}
        <div style={{ ...RESET, padding:'18px 22px 0', flexShrink:0,
          display:'flex', justifyContent:'center',
        }}>
          <BrandLockup />
        </div>

        {/* Hero copy */}
        <div style={{ ...RESET, padding:'28px 22px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:6,
          }}>Verify your number</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:28,
            letterSpacing:'-0.03em', lineHeight:1.02, color:INK, textWrap:'balance',
          }}>Enter the code.</div>
          <p style={{
            fontFamily:'var(--font-body)', fontSize:14, lineHeight:1.5,
            color:INK2, margin:'10px 0 0',
          }}>
            We sent a 6-digit code to <span style={{
              fontFamily:'var(--font-mono)', fontWeight:600, color:INK,
            }}>+1 (555) 123-4567</span>.
            {' '}
            <button style={{
              background:'transparent', border:0, padding:0, cursor:'pointer',
              fontFamily:'var(--font-body)', fontWeight:600, fontSize:14,
              color:ORANGE, textDecoration:'underline',
            }}>Change number</button>
          </p>
        </div>

        {/* Code slots */}
        <div style={{ ...RESET, padding:'24px 18px 0', flexShrink:0 }}>
          <div style={{
            ...RESET, display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6,
          }}>
            {slots.map((d, i) => {
              const filled = d !== '';
              const active = i === slots.findIndex(s => s === '');
              return (
                <div key={i} style={{
                  height:60,
                  background: filled ? PAPER2 : PAPER,
                  border: '2px solid ' + (active ? INK : LINES),
                  borderRadius:'var(--r-2)',
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--font-display)', fontWeight:900, fontSize:26,
                  letterSpacing:'-0.02em', color:INK,
                  boxShadow: active ? '0 0 0 3px var(--bc-orange-tint)' : 'none',
                  position:'relative',
                }}>
                  {filled ? d : (active ? <Caret /> : '')}
                </div>
              );
            })}
          </div>

          {/* Resend timer */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            marginTop:18, padding:'0 4px',
          }}>
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
              letterSpacing:'0.04em', textTransform:'uppercase', color:INK3,
            }}>Didn't get it?</span>
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700,
              letterSpacing:'0.04em', textTransform:'uppercase', color:INK,
            }}>Resend in 0:32</span>
          </div>
        </div>

        <div style={{ flex:1 }} />

        {/* CTA */}
        <div style={{
          ...RESET, padding:'10px 22px 16px',
          background:PAPER, borderTop:'1.5px solid '+LINE, flexShrink:0,
        }}>
          <PrimaryCTA icon="check" label="Verify" disabled />
        </div>

        {/* Home indicator */}
        <div style={{ flexShrink:0, paddingBottom:8, display:'flex', justifyContent:'center' }}>
          <div style={{ width:120, height:4, background:INK, borderRadius:999, opacity:0.5 }} />
        </div>
      </div>
    );
  }

  // Blinking caret for the active code slot
  function Caret() {
    return (
      <div style={{
        width:2, height:28, background:INK,
        animation:'bc-caret-blink 1.06s steps(2) infinite',
      }} />
    );
  }

  // Inject caret keyframes once
  if (typeof document !== 'undefined' && !document.getElementById('bc-auth-anim')) {
    const s = document.createElement('style');
    s.id = 'bc-auth-anim';
    s.textContent = `@keyframes bc-caret-blink { 0%, 50% { opacity: 1 } 50.01%, 100% { opacity: 0 } }`;
    document.head.appendChild(s);
  }

  Object.assign(window, { PhoneEntryScreen, CodeVerifyScreen });
})();
