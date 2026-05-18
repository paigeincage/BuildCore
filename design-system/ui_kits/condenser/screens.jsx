// Screens.jsx — The Condenser. Each Screen is a function that returns
// the body of one full mobile view (the IOS frame is the chrome).

const SAMPLE_PUNCHES = [
  { id: 'PL-1023', lot: 247, title: 'Hairline crack in master bath tile — north wall', trade: 'Tile',       due: '05/19', status: 'blocked',  photos: 3 },
  { id: 'PL-1020', lot: 247, title: 'Outlet missing cover plate — powder room',         trade: 'Electrical', due: '05/18', status: 'open',     photos: 1 },
  { id: 'PL-1018', lot: 247, title: 'Door rub on master closet · sanded, re-hang',      trade: 'Doors',      due: '05/18', status: 'progress', photos: 2 },
  { id: 'PL-1014', lot: 247, title: 'Garage drywall mud crack at SW corner',            trade: 'Drywall',    due: '05/20', status: 'open',     photos: 4 },
  { id: 'PL-1011', lot: 247, title: 'Toilet supply line — slow drip behind escutcheon', trade: 'Plumbing',   due: '05/17', status: 'open',     photos: 2 },
];

const SAMPLE_LOTS = [
  { number: '247', address: '14 Sycamore Lane',  plan: 'Ashford',     phase: 'Pre-walk',  open: 12, closed: 31 },
  { number: '89A', address: '802 Maple Crest',   plan: 'Maple Ridge', phase: 'Closed',    open: 0,  closed: 47 },
  { number: '312', address: '23 Birchwood Ct.',  plan: 'Ashford',     phase: 'Frame',     open: 4,  closed: 9  },
  { number: '301', address: '11 Willow Bend',    plan: 'Hampton',     phase: 'Final',     open: 6,  closed: 38 },
  { number: '208', address: '57 Cedar Hollow',   plan: 'Hampton',     phase: 'Rough-in',  open: 9,  closed: 14 },
];

// ─────────────────────────────────────────────────────────────
// TODAY — dashboard
// ─────────────────────────────────────────────────────────────
function TodayScreen({ go }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header
        eyebrow="Friday · 05/17"
        title="Today"
        right={(
          <button aria-label="Search" style={{
            width: 40, height: 40, display:'inline-flex', alignItems:'center', justifyContent:'center',
            border: '1.5px solid var(--bc-line)', background: 'var(--bc-paper)',
            borderRadius: 'var(--r-2)', cursor: 'pointer', padding: 0,
          }}>
            <Icon name="search" size={18} />
          </button>
        )}
      />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatTile value="31" label="Open punches" accent />
          <StatTile value="4"  label="Lots in walk" />
          <StatTile value="2"  label="Late · need fix" />
        </div>

        <div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 10 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, letterSpacing:'-0.015em', margin:0 }}>Late · needs you today</h2>
            <span className="meta">2 items</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <PunchTicket onClick={() => go('detail')} punch={SAMPLE_PUNCHES[0]} />
            <PunchTicket onClick={() => go('detail')} punch={SAMPLE_PUNCHES[4]} stamped={false} />
          </div>
        </div>

        <div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 10 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, letterSpacing:'-0.015em', margin:0 }}>Lots in walk-down</h2>
            <span className="meta">4 lots</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <LotCard lot={SAMPLE_LOTS[0]} onClick={() => go('punchList')} />
            <LotCard lot={SAMPLE_LOTS[2]} onClick={() => go('punchList')} />
            <LotCard lot={SAMPLE_LOTS[3]} onClick={() => go('punchList')} />
          </div>
        </div>

        <Button fullWidth icon="plus" onClick={() => go('new')}>Add punch</Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PUNCH LIST for a Lot
// ─────────────────────────────────────────────────────────────
function PunchListScreen({ go }) {
  const [filter, setFilter] = useState('open');
  const filtered = filter === 'all'
    ? SAMPLE_PUNCHES
    : SAMPLE_PUNCHES.filter(p => filter === 'open' ? p.status !== 'closed' : p.status === 'closed');
  return (
    <div>
      <Header
        eyebrow="Lot 247 · 14 Sycamore Ln"
        title="Punch list"
        back onBack={() => go('lots')}
        right={<button aria-label="Filter" style={{ width:40, height:40, display:'inline-flex', alignItems:'center', justifyContent:'center', border:'1.5px solid var(--bc-line)', background:'var(--bc-paper)', borderRadius:'var(--r-2)', cursor:'pointer', padding:0 }}><Icon name="sliders-horizontal" size={18} /></button>}
      />
      <div style={{ padding: '12px 16px 0' }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'open',  label: 'Open · 4' },
            { value: 'closed',label: 'Closed · 1' },
            { value: 'all',   label: 'All' },
          ]}
        />
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(p => (
          <PunchTicket key={p.id} punch={p} stamped={p === filtered[0]} onClick={() => go('detail')} />
        ))}
        <div style={{ height: 4 }} />
        <Button fullWidth icon="plus" onClick={() => go('new')}>Add punch to lot 247</Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PUNCH DETAIL
