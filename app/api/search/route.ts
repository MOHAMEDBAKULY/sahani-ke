import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/lib/cms";
import { isLocale, localize } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const lang = request.nextUrl.searchParams.get("lang") || "en";
  const locale = isLocale(lang) ? lang : "en";
  const found = searchContent(q, locale);
  return NextResponse.json({
    stories: found.stories.map((s) => ({ slug: s.slug, title: s.title })),
    destinations: found.destinations.map((d) => ({ slug: d.slug, name: d.name })),
    trips: found.trips.map((t) => ({ slug: t.slug, title: t.title })),
    guides: found.guides.map((g) => ({ slug: g.slug, title: g.title })),
    locale,
    q,
    labels: {
      preview: found.stories[0] ? localize(found.stories[0].title, locale) : null,
    },
  });
}
