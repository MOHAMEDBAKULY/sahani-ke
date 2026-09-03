import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { TripRouteMap } from "@/components/atlas/TripRouteMap";
import { getTripBySlug, loadStore } from "@/lib/cms";
import { formatDate, isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip || !isLocale(locale)) return {};
  return { title: localize(trip.title, locale), description: localize(trip.description, locale) };
}

export default async function TripDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();
  const store = loadStore();

  return (
    <>
      <section className="relative min-h-[60vh] bg-carbon-ink text-highlighter-mint">
        <Image src={trip.coverImage} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-carbon-ink/45" />
        <div className="relative z-10 flex min-h-[60vh] flex-col">
          <SiteHeader locale={locale} dark />
          <div className="mt-auto px-6 pb-10 md:px-12">
            <p className="caption">
              {formatDate(trip.startDate, locale)} — {formatDate(trip.endDate, locale)}
            </p>
            <h1 className="font-display mt-3 text-[48px] leading-[0.9] md:text-[clamp(48px,7vw,120px)]">
              {localize(trip.title, locale)}
            </h1>
          </div>
        </div>
      </section>
      <section className="section-light px-6 py-[67px] md:px-12">
        <p className="max-w-2xl text-[16px] normal-case">{localize(trip.description, locale)}</p>
        <h2 className="font-display mt-12 text-[40px]">{t("timeline", locale)}</h2>
      </section>
      <TripRouteMap trip={trip} locale={locale} />
      <section className="section-light px-6 py-[67px] md:px-12">
        <h2 className="font-display text-[40px]">{t("navStories", locale)}</h2>
        <ul className="mt-6 flex flex-col gap-4">
          {trip.stories.map((s) => (
            <li key={s._id}>
              <Link href={pathFor(locale, `/stories/${s.slug}`)} className="inline-link">
                {localize(s.title, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