// ─────────────────────────────────────────────────────────────
function PunchDetailScreen({ go }) {
  const p = SAMPLE_PUNCHES[0];
  return (
    <div>
      <Header
        eyebrow={p.id + ' · LOT 247'}
        title="Punch"
        back onBack={() => go('punchList')}
        right={<button aria-label="More" style={{ width:40, height:40, display:'inline-flex', alignItems:'center', justifyContent:'center', border:'1.5px solid var(--bc-line)', background:'var(--bc-paper)', borderRadius:'var(--r-2)', cursor:'pointer', padding:0 }}><Icon name="more-horizontal" size={18} /></button>}
      />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom: 10 }}>
            <StatusPill status="blocked" />
            <TradeTag>Tile</TradeTag>
            <span className="meta" style={{ alignSelf:'center' }}>Walked 05/14 · Due 05/19</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:24, letterSpacing:'-0.02em', lineHeight:1.15, margin:0, color:'var(--bc-ink)' }}>
            Hairline crack in master bath tile — north wall, just above tub deck
          </h1>
        </div>

        {/* Photos */}
        <div>
          <div className="label" style={{ marginBottom: 8 }}>Photos · 3</div>
          <div style={{ display:'flex', gap: 10, overflowX:'auto' }}>
            <PhotoTile size="lg" label="Crack · close" />
            <PhotoTile size="lg" label="North wall" />
            <PhotoTile size="lg" label="Tub deck" />
          </div>
        </div>

        {/* Voice memo */}
        <div style={{
          border: '2px solid var(--bc-line-strong)', borderRadius:'var(--r-4)',
          background:'var(--bc-paper)', padding: '12px 14px',
          display:'flex', alignItems:'center', gap: 12,
        }}>
          <button aria-label="Play" style={{
            width: 48, height: 48, borderRadius: 'var(--r-2)',
            border:'2px solid var(--bc-ink)', background:'var(--bc-orange)',
            color: 'var(--bc-paper)', cursor:'pointer', boxShadow:'2px 2px 0 0 var(--bc-ink)',
            display:'inline-flex', alignItems:'center', justifyContent:'center', padding:0,
          }}>
            <Icon name="play" size={18} color="on-dark" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 3, height: 28 }}>
              {[12,18,7,22,16,9,25,18,11,20,14,8,22,16,10,5].map((h,i)=>(
                <div key={i} style={{ width: 3, height: h, background:'var(--bc-ink)' }} />
              ))}
            </div>
            <div className="meta" style={{ marginTop: 4 }}>0:00 / 0:18 · Voice memo</div>
          </div>
        </div>

        {/* Assignment */}
        <div style={{ border:'2px solid var(--bc-line-strong)', borderRadius:'var(--r-4)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderBottom:'1.5px solid var(--bc-line)' }}>
            <div style={{ width:36, height:36, borderRadius:999, background:'var(--bc-orange)', color:'var(--bc-paper)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)', fontWeight:600, fontSize:13 }}>JM</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:15, color:'var(--bc-ink)' }}>J. Morales</div>
              <div className="meta">Pro Tile Co · last on site 05/14</div>
            </div>
            <button aria-label="Call" style={{ width:40, height:40, border:'1.5px solid var(--bc-line)', background:'var(--bc-paper)', borderRadius:'var(--r-2)', cursor:'pointer', padding:0, display:'inline-flex', alignItems:'center', justifyContent:'center' }}><Icon name="phone" size={18} /></button>
            <button aria-label="Message" style={{ width:40, height:40, border:'1.5px solid var(--bc-line)', background:'var(--bc-paper)', borderRadius:'var(--r-2)', cursor:'pointer', padding:0, display:'inline-flex', alignItems:'center', justifyContent:'center' }}><Icon name="message-square" size={18} /></button>
          </div>
          <div style={{ padding:'10px 14px', background:'var(--bc-paper-2)', display:'flex', flexDirection:'column', gap: 6 }}>
            <div className="meta" style={{ color:'var(--bc-ink-2)' }}>Trade message · sent 05/15 09:12</div>
            <div style={{ fontSize: 15, color:'var(--bc-ink)' }}>"Heads up — north wall crack reappeared after settling. Can you swing back this week before final?"</div>
          </div>
        </div>

        <div style={{ display:'flex', gap: 10 }}>
          <Button variant="secondary" fullWidth icon="check">Close out</Button>
          <Button variant="primary" fullWidth icon="send">Re-send</Button>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOTS list
