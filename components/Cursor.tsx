"use client";

import { useEffect, useRef } from "react";

/**
 * Morphing cursor.
 *
 * Three modes, driven by what's under the pointer:
 *   - "label"   an element with [data-cursor-label] → pill shows that text
 *   - "focus"   any a / button / [data-link] / [data-goto] → small ring
 *   - "default" bare dot
 *
 * Lives once in the root layout so it persists across route changes.
 * Disabled on coarse / touch pointers.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cur = dotRef.current;
    const txt = textRef.current;
    if (!fine || !cur || !txt) return;

    document.body.dataset.customCursor = "on";

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let ps = 1; // current scale
    let tp = 1; // target scale
    let shown = false;
    let raf = 0;

    const setMode = (mode: "label" | "focus" | "default", text = "") => {
      if (mode === "label") {
        cur.style.height = "26px";
        cur.style.minWidth = "26px";
        cur.style.padding = "0 12px";
        txt.textContent = text;
        txt.style.maxWidth = "300px";
        txt.style.opacity = "1";
      } else if (mode === "focus") {
        cur.style.height = "32px";
        cur.style.minWidth = "32px";
        cur.style.padding = "0";
        txt.textContent = "";
        txt.style.maxWidth = "0";
        txt.style.opacity = "0";
      } else {
        cur.style.height = "11px";
        cur.style.minWidth = "11px";
        cur.style.padding = "0";
        txt.textContent = "";
        txt.style.maxWidth = "0";
        txt.style.opacity = "0";
      }
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        cur.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || !target.closest) return;
      const lbl = target.closest<HTMLElement>("[data-cursor-label]");
      if (lbl) {
        setMode("label", lbl.getAttribute("data-cursor-label") ?? "");
        return;
      }
      if (target.closest("a, button, [data-goto], [data-link]")) {
        setMode("focus");
        return;
      }
      setMode("default");
    };
    const onDown = () => {
      tp = 0.74;
    };
    const onUp = () => {
      tp = 1;
    };
    const onLeave = () => {
      cur.style.opacity = "0";
    };
    const onEnter = () => {
      if (shown) cur.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      ps += (tp - ps) * 0.3;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(${ps})`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      delete document.body.dataset.customCursor;
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9000] flex h-[11px] min-w-[11px] items-center justify-center rounded-full bg-ac font-mono text-[11px] tracking-[0.04em] text-curtext opacity-0 pointer-events-none whitespace-nowrap will-change-transform"
      style={{
        transform: "translate(-100px,-100px)",
        transition:
          "height .24s cubic-bezier(.22,1,.36,1),min-width .24s cubic-bezier(.22,1,.36,1),padding .24s cubic-bezier(.22,1,.36,1),background .25s,opacity .2s",
      }}
    >
      <span
        ref={textRef}
        className="max-w-0 overflow-hidden opacity-0"
        style={{
          transition:
            "max-width .28s cubic-bezier(.22,1,.36,1),opacity .18s",
        }}
      />
    </div>
  );
}
