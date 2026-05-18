# BuildCore Design System — Option B deploy bundle

This folder is ready to drop into your BuildCore repo for deployment to `buildcore-production.up.railway.app/design-system/`.

## What's in `public/design-system/`

The full design system + landing pages + Condenser app preview.

| Path | What it is |
| --- | --- |
| `index.html` | Landing page listing every deliverable |
| `colors_and_type.css` | All design tokens (color, type, spacing, motion) |
| `assets/` | Logos, brand wedge, app icons |
| `fonts/` | Webfont reference |
| `pages/` | Marketing pages — BuildCore Ops, The Condenser Landing, The Condenser App |
| `condenser-redesign/` | All 11 native screens + responsive app shell source |
| `ui_kits/` | BuildCore Ops + Condenser UI kits |
| `preview/` | Design system token cards |
| `README.md` | Design system reference |
| `BuildCore Ops Landing.html` | Standalone (offline-capable) bundled marketing site |

## Deploy steps (from your local `BuildCore/` folder)

```
# 1. Drop the public/design-system/ folder from this bundle into your repo
cp -r path/to/this/bundle/public/design-system  ./public/design-system

# 2. Commit + push
git add -A
git commit -m "feat: add design system + Condenser app preview at /design-system/"
git push origin main

# 3. Deploy
railway up --detach
```

Once deployed, browse to:
- `https://buildcore-production.up.railway.app/design-system/` — directory index
- `https://buildcore-production.up.railway.app/design-system/pages/The%20Condenser%20App.html` — the responsive Condenser app preview

## Notes

- All files are static. No build step required for the design-system route.
- The existing marketing landing at `/` is untouched.
- The Express server in your BuildCore repo already serves `public/` — this just nests under it.
- Path-sensitive: filenames contain spaces. URL-encode them as `%20`.
- The Clock In button on the BuildCore marketing landing currently points to a relative path `../../pages/The Condenser App.html` (from `ui_kits/buildcore-ops/`). For production, you may want to change `CONDENSER_URL` in `condenser-redesign/condenser-app.jsx`... actually that's the `ui_kits/buildcore-ops/components.jsx` constant. Update to `/design-system/pages/The%20Condenser%20App.html` if you want absolute paths.
