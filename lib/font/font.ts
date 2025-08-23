import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

// Google font
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Local fonts
export const marvinVisionsBig = localFont({
  src: [{ path: "../../public/fonts/MarvinVisionsBig-Bold.woff2", weight: "400", style: "normal" }],
  variable: "--font-marvin",
});

export const orborn = localFont({
  src: [{ path: "../../public/fonts/Orborn.woff", weight: "400", style: "normal" }],
  variable: "--font-orborn",
});

export const bebasNeue = localFont({
  src: [{ path: "../../public/fonts/BebasNeue-Regular.woff", weight: "400", style: "normal" }],
  variable: "--font-bebas",
});

export const montRegular = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-Regular.woff", style: "normal" }],
  variable: "--font-montRegular",
});

export const montItalic = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-Italic.woff", style: "italic", weight: "400" }],
  variable: "--font-montItalic",
});

export const montMedium = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-Medium.woff", style: "normal", weight: "500" }],
  variable: "--font-montMedium",
});

export const montMediumItalic = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-MediumItalic.woff", style: "italic", weight: "500" }],
  variable: "--font-montMediumItalic",
});

export const montLight = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-Light.woff", style: "normal", weight: "300" }],
  variable: "--font-montLight",
});

export const montLightItalic = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-LightItalic.woff", style: "italic", weight: "300" }],
  variable: "--font-montLightItalic",
});

export const montBold = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-Bold.woff", style: "normal", weight: "700" }],
  variable: "--font-montBold",
});

export const montBoldItalic = localFont({
  src: [{ path: "../../public/fonts/NeueMontreal-BoldItalic.woff", style: "italic", weight: "700" }],
  variable: "--font-montBoldItalic",
});
