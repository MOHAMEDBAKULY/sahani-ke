"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/copy";
import { useBookmarks } from "@/lib/bookmarks";

export function BookmarkButton({ id, locale }: { id: string; locale: Locale }) {
  const { has, toggle } = useBookmarks();
  const saved = has(id);
  return (
    <button type="button" className="outlined-btn" onClick={() => toggle(id)} aria-pressed={saved}>
      {saved ? t("bookmarked", locale) : t("bookmark", locale)}
    </button>
  );
}
