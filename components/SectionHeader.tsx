import type { ElementType, ReactNode } from "react";

/**
 * The numbered rule-line header used by every section and subpage:
 *   [num]   Title                         [note / action]
 */
export default function SectionHeader({
  num,
  title,
  note,
  as = "h2",
  variant = "section",
  className = "",
}: {
  num: string;
  title: string;
  /** right-aligned text or an element (e.g. a download button) */
  note?: ReactNode;
  as?: ElementType;
  variant?: "section" | "page";
  className?: string;
}) {
  const Heading = as as ElementType;
  const titleCls =
    variant === "page"
      ? "text-[clamp(28px,3.4vw,46px)] tracking-[-0.015em]"
      : "text-[clamp(26px,3vw,40px)] tracking-[-0.01em]";

  return (
    <div
      className={`flex items-baseline gap-[18px] border-b border-ln pb-[26px] ${className}`}
    >
      <span className="font-mono text-[12px] tracking-[0.2em] text-fd">
        {num}
      </span>
      <Heading className={`font-normal text-fs ${titleCls}`}>{title}</Heading>
      {note != null &&
        (typeof note === "string" ? (
          <span className="ml-auto font-mono text-[12px] text-ff">{note}</span>
        ) : (
          <div className="ml-auto">{note}</div>
        ))}
    </div>
  );
}
