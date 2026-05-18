# Fonts

This system loads all three families from Google Fonts at runtime — there are no `.woff2` files bundled here yet.

```
Archivo      — Display.  Weights 500/600/700/800/900.
Geist        — Body / UI. Weights 400/500/600/700.
Geist Mono   — Data / IDs / timestamps. Weights 400/500/600.
```

The `@import` lives at the top of `../colors_and_type.css`.

⚠️ **If BuildCore actually uses a different family** (Söhne, GT America, Inter Display, Neue Haas Grotesk, etc.), please drop the `.woff2` files into this folder and replace the `@import` block with a local `@font-face` set. Archivo + Geist are stand-ins that match the brief's "industrial, stripped down, function over decoration" tone.
