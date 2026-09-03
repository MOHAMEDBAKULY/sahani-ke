import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";
import { TranslationDesk } from "@/components/dashboard/TranslationDesk";

export default async function TranslationsPage() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const stories = loadStore().stories.map((s) => ({
    _id: s._id,
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt,
  }));
  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Translations</h1>
      <p className="caption mt-3">Side-by-side English and Arabic review</p>
      <div className="mt-8">
        <TranslationDesk stories={stories} />
      </div>
    </div>
  );
}
