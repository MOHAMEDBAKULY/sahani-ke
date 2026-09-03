import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { PortableBody } from "@/components/content/PortableBody";
import { BookmarkButton } from "@/components/content/BookmarkButton";
import { ShareToolbar } from "@/components/content/ShareToolbar";
import { GalleryLightbox } from "@/components/content/GalleryLightbox";
import { AudioPlayer, VideoEmbed } from "@/components/content/Media";
import { PracticalPanel } from "@/components/content/PracticalPanel";
import { getStoryBySlug, loadStore, storiesForDestination } from "@/lib/cms";
import { formatDate, isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: localize(story.title, locale),
    description: localize(story.seo.metaDescription, locale),
    openGraph: { images: [story.seo.shareImage], type: "article" },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const story = getStoryBySlug(slug);
  if (!story) notFound();
  const store = loadStore();
  const related = storiesForDestination(story.destinationId).filter((s) => s._id !== story._id).slice(0, 3);

  return (
    <>
      <section className="relative min-h-[80vh] bg-carbon-ink text-highlighter-mint">
        <Image src={story.heroMedia.url} alt={story.heroMedia.caption || ""} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-carbon-ink/40" />
        <div className="relative z-10 flex min-h-[80vh] flex-col">
          <SiteHeader locale={locale} dark />
          <div className="mt-auto px-6 pb-10 md:px-12">
            <p className="caption">
              {story.category} · {localize(story.destination.name, locale)} · {formatDate(story.publishedAt, locale)}
            </p>
            <h1 className="mt-4 max-w-5xl font-display text-[48px] leading-[0.9] md:text-[clamp(48px,8vw,120px)]">
              {localize(story.title, locale)}
            </h1>
          </div>
        </div>
      </section>
      <article className="section-light px-6 py-[67px] md:px-12">
        <div className="mb-10 flex flex-wrap gap-3">
          <BookmarkButton id={story._id} locale={locale} />
          <ShareToolbar title={localize(story.title, locale)} locale={locale} />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="mb-10 max-w-2xl text-[16px] normal-case">{localize(story.excerpt, locale)}</p>
            <PortableBody blocks={localize(story.content, locale)} locale={locale} />
            {story.audioUrl ? (
              <div className="mt-12">
                <AudioPlayer src={story.audioUrl} locale={locale} />
              </div>
            ) : null}
            {story.videoEmbedUrl ? (
              <div className="mt-12">
                <VideoEmbed url={story.videoEmbedUrl} />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-6">
            <PracticalPanel info={story.destination.practicalInfo} locale={locale} />
            <Link href={pathFor(locale, `/destinations/${story.destination.slug}`)} className="inline-link">
              {t("viewDestination", locale)}
            </Link>
            {story.trip ? (
              <Link href={pathFor(locale, `/trips/${story.trip.slug}`)} className="inline-link">
                {t("exploreJourney", locale)}
              </Link>
            ) : null}
          </div>
        </div>
      </article>
      <GalleryLightbox images={story.gallery} locale={locale} />
      {related.length ? (
        <section className="section-dark px-6 py-[67px] md:px-12">
          <h2 className="font-display text-[48px] leading-[0.9]">{t("related", locale)}</h2>
          <ul className="mt-8 flex flex-col gap-4">
            {related.map((s) => (
              <li key={s._id}>
                <Link href={pathFor(locale, `/stories/${s.slug}`)} className="caption underline">
                  {localize(s.title, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
