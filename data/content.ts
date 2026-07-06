// ── Central content for the site ──────────────────────────────

export type HeroHighlight = {
  label: string; // shown in the morphing cursor
  href: string; // where the card leads
  heightClass: string; // clamp() height
  marginTopClass: string; // clamp() top offset (the staggered look)
};

export const heroHighlights: HeroHighlight[] = [
  {
    label: "Ledger",
    href: "/#software",
    heightClass: "h-[clamp(180px,26vh,272px)]",
    marginTopClass: "mt-0",
  },
  {
    label: "Toneform",
    href: "/#software",
    heightClass: "h-[clamp(150px,22vh,224px)]",
    marginTopClass: "mt-[clamp(50px,9vh,92px)]",
  },
  {
    label: "Field Notes",
    href: "/photography",
    heightClass: "h-[clamp(196px,28vh,300px)]",
    marginTopClass: "mt-[clamp(22px,4vh,40px)]",
  },
];

export type Project = {
  title: string;
  description: string;
  tech: string;
  year: string;
};

export const projects: Project[] = [
  {
    title: "Ledger",
    description:
      "A design system and the web app built on top of it — tokens, components, docs.",
    tech: "TypeScript · React",
    year: "2025",
  },
  {
    title: "Toneform",
    description:
      "A generative audio instrument in the browser — nodes, envelopes, and a lot of math.",
    tech: "Rust · WebAudio",
    year: "2024",
  },
  {
    title: "Field Notes",
    description:
      "A quiet journaling space for film rolls — scans, contact sheets, and notes.",
    tech: "Next.js",
    year: "2024",
  },
  {
    title: "Margin",
    description:
      "A reading tracker that stays out of the way — shelves, notes, and a yearly map.",
    tech: "SwiftUI",
    year: "2023",
  },
];

export const aboutFacts: { label: string; value: string }[] = [
  { label: "based", value: "Melbourne, AU" },
  { label: "focus", value: "product · systems" },
  { label: "tools", value: "TS · Rust · Figma" },
  { label: "making", value: "an EP, slowly" },
];

export const contactLinks: { label: string; href: string }[] = [
  { label: "GitHub ↗", href: "#" },
  { label: "Are.na ↗", href: "#" },
  { label: "Instagram ↗", href: "#" },
  { label: "Read.cv ↗", href: "#" },
];

export const resume: { period: string; role: string; place: string }[] = [
  {
    period: "2024 — now",
    role: "Senior Engineer",
    place: "Design systems & product · Studio North",
  },
  {
    period: "2021 — 24",
    role: "Product Engineer",
    place: "Web platform & UI · Loom Labs",
  },
  {
    period: "2019 — 21",
    role: "Frontend Developer",
    place: "Agency work · freelance",
  },
];

export type Photo = { label: string; heightClass: string };

export const photos: Photo[] = [
  { label: "Kyoto · 2025", heightClass: "h-[340px]" },
  { label: "Melbourne · 2024", heightClass: "h-[240px]" },
  { label: "Lisbon · 2024", heightClass: "h-[300px]" },
  { label: "Coast · 2025", heightClass: "h-[280px]" },
  { label: "Tokyo · 2023", heightClass: "h-[360px]" },
  { label: "Night · 2024", heightClass: "h-[220px]" },
  { label: "Harbour · 2023", heightClass: "h-[300px]" },
  { label: "Rooftops · 2025", heightClass: "h-[260px]" },
  { label: "Quiet · 2024", heightClass: "h-[330px]" },
];

export type Book = { title: string; author: string; year: string };

export const currentlyReading: Book[] = [
  { title: "The MANIAC", author: "Benjamín Labatut", year: "’23" },
  { title: "A Pattern Language", author: "Christopher Alexander", year: "’77" },
  { title: "Tao Te Ching", author: "Lao Tzu · trans. Le Guin", year: "’97" },
];

export const recentlyFinished: Book[] = [
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    year: "’69",
  },
  { title: "Designing Design", author: "Kenya Hara", year: "’07" },
  { title: "The Pattern on the Stone", author: "W. Daniel Hillis", year: "’98" },
];
