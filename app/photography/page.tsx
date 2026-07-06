import BottomNav from "@/components/BottomNav";
import SectionHeader from "@/components/SectionHeader";
import Tile from "@/components/Tile";
import TopChrome from "@/components/TopChrome";
import { photos } from "@/data/content";

export const metadata = {
  title: "Photography — Alex Mercer",
};

export default function Photography() {
  return (
    <main className="relative min-h-screen px-[clamp(40px,7vw,120px)] pb-[clamp(120px,16vh,160px)] pt-[clamp(120px,16vh,180px)]">
      <TopChrome variant="subpage" />

      <div className="mx-auto w-full max-w-[1440px]">
        <SectionHeader
          num="02"
          title="Photography"
          as="h1"
          variant="page"
          note="35mm · selected frames"
          className="mb-[40px]"
        />

        {/* masonry via CSS columns */}
        <div className="[column-count:1] [column-gap:24px] sm:[column-count:2] lg:[column-count:3]">
          {photos.map((photo) => (
            <Tile
              key={photo.label}
              label={photo.label}
              className={`mb-6 block break-inside-avoid ${photo.heightClass}`}
            />
          ))}
        </div>
      </div>

      <BottomNav page="photography" />
    </main>
  );
}
