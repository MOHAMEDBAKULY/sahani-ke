import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { GalleryLightbox } from "@/components/content/GalleryLightbox";
import { PracticalPanel } from "@/components/content/PracticalPanel";
import { AtlasMap } from "@/components/atlas/AtlasMap";
import { getDestinationBySlug, loadStore, storiesForDestination } from "@/lib/cms";
import { isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { OutlinedButton } from "@/components/ui/OutlinedButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest || !isLocale(locale)) return {};
  return {
    title: localize(dest.name, locale),
    description: localize(dest.seo.metaDescription, locale),
    openGraph: { images: [dest.seo.shareImage] },
  };
}

export default async function DestinationDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();
  const store = loadStore();
  const stories = storiesForDestination(dest._id);
  const guides = store.guides.filter((g) => g.destinationId === dest._id && g.status === "published");

  return (
    <>
      <section className="relative min-h-[70vh] bg-carbon-ink text-highlighter-mint">
        <Image src={dest.coverImage} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-carbon-ink/40" />
        <div className="relative z-10 flex min-h-[70vh] flex-col">
          <SiteHeader locale={locale} dark />
          <div className="mt-auto px-6 pb-10 md:px-12">
            <p className="caption">{localize(dest.country.name, locale)}</p>
            <h1 className="display-line mt-2">{localize(dest.name, locale).slice(0, 12)}</h1>
          </div>
        </div>
      </section>
      <section className="section-light grid gap-10 px-6 py-[67px] md:grid-cols-[1.2fr_0.8fr] md:px-12">
        <div>
          <p className="font-display text-[40px] leading-[0.9]">{localize(dest.name, locale)}</p>
          <p className="mt-6 max-w-2xl text-[16px] normal-case">{localize(dest.description, locale)}</p>
          <p className="caption mt-6">{dest.region}</p>
        </div>
        <PracticalPanel info={dest.practicalInfo} locale={locale} />
      </section>
      <AtlasMap
        locale={locale}
        countries={[dest.country]}
        points={[
          {
            id: dest._id,
            slug: dest.slug,
            name: dest.name,
            countryName: dest.country.name,
            countrySlug: dest.country.slug,
            coverImage: dest.coverImage,
            storyCount: stories.length,
            latitude: dest.coordinates.latitude,
            longitude: dest.coordinates.longitude,
            categories: [],
          },
        ]}
        routes={[]}
        highlightId={dest._id}
      />
      <GalleryLightbox images={dest.gallery} locale={locale} />
      <section className="section-light px-6 py-[67px] md:px-12">
        <h2 className="font-display text-[48px] leading-[0.9]">{t("navStories", locale)}</h2>
        <ul className="mt-8 flex flex-col gap-6">
          {stories.map((s) => (
            <li key={s._id}>
              <Link href={pathFor(locale, `/stories/${s.slug}`)} className="inline-link">
                {localize(s.title, locale)}
              </Link>
              <span className="caption ms-3">{s.category}</span>
            </li>
          ))}
        </ul>
        {guides.length ? (
          <div className="mt-12">
            <h2 className="font-display text-[40px]">{t("navGuides", locale)}</h2>
            {guides.map((g) => (
              <OutlinedButton key={g._id} href={pathFor(locale, `/guides/${g.slug}`)} className="mt-4 me-3">
                {localize(g.title, locale)}
              </OutlinedButton>
            ))}
          </div>
        ) : null}
      </section>
      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
