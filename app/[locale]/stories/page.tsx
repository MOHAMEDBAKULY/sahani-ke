import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { getPublishedStories, loadStore } from "@/lib/cms";
import { isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";

export const metadata: Metadata = { title: "Stories" };

export default async function StoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const store = loadStore();
  const stories = getPublishedStories(store);

  return (
    <>
      <div className="section-light">
        <SiteHeader locale={locale} />
        <div className="px-6 py-[67px] md:px-12">
          <h1 className="font-display text-[48px] leading-[0.9]">{t("navStories", locale)}</h1>
          <div className="mt-12 flex flex-col gap-14">
            {stories.map((story) => (
              <article key={story._id} className="grid gap-6 md:grid-cols-[280px_1fr]">
                <Image src={story.heroMedia.url} alt="" width={560} height={380} className="aspect-[3/2] w-full object-cover" />
                <div>
                  <p className="caption">
                    {story.category} · {localize(story.destination.name, locale)} · {story.readingTimeMinutes} min
                  </p>
                  <h2 className="font-display mt-2 text-[40px] leading-[0.9]">
                    <Link href={pathFor(locale, `/stories/${story.slug}`)}>{localize(story.title, locale)}</Link>
                  </h2>
                  <p className="mt-4 text-[16px] normal-case">{localize(story.excerpt, locale)}</p>
                  <Link href={pathFor(locale, `/stories/${story.slug}`)} className="inline-link mt-4 inline-block">
                    {t("readStory", locale)}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
