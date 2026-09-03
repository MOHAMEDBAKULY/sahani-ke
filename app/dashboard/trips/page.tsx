import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";

export default async function TripsAdmin() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const trips = loadStore().trips;
  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Trips</h1>
      <ul className="mt-8 flex flex-col gap-4">
        {trips.map((t) => (
          <li key={t._id} className="border border-forest-charcoal p-4">
            <p className="caption">{t.status}</p>
            <p className="font-display text-[40px] leading-[0.9]">{t.title.en}</p>
            <Link href={`/en/trips/${t.slug}`} className="caption underline">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
