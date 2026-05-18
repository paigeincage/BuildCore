# BuildCore Design System

> Tools for residential construction managers. Built from inside a working CM's truck, for people standing in a half-finished house, not sitting at a desk.

BuildCore is a small suite of construction-management tools made by a working construction manager at Pulte Homes. Its products replace the spreadsheets, sticky notes, and group texts that run most jobsites today.

## Products in this system

| Product             | What it is                                                          | Surface           |
| ------------------- | ------------------------------------------------------------------- | ----------------- |
| **The Condenser**   | Mobile-first punch-list management — photos, voice capture, trade classification, lot tracking. The flagship product. | Mobile web / PWA  |
| **BuildCore Ops**   | Daily field operations — broader platform / marketing umbrella for the suite. | Marketing website |

Both products share one identity, one type system, one palette. The mobile app gets larger touch targets and a denser data style; the marketing site gets bigger display type and more breathing room — but every visual decision serves the same rule:

> **Function over decoration, always.** It has to work one-handed, in sunlight, with gloves on.

---

## Sources used to build this system

The following materials were referenced. The reader of this file may or may not have access — paths and URLs are logged here so they can re-fetch / re-attach if needed.

- **BuildCore Ops landing page** — https://the-condenser-landing-production.up.railway.app/
- **The Condenser (live app)** — https://condenser-app-production.up.railway.app/
- **Written product brief** provided in chat (see prompt history).

