// empty-states.jsx — Screen 8/8: Four empty states
// no sites · no punches · no contacts · no files
(function () {
  const ICON   = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;
  const PAPER  = 'var(--bc-paper)', PAPER2 = 'var(--bc-paper-2)';
  const INK    = 'var(--bc-ink)', INK2 = 'var(--bc-ink-2)', INK3 = 'var(--bc-ink-3)';
  const LINE   = 'var(--bc-line)', LINES = 'var(--bc-line-strong)';
  const ORANGE = 'var(--bc-orange)';
  const RESET  = { boxSizing:'border-box', maxWidth:'100%', minWidth:0 };

  function Ico({ name, size = 18, color, onPrimary }) {
    return <img src={ICON(name)} width={size} height={size} alt="" style={{
      display:'block', flexShrink:0,
      filter: onPrimary ? 'invert(98%) sepia(2%) saturate(123%) hue-rotate(45deg) brightness(108%)'
            : color === 'muted' ? 'invert(40%) sepia(8%) saturate(330%) hue-rotate(8deg) brightness(95%) contrast(85%)'
            : color === 'orange' ? 'invert(43%) sepia(63%) saturate(835%) hue-rotate(346deg) brightness(89%) contrast(86%)'
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
      <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
        <div style={{ width:18, height:14, background:ORANGE, clipPath:'polygon(0 100%, 0 0, 70% 0, 100% 100%)' }} />
        <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:12, letterSpacing:'-0.025em', color:INK, lineHeight:1 }}>BuildCore</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, letterSpacing:'0.05em', textTransform:'uppercase', color:INK3, marginLeft:4 }}>· Condenser</span>
      </div>
    </div>;
  }

  function TabBar({ active }) {
    return <div style={{
      ...RESET, display:'grid', gridTemplateColumns:'repeat(5,1fr)',
      borderTop:'2px solid '+LINES, background:PAPER, paddingBottom:12, flexShrink:0,
    }}>
      {[
        { id:'today',  icon:'sun', label:'Today' },
        { id:'sites',  icon:'home', label:'Sites' },
        { id:'punch',  icon:'clipboard-list', label:'Punch' },
        { id:'trades', icon:'hard-hat', label:'Trades' },
        { id:'me',     icon:'user', label:'Me' },
      ].map(t => {
        const on = t.id === active;
        return (
          <div key={t.id} style={{
            height:52, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', gap:2,
            borderTop: on ? '3px solid '+ORANGE : '3px solid transparent', marginTop:-2,
          }}>
            <Ico name={t.icon} size={18} color={on ? undefined : 'muted'} />
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:8.5, letterSpacing:'0.04em',
              textTransform:'uppercase', fontWeight: on ? 600 : 500, color: on ? INK : INK3,
            }}>{t.label}</span>
          </div>
        );
      })}
    </div>;
  }

  // ─────────────────────────────────────────────────────────────
  // Shared empty-state shell
  // ─────────────────────────────────────────────────────────────
  function Empty({ tab, eyebrow, title, headline, copy, icon, ctaIcon, ctaLabel, secondary }) {
    return (
      <div style={{ ...RESET, background:PAPER, height:'100%', width:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <StatusBar />
        <BrandRow />

        {/* Title */}
        <div style={{ ...RESET, padding:'4px 18px 0', flexShrink:0 }}>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
            letterSpacing:'0.08em', textTransform:'uppercase', color:INK3, marginBottom:2,
          }}>{eyebrow}</div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:24,
            letterSpacing:'-0.025em', lineHeight:1, color:INK,
          }}>{title}</div>
        </div>

        {/* Center column */}
        <div style={{
          ...RESET, flex:1, minHeight:0,
          padding:'20px 22px',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:18, textAlign:'center',
        }}>
          {/* Stamped icon block */}
          <div style={{
            width:96, height:96, borderRadius:'var(--r-4)',
            background:PAPER, border:'2px solid '+INK,
            boxShadow:'4px 4px 0 0 '+INK,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            position:'relative',
          }}>
            <div style={{
              position:'absolute', inset:0, background:'var(--bc-orange-tint)',
              border:'2px solid '+INK, borderRadius:'var(--r-4)',
            }} />
            <Ico name={icon} size={40} color="orange" />
          </div>

          <div style={{
            fontFamily:'var(--font-display)', fontWeight:800, fontSize:22,
            letterSpacing:'-0.025em', lineHeight:1.1, color:INK, textWrap:'balance',
            maxWidth:280,
          }}>{headline}</div>
          <p style={{
            fontFamily:'var(--font-body)', fontSize:13.5, lineHeight:1.5,
            color:INK2, margin:0, maxWidth:280, textWrap:'pretty',
          }}>{copy}</p>
        </div>

        {/* CTA + secondary */}
        <div style={{
          ...RESET, padding:'10px 22px 14px',
          background:PAPER, borderTop:'1.5px solid '+LINE, flexShrink:0,
          display:'flex', flexDirection:'column', gap:10,
        }}>
          <button style={{
            ...RESET, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            height:54, padding:'0 18px', width:'100%',
            background:ORANGE, color:PAPER,
            border:'2px solid '+INK, borderRadius:'var(--r-2)',
            boxShadow:'3px 3px 0 0 '+INK, cursor:'pointer',
            fontFamily:'var(--font-body)', fontWeight:700, fontSize:15,
          }}>
            <Ico name={ctaIcon} size={16} onPrimary />
            {ctaLabel}
          </button>
          {secondary && (
            <button style={{
              background:'transparent', border:0, padding:8, cursor:'pointer',
              fontFamily:'var(--font-body)', fontWeight:600, fontSize:13,
              color:INK2, textDecoration:'underline', textUnderlineOffset:3,
            }}>{secondary}</button>
          )}
        </div>

        <TabBar active={tab} />
      </div>
    );
  }

  function EmptySites() {
    return <Empty
      tab="sites"
      eyebrow="Sites"
      title="No sites yet"
      icon="home"
      headline="Add your first site."
      copy="Sites are individual houses you walk. Add one to start tracking punches, walks, and trade comms by address."
      ctaIcon="plus"
      ctaLabel="Add a site"
      secondary="Import addresses from a community"
    />;
  }

  function EmptyPunches() {
    return <Empty
      tab="punch"
      eyebrow="Punch"
      title="No open punches"
      icon="clipboard-list"
      headline="You're caught up."
      copy="When you walk a house and capture a defect — voice, photo, or upload — it shows up here, sorted by trade."
      ctaIcon="mic"
      ctaLabel="Capture your first punch"
      secondary="Upload a punch list document"
    />;
  }

  function EmptyContacts() {
    return <Empty
      tab="trades"
      eyebrow="Trades"
      title="No contacts yet"
      icon="hard-hat"
      headline="Add your trades."
      copy="Your trade contacts are who gets the punch list. Add them one at a time, or import a whole list from a spreadsheet."
      ctaIcon="plus"
      ctaLabel="Add a contact"
      secondary="Import from CSV"
    />;
  }

  function EmptyFiles() {
    return <Empty
      tab="punch"
      eyebrow="Upload"
      title="Nothing uploaded yet"
      icon="upload"
      headline="Drop in a punch list."
      copy="PDFs, docs, spreadsheets, jobsite photos — we'll read them and auto-sort each item by trade. Works offline."
      ctaIcon="upload"
      ctaLabel="Pick files or photos"
      secondary="Or capture a voice memo"
    />;
  }

  Object.assign(window, { EmptySites, EmptyPunches, EmptyContacts, EmptyFiles });
})();
