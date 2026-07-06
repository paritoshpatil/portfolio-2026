import BottomNav from "@/components/BottomNav";
import DitherCanvas from "@/components/DitherCanvas";
import HeroTile from "@/components/HeroTile";
import PaperDither from "@/components/PaperDither";
import ProjectRow from "@/components/ProjectRow";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import TopChrome from "@/components/TopChrome";
import {
  aboutFacts,
  contactLinks,
  heroHighlights,
  projects,
  resume,
} from "@/data/content";

// shared horizontal + block padding for the standard sections
const SECTION = "px-[clamp(40px,7vw,120px)] py-[clamp(100px,14vh,170px)]";
const INNER = "mx-auto w-full max-w-[1440px]";

export default function Home() {
  return (
    <main className="relative">
      <TopChrome variant="index" />

      {/* ============================ HERO ============================ */}
      <section
        id="hero"
        className="relative z-0 flex min-h-screen flex-col justify-center overflow-visible px-[clamp(40px,7vw,120px)] pb-[clamp(90px,12vh,140px)] pt-[clamp(140px,20vh,220px)]"
      >
        <PaperDither className="absolute inset-x-0 top-0 z-0 h-full" />
        <div className={`relative z-[1] ${INNER}`}>
          <Reveal className="max-w-[760px]">
            <h1 className="text-[clamp(38px,5.2vw,64px)] font-normal leading-[1.08] tracking-[-0.02em] text-fs">
              I make stuff on the internet, for the internet.
            </h1>
            <p className="mt-[30px] max-w-[480px] text-[clamp(15px,1.3vw,17px)] leading-[1.7] text-ft">
              Software engineer with a soft spot for interface design. The rest
              of the time I’m making indie electronic music, shooting film, and
              working through a stack of books.
            </p>
          </Reveal>
          <Reveal
            delay={120}
            className="mt-[clamp(60px,9vh,110px)] flex items-start gap-[clamp(24px,4vw,56px)]"
          >
            {heroHighlights.map((tile) => (
              <HeroTile key={tile.label} tile={tile} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ========================= 01 SOFTWARE ========================= */}
      <section id="software" className={`relative z-[1] ${SECTION}`}>
        <div className={INNER}>
          <Reveal>
            <SectionHeader
              num="01"
              title="Software"
              note="selected work"
              className="mb-[18px]"
            />
          </Reveal>
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 60}>
              <ProjectRow project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================== 02 ABOUT ========================== */}
      <section id="about" className={SECTION}>
        <div className={INNER}>
          <Reveal>
            <SectionHeader num="02" title="About" className="mb-[50px]" />
          </Reveal>
          <div className="grid items-start gap-[clamp(40px,6vw,100px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            <Reveal className="max-w-[560px]">
              <p className="text-[clamp(18px,1.7vw,22px)] font-light leading-[1.6] text-fg">
                I’m a software engineer who cares as much about how a thing feels
                as whether it works. I move comfortably between code and design —
                shipping the system and the interface that sits on it.
              </p>
              <p className="mt-6 text-[15px] leading-[1.75] text-ft">
                Outside of work I make indie electronic music, shoot 35mm film,
                and read more than I finish. This site is where those threads sit
                next to each other.
              </p>
            </Reveal>
            <Reveal delay={120} className="font-mono text-[13px]">
              {aboutFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex justify-between border-b border-ls py-[14px]"
                >
                  <span className="text-fd">{fact.label}</span>
                  <span className="text-fg">{fact.value}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================= 03 CONTACT ========================= */}
      <section
        id="contact"
        className="flex min-h-[84vh] items-center px-[clamp(40px,7vw,120px)] py-[clamp(100px,14vh,170px)]"
      >
        <div className={INNER}>
          <Reveal className="mb-[30px] font-mono text-[12px] tracking-[0.2em] text-fd">
            03 — CONTACT
          </Reveal>
          <Reveal>
            <a
              data-cursor-label="Email ↗"
              href="mailto:paritoshpatil54321@gmail.com"
              className="inline-block text-[clamp(34px,6vw,76px)] font-normal leading-[1.05] tracking-[-0.02em] text-fs no-underline transition-colors hover:text-ac"
            >
              paritoshpatil54321@gmail.com
            </a>
          </Reveal>
          <Reveal
            delay={120}
            className="mt-[clamp(40px,6vh,70px)] flex flex-wrap gap-8 font-mono text-[14px]"
          >
            {contactLinks.map((link) => (
              <a
                key={link.label}
                data-cursor-label={link.label}
                href={link.href}
                className="text-ft no-underline transition-colors hover:text-fs"
              >
                {link.label}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ========================= 04 RÉSUMÉ ========================= */}
      <section
        id="resume"
        className="px-[clamp(40px,7vw,120px)] pb-[clamp(140px,20vh,200px)] pt-[clamp(100px,14vh,170px)]"
      >
        <div className={INNER}>
          <Reveal>
            <SectionHeader
              num="04"
              title="Résumé"
              className="mb-[46px]"
              note={
                <a
                  data-cursor-label="PDF ↓"
                  href="#"
                  className="border border-ln px-[18px] py-[11px] font-mono text-[12px] tracking-[0.08em] text-fg no-underline transition-colors hover:border-ac hover:text-ac"
                >
                  DOWNLOAD CV (PDF)
                </a>
              }
            />
          </Reveal>
          <div className="grid gap-[clamp(30px,4vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {resume.map((entry, i) => (
              <Reveal key={entry.period} delay={i * 80} className="flex gap-6">
                <div className="w-[90px] shrink-0 font-mono text-[12px] text-fd">
                  {entry.period}
                </div>
                <div>
                  <div className="text-[17px] text-fs">{entry.role}</div>
                  <div className="mt-1 text-[14px] text-ft">{entry.place}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BottomNav page="index" />
    </main>
  );
}
