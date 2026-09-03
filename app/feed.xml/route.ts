import { getPublishedStories, loadStore } from "@/lib/cms";
import { localize } from "@/lib/i18n";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const stories = getPublishedStories();
  const settings = loadStore().settings;
  const items = stories
    .map((s) => {
      const title = localize(s.title, "en");
      const excerpt = localize(s.excerpt, "en");
      return `<item>
        <title><![CDATA[${title}]]></title>
        <link>${base}/en/stories/${s.slug}</link>
        <guid>${base}/en/stories/${s.slug}</guid>
        <pubDate>${new Date(s.publishedAt).toUTCString()}</pubDate>
        <description><![CDATA[${excerpt}]]></description>
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${settings.seo.defaultTitle.en}</title>
      <link>${base}</link>
      <description>${settings.seo.defaultDescription.en}</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
