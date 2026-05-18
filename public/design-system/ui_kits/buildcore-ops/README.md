# BuildCore Ops — UI Kit

The marketing site for the BuildCore suite (umbrella brand for The Condenser + future products).

Open `index.html` for a full-length scroll-through.

## Sections, in order

| # | Section | Purpose |
| --- | --- | --- |
| 1 | `SiteHeader` | Sticky translucent nav. Logo wedge + wordmark, 5 links, login + primary CTA. |
| 2 | `Hero` | 72px display headline, copy, two CTAs, trust stats. Right side: jobsite-photo placeholder + floating punch ticket. |
| 3 | `LogoStrip` | "Built for builders like" — wordmark style logos (Pulte, Lennar, KB Home, etc). |
| 4 | `FeatureTrio` | The three tools in the suite (Condenser, Daily reports, Safety + comms). Stamped cards. |
| 5 | `StatBand` | Black band with 4 hero stats. Orange left-border accent on each. |
| 6 | `ConDeepDive` | Two-column section walking through The Condenser, w/ a CSS-only phone mockup of the punch list. |
| 7 | `FounderNote` | Why this exists — quote from the CM/founder. |
| 8 | `Pricing` | 3 tiers — Solo, Crew (highlighted), Builder. |
| 9 | `CtaBand` | Full-bleed orange band, single CTA. |
| 10 | `Footer` | Dark footer with brand + 3 link columns. |

## Files

| File | Contents |
| --- | --- |
| `index.html` | Entry — assembles all sections into a single scroll. |
| `components.jsx` | All marketing components (sections, hero, ticket primitive, phone mockup, footer). Exported to `window`. |

## What's intentionally faked

- Hero "jobsite photo" is a tinted placeholder gradient. Drop a real jobsite photo (grayscale or warm-tone) into `../../assets/hero-jobsite.jpg` and update `HeroVisual` to use it.
- Builder logos in `LogoStrip` are typographic placeholders (uppercase Archivo). Substitute SVGs when available.
- Phone mockup in `ConDeepDive` is CSS-only — not a real device frame. If you need higher fidelity, swap in `<IOSDevice>` from the Condenser kit.
- Founder photo is a placeholder circle. Drop a real headshot into `../../assets/founder.jpg`.

## Visual rules — quick reference

1. **96px section padding (vertical)**, max-width 1240px, 32px gutters.
2. **Display sizes are big** — hero is 72px, section H2 is 44–48px, stat numbers are 56px. All Archivo 900 at `-0.03em`.
3. **Each card has a flat stamp shadow** of 4px (vs 3px in the mobile app). Bigger surfaces → slightly heavier stamp.
4. **One orange CTA per fold.** Plus one full-orange band near the end. Otherwise: bone + ink + line.
5. **Eyebrows are `--bc-orange`**, mono, uppercase, 12px, with a 18px solid bar before them. Used on every section.
