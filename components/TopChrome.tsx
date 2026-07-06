import Link from "next/link";

const PAD = "px-[clamp(28px,5vw,56px)] py-[26px]";

/**
 * Fixed top chrome.
 *  - "index"   : static identity (left) + availability (right), non-interactive
 *  - "subpage" : both corners become links back to the index
 */
export default function TopChrome({
  variant = "index",
}: {
  variant?: "index" | "subpage";
}) {
  if (variant === "subpage") {
    return (
      <>
        <Link
          href="/"
          data-cursor-label="Index ↗"
          className={`fixed left-0 top-0 z-[60] font-mono leading-[1.55] no-underline ${PAD}`}
        >
          <div className="text-[13px] tracking-[0.04em] text-fs">
            Alex Mercer
          </div>
          <div className="text-[12px] text-fd">software engineer · designer</div>
        </Link>
        <Link
          href="/"
          data-cursor-label="Back ↗"
          className={`fixed right-0 top-0 z-[60] font-mono text-[12px] tracking-[0.04em] text-fd no-underline ${PAD}`}
        >
          ← back to index
        </Link>
      </>
    );
  }

  return (
    <>
      {/* fade so content scrolls softly under the header */}
      <div
        aria-hidden="true"
        className="chrome-fade-top pointer-events-none fixed inset-x-0 top-0 z-[55] h-[128px]"
      />
      <div
        className={`pointer-events-none fixed left-0 top-0 z-[60] font-mono leading-[1.55] ${PAD}`}
      >
        <div className="text-[13px] tracking-[0.04em] text-fs">Alex Mercer</div>
        <div className="text-[12px] text-fd">software engineer · designer</div>
      </div>
      <div
        className={`pointer-events-none fixed right-0 top-0 z-[60] text-right font-mono text-[12px] leading-[1.55] text-fd ${PAD}`}
      >
        <div>available for work</div>
        <div>Melbourne — 2026</div>
      </div>
    </>
  );
}
