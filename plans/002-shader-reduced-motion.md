# 002 — Gate the hero shader on prefers-reduced-motion

- **Status**: DONE
- **Commit**: 40084da
- **Severity**: MEDIUM
- **Category**: Accessibility / Performance
- **Estimated scope**: 1 file (`components/PaperDither.tsx`)

## Problem

The hero background is a continuously-animating WebGL dithering shader. Every other animation on the site respects `prefers-reduced-motion` — the scroll reveal (`app/globals.css:161-167` + `components/Reveal.tsx:31-35`), Lenis smooth scroll (`components/SmoothScroll.tsx:43-49`), and even the unused `DitherCanvas` (`components/DitherCanvas.tsx:154`). The **most prominent, always-on-screen animation ignores it** and animates forever regardless of the user's setting.

```tsx
/* components/PaperDither.tsx:37-50 — current */
  return (
    <Dithering
      className={className}
      colorBack="#301c2a00"
      colorFront={colorFront}
      shape="warp"
      type="2x2"
      size={2.2}
      speed={0.12}
      scale={1.52}
      offsetX={0.54}
      offsetY={0.86}
    />
  );
```

`speed={0.12}` is hard-coded; there is no reduced-motion branch.

## Target

Drive `speed` from state that is `0` when the user prefers reduced motion and `0.12` otherwise. `speed={0}` renders a static dither frame (the shape/colour are preserved — only the motion stops), which is exactly what reduced-motion asks for: keep the visual, drop the movement.

```tsx
/* target — components/PaperDither.tsx */
const DEFAULT_ACCENT = "#FF4D00";
const SHADER_SPEED = 0.12; // animated; forced to 0 under prefers-reduced-motion

export default function PaperDither({ className }: { className?: string }) {
  const [colorFront, setColorFront] = useState(DEFAULT_ACCENT);
  const [speed, setSpeed] = useState(SHADER_SPEED);

  // ...existing accent-tracking effect stays unchanged...

  // reduced-motion: freeze the shader (keep the frame, drop the motion)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setSpeed(mq.matches ? 0 : SHADER_SPEED);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <Dithering
      className={className}
      colorBack="#301c2a00"
      colorFront={colorFront}
      shape="warp"
      type="2x2"
      size={2.2}
      speed={speed}
      scale={1.52}
      offsetX={0.54}
      offsetY={0.86}
    />
  );
}
```

## Repo conventions to follow

- `PaperDither` is already a `"use client"` component that uses `useState` + `useEffect` and corrects an SSR default value on mount (see the `colorFront` pattern, `components/PaperDither.tsx:18-35`). Mirror that exact pattern for `speed`: initialize to the animated default, correct in an effect. This keeps SSR output stable and matches the file's own idiom.
- Reduced-motion detection elsewhere uses `window.matchMedia("(prefers-reduced-motion: reduce)").matches` (see `components/Reveal.tsx:31`, `components/SmoothScroll.tsx:45`). Use the same query string. This plan additionally subscribes to `change` so a live OS toggle updates the shader — matching how `PaperDither` already subscribes to theme changes via `MutationObserver`.

## Steps

1. In `components/PaperDither.tsx`, add a module-level constant `const SHADER_SPEED = 0.12;` next to `DEFAULT_ACCENT` (line ~8).
2. Add `const [speed, setSpeed] = useState(SHADER_SPEED);` beside the existing `colorFront` state (line ~18).
3. Add the reduced-motion `useEffect` shown in Target, after the existing accent-tracking effect. Do not merge it into the accent effect — keep the two concerns separate.
4. Change the JSX prop from `speed={0.12}` (line 45) to `speed={speed}`.

## Boundaries

- Do NOT change any other shader prop (`shape`, `type`, `size`, `scale`, `offsetX`, `offsetY`, `colorBack`, `colorFront`).
- Do NOT remove or unmount the shader for reduced-motion users — the requirement is *freeze*, not *hide*. `speed={0}` keeps the frame visible.
- Do NOT add new dependencies.
- If a step doesn't match the code you find (drift since commit 40084da), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run build` succeeds; no new type errors.
- **Feel check**: run `npm run dev` and open the index.
  - With normal motion settings, the hero dither still warps/drifts as before.
  - In Chrome DevTools → Rendering panel → **Emulate CSS prefers-reduced-motion: reduce**, reload: the hero shows a **static** dither field (colour and shape intact, no drift). Toggle the emulation back to no-preference **without reloading** and confirm the motion resumes (the `change` listener path).
  - Confirm the shader colour still tracks the accent swatches (regression check on the existing behaviour).
- **Done when**: `speed` is `0` under reduced-motion and `0.12` otherwise, live-toggling works, and accent tracking still functions.
