# BuildCore — Handoff (2026-05-18)

## What this project is

**BuildCore** is a software suite for residential construction managers, built from inside Pulte Homes by Paige Beltran. Two products under one brand:

- **The Condenser** — mobile + web punch-list engine. Voice + photo + voice-note capture, trade auto-classification, send to trade via SMS/email, folders/archive, multi-report per address.
- **BuildCore Ops** — marketing site for the suite.

Voice = plain, stripped-down, mobile-first. Rule: *"Works one-handed, in sunlight, with gloves on."*

---

## Deploy targets

- **GitHub:** https://github.com/paigeincage/BuildCore.git
- **Railway:** https://buildcore-production.up.railway.app
- **Push chain:** local `C:\Users\Admin\BuildCore` → GitHub → Railway (`railway up --detach`)
- **No Vercel.** Static files served by a 12-line Express server from `public/`.

---

## What was built this session

### Marketing site (`ui_kits/buildcore-ops/`)
- Mobile-responsive landing page
- All CTAs wired — every "Clock In" routes to the Condenser app
- No fake builder names, no fake stats, no fake founder
- `Clock In` constant: `condenser-redesign/The Condenser - Desktop Shell.html`
- Bundled standalone: `BuildCore Ops Landing.html` (root) + `_deploy_b/public/design-system/BuildCore Ops Landing.html`

### Condenser app — Home & Folders (`pages/The Condenser Home.html`)
- Folder grid with 3 seeded folders (Active builds · Punch in progress · Awaiting closeout)
- Drag-to-reorder, rename, delete folders
- "+ New punch list" hero CTA
- Archive view (closed-out reports)

### Condenser app — New Punch List intake (`pages/New Punch List.html`)
- Address + folder + source label + optional PDF upload
- PDF saved to **IndexedDB** so localStorage doesn't fill up
- Creates a per-report ID and routes to workspace with `?report=<id>`

### Condenser app — Workspace (`pages/Inspection Test - 516 Madelines Meadow.html`)
- Top bar: back to home, address, "Auto-saved" indicator, "Mark complete →"
- Bottom bar: Home · Trades · Archive · + Add note
- 31 items pre-extracted from a real TREC PDF for the demo
- 13 deterministic trade-classification rules (CAULK, SEAL, NAIL POP, CABINET, PORCH POST, LEANDER 3T 2, drywall repair → painters, interior door → painters, broken LVP → flooring → trim → painters, etc.)
- Multi-trade step sequences per item — add/remove/reorder steps, set status (pending/sent/done), forecast date, notes
- Trade dropdown per item with **learning system** — corrections save as rules keyed by title prefix and auto-reapply on future loads
- Source tags per item (editable) — "Inspection report" / "My side notes" / custom
- Photos per item (camera + library), lightbox view, delete
- Voice notes per item — record / save / play / delete via **IndexedDB**
- Schedule date per item (native date picker via kebab menu)
- "+ Add note" modal for user-created punch items
- **PDF → items extraction in-page** — TREC format, regex-based, ~5s for 40 pages
- Auto-save to localStorage on every mutation, per-report cache key

### Send to Trade modal
- Trade-aware (only shows trades that have selected items)
- Auto-matches contact by trade from user's directory + sample fallbacks
- Editable recipient form (name / company / phone / email)
- Email provider selector — **Outlook (default)** / Gmail / Yahoo / Default mail app
- SMS button via `sms:` for iMessage
- Live message preview with READY NOW + COMING SOON groups for multi-trade
- Copy + Share (native share API)

### Trades Directory (`pages/Trades Directory.html`)
- Add/edit/delete contacts (name, company, role, phone, email, preferred channel)
- Manage trades — add custom (e.g. "Leander 3T 2"), rename, remove, reset to defaults
- **Import contacts from photo/CSV/text** via Claude vision — editable table → bulk save
- Polished card design (section underlines, hover states, no empty box)

---

## Storage map

