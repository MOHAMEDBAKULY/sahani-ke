import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsletterModal } from "@/components/site/NewsletterForm";
import { PortableBody } from "@/components/content/PortableBody";
import { PracticalPanel } from "@/components/content/PracticalPanel";
import { getGuideBySlug, loadStore } from "@/lib/cms";
import { isLocale, localize, pathFor } from "@/lib/i18n";
import { OutlinedButton } from "@/components/ui/OutlinedButton";
import { t } from "@/lib/copy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide || !isLocale(locale)) return {};
  return { title: localize(guide.title, locale), description: localize(guide.excerpt, locale) };
}

export default async function GuideDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  const store = loadStore();

  return (
    <>
      <section className="relative min-h-[55vh] bg-carbon-ink text-highlighter-mint">
        <Image src={guide.coverImage} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-carbon-ink/40" />
        <div className="relative z-10 flex min-h-[55vh] flex-col">
          <SiteHeader locale={locale} dark />
          <div className="mt-auto px-6 pb-10 md:px-12">
            <p className="caption">{localize(guide.destination.name, locale)}</p>
            <h1 className="font-display mt-3 text-[48px] leading-[0.9]">{localize(guide.title, locale)}</h1>
          </div>
        </div>
      </section>
      <section className="section-light grid gap-12 px-6 py-[67px] md:grid-cols-[1fr_280px] md:px-12">
        <div>
          <p className="mb-8 max-w-2xl text-[16px] normal-case">{localize(guide.excerpt, locale)}</p>
          <PortableBody blocks={localize(guide.content, locale)} locale={locale} />
          <div className="mt-10">
            <OutlinedButton href={pathFor(locale, `/destinations/${guide.destination.slug}`)}>
              {t("viewDestination", locale)}
            </OutlinedButton>
          </div>
        </div>
        <PracticalPanel info={guide.destination.practicalInfo} locale={locale} />
      </section>
      <SiteFooter locale={locale} settings={store.settings} />
      <NewsletterModal locale={locale} />
    </>
  );
}
