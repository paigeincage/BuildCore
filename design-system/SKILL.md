---
name: buildcore-design
description: Use this skill to generate well-branded interfaces and assets for BuildCore, the residential-construction software suite (The Condenser punch-list app + BuildCore Ops marketing site). Use it for production code, throwaway prototypes, marketing pages, and slide decks. Contains the full design system — colors, type, spacing, motion, iconography, voice/tone, and ready-made React UI kits for both the mobile app and the marketing site.
user-invocable: true
---

# BuildCore Design

This skill packages everything you need to design **for BuildCore** — the residential-construction-management software suite. The voice is plain, the visuals are stripped-down, the touch targets are big. Every decision answers one question: **does this work one-handed, in sunlight, with gloves on?**

## How to use this skill

1. **Start by reading `README.md`** in this folder. It has the brand context, content fundamentals, full visual foundations, and iconography rules. This is the source of truth — if you're stuck on a decision, re-read it.
2. **Import `colors_and_type.css` in every HTML artifact.** All tokens (color, type, spacing, radius, shadow, motion, touch targets) live there as CSS custom properties. Never hard-code a hex.
3. **For the mobile app surface**, the `ui_kits/condenser/` folder has reusable React components (`components.jsx`) and full screens (`screens.jsx`). Use them as primitives — Header, BottomTabs, PunchTicket, LotCard, Button, StatusPill — and assemble new screens.
4. **For the marketing site surface**, `ui_kits/buildcore-ops/components.jsx` has Hero, FeatureTrio, Pricing, CtaBand, Footer, etc. The visual rhythm there (96px section padding, 44–48px H2, 4px stamp shadow on cards) is intentional — match it.
5. **Glance through `preview/`** for at-a-glance specs of every token cluster: color palettes, type scale, button states, status pills, the signature punch-ticket card.
6. **Logos and app icons** live in `assets/`. The current wordmark is a typographic placeholder (Archivo Black + an orange wedge mark) — flag this to whoever is using the artifact.

## What to make

If invoked without specifics, ask the user what they want — a marketing page, an app screen, a slide deck, a pitch, a microsite, an internal admin tool — and then ask the questions that matter:

- **Surface?** Mobile app, desktop dashboard, marketing page, slide deck, email?
- **Audience?** A construction manager in the field? A VP-level decision-maker at a national builder? A trade partner being onboarded?
- **Variations?** Should you produce 2–3 options on layout, hierarchy, or copy direction?
- **Real or fake data?** Pull from `SAMPLE_PUNCHES` / `SAMPLE_LOTS` in `ui_kits/condenser/screens.jsx` for plausible content if none provided.

Then act as an expert designer — output HTML artifacts for prototypes/mocks/slides, or production code for shipping work. Use the existing components; don't re-invent the visual vocabulary.

## House rules (don't violate)

- **Borders over shadows.** A 2px `var(--bc-line-strong)` border defines a card; soft shadows are reserved for sheets lifting off the surface. The signature is the flat `3px 3px 0 0 var(--bc-ink)` stamp shadow used on the primary CTA and the marquee punch-ticket card.
- **Orange (`#C45A2C`) is sacred.** It appears on the primary CTA, the active tab indicator, and the brand wedge — nowhere else.
- **No emoji.** Use Lucide icons. They inherit `currentColor`.
- **Verbs on buttons.** "Send to trade", "Close out lot", "Add punch" — never "Submit", "OK", or "Save Changes".
- **Mono case for data.** All IDs, lot numbers, trade tags, timestamps → Geist Mono, uppercase, 11–12px.
- **No bounces, no spring, no parallax.** Animation is `cubic-bezier(0.2, 0.7, 0.2, 1)` ease-out at 100–240ms. Fade + ≤8px translate is the heaviest move.
- **Mobile-first density.** 48px minimum tap target. 56px for primary actions. 64px for bottom-bar items. Don't compress for desktop; scale up.

## Substitutions to flag

When you use this skill, surface these caveats to the user up front:

- The wordmark in `assets/logo.svg` is a typographic placeholder — drop in the real logo SVG if available.
- Fonts (Archivo + Geist + Geist Mono) are reasonable stand-ins for the "industrial, stripped-down" tone. If BuildCore uses a different family, the import in `colors_and_type.css` should be swapped.
- Iconography is Lucide (CDN). If the shipped product uses a different set, request it.
