import { NextRequest, NextResponse } from "next/server";
import { getPublishedStories, getStoryBySlug } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") || "en";
  const locale = isLocale(lang) ? lang : "en";
  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const limit = Number(request.nextUrl.searchParams.get("limit") || "12");
  const all = getPublishedStories();
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit).map((s) => ({
    slug: s.slug,
    title: s.title[locale],
    excerpt: s.excerpt[locale],
    category: s.category,
    publishedAt: s.publishedAt,
    destination: s.destination.name[locale],
    hero: s.heroMedia.url,
  }));
  return NextResponse.json({ items, total: all.length, page, limit });
}
