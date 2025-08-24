// app/page.tsx (or pages/index.tsx / layout in App Router)
'use client';
import Script from 'next/script';

export default function VantaBackground() {
  return (
    <>
      {/* Load three.js and Vanta BEFORE hydration */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.dots.min.js"
        strategy="beforeInteractive"
      />
      {/* Inline script to initialize Vanta once those are ready */}
      <Script id="vanta-init" strategy="afterInteractive">
        {`
          VANTA.DOTS({
            el: "#vanta-background",
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            color: 0xff3f81,
            size: 3.0,           
            spacing: 20.0, 
            backgroundAlpha: 0.0,
            scale: 1.0,
            scaleMobile: 1.0,
          });
        `}
      </Script>

      {/* DOM container for the background */}
      <div
        id="vanta-background"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
      />
    </>
  );
}