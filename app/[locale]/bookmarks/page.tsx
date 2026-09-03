import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { BookmarksList } from "@/components/content/BookmarksList";
import { getPublishedStories, loadStore } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { t } from "@/lib/copy";

export default async function BookmarksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const store = loadStore();
  const stories = getPublishedStories(store).map((s) => ({
    _id: s._id,
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt,
    hero: s.heroMedia.url,
    destination: s.destination.name,
  }));

  return (
    <>
      <div className="section-light">
        <SiteHeader locale={locale} />
        <div className="px-6 py-[67px] md:px-12">
          <h1 className="font-display text-[48px] leading-[0.9]">{t("navBookmarks", locale)}</h1>
          <div className="mt-10">
            <BookmarksList locale={locale} stories={stories} />
          </div>
        </div>
      </div>
      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
