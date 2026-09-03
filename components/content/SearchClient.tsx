"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";

type Hit = { slug: string; title?: { en: string; ar: string }; name?: { en: string; ar: string } };

type Results = {
  stories: Hit[];
  destinations: Hit[];
  trips: Hit[];
  guides: Hit[];
};

export function SearchClient({ locale, initialQuery }: { locale: Locale; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      if (!q.trim()) {
        setResults(null);
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${locale}`);
      setResults((await res.json()) as Results);
    }, 180);
    return () => window.clearTimeout(handle);
  }, [q, locale]);

  const empty =
    results &&
    !results.stories.length &&
    !results.destinations.length &&
    !results.trips.length &&
    !results.guides.length;

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchPlaceholder", locale)}
        className="w-full max-w-xl"
        autoFocus
      />
      {empty ? <p className="mt-8">{t("noResults", locale)}</p> : null}
      {results ? (
        <div className="mt-10 flex flex-col gap-10">
          <Group title={t("navStories", locale)} items={results.stories} href={(s) => pathFor(locale, `/stories/${s.slug}`)} locale={locale} />
          <Group title={t("navDestinations", locale)} items={results.destinations} href={(s) => pathFor(locale, `/destinations/${s.slug}`)} locale={locale} />
          <Group title={t("navTrips", locale)} items={results.trips} href={(s) => pathFor(locale, `/trips/${s.slug}`)} locale={locale} />
          <Group title={t("navGuides", locale)} items={results.guides} href={(s) => pathFor(locale, `/guides/${s.slug}`)} locale={locale} />
        </div>
      ) : null}
    </div>
  );
}

function Group({
  title,
  items,
  href,
  locale,
}: {
  title: string;
  items: Hit[];
  href: (item: Hit) => string;
  locale: Locale;
}) {
  if (!items.length) return null;
  return (
    <section>
      <p className="caption mb-4">{title}</p>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={href(item)} className="inline-link">
              {localize(item.title || item.name || { en: item.slug, ar: item.slug }, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
