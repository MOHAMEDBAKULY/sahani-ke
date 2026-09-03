import type { Metadata } from "next";
import { headers } from "next/headers";
import { displayFont, monoFont, arabicFont } from "@/lib/fonts";
import { Providers } from "@/components/site/Providers";
import { loadStore } from "@/lib/cms";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = loadStore().settings;
  return {
    title: {
      default: settings.seo.defaultTitle.en,
      template: `%s — Sahani.KE`,
    },
    description: settings.seo.defaultDescription.en,
    openGraph: {
      siteName: "Sahani.KE",
      type: "website",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-locale") || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html
      lang={locale}
      dir={dir}
      className={`${displayFont.variable} ${monoFont.variable} ${arabicFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
