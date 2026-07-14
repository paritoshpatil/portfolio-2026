# 003 — Add scroll reveals + stagger to Photography & Reading subpages

- **Status**: DONE
- **Commit**: 40084da
- **Severity**: MEDIUM
- **Category**: Missed opportunity / Cohesion
- **Estimated scope**: 2 files (`app/photography/page.tsx`, `app/reading/page.tsx`)

## Problem

The index reveals every block on scroll with a staggered fade+lift (`components/Reveal.tsx`, used throughout `app/page.tsx`). The two subpages do **not** — their content renders flat, appearing all at once with no motion. This is both a cohesion gap (the subpages feel like a different site) and a lost delight moment on the two pages that are otherwise pure grids.

```tsx
/* app/photography/page.tsx:27-35 — current (no motion) */
        <div className="[column-count:1] [column-gap:24px] sm:[column-count:2] lg:[column-count:3]">
          {photos.map((photo) => (
            <Tile
              key={photo.label}
              label={photo.label}
              className={`mb-6 block break-inside-avoid ${photo.heightClass}`}
            />
          ))}
        </div>
```

```tsx
/* app/reading/page.tsx:16-29 — current (no motion) */
      {books.map((book) => (
        <div
          key={book.title}
          className="flex items-baseline justify-between border-b border-ls py-4"
        >
          <div>
            <div className="text-[16px] text-fs">{book.title}</div>
            <div className="mt-[3px] text-[13px] text-ft">{book.author}</div>
          </div>
          <div className="font-mono text-[12px] text-fd">{book.year}</div>
        </div>
      ))}
```

## Target

Wrap each grid item / book row in the existing `Reveal` component with a small stagger, reusing the index's exact motion (fade + 24px lift, `--dur-reveal`, `--ease-out`, reduced-motion already handled inside `Reveal`).

**Photography** — `Reveal` renders a `<div>`, so it must become the direct child of the CSS-columns container and therefore carries the masonry layout classes (`mb-6 block break-inside-avoid` + the per-photo `heightClass`); the inner `Tile` fills it:

```tsx
/* target — app/photography/page.tsx */
        <div className="[column-count:1] [column-gap:24px] sm:[column-count:2] lg:[column-count:3]">
          {photos.map((photo, i) => (
            <Reveal
              key={photo.label}
              delay={(i % 3) * 60}
              className={`mb-6 block break-inside-avoid ${photo.heightClass}`}
            >
              <Tile label={photo.label} className="block h-full w-full" />
            </Reveal>
          ))}
        </div>
```

**Reading** — the book row is already a `<div>`; swap it for `Reveal` (which renders a `<div>` and forwards `className`), staggered within each shelf:

```tsx
/* target — app/reading/page.tsx Shelf() */
      {books.map((book, i) => (
        <Reveal
          key={book.title}
          delay={Math.min(i, 6) * 50}
          className="flex items-baseline justify-between border-b border-ls py-4"
        >
          <div>
            <div className="text-[16px] text-fs">{book.title}</div>
            <div className="mt-[3px] text-[13px] text-ft">{book.author}</div>
          </div>
          <div className="font-mono text-[12px] text-fd">{book.year}</div>
        </Reveal>
      ))}
```

Stagger is **capped** (`i % 3` for the masonry, `Math.min(i, 6)` for shelves) so late items never carry a multi-hundred-ms delay after they scroll into view — the reveal must feel responsive, never laggy. Stagger is decorative and never blocks interaction (these items are non-interactive tiles / plain rows).

## Repo conventions to follow

- `Reveal` is the established scroll-reveal primitive: `import Reveal from "@/components/Reveal";`, `delay` is in **ms**, it forwards `className`, and it accepts an `as` prop (default `"div"`). See usage in `app/page.tsx:33`, `app/page.tsx:66` (`delay={i * 60}`), and `app/page.tsx:167` (`delay={i * 80}`) — the index already staggers list items exactly this way.
- Reduced-motion is handled **inside** `Reveal` (`components/Reveal.tsx:31-35`) — do not add your own guard.
- `Tile` applies `stripes ${className}` (`components/Tile.tsx:12-18`), so passing `className="block h-full w-full"` makes it fill the reveal wrapper that now owns the height.

## Steps

1. **Photography** (`app/photography/page.tsx`):
   a. Add `import Reveal from "@/components/Reveal";` to the imports.
   b. Replace the `photos.map(...)` block (lines 28-34) with the Target version: map with `(photo, i)`, wrap in `Reveal` carrying `delay={(i % 3) * 60}` and the masonry classes, and give the inner `Tile` `className="block h-full w-full"`.
2. **Reading** (`app/reading/page.tsx`):
   a. Add `import Reveal from "@/components/Reveal";` to the imports.
   b. In `Shelf()`, replace the `books.map(...)` row `<div>` (lines 16-28) with the Target `Reveal` version: map with `(book, i)`, `delay={Math.min(i, 6) * 50}`, move the row's existing `className` onto the `Reveal`, keep the two inner `<div>`s unchanged.
   c. Leave the shelf heading (`app/reading/page.tsx:12-14`) as-is (optional: it may also be wrapped in `Reveal`, but that is out of scope for this plan).

## Boundaries

- Do NOT modify `components/Reveal.tsx`, `components/Tile.tsx`, or `app/globals.css` — reuse them as-is.
- Do NOT change the masonry structure (`column-count` / `column-gap` / `break-inside-avoid`) beyond moving the layout classes onto the new `Reveal` wrapper as shown. `break-inside-avoid` MUST end up on the direct column child (the `Reveal`), or photos will split across columns.
- Do NOT change the reading grid layout or the `Shelf` signature.
- Do NOT add new dependencies.
- If a step doesn't match the code you find (drift since commit 40084da), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` succeeds; no new type errors.
- **Feel check**: run `npm run dev`.
  - **/photography**: reload and scroll — tiles fade+lift into view as they enter the viewport, with a subtle per-column stagger. Confirm **no photo splits across two columns** (masonry integrity) and there is no horizontal overflow. Resize between 1/2/3 columns and re-scroll.
  - **/reading**: reload and scroll — book rows reveal top-to-bottom within each shelf with a light stagger that does not feel laggy on the last rows.
  - In DevTools → Animations, set playback to 10% and confirm the reveal is the same fade + 24px lift as the index (identical curve/duration — they now share `.reveal`).
  - DevTools → Rendering → **prefers-reduced-motion: reduce**, reload both pages: content is fully visible immediately with no transform/opacity animation (handled by `Reveal`).
- **Done when**: both subpages reveal on scroll with capped stagger, masonry stays intact, and reduced-motion shows everything instantly.
