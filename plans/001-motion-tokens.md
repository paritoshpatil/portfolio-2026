# 001 — Extract motion tokens (easing + duration scale)

- **Status**: DONE
- **Commit**: 40084da
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files (`app/globals.css`, `components/Cursor.tsx`), refactor-only — no feel change intended

## Problem

The repo tokenizes color/theme beautifully in `@theme` (`app/globals.css:63-80`) but has **no motion tokens**. One strong ease-out curve is hand-typed across multiple files, and durations are scattered as raw values that almost-but-don't match. This is the classic consolidation finding: several near-identical hand-typed values that should be one token each.

Hand-typed easing curve `cubic-bezier(0.22, 1, 0.36, 1)` appears in:

```css
/* app/globals.css:149-155 — current */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
```

```tsx
/* components/Cursor.tsx:131-134 — current */
        transform: "translate(-100px,-100px)",
        transition:
          "height .24s cubic-bezier(.22,1,.36,1),min-width .24s cubic-bezier(.22,1,.36,1),padding .24s cubic-bezier(.22,1,.36,1),background .25s,opacity .2s",
```

```tsx
/* components/Cursor.tsx:139-142 — current */
        style={{
          transition:
            "max-width .28s cubic-bezier(.22,1,.36,1),opacity .18s",
        }}
```

Six occurrences of the same curve, and five near-identical durations (`.24s`, `.28s`, `.25s`, `.2s`, `.18s`) that collapse cleanly to two.

## Target

Introduce a small motion-token set in `:root` and reference it everywhere. **Preserve the repo's existing curve value `cubic-bezier(0.22, 1, 0.36, 1)`** — this is a refactor, not a re-tune. Snap the five cursor durations to two tokens (max drift is 40ms, imperceptible):

```css
/* target — add inside :root in app/globals.css, near the other tokens */
:root {
  /* ...existing palette + dither tokens... */

  /* motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1); /* strong ease-out — the site's one curve */
  --dur-fade: 180ms;   /* opacity/text fades (was .18s–.2s) */
  --dur-morph: 240ms;  /* cursor size/label morph (was .24s–.28s / .25s) */
  --dur-reveal: 800ms; /* scroll-in reveal */
}
```

```css
/* target — app/globals.css .reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
    transform var(--dur-reveal) var(--ease-out);
  will-change: opacity, transform;
}
```

```tsx
/* target — components/Cursor.tsx dot transition (line ~132) */
        transition:
          "height var(--dur-morph) var(--ease-out),min-width var(--dur-morph) var(--ease-out),padding var(--dur-morph) var(--ease-out),background var(--dur-morph),opacity var(--dur-fade)",
```

```tsx
/* target — components/Cursor.tsx label span transition (line ~140) */
          transition:
            "max-width var(--dur-morph) var(--ease-out),opacity var(--dur-fade)",
```

CSS custom properties resolve inside inline-style `transition` strings, so `var(--dur-morph)` works verbatim in the JSX above.

## Repo conventions to follow

- All tokens live in `:root` in `app/globals.css` (see palette block `:root { --bg: #000; ... }` at `app/globals.css:15-40`). Add the motion tokens in that same `:root`, grouped under a `/* motion */` comment like the existing `/* hero dither tweaks */` group.
- Do **not** add these to `@theme inline` (that block is only for values Tailwind must expose as utilities like `bg-bg`; motion tokens are referenced directly by name, not as utilities).
- The warm theme (`:root[data-theme="warm"]`) does not need motion overrides — motion is theme-independent.

## Steps

1. In `app/globals.css`, inside the default `:root` block (after the `--dither-floor` lines, before `color-scheme: dark;` at `app/globals.css:39`), add the four motion tokens shown in Target under a `/* motion */` comment.
2. In `app/globals.css`, replace the `.reveal` `transition` (lines 152-153) with the tokenized version in Target. Leave `opacity`, `transform`, and `will-change` unchanged.
3. In `components/Cursor.tsx`, replace the dot `transition` string (line ~132-133) with the tokenized version in Target.
4. In `components/Cursor.tsx`, replace the label-span `transition` string (line ~140-141) with the tokenized version in Target.
5. Grep to confirm no stray `cubic-bezier(0.22, 1, 0.36, 1)` / `cubic-bezier(.22,1,.36,1)` remains: `grep -rniE "cubic-bezier\(\.?0?\.22" app components`. Expected: zero matches outside the `--ease-out` token definition.

## Boundaries

- Do NOT change any curve or duration **value** except the deliberate cursor duration snaps documented in Target (`.28s`/`.25s`/`.2s`/`.18s` → `--dur-morph`/`--dur-fade`). The reveal 800ms and the curve `0.22,1,0.36,1` stay exactly as-is.
- Do NOT touch `transition-colors` / `transition-transform` Tailwind utilities — those are a separate concern (Tailwind's own duration/easing defaults) and out of scope here.
- Do NOT modify `@theme inline`.
- Do NOT add new dependencies.
- If a step doesn't match the code you find (drift since commit 40084da), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` succeeds with no new type/CSS errors. `grep -rniE "cubic-bezier\(\.?0?\.22" app components` returns only the `--ease-out` definition line.
- **Feel check**: run `npm run dev` and confirm the refactor changed nothing visible:
  - Scroll the index — reveals still fade+lift over ~0.8s with the same soft ease-out (identical to before).
  - Move the cursor over a project row / link — the pill still morphs to its label and back with the same feel; press-and-release still shrinks/restores.
  - The cursor sub-timings (label text width, background color, opacity) should look indistinguishable from before — the ≤40ms snaps are not perceptible.
- **Done when**: the four tokens exist in `:root`, all six curve occurrences and five duration occurrences reference tokens, and the build is clean.