// ─────────────────────────────────────────────────────────────
function LotsScreen({ go }) {
  return (
    <div>
      <Header
        eyebrow="Pulte · Ashford community"
        title="Lots"
        right={<button aria-label="Add" style={{ width:40, height:40, display:'inline-flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--bc-ink)', background:'var(--bc-orange)', color:'var(--bc-paper)', borderRadius:'var(--r-2)', cursor:'pointer', padding:0, boxShadow:'2px 2px 0 0 var(--bc-ink)' }}><Icon name="plus" size={18} color="on-dark" /></button>}
      />
      <div style={{ padding:'12px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 12px', height: 48,
          border: '2px solid var(--bc-line-strong)', borderRadius: 'var(--r-2)',
          background: 'var(--bc-paper)',
        }}>
          <Icon name="search" size={18} color="muted" />
          <input placeholder="Search lots, address, plan…" style={{
            flex: 1, border: 0, outline: 0, background: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--bc-ink)',
          }} />
        </div>
      </div>
      <div style={{ padding: 16, display:'flex', flexDirection:'column', gap: 10 }}>
        {SAMPLE_LOTS.map(l => <LotCard key={l.number} lot={l} onClick={() => go('punchList')} />)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NEW PUNCH composer (camera + voice + form)
// ─────────────────────────────────────────────────────────────
function NewPunchScreen({ go }) {
  const [trade, setTrade] = useState('Tile');
  return (
    <div>
      <Header
        eyebrow="Lot 247"
        title="New punch"
        back onBack={() => go('punchList')}
      />
      <div style={{ padding: 16, display:'flex', flexDirection:'column', gap: 16 }}>

        {/* Camera + voice cluster */}
        <div style={{ display:'flex', gap: 10 }}>
          <button style={{
            flex: 1, height: 120, border: '2px dashed var(--bc-line-strong)',
            background: 'var(--bc-paper-2)', borderRadius: 'var(--r-4)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 8,
            cursor:'pointer', color: 'var(--bc-ink)',
          }}>
            <Icon name="camera" size={28} />
            <span className="label">Photo</span>
          </button>
          <button style={{
            flex: 1, height: 120, border: '2px dashed var(--bc-line-strong)',
            background: 'var(--bc-paper-2)', borderRadius: 'var(--r-4)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 8,
            cursor:'pointer', color: 'var(--bc-ink)',
          }}>
            <Icon name="mic" size={28} />
            <span className="label">Voice</span>
          </button>
        </div>

        {/* Title */}
        <Field label="Describe the punch">
          <textarea placeholder="What's wrong, where, who needs to fix it…" style={{
            fontFamily: 'var(--font-body)', fontSize: 17, color:'var(--bc-ink)',
            border: '2px solid var(--bc-line-strong)', borderRadius:'var(--r-2)',
            background:'var(--bc-paper)', padding: 12, minHeight: 96, resize: 'vertical',
            outline: 'none',
          }} />
        </Field>

        {/* Trade picker */}
        <Field label="Trade">
          <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
            {['Tile','Plumbing','Electrical','Drywall','Paint','HVAC','Doors','Cabinets'].map(t => {
              const on = t === trade;
              return (
                <button key={t} onClick={() => setTrade(t)} style={{
                  fontFamily:'var(--font-mono)', fontWeight:600, fontSize:12,
                  textTransform:'uppercase', letterSpacing:'0.04em',
                  padding:'8px 12px',
                  border:'2px solid ' + (on ? 'var(--bc-ink)' : 'var(--bc-line)'),
                  background: on ? 'var(--bc-ink)' : 'var(--bc-paper)',
                  color: on ? 'var(--bc-paper)' : 'var(--bc-ink)',
                  borderRadius:'var(--r-2)', cursor:'pointer',
                }}>{t}</button>
              );
            })}
          </div>
        </Field>

        <Field label="Due">
          <input value="Mon · 05/19" readOnly style={{
            fontFamily: 'var(--font-body)', fontSize: 17, color:'var(--bc-ink)',
            border: '2px solid var(--bc-line-strong)', borderRadius:'var(--r-2)',
            background:'var(--bc-paper)', padding: '0 14px', height: 56, outline: 'none',
          }} />
        </Field>

        <div style={{ display:'flex', gap: 10, marginTop: 4 }}>
          <Button variant="ghost" fullWidth onClick={() => go('punchList')}>Cancel</Button>
          <Button variant="primary" fullWidth icon="check" onClick={() => go('punchList')}>Save punch</Button>
        </div>

      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}

Object.assign(window, { TodayScreen, PunchListScreen, PunchDetailScreen, LotsScreen, NewPunchScreen });
