import type { Metadata } from "next";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://sei-trage-eta.vercel.app/"),
  title: "SeiTrage",
  description: "AI powered arbitrage platform built on SEI",
  // change the logo here
  icons: "/images/seitrage_logo.svg",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const marvinVisionsBig = localFont({
  src: [
    {
      path: "../public/fonts/MarvinVisionsBig-Bold.woff2",
      weight: "400", // adjust if you have other weights
      style: "normal",
    },
  ],
  variable: "--font-marvin", // creates a CSS variable for the font
});

const bebasNeue = localFont({
  src: [
    {
      path: "../public/fonts/BebasNeue-Regular.woff",
      weight: "400", // adjust if you have other weights
      style: "normal",
    },
  ],
  variable: "--font-bebas", // creates a CSS variable for the font
});

const montRegular = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-Regular.woff",
      style: "normal",
    },
  ],
  variable: "--font-montRegular", // creates a CSS variable for the font
});

// Italic
export const montItalic = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-Italic.woff",
      style: "italic",
      weight: "400",
    },
  ],
  variable: "--font-montItalic",
});

// Medium
export const montMedium = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-Medium.woff",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-montMedium",
});

// Medium Italic
export const montMediumItalic = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-MediumItalic.woff",
      style: "italic",
      weight: "500",
    },
  ],
  variable: "--font-montMediumItalic",
});

// Light
export const montLight = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-Light.woff",
      style: "normal",
      weight: "300",
    },
  ],
  variable: "--font-montLight",
});

// Light Italic
export const montLightItalic = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-LightItalic.woff",
      style: "italic",
      weight: "300",
    },
  ],
  variable: "--font-montLightItalic",
});

// Bold
export const montBold = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-Bold.woff",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-montBold",
});

// Bold Italic
export const montBoldItalic = localFont({
  src: [
    {
      path: "../public/fonts/NeueMontreal-BoldItalic.woff",
      style: "italic",
      weight: "700",
    },
  ],
  variable: "--font-montBoldItalic",
});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
                  ${marvinVisionsBig.variable} 
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
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
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
