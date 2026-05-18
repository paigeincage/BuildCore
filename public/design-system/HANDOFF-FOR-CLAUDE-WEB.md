# BuildCore — Handoff for a fresh Claude session

Paste this into a new Claude chat. It catches Claude up on the project, the brand, what's built, what's running, and where I'd like to pick up.

---

## Who I am and what I'm building

I'm Paige Beltran, a residential construction manager. I'm building **BuildCore** — a suite of jobsite software designed for working CMs. Two products under one brand:

- **The Condenser** — punch-list engine. Upload an inspection PDF or build a list from scratch. Voice + photo capture, trade auto-classification, send-to-trade via SMS/email, folders + archive, multi-report per address.
- **BuildCore Ops** — marketing site for the suite.

The voice is plain, the visuals are stripped down, the touch targets are big. Function over decoration. The rule: *"works one-handed, in sunlight, with gloves on."*

The full design system + design token sheet lives at: **https://buildcore-production.up.railway.app/design-system/** — review it before touching anything visual.

---

## Locked product rules (do not violate)

- No real builder names anywhere (no Pulte, Lennar, KB Home, etc.)
- No fabricated stats ("3,200+ punches closed" — that's fake, never use)
- No fake founder/customer copy
- No "Lot 247" / lot-number language — use **addresses only**
- No emoji
- Primary CTA is **"Clock In"** (orange, with stamp shadow)
- Secondary CTA is **"Talk to us"** (mailto: hello@buildcore.io)
- No Vercel — GitHub + Railway only
- All design tokens come from `colors_and_type.css` — never hardcode hex

---

## Stack

- React 18 + Babel standalone (CDN, no build step)
- Static HTML/CSS/JS served from Railway's `public/` folder via a 12-line Express server
- `localStorage` for most state; `IndexedDB` (`condenser_v1`) for PDFs and voice notes
- GitHub repo: `https://github.com/paigeincage/BuildCore.git`
- Push chain: local `C:\Users\Admin\BuildCore` → GitHub → Railway (`railway up --detach`)

---

## Shipped so far

### Marketing site
- Mobile-responsive landing at `https://buildcore-production.up.railway.app/`
- "Clock In" routes to the Condenser app (Desktop Shell view)
- Bundled standalone: `BuildCore Ops Landing.html`

### Condenser app — Home
- Folder grid (3 seeded folders: Active builds · Punch in progress · Awaiting closeout)
- Drag-to-reorder, rename, delete
- "+ New punch list" hero CTA
- Archive view for closed-out reports

### Condenser app — New Punch List intake
- Address + folder + source label + optional PDF upload (saved to IndexedDB)
- Multi-report-per-address support via `?report=<id>` URL param

### Condenser app — Workspace
- Top bar: back, address, "Auto-saved", "Mark complete →"
- Bottom bar: Home · Trades · Archive · + Add note
- **13 trade-classification rules** (CAULK, SEAL, NAIL POP, CABINET, PORCH POST, LEANDER 3T 2, drywall repair → painters, interior door → painters, broken LVP → flooring → trim → painters, etc.)
- **Multi-trade step sequences** per item — add/remove/reorder, set status (pending/sent/done), forecast date, notes
- **Learning system** — corrections save as rules keyed by title prefix and auto-reapply on future loads
- Source tags per item (editable: "Inspection report", "My side notes", or custom)
- **Photos** per item (camera + library, lightbox, delete) — currently localStorage, needs IndexedDB migration
- **Voice notes** per item — record / save / play / delete (IndexedDB)
- Per-item schedule date (native date picker via kebab menu ⋯)
- "+ Add note" modal for user-created punch items
- **PDF → items extraction in-page** (TREC format, regex-based, ~5s for 40 pages)
- Auto-save on every mutation, per-report cache key

### Send to Trade modal
- Trade-aware (only shows trades that have selected items)
- Auto-matches contact from user's directory + sample fallbacks
- Editable recipient form (name / company / phone / email)
- Email provider selector: **Outlook (default)** / Gmail / Yahoo / Default mail app
- SMS button via `sms:` for iMessage
- Live message preview with READY NOW + COMING SOON groups for multi-trade items
- Copy + Share (native share API)

### Trades Directory
- Add/edit/delete contacts (name, company, role, phone, email, channel)
- Manage trades — add custom (e.g. "Leander 3T 2"), rename, remove, reset to defaults
- **Import contacts from photo/CSV/text** via Claude vision (editable table → bulk save)

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
| IDB `voices` | IndexedDB | Voice note audio blobs |
| IDB `pdfs` | IndexedDB | Uploaded source PDFs |
| IDB `photos` | IndexedDB | Stubbed, not yet used |

---

## What's still to roll out (priority order)

1. **Claude fallback for non-TREC PDFs** — current extractor only handles TREC format. Add a Claude vision/text call for arbitrary inspection layouts.
2. **Photos → IndexedDB migration** — photos still in localStorage (~5MB cap, won't scale).
3. **Source-tagged outgoing messages** — group items by source in SMS/email body ("From 3rd-party report (5) · From your side notes (2)").
4. **Voice transcription** — push voice blobs through Claude, show text alongside audio.
5. **Mobile polish below 400px** — top/bottom bars and kebab menus collide.
6. **Send → auto-archive hookup** — optional flow to flip report status to archived after sending.
7. **Global search** — top-bar search across items, contacts, reports.

---

## File map

```
BuildCore Ops Landing.html          ← bundled marketing standalone
colors_and_type.css                  ← design tokens (always import this)

ui_kits/buildcore-ops/
  index.html                         ← marketing source
  components.jsx                     ← React, includes CONDENSER_URL constant
  phone.jsx                          ← hero phone mockup

condenser-redesign/
  The Condenser - Desktop Shell.html ← Clock In landing target
  Condenser - Home + Sites.html      ← earlier mobile-only view
  desktop-shell.jsx                  ← sidebar + topbar
  home-locked.jsx                    ← mobile Today screen

pages/
  The Condenser Home.html            ← folders + archive
  New Punch List.html                ← intake
  Inspection Test - 516 Madelines Meadow.html  ← workspace (per-report)
  Trades Directory.html              ← contacts + custom trades
  The Condenser Landing Page.html    ← Condenser product marketing

_deploy_b/                           ← drop-in deploy bundle for Railway
  public/design-system/               ← drop into your repo's public/
```

---

## Known caveats

- **TREC-only PDF extraction** — other inspection formats won't auto-extract until #1 above is built.
- **Photos in localStorage** — works for the demo, won't scale past ~5-10 photos per report. #2 above fixes.
- The workspace filename is still `Inspection Test - 516 Madelines Meadow.html` — internally parameterized by `?report=<id>` so it works for any report, but the name is misleading. Could rename to `Punch Workspace.html`.

---

## What I'd like Claude to help me with next

[fill this in based on what you actually want to work on — e.g. "Pick up priority #1 — Claude fallback for non-TREC PDFs" or "I want to redesign the home screen" or "I need a marketing one-pager" or whatever]

When responding:
- Read `colors_and_type.css` and use the design tokens
- Match the established voice (plain, direct, no SaaS-speak)
- Don't violate the locked product rules above
- Keep the field-first, one-handed-with-gloves philosophy in everything visual
