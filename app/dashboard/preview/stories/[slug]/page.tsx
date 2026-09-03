import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getStoryBySlug } from "@/lib/cms";
import { PortableBody } from "@/components/content/PortableBody";
import { localize } from "@/lib/i18n";
import Link from "next/link";

export default async function PreviewStory({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const { slug } = await params;
  const story = getStoryBySlug(slug, true);
  if (!story) notFound();
  return (
    <div>
      <p className="caption">Preview · {story.status}</p>
      <h1 className="font-display mt-4 text-[48px] leading-[0.9]">{story.title.en}</h1>
      <p className="mt-4 max-w-2xl text-[16px] normal-case">{story.excerpt.en}</p>
      <div className="mt-8">
        <PortableBody blocks={localize(story.content, "en")} />
      </div>
      <Link href="/dashboard/stories" className="caption mt-10 inline-block underline">
        Back
      </Link>
    </div>
  );
}
