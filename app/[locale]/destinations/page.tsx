import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { getDestinations, loadStore } from "@/lib/cms";
import { isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "الوجهات" : "Destinations" };
}

export default async function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const store = loadStore();
  const destinations = getDestinations(store);

  return (
    <>
      <div className="section-light">
        <SiteHeader locale={locale} />
        <div className="px-6 py-[67px] md:px-12">
          <h1 className="font-display text-[48px] leading-[0.9]">{t("navDestinations", locale)}</h1>
          <div className="mt-12 flex flex-col gap-16">
            {destinations.map((d, i) => (
              <article key={d._id} className={`grid gap-8 md:grid-cols-2 ${i % 2 ? "md:[&>a]:order-2" : ""}`}>
                <Link href={pathFor(locale, `/destinations/${d.slug}`)}>
                  <Image src={d.coverImage} alt={localize(d.name, locale)} width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
                </Link>
                <div className="flex flex-col justify-end">
                  <p className="caption">{localize(d.country.name, locale)} · {d.region}</p>
                  <h2 className="font-display mt-3 text-[40px] leading-[0.9]">
                    <Link href={pathFor(locale, `/destinations/${d.slug}`)}>{localize(d.name, locale)}</Link>
                  </h2>
                  <p className="mt-4 text-[16px] normal-case">{localize(d.description, locale)}</p>
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
