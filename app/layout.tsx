import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

// Restore the saved theme/accent before first paint (no flash of default).
const themeInit = `(function(){try{
var t=localStorage.getItem('theme');
if(t==='warm')document.documentElement.setAttribute('data-theme','warm');
var a=localStorage.getItem('accent');
if(a){var r=document.documentElement;r.style.setProperty('--ac',a);
var c=a.replace('#','');if(c.length===3)c=c.split('').map(function(x){return x+x}).join('');
var lum=(0.299*parseInt(c.substr(0,2),16)+0.587*parseInt(c.substr(2,2),16)+0.114*parseInt(c.substr(4,2),16))/255;
r.style.setProperty('--curtext',lum>0.62?'#000':'#fff');}
}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Paritosh Patil — software engineer · designer",
  description:
    "Software engineer with a soft spot for interface design. Indie electronic music, 35mm film, and a stack of books.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
