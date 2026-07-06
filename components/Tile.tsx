/**
 * A plain striped placeholder (e.g. a photo frame). Non-interactive,
 * but surfaces its caption in the morphing cursor on hover.
 */
export default function Tile({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      data-cursor-label={label}
      aria-label={label}
      className={`stripes ${className}`}
    />
  );
}