> ⚠️ **Caveat — fidelity.** Both live URLs block iframe embedding (X-Frame-Options), so this system was built from: (a) the written brief, (b) extracted page metadata (theme color `#C45A2C` is real, pulled from The Condenser's `<meta name="theme-color">`), and (c) construction-PM design conventions. **Please share screenshots, a Figma file, or codebase access if pixel-fidelity to the shipped UI matters.**

---

## Index — what's in this folder

| Path | Purpose |
| ---- | ------- |
| `README.md` | This file. Brand context, content + visual foundations, iconography rules. |
| `SKILL.md` | Agent-Skill manifest. Drop this folder into Claude Code as a skill. |
| `colors_and_type.css` | All color, type, spacing, radius, shadow, and motion tokens as CSS vars. Import this in every artifact. |
| `assets/` | Logos, app icons, hero imagery placeholders. |
| `fonts/` | Webfont notes. Fonts load from Google Fonts CDN — see [Type](#type) below. |
| `preview/` | Small HTML cards that render in the Design System tab. One concept per card. |
| `ui_kits/condenser/` | High-fidelity UI kit for The Condenser mobile app — components + clickable index. |
| `ui_kits/buildcore-ops/` | UI kit for the BuildCore Ops marketing site. |

---

## Type

Three families. Loaded from Google Fonts.

- **Display — Archivo** (700–900). Industrial geometric grotesque. Headlines, hero numbers, slab-style stat labels. Tight tracking (`-0.02em` to `-0.03em`).
- **Body — Geist** (400–700). Neutral modern sans for everything readable. We use **17px** as the default body size in app surfaces because phones get held at arm's length on a jobsite.
- **Mono — Geist Mono** (400–600). Lot numbers, ticket IDs (`PL-1023`), unit codes, timestamps, anything tabular. Uppercase by default.

Substitution flag: ⚠️ We don't have access to the original BuildCore type spec — these are reasonable defaults that match the brief's "stripped down, fast, industrial" tone. If the live products use something different (e.g. Söhne, Inter Display, GT America), please drop in `.woff2` files and we'll swap.

See `colors_and_type.css` for the full scale.

---

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--bc-orange` | `#C45A2C` | **Brand & primary action.** Pulled from The Condenser's live `theme-color`. Used for primary buttons, the active tab indicator, the brand wordmark, the Condenser app icon. |
| `--bc-hi-vis` | `#F0B500` | Caution / warning state. Echoes the safety-vest / hi-vis vocabulary of a jobsite. |
| `--bc-green` | `#2E7D3A` | Complete / passed / signed-off. |
| `--bc-red` | `#B82A1F` | Defect / blocker / failed inspection. |
| `--bc-blue` | `#1F5A8A` | Info / inspection / informational links. |
| `--bc-paper` | `#FAFAF7` | Page background — slightly warm bone, NOT pure white. Easier on eyes in bright sun. |
| `--bc-ink` | `#14110D` | Primary text — rich near-black, NOT pure black. |
| `--bc-line-strong` | `#2A2722` | The heavy 2px border that defines our cards, inputs, and ticket-stub motif. |

WCAG contrast: `--bc-ink` on `--bc-paper` is 17:1. Every primary state passes AAA on its respective background.

---

## Content fundamentals

How copy is written across BuildCore.

**Voice.** Plain, direct, and short. We sound like a competent foreman — not a tech company, not a contractor's brochure. We never say "leverage," "empower," "seamless," or "revolutionize." We do say "fix," "punch," "close out," "trade," "lot," "walk."

**Person.** Second-person ("you") for actions and microcopy. First-person plural ("we") only for the founder voice on the marketing site, sparingly. Never "the user."

**Casing.** Sentence case everywhere except section labels and IDs, which go UPPERCASE in the mono font. Buttons read like spoken verbs: "Add punch", "Send to trade", "Close out lot" — not "Submit," not "Save Changes."

**Length.** Marketing headlines: 4–8 words. App empty states: one sentence + one CTA. Error messages: what broke, then what to do. Field-facing UI prefers a 2–3 word noun ("Punch list", "Open items", "Trade contacts") over a verbose label.

**Emoji.** No. We use icons (Lucide) and color, never emoji. The vocabulary is hard hats and pickup trucks, not party poppers.

**Examples** (style, not exact copy from the live product):

- App empty state: **"No open punches. Nice work."**
- Push notification: **"3 new punches — Lot 247, plumbing."**
- Marketing hero: **"Built in the field. Not in a meeting."**
- Marketing subhead: **"Punch lists, daily reports, and trade comms — one app, offline-first, made by a CM who's tired of spreadsheets."**
- Error: **"Photo didn't upload. Tap to retry."**
- Button: **"Send to trade"** (not "Send notification to trade contact")

---

## Visual foundations

**Backgrounds.** Warm bone `--bc-paper` (#FAFAF7) is the canvas everywhere. No gradients. No images behind text. On marketing surfaces a single grayscale jobsite photo may appear at 100% — never blurred, never tinted.

**Cards.** Heavy. Each card is a **ticket stub**: 2px solid `--bc-ink` border, 4–8px corner radius (slightly squared), and optionally a flat 3-3-0 stamp shadow (`--shadow-stamp`) for elevated punch tickets. We do not use soft drop shadows for definition — borders do that job. Soft shadows are reserved for bottom sheets and modals lifting off the surface (`--shadow-3`).

**Borders.** Default UI borders use `--bc-line` (#D6D2C7) at 1.5px. Anything that should *register as a thing you can act on* — inputs, buttons, cards, list rows on hover — gets the strong border `--bc-line-strong` at 2px. The system reads like blueprint linework.

**Radii.** Small. `2px` chips, `4px` buttons/inputs/cards (default), `8px` larger panels, `12px` sheets/modals. Pills (`999px`) are used **only for status dots** — never for buttons. Pillow-buttons are a tell that you're not BuildCore.

**Shadows.** Restrained. `--shadow-1` for default lift on light surfaces, `--shadow-2` for menus/dropdowns, `--shadow-3` for floating sheets. The signature is `--shadow-stamp` — a flat 3px hard-edged offset shadow, used on the primary punch-ticket card and the orange CTA button to give them physical weight. No blur, no gradient.

**Hover states.** Surfaces darken by one step (`--bg-1` → `--bg-2`). The orange button does NOT lighten — it darkens to `--bc-orange-press` (#A84A22). Links underline on hover; they were not underlined at rest. No glow, no scale, no transform.

**Press states.** Buttons translate down 1px and lose their stamp shadow — gives the satisfying "click it home" feel without animation cruft. Tap targets ripple to `--bc-orange-tint` for 100ms then return (mobile only).

**Animation.** Quick (100–240ms) and decisive. `cubic-bezier(0.2, 0.7, 0.2, 1)` ease-out for almost everything. **No bounces, no spring, no parallax, no scroll-jacking.** Fade + 4–8px translate is the heaviest move we'll make. Page transitions are instant.

**Transparency / blur.** Used in exactly one place: the **mobile sticky header**, which goes `rgba(250,250,247,0.92)` + `backdrop-filter: blur(12px)` so the list scrolls cleanly underneath. Nowhere else. No frosted glass cards, no translucent overlays for decoration.

**Imagery.** When marketing photos appear, they are **real jobsite photos** (a half-framed home, a stack of trusses, a punch list on a clipboard) — warm white-balance, never desaturated to nothing, never blue-cool. Avoid stock corporate handshakes. The mobile app shows user-captured photos as-is — no filters, no auto-crop. A captured photo with a finger in the frame is more honest than a polished render.

**Layout.** Mobile-first single column. Marketing uses a 12-col grid with generous side gutters (32–64px). Sticky bottom nav on mobile (5 icons, 64px tall). Sticky header on every app surface. No floating action buttons that obscure list content — primary actions live in the bottom bar or as a full-width button at the end of a list.

**Density.** Field-app density is **medium-low**: list rows are 64–72px tall (one row, one tap target). Marketing density is generous. We never pack three actions into a row at 32px height — there's no realistic way to hit them with work gloves.

**Use of color.** Restrained. The page is 90% paper + ink. Color appears only on: a status pill, the active tab indicator, the primary button, a hi-vis warning bar. A screen with too much color is wrong — it loses the at-a-glance scan that field users rely on.

**Touch targets.** 48px minimum, 56px for primary actions in the app, 64px for the bottom bar. Hero CTAs in marketing: 56px tall with comfortable horizontal padding.

---

## Iconography

**System: Lucide** (https://lucide.dev), stroke-based, 1.75px stroke, 24px default.

⚠️ **Substitution flag.** We could not access BuildCore's actual icon set. Lucide is a solid stand-in — its stroke weight and proportions match the "industrial, no-decoration" feel of the brief. **If the shipped products use a different set (Phosphor, Heroicons, Material Icons, custom SVG), please share and we'll swap.** Icons load from CDN: `https://unpkg.com/lucide-static@latest/icons/<name>.svg`. A bundled subset is mirrored in `assets/icons/` for offline use.

**Sizing.** 18px in list rows, 20px in buttons, 24px in section headers, 28px in the bottom tab bar. Stroke weight stays at 1.75px — we don't switch to filled.

**Color.** Icons inherit `currentColor`. Active state icons are `--bc-ink`; inactive are `--bc-ink-3`; on-orange (inside the primary button) are `--bc-on-dark`.

**Emoji.** Not used. Anywhere.

**Unicode glyphs.** Avoided. We don't use arrows like `→` or `↗` in UI; we use the Lucide `arrow-right` icon for consistency. In running marketing copy, an em dash (`—`) is fair game; nothing fancier.

**Logo.** ⚠️ **The BuildCore wordmark in `assets/` is a typographic placeholder** built from Archivo Black. If a real logo lockup exists, drop the SVG into `assets/logo.svg` and the rest will pick it up.

---

## Conventions for using this system

1. **Import the token sheet first.** Every HTML artifact starts with `<link rel="stylesheet" href="colors_and_type.css">` (adjust path). Use the CSS vars; do not hard-code hex.
2. **Reach for the semantic tokens** (`--fg-1`, `--bg-1`, `--accent`) over the named ones when possible — easier to theme later.
3. **Borders, not shadows.** When defining a thing, give it a heavy border first. Shadow only if it's literally floating off the surface.
4. **Verbs on buttons.** Two-word verb phrases. No "Submit." No "OK." Say what's about to happen.
5. **Mobile-first thinking** even on desktop. Marketing scales up from a 375px mobile baseline; the design should still work if you delete every breakpoint above 600px.
