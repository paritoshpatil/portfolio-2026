import BottomNav from "@/components/BottomNav";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import TopChrome from "@/components/TopChrome";
import { currentlyReading, recentlyFinished, type Book } from "@/data/content";

export const metadata = {
  title: "Reading — Paritosh Patil",
};

function Shelf({ heading, books }: { heading: string; books: Book[] }) {
  return (
    <div>
      <div className="mb-5 font-mono text-[11px] tracking-[0.2em] text-ff">
        {heading}
      </div>
      {books.map((book, i) => (
        <Reveal
          key={book.title}
          delay={Math.min(i, 6) * 50}
          className="flex items-baseline justify-between border-b border-ls py-4"
        >
          <div>
            <div className="text-[16px] text-fs">{book.title}</div>
            <div className="mt-[3px] text-[13px] text-ft">{book.author}</div>
          </div>
          <div className="font-mono text-[12px] text-fd">{book.year}</div>
        </Reveal>
      ))}
    </div>
  );
}

export default function Reading() {
  return (
    <main className="relative min-h-screen px-[clamp(40px,7vw,120px)] pb-[clamp(120px,16vh,160px)] pt-[clamp(120px,16vh,180px)]">
      <TopChrome variant="subpage" />

      <div className="mx-auto w-full max-w-[1440px]">
        <SectionHeader
          num="03"
          title="Reading"
          as="h1"
          variant="page"
          note="a running shelf"
          className="mb-[46px]"
        />

        <div className="grid gap-[clamp(40px,6vw,90px)] [grid-template-columns:repeat(auto-fit,minmax(360px,1fr))]">
          <Shelf heading="CURRENTLY" books={currentlyReading} />
          <Shelf heading="RECENTLY FINISHED" books={recentlyFinished} />
        </div>
      </div>

      <BottomNav page="reading" />
    </main>
  );
}
