# BuildCore

Marketing site for BuildCore — software for residential construction managers.
Built on the BuildCore Design System (Archivo + Geist + orange `#C45A2C`).

## Local

```
npm install
npm start
```

Server runs on `http://localhost:3000`.

## Stack

- Static `public/` served by a tiny Express process (Railway-friendly).
- React 18 + Babel standalone via CDN — no build step.
- `public/colors_and_type.css` is the design-system token sheet.
- `public/components.jsx` is the BuildCore Ops UI kit.
