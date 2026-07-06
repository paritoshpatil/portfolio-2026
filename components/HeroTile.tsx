import Link from "next/link";
import type { HeroHighlight } from "@/data/content";

/**
 * A project-highlight card in the hero — a striped placeholder that
 * leads somewhere and surfaces its name in the morphing cursor.
 * The staggered heights/offsets come from the data so the row keeps
 * its off-kilter rhythm.
 */
export default function HeroTile({ tile }: { tile: HeroHighlight }) {
  return (
    <Link
      href={tile.href}
      data-cursor-label={tile.label}
      aria-label={tile.label}
      className={`stripes block flex-1 ${tile.heightClass} ${tile.marginTopClass}`}
    />
  );
}
