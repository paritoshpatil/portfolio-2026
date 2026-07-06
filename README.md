# Portfolio 2026

A personal portfolio built from a Claude Design handoff, implemented as a
**Next.js (App Router) + Tailwind CSS v4** project.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Routes

| Route          | File                        | Notes                                              |
| -------------- | --------------------------- | -------------------------------------------------- |
| `/`            | `app/page.tsx`              | Hero, Software, About, Contact, Résumé (scrolls)   |
| `/photography` | `app/photography/page.tsx`  | Masonry grid of 35mm frames                        |
| `/reading`     | `app/reading/page.tsx`      | Currently / recently-finished shelves              |

The bottom-nav section links (`software`, `about`, …) point at `/#anchor`, so
they smooth-scroll on the index and route-then-scroll from a subpage.

## Reusable components (`components/`)

- **`Cursor`** — the morphing cursor. Mounted once in the root layout so it
  persists across routes. Reads `[data-cursor-label]` to show a text pill,
  otherwise grows into a focus ring over any link/button. Auto-disabled on
  touch / coarse pointers.
- **`HeroTile`** — a project-highlight card in the hero (striped placeholder
  that links somewhere and surfaces its name in the cursor).
- **`ProjectRow`** — a row in the Software “selected work” datasheet.
- **`Tile`** — a plain striped placeholder (photography frames).
- **`BottomNav`** / **`TopChrome`** — shared fixed chrome; `BottomNav` tracks
  the active section on the index.
- **`SectionHeader`** — the numbered rule-line header.
- **`Reveal`** — scroll-into-view fade/lift wrapper.
- **`DitherCanvas`** — the animated ordered-dither hero background.

Page content lives in `data/content.ts`.

## Tweaks — all in CSS variables

Every knob the original design exposed as an editor “prop” is a CSS variable in
`app/globals.css`, so the whole look is retuned in one place:

- **Palette** — dark by default (`:root`). A warm/light palette ships under
  `:root[data-theme="warm"]`; set `data-theme="warm"` on `<html>` to switch.
- **Accent** — `--ac` (default `#FF4D00`). `--curtext` is the cursor-label text
  colour (kept readable against the accent).
- **Hero dither** — `--dither-color` and `--dither-speed`. `DitherCanvas` reads
  these (and `--bg`) at runtime and reacts to theme changes.

These tokens are mapped onto Tailwind via `@theme inline`, so utilities like
`bg-bg`, `text-fs`, `border-ln`, and `text-ac` resolve to the live variables and
keep switching with the theme.
