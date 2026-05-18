// phone.jsx — Interactive iPhone mockup for the BuildCore landing hero.
// Replaces the static PhoneMockup defined earlier. The user can:
//   1. Tap a punch ticket → see the punch detail
//   2. Tap "Send to trade" → success toast, ticket marks closed, back to list
//   3. Tap "Try it on your jobsite" → email capture screen
//   4. Submit email → success screen with iOS / Android send-link buttons
//
// Goal: a real dopamine loop inside the marketing site. Every tap moves something.

(function () {
  const { useState, useEffect } = React;
  const I = (n) => (typeof window !== 'undefined' && window.__resources && window.__resources[n]) || `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;

  // ─────────────────────────────────────────────────────────────
  // Sample data — mutable status so "send to trade" closes it locally.
  // ─────────────────────────────────────────────────────────────
  // All three punches are for the same house — that's what a punch list is.
  // Addresses only — never "lot" or lot numbers per brand rules.
  const HOUSE_ADDR = '14 Sycamore Ln';
  const INITIAL_TICKETS = [
    { id: 'PL-1023', addr: HOUSE_ADDR, title: 'Hairline crack — master bath tile, north wall', trade: 'Tile',       due: '05/19', status: 'blocked',  photos: 3, partner: 'J. Morales · Pro Tile Co.', initials: 'JM',
      note: 'North wall crack reappeared after settling. Please swing by this week.' },
    { id: 'PL-1020', addr: HOUSE_ADDR, title: 'Outlet missing cover plate — powder rm',         trade: 'Electrical', due: '05/18', status: 'open',     photos: 1, partner: 'R. Tanaka · Volt Electric',   initials: 'RT',
      note: 'Buyer noticed during 30-day walk. Quick fix — five minutes.' },
    { id: 'PL-1018', addr: HOUSE_ADDR, title: 'Door rub on master closet',                       trade: 'Doors',      due: '05/18', status: 'open',     photos: 2, partner: 'D. Kowalski · Doorworks',     initials: 'DK',
      note: 'Sanding the bottom should do it. Confirm before walk.' },
  ];

  // ─────────────────────────────────────────────────────────────
  // Inline primitive helpers (kept local so this file is self-contained)
  // ─────────────────────────────────────────────────────────────
  function Stamp({ children, dark }) {
    return (
      <span style={{
        fontFamily:'var(--font-mono)', fontWeight:600, fontSize:11, letterSpacing:'0.03em', textTransform:'uppercase',
        padding:'3px 8px', borderRadius:'var(--r-2)', border:'1.5px solid var(--bc-line)',
        background: dark ? 'var(--bc-paper-3)' : 'var(--bc-paper-2)',
      }}>{children}</span>
    );
  }
  function Pill({ children, kind }) {
    const map = {
      blocked: { c:'#B82A1F', bg:'#F6DDD7', label:'Blocked' },
      open:    { c:'#1F5A8A', bg:'#D9E5F0', label:'Open' },
      closed:  { c:'#2E7D3A', bg:'#DEEFD8', label:'Sent · closed' },
    };
    const s = map[kind] || map.open;
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', gap:6,
        fontFamily:'var(--font-mono)', fontWeight:600, fontSize:10,
        textTransform:'uppercase', letterSpacing:'0.05em',
        padding:'3px 7px', borderRadius:'var(--r-2)',
        border:'1.5px solid '+s.c, background:s.bg, color:s.c,
      }}>
        <span style={{ width:6, height:6, background:'currentColor', borderRadius:999 }}/>
        {s.label}
      </span>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Reusable chrome
  // ─────────────────────────────────────────────────────────────
  function PhoneShell({ children }) {
    return (
      <div style={{
        width: 360, height: 720,
        background: '#14110D', borderRadius: 42, padding: 8,
        boxShadow: '0 30px 60px rgba(20,17,13,0.25), 0 0 0 2px var(--bc-ink)',
        position: 'relative',
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform:'translateX(-50%)',
          width: 110, height: 28, background: '#000', borderRadius: 18, zIndex: 5,
        }}/>
        <div style={{
          width: '100%', height: '100%', background: 'var(--bc-paper)',
          borderRadius: 34, overflow: 'hidden', position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Top status spacer (clears the iOS notch)
  // ─────────────────────────────────────────────────────────────
  function StatusSpacer({ children }) {
    return (
      <div style={{
        height: 52, padding: '14px 18px 0', display:'flex', alignItems:'flex-end',
        justifyContent:'space-between',
        fontFamily:'-apple-system, SF Pro, system-ui, sans-serif',
        fontSize: 13, fontWeight: 600, color: 'var(--bc-ink)',
      }}>
        <span>9:41</span>
        <span style={{ display:'inline-flex', gap: 4, alignItems:'center' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize: 10, color:'var(--bc-ink-3)' }}>5G</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize: 10 }}>100%</span>
        </span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 1 — Punch list
  // ─────────────────────────────────────────────────────────────
  function ListScreen({ tickets, filter, setFilter, openTicket, goEmail, pulse }) {
    const visible = filter === 'all' ? tickets : tickets.filter(t => filter === 'open' ? t.status !== 'closed' : t.status === 'closed');
    const counts = {
      open:   tickets.filter(t => t.status !== 'closed').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
    return (
      <Anim>
        <StatusSpacer />
        <div style={{ padding: '6px 18px 2px' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--bc-ink-3)' }}>14 Sycamore Ln · Ashford</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize: 22, letterSpacing:'-0.02em', color:'var(--bc-ink)', marginTop: 2 }}>Punch list</div>
        </div>
        <div style={{ display:'flex', gap: 6, padding: '10px 18px 10px' }}>
          <Seg on={filter==='open'}    onClick={() => setFilter('open')}>Open · {counts.open}</Seg>
          <Seg on={filter==='closed'}  onClick={() => setFilter('closed')}>Closed · {counts.closed}</Seg>
          <Seg on={filter==='all'}     onClick={() => setFilter('all')}>All</Seg>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding:'0 18px 12px', display:'flex', flexDirection:'column', gap: 10 }}>
          {visible.length === 0 ? (
            <div style={{
              padding: '40px 18px', textAlign: 'center',
              fontFamily:'var(--font-body)', fontSize: 14, color: 'var(--bc-ink-3)',
            }}>
              No {filter === 'closed' ? 'closed' : 'open'} punches.<br/>
              <span style={{ color:'var(--bc-ink)', fontWeight: 600 }}>Nice work.</span>
            </div>
          ) : visible.map((t, i) => (
            <TicketRow
              key={t.id}
              t={t}
              firstStamped={i === 0 && t.status !== 'closed'}
              pulse={pulse && i === 0 && t.status === 'blocked'}
              onClick={() => openTicket(t.id)}
            />
          ))}
        </div>
        <div style={{ padding: '0 18px 18px' }}>
          <CtaInPhone onClick={goEmail}>
            <span>Try it on your jobsite</span>
            <Icon name="arrow-right" size={16} onPrimary />
          </CtaInPhone>
        </div>
      </Anim>
    );
  }

  function Seg({ children, on, onClick }) {
    return (
      <button onClick={onClick} style={{
        flex:1, height: 32, padding: 0, border: '1.5px solid ' + (on ? 'var(--bc-ink)' : 'var(--bc-line)'),
        background: on ? 'var(--bc-ink)' : 'var(--bc-paper)',
        color: on ? 'var(--bc-paper)' : 'var(--bc-ink-3)',
        borderRadius: 'var(--r-2)',
        fontFamily:'var(--font-body)', fontWeight: 600, fontSize: 10,
        letterSpacing:'0.04em', textTransform:'uppercase',
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 160ms var(--ease-out)',
      }}>{children}</button>
    );
  }

  function TicketRow({ t, firstStamped, pulse, onClick }) {
    return (
      <button onClick={onClick} style={{
        background: 'var(--bc-paper)',
        border: '2px solid var(--bc-ink)',
        borderRadius: 'var(--r-4)',
        padding: '10px 12px',
        display: 'flex', flexDirection: 'column', gap: 6,
        boxShadow: firstStamped ? '3px 3px 0 0 var(--bc-ink)' : 'none',
        cursor: 'pointer', textAlign: 'left',
        position: 'relative',
        animation: pulse ? 'bc-pulse 1.8s var(--ease-out) infinite' : 'none',
        transition: 'transform 100ms var(--ease-out), box-shadow 100ms var(--ease-out)',
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '0 0 0 0 var(--bc-ink)'; }}
      onMouseUp={e =>   { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = firstStamped ? '3px 3px 0 0 var(--bc-ink)' : 'none'; }}
      onMouseLeave={e =>{ e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = firstStamped ? '3px 3px 0 0 var(--bc-ink)' : 'none'; }}
      >
        <div style={{ display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap' }}>
          <Stamp>{t.id}</Stamp>
          <Stamp dark>{t.addr}</Stamp>
          <span style={{ marginLeft:'auto' }}><Pill kind={t.status}/></span>
        </div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13.5, letterSpacing:'-0.01em', lineHeight:1.2, color:'var(--bc-ink)' }}>{t.title}</div>
        <div style={{ display:'flex', gap: 10, fontFamily:'var(--font-mono)', fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--bc-ink-3)' }}>
          <span><b style={{color:'var(--bc-ink-2)'}}>{t.trade}</b></span>
          <span><b style={{color:'var(--bc-ink-2)'}}>Due</b> {t.due}</span>
        </div>
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 2 — Punch detail
  // ─────────────────────────────────────────────────────────────
  function DetailScreen({ ticket, onBack, onSend, sending }) {
    return (
      <Anim>
        <StatusSpacer />
        <div style={{ padding: '8px 18px 10px', display:'flex', alignItems:'center', gap: 10, borderBottom: '1.5px solid var(--bc-line)' }}>
          <button onClick={onBack} aria-label="Back" style={{
            width: 34, height: 34, border:'1.5px solid var(--bc-line)', background:'var(--bc-paper)',
            borderRadius:'var(--r-2)', cursor:'pointer', padding:0,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="chevron-left" size={18} />
          </button>
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--bc-ink-3)' }}>{ticket.id} · {ticket.addr}</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize: 16, letterSpacing:'-0.02em', color:'var(--bc-ink)' }}>Punch</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 16px', display:'flex', flexDirection:'column', gap: 14 }}>

          <div style={{ display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap' }}>
            <Pill kind={ticket.status}/>
            <Stamp>{ticket.trade}</Stamp>
            <span style={{ fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--bc-ink-3)' }}>Due {ticket.due}</span>
          </div>

          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize: 17, letterSpacing:'-0.015em', lineHeight: 1.2, color:'var(--bc-ink)' }}>
            {ticket.title}
          </div>

          {/* Photos */}
          <div style={{ display:'flex', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: 1, aspectRatio: '1 / 1',
                background:
                  i === 0 ? 'linear-gradient(135deg, #6b6356 0%, #8a7e6b 100%)' :
                  i === 1 ? 'linear-gradient(135deg, #4a423a 0%, #6e6860 100%)' :
                            'linear-gradient(135deg, #8a7e6b 0%, #aa9e8b 100%)',
                border: '2px solid var(--bc-ink)', borderRadius: 'var(--r-2)',
                display:'flex', alignItems:'flex-end', padding: 4,
              }}>
                <span style={{
                  background:'rgba(20,17,13,0.7)', color:'var(--bc-paper)',
                  padding: '1px 5px', borderRadius: 2,
                  fontFamily:'var(--font-mono)', fontSize: 8, letterSpacing:'0.05em', textTransform:'uppercase',
                }}>0{i+1}/{ticket.photos}</span>
              </div>
            ))}
          </div>

          {/* Voice memo */}
          <div style={{
            border:'2px solid var(--bc-line-strong)', borderRadius:'var(--r-4)',
            background:'var(--bc-paper)', padding: 10,
            display:'flex', alignItems:'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--r-2)',
              background:'var(--bc-orange)', color:'var(--bc-paper)',
              border:'2px solid var(--bc-ink)', boxShadow:'2px 2px 0 0 var(--bc-ink)',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="play" size={14} onPrimary />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 2, height: 20 }}>
                {[10,16,6,20,14,7,22,15,10,18,12,7,19,14,9,4].map((h,i)=>(
                  <div key={i} style={{ width: 2, height: h, background:'var(--bc-ink)' }} />
                ))}
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize: 9, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--bc-ink-3)', marginTop: 2 }}>
                Voice · 0:18
              </div>
            </div>
          </div>

          {/* Trade partner card */}
          <div style={{
            border: '2px solid var(--bc-line-strong)', borderRadius:'var(--r-4)',
            background:'var(--bc-paper)', padding: 10,
            display:'flex', alignItems:'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 999,
              background: 'var(--bc-orange)', color: 'var(--bc-paper)',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 11,
            }}>{ticket.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily:'var(--font-body)', fontWeight: 600, fontSize: 13, color:'var(--bc-ink)' }}>{ticket.partner.split('·')[0].trim()}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize: 9, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--bc-ink-3)' }}>{ticket.partner.split('·')[1] ? ticket.partner.split('·')[1].trim() : ''}</div>
            </div>
          </div>

          <div style={{
            padding: 10, background:'var(--bc-paper-2)',
            border:'1.5px solid var(--bc-line)', borderRadius:'var(--r-2)',
            fontSize: 12.5, color:'var(--bc-ink)', lineHeight: 1.45,
            fontFamily:'var(--font-body)', fontStyle: 'italic',
          }}>"{ticket.note}"</div>
        </div>

        <div style={{ padding: '0 18px 18px' }}>
          <CtaInPhone onClick={onSend} disabled={ticket.status === 'closed' || sending} accent>
            {ticket.status === 'closed' ? (
              <><Icon name="check-circle" size={16} onPrimary /><span>Sent — trade notified</span></>
            ) : sending ? (
              <span>Sending…</span>
            ) : (
              <><Icon name="send" size={16} onPrimary /><span>Send to trade</span></>
            )}
          </CtaInPhone>
        </div>
      </Anim>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 3 — Email capture
  // ─────────────────────────────────────────────────────────────
  function EmailScreen({ onBack, onSubmit }) {
    const [email, setEmail] = useState('');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return (
      <Anim>
        <StatusSpacer />
        <div style={{ padding: '8px 18px 0', display:'flex', alignItems:'center', gap: 10 }}>
          <button onClick={onBack} aria-label="Back" style={{
            width: 34, height: 34, border:'1.5px solid var(--bc-line)', background:'var(--bc-paper)',
            borderRadius:'var(--r-2)', cursor:'pointer', padding:0,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="chevron-left" size={18} />
          </button>
          <div style={{ fontFamily:'var(--font-mono)', fontSize: 10, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--bc-ink-3)', fontWeight: 600 }}>
            Step 1 of 1
          </div>
        </div>

        <div style={{ flex: 1, overflowY:'auto', padding: '24px 22px', display:'flex', flexDirection:'column', gap: 20 }}>
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--bc-orange)', display:'inline-flex', alignItems:'center', gap: 8 }}>
              <span style={{ width: 14, height: 2, background:'currentColor' }}/>
              Free · 60-day trial
            </div>
            <h2 style={{
              fontFamily:'var(--font-display)', fontWeight:900,
              fontSize: 32, letterSpacing:'-0.03em', lineHeight: 1,
              margin: '14px 0 10px', color:'var(--bc-ink)', textWrap:'balance',
            }}>
              Want this in<br/>your truck?
            </h2>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color:'var(--bc-ink-2)', margin: 0 }}>
              Drop your email. We send a one-tap install link for iOS or Android — no card, no demo call.
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(email.trim()); }}
            style={{ display:'flex', flexDirection:'column', gap: 12 }}
          >
            <label style={{ display:'flex', flexDirection:'column', gap: 6 }}>
              <span style={{ fontFamily:'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--bc-ink)' }}>
                Email
              </span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  height: 48, padding: '0 14px',
                  fontFamily:'var(--font-body)', fontSize: 15, color:'var(--bc-ink)',
                  background:'var(--bc-paper)', border: '2px solid var(--bc-line-strong)',
                  borderRadius:'var(--r-2)', outline: 'none',
                }}
                onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px var(--bc-orange-tint)'}
                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
              />
            </label>
            <CtaInPhone type="submit" disabled={!valid}>
              <Icon name="send" size={16} onPrimary />
              <span>Send me the link</span>
            </CtaInPhone>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 10, color:'var(--bc-ink-3)', textTransform:'uppercase', letterSpacing:'0.05em', textAlign:'center', marginTop: 4 }}>
              No spam · unsubscribe in one tap
            </div>
          </form>
        </div>
      </Anim>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // SCREEN 4 — Success
  // ─────────────────────────────────────────────────────────────
  function SuccessScreen({ email, onReset }) {
    return (
      <Anim key="success">
        <StatusSpacer />
        <div style={{ flex: 1, padding: '36px 22px 22px', display:'flex', flexDirection:'column', gap: 18, alignItems:'flex-start' }}>
          <div style={{
            width: 56, height: 56, border:'2px solid var(--bc-ink)', borderRadius:'var(--r-2)',
            background:'var(--bc-green)', color:'var(--bc-paper)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            boxShadow:'3px 3px 0 0 var(--bc-ink)',
          }}>
            <Icon name="mail" size={28} onPrimary />
          </div>

          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--bc-green)' }}>
              On its way ✓
            </div>
            <h2 style={{
              fontFamily:'var(--font-display)', fontWeight:900,
              fontSize: 28, letterSpacing:'-0.025em', lineHeight: 1.05,
              margin: '12px 0 10px', color:'var(--bc-ink)', textWrap:'balance',
            }}>
              Check your inbox.
            </h2>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color:'var(--bc-ink-2)', margin: 0 }}>
              We just sent an install link to <span style={{ fontFamily:'var(--font-mono)', color:'var(--bc-ink)', fontWeight: 600 }}>{email}</span>.
              Tap it from your phone — you'll be in the app in under a minute.
            </p>
          </div>

          <div style={{
            border:'2px solid var(--bc-line-strong)', borderRadius:'var(--r-4)',
            padding: 14, background:'var(--bc-paper-2)', width: '100%',
            display:'flex', flexDirection:'column', gap: 10,
          }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize: 10, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--bc-ink-3)', fontWeight: 600 }}>
              Or go straight there
            </div>
            <a href="#" style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding: '10px 12px', background:'var(--bc-paper)',
              border:'1.5px solid var(--bc-line-strong)', borderRadius:'var(--r-2)',
              fontFamily:'var(--font-body)', fontSize: 13, fontWeight: 600,
              color:'var(--bc-ink)', textDecoration:'none',
            }}>
              <span>Download on iOS</span>
              <Icon name="arrow-right" size={14} />
            </a>
            <a href="#" style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding: '10px 12px', background:'var(--bc-paper)',
              border:'1.5px solid var(--bc-line-strong)', borderRadius:'var(--r-2)',
              fontFamily:'var(--font-body)', fontSize: 13, fontWeight: 600,
              color:'var(--bc-ink)', textDecoration:'none',
            }}>
              <span>Download for Android</span>
              <Icon name="arrow-right" size={14} />
            </a>
          </div>

          <button
            onClick={onReset}
            style={{
              alignSelf:'center', marginTop: 'auto',
              background:'transparent', border: 0, color:'var(--bc-ink-3)',
              fontFamily:'var(--font-body)', fontSize: 12, fontWeight: 500,
              textDecoration:'underline', cursor:'pointer', padding: 8,
            }}
          >Replay the demo</button>
        </div>
      </Anim>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Shared: in-phone CTA button + Icon helper
  // ─────────────────────────────────────────────────────────────
  function CtaInPhone({ children, onClick, type, disabled, accent }) {
    return (
      <button type={type || 'button'} onClick={onClick} disabled={disabled} style={{
        width: '100%', height: 48, padding: '0 16px',
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8,
        fontFamily:'var(--font-body)', fontWeight: 700, fontSize: 14,
        background: disabled ? 'var(--bc-paper-3)' : 'var(--bc-orange)',
        color: disabled ? 'var(--bc-ink-3)' : 'var(--bc-paper)',
        border: '2px solid var(--bc-ink)', borderRadius:'var(--r-2)',
        boxShadow: disabled ? 'none' : '3px 3px 0 0 var(--bc-ink)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 100ms var(--ease-out), box-shadow 100ms var(--ease-out), background 160ms var(--ease-out)',
      }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = 'translate(3px,3px)'; e.currentTarget.style.boxShadow = '0 0 0 0 var(--bc-ink)'; } }}
      onMouseUp={e =>   { if (!disabled) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 0 var(--bc-ink)'; } }}
      onMouseLeave={e =>{ if (!disabled) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 0 var(--bc-ink)'; } }}
      >{children}</button>
    );
  }
  function Icon({ name, size = 16, onPrimary }) {
    return (
      <img src={I(name)} width={size} height={size} alt="" style={{
        filter: onPrimary ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)' : 'none',
        display: 'block', flexShrink: 0,
      }}/>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Anim — fade + 8px translate in
  // ─────────────────────────────────────────────────────────────
  function Anim({ children }) {
    return (
      <div style={{
        height: '100%', display:'flex', flexDirection:'column',
        animation: 'bc-screen-in 240ms var(--ease-out) both',
      }}>{children}</div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Toast — bottom of phone, slides up
  // ─────────────────────────────────────────────────────────────
  function Toast({ children }) {
    return (
      <div style={{
        position: 'absolute', left: 14, right: 14, bottom: 86, zIndex: 4,
        background: 'var(--bc-ink)', color: 'var(--bc-paper)',
        padding: '10px 14px', borderRadius: 'var(--r-2)',
        boxShadow: '3px 3px 0 0 var(--bc-orange)',
        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'bc-toast-in 240ms var(--ease-out) both',
      }}>
        <Icon name="check-circle" size={16} onPrimary />
        {children}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PhoneMockup — top-level interactive component (overrides window.PhoneMockup)
  // ─────────────────────────────────────────────────────────────
  function PhoneMockup() {
    const [tickets, setTickets] = useState(INITIAL_TICKETS);
    const [filter,  setFilter]  = useState('open');
    const [screen,  setScreen]  = useState('list'); // list | detail | email | success
    const [openId,  setOpenId]  = useState(null);
    const [sending, setSending] = useState(false);
    const [toast,   setToast]   = useState(null);
    const [email,   setEmail]   = useState('');

    useEffect(() => {
      if (!toast) return;
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    }, [toast]);

    const openTicket = (id) => { setOpenId(id); setScreen('detail'); };
    const ticket = tickets.find(t => t.id === openId);

    const onSend = () => {
      if (!ticket || sending) return;
      setSending(true);
      setTimeout(() => {
        setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'closed' } : t));
        setSending(false);
        setToast(`Sent to ${ticket.partner.split('·')[0].trim()}`);
        setTimeout(() => { setScreen('list'); setFilter('open'); }, 700);
      }, 750);
    };

    const reset = () => {
      setTickets(INITIAL_TICKETS);
      setEmail('');
      setScreen('list');
      setFilter('open');
    };

    return (
      <PhoneShell>
        {screen === 'list'    && <ListScreen tickets={tickets} filter={filter} setFilter={setFilter} openTicket={openTicket} goEmail={() => setScreen('email')} pulse={!toast} />}
        {screen === 'detail'  && ticket && <DetailScreen ticket={ticket} onBack={() => setScreen('list')} onSend={onSend} sending={sending}/>}
        {screen === 'email'   && <EmailScreen onBack={() => setScreen('list')} onSubmit={(e) => { setEmail(e); setScreen('success'); }} />}
        {screen === 'success' && <SuccessScreen email={email} onReset={reset} />}
        {toast && <Toast>{toast}</Toast>}
      </PhoneShell>
    );
  }

  // Override the static PhoneMockup defined in components.jsx.
  // Order in index.html: components.jsx loads first, phone.jsx loads second, so
  // by the time React renders, window.PhoneMockup points to this interactive version.
  Object.assign(window, { PhoneMockup });

  // Inject animation keyframes (idempotent)
  if (!document.getElementById('bc-phone-anims')) {
    const s = document.createElement('style');
    s.id = 'bc-phone-anims';
    s.textContent = `
      @keyframes bc-screen-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes bc-toast-in {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes bc-pulse {
        0%, 100% { box-shadow: 3px 3px 0 0 var(--bc-ink); }
        50%      { box-shadow: 3px 3px 0 0 var(--bc-orange), 0 0 0 4px var(--bc-orange-tint); }
      }
    `;
    document.head.appendChild(s);
  }
})();
