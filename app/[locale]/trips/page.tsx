import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { getPublishedTrips, loadStore } from "@/lib/cms";
import { formatDate, isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";

export default async function TripsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const store = loadStore();
  const trips = getPublishedTrips(store);

  return (
    <>
      <div className="section-light">
        <SiteHeader locale={locale} />
        <div className="px-6 py-[67px] md:px-12">
          <h1 className="font-display text-[48px] leading-[0.9]">{t("navTrips", locale)}</h1>
          <div className="mt-12 flex flex-col gap-14">
            {trips.map((trip) => (
              <article key={trip._id} className="grid gap-6 md:grid-cols-2">
                <Image src={trip.coverImage} alt="" width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
                <div className="flex flex-col justify-end">
                  <p className="caption">
                    {formatDate(trip.startDate, locale)} — {formatDate(trip.endDate, locale)}
                  </p>
                  <h2 className="font-display mt-2 text-[40px] leading-[0.9]">
                    <Link href={pathFor(locale, `/trips/${trip.slug}`)}>{localize(trip.title, locale)}</Link>
                  </h2>
                  <p className="mt-4 text-[16px] normal-case">{localize(trip.description, locale)}</p>
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
