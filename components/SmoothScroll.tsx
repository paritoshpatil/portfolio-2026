"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import "lenis/dist/lenis.css";

const LENIS_OPTIONS = {
  autoRaf: true,
  anchors: true,
  stopInertiaOnNavigate: true,
  lerp: 0.1,
  duration: 1.2,
  touchMultiplier: 2,
} as const;

/** Scroll to top on route change, or to a hash when present. */
function LenisRouteSync() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        lenis.scrollTo(hash);
      });
      return;
    }

    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const options = useMemo(() => ({ ...LENIS_OPTIONS }), []);

  useEffect(() => {
    setEnabled(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis root options={options}>
      <LenisRouteSync />
      {children}
    </ReactLenis>
  );
}
