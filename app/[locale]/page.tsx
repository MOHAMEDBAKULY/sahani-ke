import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterForm, NewsletterModal } from "@/components/site/NewsletterForm";
import { AtlasSection } from "@/components/atlas/AtlasSection";
import { TiltedPhotos } from "@/components/ui/TiltedPhotos";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { HatIcon, HouseIcon, IconBadge } from "@/components/ui/IconBadge";
import { OutlinedButton } from "@/components/ui/OutlinedButton";
import {
  getDestinations,
  getPublishedStories,
  getPublishedTrips,
  loadStore,
} from "@/lib/cms";
import { COLLECTIONS } from "@/data/seed";
import { isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";
import type { MapPoint, MapRoute } from "@/components/atlas/types";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const store = loadStore();
  const stories = getPublishedStories(store);
  const destinations = getDestinations(store);
  const trips = getPublishedTrips(store);
  const featured = trips[0];
  const featuredStory = stories[0];

  const points: MapPoint[] = destinations.map((d) => {
    const related = stories.filter((s) => s.destinationId === d._id);
    return {
      id: d._id,
      slug: d.slug,
      name: d.name,
      countryName: d.country.name,
      countrySlug: d.country.slug,
      coverImage: d.coverImage,
      storyCount: related.length,
      latitude: d.coordinates.latitude,
      longitude: d.coordinates.longitude,
      categories: [...new Set(related.map((s) => s.category))],
    };
  });

  const routes: MapRoute[] = trips.map((trip) => ({
    id: trip._id,
    slug: trip.slug,
    title: trip.title,
    points: trip.route.map((p) => ({ latitude: p.latitude, longitude: p.longitude })),
  }));

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-carbon-ink text-highlighter-mint">
        <Image
          src={store.settings.seo.defaultTitle.en ? destinations[0].coverImage : destinations[0].coverImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-carbon-ink/35" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader locale={locale} dark />
          <div className="mt-auto px-6 pb-10 md:px-12">
            <p className="caption max-w-md">{t("heroKicker", locale)}</p>
            <h1 className="display-line mt-4">SAHANI</h1>
            <p className="caption mt-4 max-w-lg">{t("heroByline", locale)}</p>
            <div className="mt-8">
              <ScrollCue />
            </div>
          </div>
        </div>
      </section>

      <section className="section-light px-6 py-[67px] md:px-12">
        <p className="font-display text-[40px] md:text-[48px]">{localize(store.settings.tagline, locale)}</p>
        <p className="mt-6 max-w-2xl text-[16px] normal-case">{localize(store.settings.bio, locale)}</p>
      </section>

      <AtlasSection locale={locale} countries={store.countries} points={points} routes={routes} />

      <section className="section-dark overflow-hidden px-6 py-[70px] md:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-display text-[48px] leading-[0.9]">{t("featuredDestinations", locale)}</h2>
          <IconBadge>
            <HatIcon />
          </IconBadge>
        </div>
        <TiltedPhotos
          images={destinations.slice(0, 4).map((d) => d.coverImage)}
          alts={destinations.slice(0, 4).map((d) => localize(d.name, locale))}
        />
        <div className="mt-16 flex flex-wrap gap-8">
          {destinations.slice(0, 6).map((d) => (
            <Link key={d._id} href={pathFor(locale, `/destinations/${d.slug}`)} className="caption underline">
              {localize(d.name, locale)} · {localize(d.country.name, locale)}
            </Link>
          ))}
        </div>
      </section>

      {featured && featuredStory ? (
        <section className="section-light grid gap-10 px-6 py-[67px] md:grid-cols-2 md:px-12">
          <div>
            <p className="caption">{t("featuredJourney", locale)}</p>
            <h2 className="font-display mt-4 text-[48px] leading-[0.9]">{localize(featured.title, locale)}</h2>
            <p className="mt-6 max-w-xl text-[16px] normal-case">{localize(featured.description, locale)}</p>
            <div className="mt-8">
              <OutlinedButton href={pathFor(locale, `/trips/${featured.slug}`)}>
                {t("exploreJourney", locale)}
              </OutlinedButton>
            </div>
          </div>
          <Link href={pathFor(locale, `/stories/${featuredStory.slug}`)} className="block">
            <Image
              src={featuredStory.heroMedia.url}
              alt={localize(featuredStory.title, locale)}
              width={1200}
              height={800}
              className="aspect-[4/3] w-full object-cover"
            />
            <p className="caption mt-4">{localize(featuredStory.title, locale)}</p>
          </Link>
        </section>
      ) : null}

      <section className="section-light border-t border-forest-charcoal px-6 py-[67px] md:px-12">
        <h2 className="font-display text-[48px] leading-[0.9]">{t("latestStories", locale)}</h2>
        <div className="mt-10 flex flex-col gap-10">
          {stories.slice(0, 6).map((story) => (
            <article key={story._id} className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
              <Image
                src={story.heroMedia.url}
                alt=""
                width={440}
                height={300}
                className="aspect-[3/2] w-full object-cover"
              />
              <div>
                <p className="caption">
                  {story.category} · {localize(story.destination.name, locale)}
                </p>
                <h3 className="font-display mt-2 text-[40px] leading-[0.9]">
                  <Link href={pathFor(locale, `/stories/${story.slug}`)}>{localize(story.title, locale)}</Link>
                </h3>
                <p className="mt-3 max-w-2xl text-[16px] normal-case">{localize(story.excerpt, locale)}</p>
                <Link href={pathFor(locale, `/stories/${story.slug}`)} className="inline-link mt-4 inline-block">
                  {t("readStory", locale)}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-dark px-6 py-[70px] md:px-12">
        <div className="mb-10 flex items-center gap-4">
          <IconBadge>
            <HouseIcon />
          </IconBadge>
          <h2 className="font-display text-[48px] leading-[0.9]">{t("collections", locale)}</h2>
        </div>
        <div className="flex flex-col gap-12 md:flex-row">
          {COLLECTIONS.map((col, i) => {
            const dests = destinations.filter((d) => col.destinationIds.includes(d._id));
            return (
              <div key={col.slug} className={i === 1 ? "md:mt-16" : ""}>
                <p className="font-display text-[40px]">{localize(col.title, locale)}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {dests.map((d) => (
                    <li key={d._id}>
                      <Link href={pathFor(locale, `/destinations/${d.slug}`)} className="caption underline">
                        {localize(d.name, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-light px-6 py-[67px] md:px-12">
        <div className="max-w-lg">
          <h2 className="font-display text-[48px] leading-[0.9]">{t("newsletterTitle", locale)}</h2>
          <p className="mt-4 text-[16px] normal-case">{t("newsletterBody", locale)}</p>
          <div className="mt-8">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
