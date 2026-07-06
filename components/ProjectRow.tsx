import type { Project } from "@/data/content";

/**
 * A single row in the "Software / selected work" list.
 * Three-column datasheet layout that tints on hover; the cursor
 * morphs to "Open ↗" over it.
 */
export default function ProjectRow({ project }: { project: Project }) {
  return (
    <button
      type="button"
      data-cursor-label="Open ↗"
      className="grid w-full grid-cols-[1.2fr_2fr_auto] items-baseline gap-6 border-b border-ls px-2 py-7 text-left font-[inherit] transition-colors hover:bg-cb"
    >
      <div className="text-[clamp(20px,2vw,26px)] font-normal text-fs">
        {project.title}
      </div>
      <div className="text-[14px] leading-[1.5] text-ft">
        {project.description}
      </div>
      <div className="text-right font-mono text-[12px] leading-[1.7] text-fd">
        {project.tech}
        <br />
        {project.year}
      </div>
    </button>
  );
}
