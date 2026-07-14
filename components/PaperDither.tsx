"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

// Matches the CSS default `--ac` so the first (SSR) paint agrees with the
// pre-paint script before the effect reads the live value.
const DEFAULT_ACCENT = "#FF4D00";
const SHADER_SPEED = 0.12; // animated; forced to 0 under prefers-reduced-motion

/**
 * Hero dither field. Its foreground colour tracks the selected accent
 * (`--ac`), so switching the accent swatch retints the whole background.
 * The accent lives in a CSS variable, but the shader needs a concrete
 * colour prop — so we read the computed value and re-read whenever the
 * theme (`data-theme`) or accent (inline `style` → `--ac`) changes.
 */
export default function PaperDither({ className }: { className?: string }) {
  const [colorFront, setColorFront] = useState(DEFAULT_ACCENT);
  const [speed, setSpeed] = useState(SHADER_SPEED);

  useEffect(() => {
    const read = () => {
      const ac = getComputedStyle(document.documentElement)
        .getPropertyValue("--ac")
        .trim();
      if (ac) setColorFront(ac);
    };
    read();

    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });
    return () => mo.disconnect();
  }, []);

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
