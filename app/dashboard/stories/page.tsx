import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";

export default async function StoriesAdmin() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const stories = loadStore().stories;
  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Stories</h1>
      <ul className="mt-8 flex flex-col gap-4">
        {stories.map((s) => (
          <li key={s._id} className="border border-forest-charcoal p-4">
            <p className="caption">{s.status} · {s.category}</p>
            <Link href={`/dashboard/stories/${s._id}`} className="font-display text-[40px] leading-[0.9]">
              {s.title.en}
            </Link>
            <p className="caption mt-2">
              {s.status === "published" ? (
                <Link href={`/en/stories/${s.slug}`} className="underline">
                  Public
                </Link>
              ) : (
                <Link href={`/dashboard/preview/stories/${s.slug}`} className="underline">
                  Preview
                </Link>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
