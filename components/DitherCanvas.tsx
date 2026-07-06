"use client";

import { useEffect, useRef } from "react";

const CELL = 3; // px per dither cell
// 4x4 ordered (Bayer) matrix, 0..15
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function hexToRgb(hex: string, fallback: [number, number, number]) {
  let h = (hex || "").trim().replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (h.length < 6) return fallback;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return fallback;
  return [r, g, b] as [number, number, number];
}

/**
 * Animated ordered-dither field for the hero background. Density rises
 * toward the bottom with two slow travelling waves plus low-frequency
 * blobs for irregularity. Each drawn dot's brightness also tracks the
 * local density, so the field reads as a light→dark gradient: brightest
 * where the dots are concentrated, fading toward the background where
 * they're scarce. Colours, speed, and the fade floor are read from CSS
 * variables (--bg, --dither-color, --dither-speed, --dither-floor) so
 * theme tweaks flow through.
 */
export default function DitherCanvas({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) {
      cv.style.display = "none";
      return;
    }

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      const floor = parseFloat(cs.getPropertyValue("--dither-floor"));
      return {
        speed: parseFloat(cs.getPropertyValue("--dither-speed")) || 1,
        // lowest brightness a drawn dot fades to in the scarce region (0..1)
        floor: Number.isFinite(floor) ? floor : 0.3,
        bg: hexToRgb(cs.getPropertyValue("--bg"), [0, 0, 0]),
        dot: hexToRgb(cs.getPropertyValue("--dither-color"), [90, 90, 90]),
      };
    };
    let theme = readTheme();

    let cols = 0;
    let rows = 0;
    let off: HTMLCanvasElement | null = null;
    let offCtx: CanvasRenderingContext2D | null = null;
    let img: ImageData | null = null;

    const resize = () => {
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w;
      cv.height = h;
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      offCtx = off.getContext("2d");
      img = offCtx?.createImageData(cols, rows) ?? null;
      ctx.imageSmoothingEnabled = false;
    };
    window.addEventListener("resize", resize);
    resize();

    // fast integer hash + smooth value noise for irregularity
    const hash = (x: number, y: number) => {
      let n = (x * 374761393 + y * 668265263) >>> 0;
      n = (Math.imul(n ^ (n >>> 13), 1274126177)) >>> 0;
      return n / 4294967295;
    };
    const vnoise = (x: number, y: number) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const xf = x - xi;
      const yf = y - yi;
      const u = xf * xf * (3 - 2 * xf);
      const w = yf * yf * (3 - 2 * yf);
      const a = hash(xi, yi);
      const b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1);
      const e = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * w + (a - b - c + e) * u * w;
    };

    const drawFrame = (now: number) => {
      if (!img || !off || !offCtx) return;
      const t = (now / 1000) * 0.35 * (theme.speed || 1);
      const d = img.data;
      const bg = theme.bg;
      const dot = theme.dot;
      const floor = theme.floor;
      const span = 1 - floor;
      for (let y = 0; y < rows; y++) {
        const ny = y / rows;
        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const grad = Math.pow(ny, 1.45) * 1.02 + nx * 0.26;
          const wave =
            Math.sin(nx * 3.0 + t) * 0.5 +
            Math.sin((nx + ny) * 2.4 - t * 0.8) * 0.5;
          const blobs =
            (vnoise(nx * 5.5 + t * 0.25, ny * 5.5 - t * 0.15) - 0.5) * 0.34;
          const grain = (hash(x, y) - 0.5) * 0.14;
          // smooth local density (no grain) drives both presence and brightness
          const dens = grad * 0.7 + wave * 0.1 + blobs - 0.28;
          let v = dens + grain; // grain only perturbs the dither threshold
          if (v < 0) v = 0;
          else if (v > 1) v = 1;
          const thr = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
          const i = (y * cols + x) * 4;
          if (v > thr) {
            // brightness tracks concentration: dense → full dither colour,
            // scarce → fades toward the background (down to `floor`).
            const db = dens < 0 ? 0 : dens > 1 ? 1 : dens;
            const b = floor + span * db;
            d[i] = bg[0] + (dot[0] - bg[0]) * b;
            d[i + 1] = bg[1] + (dot[1] - bg[1]) * b;
            d[i + 2] = bg[2] + (dot[2] - bg[2]) * b;
          } else {
            d[i] = bg[0];
            d[i + 1] = bg[1];
            d[i + 2] = bg[2];
          }
          d[i + 3] = 255;
        }
      }
      offCtx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(off, 0, 0, cols, rows, 0, 0, cv.width, cv.height);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (now - last < 55) return; // ~18fps — slow wave, cheap
      last = now;
      drawFrame(now);
    };

    // watch for theme (colour) changes
    const mo = new MutationObserver(() => {
      theme = readTheme();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    drawFrame(performance.now());
    if (!reduce) raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none block [image-rendering:pixelated] ${className}`}
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom,#000 0%,#000 80%,transparent 100%)",
        maskImage:
          "linear-gradient(to bottom,#000 0%,#000 80%,transparent 100%)",
      }}
    />
  );
}
