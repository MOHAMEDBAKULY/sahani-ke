import type { MetadataRoute } from "next";
import { getDestinations, getPublishedGuides, getPublishedStories, getPublishedTrips } from "@/lib/cms";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locales = ["en", "ar"] as const;
  const staticPaths = ["", "/destinations", "/stories", "/trips", "/guides", "/bookmarks", "/search"];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({ url: `${base}/${locale}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 });
    }
    for (const s of getPublishedStories()) {
      entries.push({ url: `${base}/${locale}/stories/${s.slug}`, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const d of getDestinations()) {
      entries.push({ url: `${base}/${locale}/destinations/${d.slug}`, changeFrequency: "monthly", priority: 0.7 });
    }
    for (const t of getPublishedTrips()) {
      entries.push({ url: `${base}/${locale}/trips/${t.slug}`, changeFrequency: "monthly", priority: 0.7 });
    }
    for (const g of getPublishedGuides()) {
      entries.push({ url: `${base}/${locale}/guides/${g.slug}`, changeFrequency: "monthly", priority: 0.6 });
    }
  }
  return entries;
}
