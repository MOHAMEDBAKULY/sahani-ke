import { Bebas_Neue, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";

export const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-f37stout",
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const arabicFont = Noto_Sans_Arabic({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});
