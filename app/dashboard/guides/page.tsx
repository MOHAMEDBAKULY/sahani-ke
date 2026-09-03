import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";

export default async function GuidesAdmin() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const guides = loadStore().guides;
  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Guides</h1>
      <ul className="mt-8 flex flex-col gap-3">
        {guides.map((g) => (
          <li key={g._id}>
            <Link href={`/en/guides/${g.slug}`} className="caption underline">
              {g.title.en}
            </Link>
            <span className="caption"> · {g.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
