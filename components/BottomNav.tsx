"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = [
  { key: "software", num: "01", label: "software" },
  { key: "about", num: "02", label: "about" },
  { key: "contact", num: "03", label: "contact" },
  { key: "resume", num: "04", label: "résumé" },
] as const;

type Page = "index" | "photography" | "reading";

/**
 * Fixed bottom navigation shared by every route.
 * On the index it tracks the section under the viewport centre and
 * highlights the matching item (number turns accent). On a subpage the
 * matching external link (photography / reading) gets the active dot.
 */
export default function BottomNav({ page = "index" }: { page?: Page }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (page !== "index") return;
    const ids = ["hero", ...SECTIONS.map((s) => s.key)];

    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.5;
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [page]);

  return (
    <nav className="chrome-fade-bottom fixed inset-x-0 bottom-0 z-[60] flex items-center justify-between gap-6 px-[clamp(28px,5vw,56px)] pb-[18px] pt-4 font-mono text-[13px]">
      {/* left — identity mark */}
      <Link
        href="/"
        data-cursor-label={page === "index" ? "Top ↑" : "Home ↗"}
        className="flex shrink-0 items-center gap-3 no-underline"
      >
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-ac">
          <span className="h-[5px] w-[5px] rounded-full bg-ac" />
        </span>
        <span className="text-[11px] leading-[1.4] text-fd">
          A. Mercer
          <br />
          <span className="text-ff">
            {page === "index" ? "index ↑" : "← home"}
          </span>
        </span>
      </Link>

      {/* right — section + external links */}
      <div className="flex flex-wrap items-baseline justify-end gap-[clamp(12px,1.8vw,28px)]">
        {SECTIONS.map((s) => {
          const on = page === "index" && active === s.key;
          return (
            <Link
              key={s.key}
              href={`/#${s.key}`}
              className={`flex items-baseline gap-[7px] no-underline transition-colors hover:text-fs ${
                on ? "text-fs" : "text-fd"
              }`}
            >
              <span
                className={`text-[11px] ${on ? "text-ac" : "text-ff"}`}
              >
                {s.num}
              </span>
              <span>{s.label}</span>
            </Link>
          );
        })}

        <span
          aria-hidden="true"
          className="mx-[2px] h-[15px] w-px self-center bg-ln"
        />

        <ExternalNavLink
          href="/photography"
          label="photography"
          active={page === "photography"}
        />
        <ExternalNavLink
          href="/reading"
          label="reading"
          active={page === "reading"}
        />
      </div>
    </nav>
  );
}

function ExternalNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  if (active) {
    return (
      <Link
        href={href}
        className="flex items-baseline gap-[6px] text-fs no-underline"
      >
        <span className="h-[5px] w-[5px] self-center rounded-full bg-ac" />
        <span>{label}</span>
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="flex items-baseline gap-[6px] text-ft no-underline transition-colors hover:text-fs"
    >
      <span>{label}</span>
      <span className="text-[11px] text-fd">↗</span>
    </Link>
  );
}
