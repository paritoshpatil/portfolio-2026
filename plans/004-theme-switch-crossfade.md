# 004 — Crossfade the theme / accent switch (View Transitions)

- **Status**: DONE
- **Commit**: 40084da
- **Severity**: LOW (additive — missed opportunity)
- **Category**: Missed opportunity / Cohesion
- **Estimated scope**: 2 files (`components/ThemeControls.tsx`, `app/globals.css`)
- **Depends on**: 001 (uses the `--ease-out` token; inline fallback provided if 001 not yet done)

## Problem

Switching the palette (dark ↔ warm) or picking an accent instantly repaints the entire page. Every token — background, all foreground tones, lines, card fills, the accent — snaps to the new value in a single frame. It's a jarring, hard-cut state change on the most tactile control on the site.

```tsx
/* components/ThemeControls.tsx:71-82 — current (instant DOM mutation) */
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "warm" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  };

  const pickAccent = (hex: string) => {
    setAccent(hex);
    applyAccent(hex);
    localStorage.setItem("accent", hex);
  };
```

`applyTheme` / `applyAccent` (`components/ThemeControls.tsx:31-41`) mutate `<html>` attributes / CSS variables directly, so the change is immediate and un-animatable via ordinary CSS transitions (CSS variables don't transition, and dozens of elements would each need their own transition).

## Target

Wrap the DOM mutation in the **View Transitions API** (`document.startViewTransition`), which snapshots the old page, applies the change, and cross-fades the whole document in one call — the correct tool for a global state swap that CSS transitions can't reach. Feature-detect it and honour reduced-motion by falling back to the instant path.

Add a small helper and use it for both handlers:

```tsx
/* target — components/ThemeControls.tsx, above the component */
/** Run a DOM mutation inside a document cross-fade when supported and
 *  motion is allowed; otherwise apply it instantly. */
function withViewTransition(mutate: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = (document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  }).startViewTransition;
  if (reduce || typeof start !== "function") {
    mutate();
    return;
  }
  start.call(document, mutate);
}
```

```tsx
/* target — components/ThemeControls.tsx handlers */
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "warm" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    withViewTransition(() => applyTheme(next));
  };

  const pickAccent = (hex: string) => {
    setAccent(hex);
    localStorage.setItem("accent", hex);
    withViewTransition(() => applyAccent(hex));
  };
```

Tune the cross-fade timing and add the reduced-motion CSS fallback (in case a browser ignores the JS guard) in `app/globals.css`:

```css
/* target — append to app/globals.css */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 320ms;
  animation-timing-function: var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

320ms sits in the modal/drawer band (200–500ms) — appropriate for a full-page material change, not a small UI element. The `var(--ease-out, …)` uses the token from plan 001 with the literal curve as an inline fallback so this plan works whether or not 001 has landed.

## Repo conventions to follow

- `withViewTransition` keeps React `setState` + `localStorage` **outside** the transition and only the DOM-token mutation (`applyTheme` / `applyAccent`) **inside** it — those two functions are the sole source of the visual change (`components/ThemeControls.tsx:31-41`); the state is just for the button label.
- Reduced-motion detection uses `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, matching `components/Reveal.tsx:31` and `components/SmoothScroll.tsx:45`.
- `--ease-out` is defined in `:root` by plan 001 (`app/globals.css`). The inline fallback in the `var()` call means no hard dependency ordering is required.

## Steps

1. In `components/ThemeControls.tsx`, add the `withViewTransition` helper function above the `ThemeControls` component (after the `applyAccent` definition, before `export default function`).
2. Change `toggleTheme` (lines 71-76) to call `withViewTransition(() => applyTheme(next))` instead of calling `applyTheme(next)` directly; keep `setTheme` and `localStorage.setItem` as-is.
3. Change `pickAccent` (lines 78-82) to call `withViewTransition(() => applyAccent(hex))` instead of calling `applyAccent(hex)` directly; keep `setAccent` and `localStorage.setItem` as-is.
4. Append the `::view-transition-*` rules and the reduced-motion `@media` block from Target to the end of `app/globals.css`.

## Boundaries

- Do NOT change `applyTheme` / `applyAccent` / `contrast` — call them unchanged from inside the helper.
- Do NOT add a `view-transition-name` to any element or introduce custom keyframes — rely on the default root cross-fade. (If the moving custom cursor looks briefly frozen during the fade, that is acceptable for a rare, deliberate toggle — do not attempt to exclude it in this plan.)
- Do NOT add a polyfill or new dependency — feature-detect and fall back to the instant path on unsupported browsers (Firefox today).
- Do NOT wrap route navigations or any other state change — only the two theme controls.
- If a step doesn't match the code you find (drift since commit 40084da), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` succeeds; no new type errors (the `Document & { startViewTransition?… }` cast keeps TS happy without a lib bump).
- **Feel check**: run `npm run dev` in a Chromium browser (View Transitions supported).
  - Click **[DARK]/[WARM]**: the whole page cross-fades between palettes over ~320ms instead of hard-cutting. It should feel like a smooth material change, not a flash.
  - Click each accent swatch: the accent (and the hero shader tint, links, active nav dot) cross-fades in. Confirm the swatch's own selected-ring still updates.
  - In DevTools → Animations, set playback to 10% during a toggle and confirm a single clean opacity cross-fade of the root (old fading out, new fading in) with no double-exposed flicker.
  - DevTools → Rendering → **prefers-reduced-motion: reduce**: toggling theme/accent now applies **instantly** (no fade) via the JS guard.
  - In **Firefox** (no View Transitions): toggling still works, applying instantly — confirm no console error and no broken state.
- **Done when**: theme and accent changes cross-fade in supporting browsers, apply instantly under reduced-motion and on unsupported browsers, and all existing theme/accent behaviour (label, ring, shader tint, persistence) still works.
