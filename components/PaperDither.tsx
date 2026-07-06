import { Dithering } from "@paper-design/shaders-react";



export default function PaperDither({ className }: { className?: string }) {
  return (
    <Dithering
        className={className}
        colorBack="#301c2a00"
        colorFront="#454545"
        shape="warp"
        type="2x2"
        size={2.2}
        speed={0.12}
        scale={1.52}
        offsetX={0.54}
        offsetY={0.86}
/>)};