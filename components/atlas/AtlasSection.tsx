"use client";

import { useMemo, useState } from "react";
import type { Country, Locale, StoryCategory } from "@/lib/types";
import { localize } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { AtlasMap } from "./AtlasMap";
import { MapboxAtlas } from "./MapboxAtlas";
import type { MapPoint, MapRoute } from "./types";

const CATEGORIES: StoryCategory[] = [
  "Luxury Safari",
  "Coastal Retreat",
  "Cultural Discovery",
  "Urban Editorial",
  "Culinary Journey",
];

export function AtlasSection({
  locale,
  countries,
  points,
  routes,
}: {
  locale: Locale;
  countries: Country[];
  points: MapPoint[];
  routes: MapRoute[];
}) {
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    return points.filter((p) => {
      if (country && p.countrySlug !== country) return false;
      if (category && !p.categories.includes(category as StoryCategory)) return false;
      return true;
    });
  }, [points, country, category]);

  const shownRoutes = type === "destinations" ? [] : routes;

  return (
    <section id="atlas" className="section-dark">
      <div className="flex flex-wrap items-end gap-6 border-b border-highlighter-mint px-6 py-6 md:px-12">
        <label className="flex flex-col gap-2">
          <span className="caption">{t("filterCountry", locale)}</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="caption min-w-[140px]">
            <option value="">{t("allCountries", locale)}</option>
            {countries.map((c) => (
              <option key={c._id} value={c.slug}>
                {localize(c.name, locale)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="caption">{t("filterType", locale)}</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="caption min-w-[140px]">
            <option value="">{t("filterAll", locale)}</option>
            <option value="stories">{t("navStories", locale)}</option>
            <option value="trips">{t("navTrips", locale)}</option>
            <option value="guides">{t("navGuides", locale)}</option>
            <option value="destinations">{t("navDestinations", locale)}</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="caption">{t("filterCategory", locale)}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="caption min-w-[160px]">
            <option value="">{t("filterAll", locale)}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
        <MapboxAtlas
          token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          points={filtered}
          locale={locale}
        />
      ) : (
        <AtlasMap locale={locale} countries={countries} points={filtered} routes={shownRoutes} />
      )}
    </section>
  );
}
