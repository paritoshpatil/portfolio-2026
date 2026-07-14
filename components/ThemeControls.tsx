"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "warm";

// Accent options mirror the ones the original design exposed.
const ACCENTS = [
  { name: "Ember", hex: "#FF4D00" },
  { name: "Cobalt", hex: "#2A6FDB" },
  { name: "Pine", hex: "#1F8A5B" },
  { name: "Rose", hex: "#E5484D" },
] as const;

const DEFAULT_ACCENT = ACCENTS[0].hex;

/** #000 or #fff — whichever reads better on top of the given colour. */
function contrast(hex: string) {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#000" : "#fff";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "warm") root.setAttribute("data-theme", "warm");
  else root.removeAttribute("data-theme");
}

function applyAccent(hex: string) {
  const root = document.documentElement;
  root.style.setProperty("--ac", hex);
  root.style.setProperty("--curtext", contrast(hex));
}

/** Run a DOM mutation inside a document cross-fade when supported and
 *  motion is allowed; otherwise apply it instantly. */
function withViewTransition(mutate: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = (
    document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    }
  ).startViewTransition;
  if (reduce || typeof start !== "function") {
    mutate();
    return;
  }
  start.call(document, mutate);
}

/**
 * Inline "tweaks" control — flips the palette (dark / warm) and picks the
 * accent. Both write straight to the CSS variables on <html> (and to
 * localStorage), so the whole site retunes live. The pre-paint script in
 * the layout restores the saved choice before first render.
 *
 * Rendered inside the top chrome (to the left of the corner text) rather
 * than as its own edge-pinned panel, so it never fouls the layout on
 * narrow screens.
 */
export default function ThemeControls() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<string>(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  // Sync state with whatever the pre-paint script already applied.
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as Theme | null) ??
      (document.documentElement.getAttribute("data-theme") === "warm"
        ? "warm"
        : "dark");
    const savedAccent = localStorage.getItem("accent") ?? DEFAULT_ACCENT;
    setTheme(savedTheme);
    setAccent(savedAccent);
    setMounted(true);
  }, []);

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

  return (
    <div className="pointer-events-auto flex items-center gap-3 font-mono">
      <button
        type="button"
        onClick={toggleTheme}
        data-cursor-label="Theme"
        aria-label={`Switch to ${theme === "dark" ? "warm" : "dark"} theme`}
        className="flex items-center gap-2 text-[11px] tracking-[0.14em] text-fd transition-colors hover:text-fs"
      >
        {/* invisible until mounted to avoid a hydration label mismatch;
            hidden on phones to keep the top bar from crowding */}
        <span className="hidden sm:inline" style={{ opacity: mounted ? 1 : 0 }}>
          {theme === "warm" ? "[WARM]" : "[DARK]"}
        </span>
        {/* <span
          aria-hidden="true"
          className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-ln text-[10px] leading-none text-fs"
        >
          {theme === "warm" ? "☀" : "☾"}
        </span> */}
      </button>

      <div className="hidden items-center gap-[10px] sm:flex">
        {ACCENTS.map((a) => {
          const active = a.hex.toLowerCase() === accent.toLowerCase();
          return (
            <button
              key={a.hex}
              type="button"
              onClick={() => pickAccent(a.hex)}
              data-cursor-label={a.name}
              aria-label={`Accent ${a.name}`}
              aria-pressed={active}
              className="h-3 w-3 rounded-full transition-transform hover:scale-125"
              style={{
                background: a.hex,
                boxShadow: active
                  ? `0 0 0 2px var(--bg), 0 0 0 3.5px ${a.hex}`
                  : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
