import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { getPublishedGuides, loadStore } from "@/lib/cms";
import { isLocale, localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const store = loadStore();
  const guides = getPublishedGuides(store);

  return (
    <>
      <div className="section-light">
        <SiteHeader locale={locale} />
        <div className="px-6 py-[67px] md:px-12">
          <h1 className="font-display text-[48px] leading-[0.9]">{t("navGuides", locale)}</h1>
          <div className="mt-12 flex flex-col gap-12">
            {guides.map((g) => (
              <article key={g._id} className="grid gap-6 md:grid-cols-[240px_1fr]">
                <Image src={g.coverImage} alt="" width={480} height={320} className="aspect-[3/2] w-full object-cover" />
                <div>
                  <p className="caption">{localize(g.destination.name, locale)}</p>
                  <h2 className="font-display mt-2 text-[40px] leading-[0.9]">
                    <Link href={pathFor(locale, `/guides/${g.slug}`)}>{localize(g.title, locale)}</Link>
                  </h2>
                  <p className="mt-3 text-[16px] normal-case">{localize(g.excerpt, locale)}</p>
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
