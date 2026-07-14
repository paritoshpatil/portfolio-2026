# Animation plans

Prioritized, self-contained motion improvements produced by an `improve-animations` audit at commit `40084da`. Each plan is executable by any agent with zero prior context — exact files, values, and verification steps are inlined.

## Plans

| # | Title | Severity | Category | Status |
|---|-------|----------|----------|--------|
| [001](001-motion-tokens.md) | Extract motion tokens (easing + duration scale) | MEDIUM | Cohesion & tokens | DONE |
| [002](002-shader-reduced-motion.md) | Gate the hero shader on prefers-reduced-motion | MEDIUM | Accessibility / Perf | DONE |
| [003](003-subpage-reveals.md) | Scroll reveals + stagger on Photography & Reading | MEDIUM | Missed opportunity | DONE |
| [004](004-theme-switch-crossfade.md) | Crossfade the theme / accent switch (View Transitions) | LOW | Missed opportunity | DONE |

> All four executed and verified against commit `40084da` — `npm run build` clean (types + lint + static generation of all 6 pages). Feel-checks below are eye-checks to run in the browser.

## Recommended execution order

**001 → 002 → 003 → 004**

- **001 first** — it introduces the `--ease-out` and `--dur-*` tokens the later plans lean on. It's a pure refactor with no intended feel change, so it's the safest thing to land first and makes the rest cleaner.
- **002 and 003** are independent of each other and of 001 (they don't reference the new tokens); either can go in any order after (or before) 001.
- **004 last** — it references the `--ease-out` token from 001. It carries an inline curve fallback (`var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1))`), so it will still work if run before 001, but running it after keeps the token as the single source of truth.

## Dependencies

- **004 → 001** (soft): 004 uses `--ease-out`; falls back to the literal curve if 001 hasn't landed.
- No other cross-plan dependencies. 002 and 003 touch disjoint files (`PaperDither.tsx` vs. the two subpages) and can be parallelized.

## Notes / out of scope

These were considered during the audit and deliberately **not** turned into plans:

- **Cursor morph animates layout props** (`height`/`min-width`/`padding` in `components/Cursor.tsx`) instead of `transform` — a real perf finding, but the fix needs a feel-check (the pill must still size to its label) and is more involved. Raise a plan if you want it.
- **`.reveal` 800ms duration** — arguably slow for a 24px lift, but defensible as portfolio "marketing" pacing; left as-is (the value is now the `--dur-reveal` token after 001, so it's a one-line change if you reconsider).
- **`ThemeControls` accent swatch `hover:scale-125`** — ungated hover motion (LOW); not worth a standalone plan.
- **Dead import**: `DitherCanvas` is imported in `app/page.tsx:2` but never rendered (hero uses `PaperDither`). Cleanup, not a motion issue.
