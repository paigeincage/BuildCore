# The Condenser — UI Kit

Mobile punch-list app for residential CMs. Flagship product in the BuildCore suite.

Open `index.html` for an interactive click-through. Five screens are wired up:

| Screen | File / function | What it shows |
| --- | --- | --- |
| **Today** | `screens.jsx → TodayScreen` | Dashboard. Open-punch count, late items, lots in walk-down. Primary "Add punch" CTA. |
| **Lots** | `screens.jsx → LotsScreen` | Browse / search lots in a community. Progress bar per lot. |
| **Punch list** | `screens.jsx → PunchListScreen` | A lot's open + closed punches. Segmented filter, sorted by status. |
| **Punch detail** | `screens.jsx → PunchDetailScreen` | A single punch — photos, voice memo, trade assignment, send-to-trade. |
| **New punch** | `screens.jsx → NewPunchScreen` | Composer. Photo + voice capture, trade tag, due date. |

## Files

| File | Contents |
| --- | --- |
| `index.html` | Entry point. Mounts the React app inside an iOS device frame. |
| `ios-frame.jsx` | Generic iOS device shell from the project's starter components. Status bar + home indicator + bezel. |
| `components.jsx` | Atoms + molecules: `Icon`, `Header`, `BottomTabs`, `StatusPill`, `TradeTag`, `IdStamp`, `Button`, `PunchTicket`, `LotCard`, `Segmented`, `PhotoTile`, `StatTile`, `Field`. |
| `screens.jsx` | Full screens. Each is a function taking `{ go }` for navigation. |

## What's intentionally faked

- No real data layer. `SAMPLE_PUNCHES` / `SAMPLE_LOTS` are hard-coded at the top of `screens.jsx`.
- The camera/voice tiles are inert — they're meant to demonstrate the form, not function.
- The bottom tab bar's Trades / Me tabs route back to Today.
- Photos in the detail view are empty placeholders. Drop real images into `assets/` and reference them in `<PhotoTile src=…>`.

## Visual rules — quick reference

1. **Heavy borders over soft shadows.** 2px `--bc-ink` border + `3px 3px 0 0 var(--bc-ink)` flat shadow on the primary CTA and the active "stamp" punch ticket.
2. **Orange only where it matters.** Primary button + active tab indicator + brand wedge. Not on cards. Not on backgrounds. Not on icons (except the icon inside the primary button).
3. **Mono case for data.** All IDs, lot numbers, trade tags, durations, dates — Geist Mono, uppercase, 11–12px.
4. **72px is the minimum tappable row** for a punch or lot in this app. Don't compress.
5. **Header is sticky and translucent.** `rgba(250,250,247,0.92)` + 12px backdrop-blur. This is the ONE place we use blur.
