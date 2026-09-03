"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Currency, Locale } from "@/lib/types";
import { pathFor, switchLocalePath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { OutlinedButton } from "@/components/ui/OutlinedButton";
import { useCurrency } from "@/lib/currency-context";

export function SiteHeader({ locale, dark = false }: { locale: Locale; dark?: boolean }) {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const tone = dark ? "text-highlighter-mint" : "text-forest-charcoal";
  const links = [
    { href: pathFor(locale, "/destinations"), label: t("navDestinations", locale) },
    { href: pathFor(locale, "/stories"), label: t("navStories", locale) },
    { href: pathFor(locale, "/trips"), label: t("navTrips", locale) },
    { href: pathFor(locale, "/guides"), label: t("navGuides", locale) },
    { href: pathFor(locale, "/bookmarks"), label: t("navBookmarks", locale) },
    { href: pathFor(locale, "/search"), label: t("navSearch", locale) },
  ];

  return (
    <header className={`relative z-30 flex items-start justify-between gap-6 px-6 py-6 md:px-12 ${tone}`}>
      <Link href={pathFor(locale, "/")} className="font-display text-[40px] leading-[0.9]">
        Sahani.KE
      </Link>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <nav className="hidden items-center gap-4 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="caption">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="caption flex items-center gap-2">
          <Link href={switchLocalePath(pathname, "en")} hrefLang="en">
            EN
          </Link>
          <span>·</span>
          <Link href={switchLocalePath(pathname, "ar")} hrefLang="ar">
            AR
          </Link>
          <span className="mx-1">/</span>
          {(["USD", "KES"] as Currency[]).map((c, i) => (
            <span key={c}>
              {i > 0 ? <span> · </span> : null}
              <button type="button" onClick={() => setCurrency(c)} className={currency === c ? "font-bold" : ""}>
                {c}
              </button>
            </span>
          ))}
        </div>
        <button type="button" className="outlined-btn lg:hidden" onClick={() => setOpen((v) => !v)}>
          Menu
        </button>
        <OutlinedButton href={`${pathFor(locale, "/")}#atlas`}>{t("navAtlas", locale)}</OutlinedButton>
      </div>
      {open ? (
        <nav className="absolute top-full right-6 left-6 z-40 border border-current bg-topo-gray p-4 text-forest-charcoal lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="caption block py-2">
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
