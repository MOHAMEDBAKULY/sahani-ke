import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { SearchClient } from "@/components/content/SearchClient";
import { loadStore } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { t } from "@/lib/copy";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const { q = "" } = await searchParams;
  const store = loadStore();

  return (
    <>
      <div className="section-light">
        <SiteHeader locale={locale} />
        <div className="px-6 py-[67px] md:px-12">
          <h1 className="font-display text-[48px] leading-[0.9]">{t("navSearch", locale)}</h1>
          <div className="mt-10">
            <SearchClient locale={locale} initialQuery={q} />
          </div>
        </div>
      </div>
      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
