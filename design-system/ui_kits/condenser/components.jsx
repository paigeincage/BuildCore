// Components.jsx — The Condenser (mobile)
// Field punch-list app. All UI follows BuildCore design tokens defined in
// ../../colors_and_type.css. Components are intentionally light on logic.

const { useState } = React;

const ICONS = (n) => `https://unpkg.com/lucide-static@latest/icons/${n}.svg`;

// ─────────────────────────────────────────────────────────────
// Icon — Lucide via CDN, inherits currentColor via filter trick
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color }) {
  return (
    <img
      src={ICONS(name)}
      width={size}
      height={size}
      alt=""
      style={{
        display: 'block',
        filter: color === 'on-dark'
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

// ─────────────────────────────────────────────────────────────
// Sticky header — title + back / action buttons
// ─────────────────────────────────────────────────────────────
function Header({ title, eyebrow, back, onBack, right }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      background: 'rgba(250,250,247,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid var(--bc-line)',
      padding: '12px 16px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 36 }}>
        {back && (
          <button onClick={onBack} aria-label="Back" style={btnIcon()}>
            <Icon name="chevron-left" size={22} />
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {eyebrow && <div className="meta" style={{ marginBottom: 2 }}>{eyebrow}</div>}
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 22, letterSpacing: '-0.02em', color: 'var(--bc-ink)',
            lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}</div>
        </div>
        {right}
      </div>
    </div>
  );
}
function btnIcon() {
  return {
    width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: '1.5px solid var(--bc-line)', background: 'var(--bc-paper)',
    borderRadius: 'var(--r-2)', cursor: 'pointer', padding: 0,
  };
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar (5 items, 64px tall) — full-width on phone
// ─────────────────────────────────────────────────────────────
function BottomTabs({ tab, onTab }) {
  const tabs = [
    { id: 'today',   icon: 'sun',            label: 'Today' },
    { id: 'lots',    icon: 'home',           label: 'Lots' },
    { id: 'punch',   icon: 'clipboard-list', label: 'Punch' },
    { id: 'trades',  icon: 'hard-hat',       label: 'Trades' },
    { id: 'me',      icon: 'user',           label: 'Me' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
      borderTop: '2px solid var(--bc-line-strong)',
      background: 'var(--bc-paper)',
      paddingBottom: 18,
    }}>
      {tabs.map(t => {
        const on = t.id === tab;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{
            height: 64, padding: 0, border: 0, background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 3, cursor: 'pointer',
            borderTop: on ? '3px solid var(--bc-orange)' : '3px solid transparent',
            marginTop: -2,
          }}>
            <Icon name={t.icon} size={22} color={on ? undefined : 'muted'} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase',
              fontWeight: on ? 600 : 500,
              color: on ? 'var(--bc-ink)' : 'var(--bc-ink-3)',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Status pill — small, squared, mono-cased
// ─────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    open:     { c: '#1F5A8A', bg: '#D9E5F0', label: 'Open' },
    progress: { c: '#8A6300', bg: '#FBF1CC', label: 'In progress' },
    closed:   { c: '#2E7D3A', bg: '#DEEFD8', label: 'Closed' },
    blocked:  { c: '#B82A1F', bg: '#F6DDD7', label: 'Blocked' },
    late:     { c: '#FAFAF7', bg: '#B82A1F', label: 'Late' },
  };
  const s = map[status] || map.open;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)', fontWeight: 600,
      fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
      padding: '4px 8px', borderRadius: 'var(--r-2)',
      border: '1.5px solid ' + s.c, background: s.bg, color: s.c,
    }}>
      <span style={{ width: 7, height: 7, background: 'currentColor', borderRadius: 999 }} />
      {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Trade tag chip
// ─────────────────────────────────────────────────────────────
function TradeTag({ children }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontWeight: 600,
      fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
      padding: '4px 8px', borderRadius: 'var(--r-2)',
      border: '1.5px solid var(--bc-line)', background: 'var(--bc-paper-2)',
      color: 'var(--bc-ink)',
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// ID stamp — mono ID like "PL-1023"
// ─────────────────────────────────────────────────────────────
function IdStamp({ children, kind = 'default' }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontWeight: 600,
      fontSize: 11, letterSpacing: '0.03em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 'var(--r-2)',
      border: '1.5px solid var(--bc-line)',
      background: kind === 'dark' ? 'var(--bc-paper-3)' : 'var(--bc-paper-2)',
      color: 'var(--bc-ink)',
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Primary button (with stamp shadow)
// ─────────────────────────────────────────────────────────────
function Button({ children, variant = 'primary', onClick, icon, fullWidth, size = 'lg' }) {
  const h = size === 'sm' ? 40 : 56;
  const fs = size === 'sm' ? 14 : 16;
  const base = {
    fontFamily: 'var(--font-body)', fontWeight: 600,
    fontSize: fs, letterSpacing: '-0.005em',
    height: h, padding: '0 18px',
    borderRadius: 'var(--r-2)',
    border: '2px solid var(--bc-ink)',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: fullWidth ? '100%' : undefined,
    boxShadow: '3px 3px 0 0 var(--bc-ink)',
    transition: 'transform 100ms var(--ease-out), box-shadow 100ms var(--ease-out), background 160ms var(--ease-out)',
  };
  const styles = {
    primary:   { background: 'var(--bc-orange)', color: 'var(--bc-paper)' },
    secondary: { background: 'var(--bc-paper)',  color: 'var(--bc-ink)' },
    ghost:     { background: 'transparent', color: 'var(--bc-ink)', boxShadow: 'none' },
    danger:    { background: 'var(--bc-red)',    color: 'var(--bc-paper)' },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...styles[variant] }}
      onMouseDown={e => { e.currentTarget.style.transform = 'translate(3px,3px)'; e.currentTarget.style.boxShadow = '0 0 0 0 var(--bc-ink)'; }}
      onMouseUp={e =>   { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = base.boxShadow; }}
      onMouseLeave={e =>{ e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = variant === 'ghost' ? 'none' : base.boxShadow; }}
    >
      {icon && <Icon name={icon} size={18} color={variant === 'primary' || variant === 'danger' ? 'on-dark' : undefined} />}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Punch ticket — the signature card
// ─────────────────────────────────────────────────────────────
function PunchTicket({ punch, onClick, stamped = true }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bc-paper)',
        border: '2px solid var(--bc-ink)',
        borderRadius: 'var(--r-4)',
        boxShadow: stamped ? '3px 3px 0 0 var(--bc-ink)' : 'none',
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <IdStamp>{punch.id}</IdStamp>
        <IdStamp kind="dark">Lot {punch.lot}</IdStamp>
        <div style={{ marginLeft: 'auto' }}><StatusPill status={punch.status} /></div>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 17, letterSpacing: '-0.01em', lineHeight: 1.2,
        color: 'var(--bc-ink)',
      }}>{punch.title}</div>
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        color: 'var(--bc-ink-3)',
      }}>
        <span><span style={{ color: 'var(--bc-ink-2)', fontWeight: 600 }}>Trade</span> {punch.trade}</span>
        <span><span style={{ color: 'var(--bc-ink-2)', fontWeight: 600 }}>Due</span> {punch.due}</span>
        {punch.photos > 0 && (
          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
            <Icon name="camera" size={14} color="muted" /> {punch.photos}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lot card — a row in the Lots list
// ─────────────────────────────────────────────────────────────
function LotCard({ lot, onClick }) {
  const pct = lot.closed / (lot.closed + lot.open) * 100;
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      background: 'var(--bc-paper)',
      border: '2px solid var(--bc-line-strong)',
      borderRadius: 'var(--r-4)',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22,
          letterSpacing: '-0.01em', color: 'var(--bc-ink)',
        }}>{lot.number}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--bc-ink)' }}>
            {lot.address}
          </div>
          <div className="meta" style={{ marginTop: 2 }}>{lot.plan} · {lot.phase}</div>
        </div>
        <Icon name="chevron-right" size={20} color="muted" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 8, background: 'var(--bc-paper-3)', border: '1.5px solid var(--bc-line-strong)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: 'var(--bc-orange)' }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12,
          color: 'var(--bc-ink-2)', textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {lot.open} open · {lot.closed} closed
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Segmented tabs
// ─────────────────────────────────────────────────────────────
function Segmented({ value, onChange, options }) {
  return (
    <div style={{
      display: 'flex', border: '2px solid var(--bc-line-strong)',
      borderRadius: 'var(--r-2)', overflow: 'hidden', height: 44,
    }}>
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            flex: 1, border: 0,
            borderRight: i < options.length - 1 ? '2px solid var(--bc-line-strong)' : 0,
            background: on ? 'var(--bc-ink)' : 'var(--bc-paper)',
            color: on ? 'var(--bc-paper)' : 'var(--bc-ink-3)',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            cursor: 'pointer',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Photo tile (placeholder rectangle with crop bracket aesthetic)
// ─────────────────────────────────────────────────────────────
function PhotoTile({ src, label, size = 'md' }) {
  const dim = size === 'lg' ? 140 : 80;
  return (
    <div style={{
      width: dim, height: dim, flexShrink: 0,
      background: src ? `url(${src}) center/cover` : 'var(--bc-paper-3)',
      border: '2px solid var(--bc-line-strong)',
      borderRadius: 'var(--r-2)',
      position: 'relative',
      display: 'flex', alignItems: 'flex-end', padding: 6,
    }}>
      {!src && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', inset:0, color:'var(--bc-ink-3)' }}>
          <Icon name="image" size={26} color="muted" />
        </div>
      )}
      {label && (
        <span className="meta" style={{
          background: 'rgba(20,17,13,0.85)', color: 'var(--bc-paper)',
          padding: '2px 6px', borderRadius: 2, fontSize: 10,
        }}>{label}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat tile (used on Today screen)
// ─────────────────────────────────────────────────────────────
function StatTile({ value, label, accent }) {
  return (
    <div style={{
      flex: 1,
      background: accent ? 'var(--bc-orange)' : 'var(--bc-paper)',
      color: accent ? 'var(--bc-paper)' : 'var(--bc-ink)',
      border: '2px solid var(--bc-ink)',
      borderRadius: 'var(--r-4)',
      padding: '14px 14px 12px',
      boxShadow: accent ? '3px 3px 0 0 var(--bc-ink)' : 'none',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1,
      }}>{value}</div>
      <div className="meta" style={{
        marginTop: 6,
        color: accent ? 'rgba(250,250,247,0.85)' : 'var(--bc-ink-3)',
      }}>{label}</div>
    </div>
  );
}

// Export
Object.assign(window, {
  Icon, Header, BottomTabs, StatusPill, TradeTag, IdStamp,
  Button, PunchTicket, LotCard, Segmented, PhotoTile, StatTile,
});