| Key | Where | Contains |
|-----|-------|----------|
| `condenser_folders_v1` | localStorage | Folder list + order |
| `condenser_reports_v1` | localStorage | Report metadata (address, folder, status, pdfId) |
| `condenser_items_<reportId>_v1` | localStorage | Per-report items, photos (data URI), source tags, steps |
| `condenser_contacts_v1` | localStorage | Contacts |
| `condenser_trades_master_v1` | localStorage | Custom trade list |
| `condenser_trade_overrides_v1` | localStorage | Learned trade corrections |
| `condenser_email_provider` | localStorage | Outlook/Gmail/Yahoo preference |
| IndexedDB `condenser_v1` / `photos` | IndexedDB | (stubbed — not yet used) |
| IndexedDB `condenser_v1` / `voices` | IndexedDB | Voice note audio blobs |
| IndexedDB `condenser_v1` / `pdfs` | IndexedDB | Uploaded PDF source files |

---

## What's still to roll out (priority order)

1. **Claude fallback for non-TREC PDFs** — current extractor only handles TREC format. Add a vision/text Claude call for arbitrary inspection layouts.
2. **Photos → IndexedDB migration** — photos still in localStorage (~5MB cap). Migrate to the existing `photos` IDB store.
3. **Source-tagged outgoing messages** — group items by source in SMS/email body.
4. **Voice transcription** — push voice blobs through Claude, show text alongside audio.
5. **Mobile polish below 400px** — top/bottom bars and kebab menus collide.
6. **Send → auto-archive hookup** — optional flow to flip report to archived after sending.
7. **Global search** — top-bar search across items, contacts, reports.

---

## Known caveats

- **TREC-only PDF extraction** — other inspection formats won't auto-extract until #1 above is built.
- **Photos stored as data URIs in localStorage** — works for the demo, won't scale past ~5-10 photos per report. #2 above fixes this.
- **The "previous token required" error** in the Claude preview environment is normal — happens because the preview serves files behind a session token. Will not occur once deployed to Railway (static file serving).
- **The workspace filename** is still `Inspection Test - 516 Madelines Meadow.html`. Internally it's parameterized by `?report=<id>`. Could be renamed to `Punch Workspace.html` for clarity but not required.

---

## How to deploy

```bash
# From local C:\Users\Admin\BuildCore
# (Or unzip _deploy_b/ from this project into your BuildCore/public/)

cp -r path/to/_deploy_b/public/design-system  ./public/design-system

git add -A
git commit -m "feat: condenser workspace + send to trade + folders"
git push origin main

railway up --detach
```

Live URLs after deploy:
- `https://buildcore-production.up.railway.app/` — marketing landing
- `https://buildcore-production.up.railway.app/design-system/` — design system index
- `https://buildcore-production.up.railway.app/design-system/pages/The%20Condenser%20Home.html` — Condenser app home

---

## File map (key paths)

```
BuildCore Ops Landing.html               ← bundled marketing standalone
colors_and_type.css                       ← design tokens

ui_kits/buildcore-ops/
  index.html                              ← marketing source
  components.jsx                          ← React components, CONDENSER_URL constant
  phone.jsx                               ← hero phone mockup

condenser-redesign/
  The Condenser - Desktop Shell.html      ← Direction C — Clock In target
  Condenser - Home + Sites.html           ← earlier mobile-only view
  desktop-shell.jsx                       ← sidebar + topbar
  home-locked.jsx                         ← mobile Today screen

pages/
  The Condenser Home.html                 ← folders + archive
  New Punch List.html                     ← intake
  Inspection Test - 516 Madelines Meadow.html  ← workspace (per-report)
  Trades Directory.html                   ← contacts + custom trades
  The Condenser Landing Page.html         ← Condenser product marketing

_deploy_b/                                ← drop-in deploy bundle
  README.md                                ← deploy steps
  public/design-system/                    ← drop into your repo's public/
```

---

## Open questions for next session

- Photo migration to IndexedDB — straightforward but touches every photo read/write site
- Claude PDF fallback — needs UX decision on the loading state (5s for TREC regex, could be 30s+ for Claude vision on a 40-page PDF)
- Multi-tenant — currently single-user via localStorage; if BuildCore grows past Paige's personal use, need a real backend
