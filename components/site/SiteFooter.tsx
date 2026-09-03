import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/copy";
import { pathFor } from "@/lib/i18n";
import { localize } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({
  locale,
  settings,
  dark = true,
}: {
  locale: Locale;
  settings: SiteSettings;
  dark?: boolean;
}) {
  return (
    <footer
      className={`${dark ? "section-dark" : "section-light"} px-6 py-16 md:px-12 md:py-[70px]`}
    >
      <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="font-display text-[40px] md:text-[48px]">{t("aboutTitle", locale)}</p>
          <p className="mt-6 text-[16px] leading-[1.2] normal-case tracking-[-0.01em]">
            {localize(settings.bio, locale)}
          </p>
          <div className="mt-6 flex gap-4 caption">
            <a href={settings.social.instagram} className="font-times inline-link lowercase">
              Instagram
            </a>
            <a href={settings.social.x} className="font-times inline-link lowercase">
              X
            </a>
            <a href={settings.social.pinterest} className="font-times inline-link lowercase">
              Pinterest
            </a>
          </div>
        </div>
        <div className="caption text-end md:me-[80px] md:mb-4">
          <p>{t("footerLine1", locale)}</p>
          <p className="mt-2">{t("footerLine2", locale)}</p>
          <p className="mt-2">{t("footerLine3", locale)}</p>
          <p className="mt-6">
            <Link href={pathFor(locale, "/search")} className="underline">
              {t("navSearch", locale)}
            </Link>
            {" · "}
            <Link href="/dashboard" className="underline">
              Desk
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
