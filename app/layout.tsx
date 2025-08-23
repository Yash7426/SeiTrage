import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/components/theme-provider";
import {
  montserrat,
  marvinVisionsBig,
  orborn,
  bebasNeue,
  montRegular,
  montItalic,
  montMedium,
  montMediumItalic,
  montLight,
  montLightItalic,
  montBold,
  montBoldItalic,
} from "@/lib/font/font";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sei-trage-eta.vercel.app/"),
  title: "SeiTrage",
  description: "AI powered arbitrage platform built on SEI",
  icons: "/images/seitrage_logo.svg",
};

export const viewport = {
  maximumScale: 1,
};

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${marvinVisionsBig.variable} 
        ${orborn.variable}
        ${montserrat.variable} 
        ${montRegular.variable}
        ${montItalic.variable}
        ${montMedium.variable}
        ${montMediumItalic.variable}
        ${montLight.variable}
        ${montLightItalic.variable}
        ${montBold.variable}
        ${montBoldItalic.variable}
        ${bebasNeue.variable}
      `}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_COLOR_SCRIPT }} />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
