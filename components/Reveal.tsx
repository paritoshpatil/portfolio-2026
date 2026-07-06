"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** stagger, in ms — mirrors the prototype's data-reveal-delay */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Fades + lifts its child into view once it scrolls near the viewport.
 * Resting/hidden styles live in globals.css (.reveal); this just toggles
 * data-shown and applies the per-item delay. Respects reduced-motion via CSS.
 */
export default function Reveal({
  children,
  delay = 0,
  as,
  className = "",
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.dataset.shown = "1";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            el.style.transitionDelay = `${delay / 1000}s`;
            el.dataset.shown = "1";
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
