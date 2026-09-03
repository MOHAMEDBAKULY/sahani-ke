"use client";

import Link from "next/link";
import type { Locale, Localized } from "@/lib/types";
import { localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { useBookmarks } from "@/lib/bookmarks";

type StoryLite = {
  _id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  hero: string;
  destination: Localized;
};

export function BookmarksList({ locale, stories }: { locale: Locale; stories: StoryLite[] }) {
  const { ids } = useBookmarks();
  const saved = stories.filter((s) => ids.includes(s._id));

  if (!saved.length) {
    return <p className="text-[16px] normal-case">{t("emptyBookmarks", locale)}</p>;
  }

  return (
    <ul className="flex flex-col gap-8">
      {saved.map((s) => (
        <li key={s._id}>
          <p className="caption">{localize(s.destination, locale)}</p>
          <Link href={pathFor(locale, `/stories/${s.slug}`)} className="font-display text-[40px] leading-[0.9]">
            {localize(s.title, locale)}
          </Link>
          <p className="mt-2 max-w-xl text-[16px] normal-case">{localize(s.excerpt, locale)}</p>
        </li>
      ))}
    </ul>
  );
}
