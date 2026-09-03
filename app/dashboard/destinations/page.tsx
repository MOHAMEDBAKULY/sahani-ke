import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getDestinations } from "@/lib/cms";

export default async function DestinationsAdmin() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const destinations = getDestinations();
  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Destinations</h1>
      <ul className="mt-8 flex flex-col gap-3">
        {destinations.map((d) => (
          <li key={d._id} className="caption">
            {d.name.en} · {d.country.name.en} · {d.coordinates.latitude.toFixed(2)}, {d.coordinates.longitude.toFixed(2)} ·{" "}
            <Link href={`/en/destinations/${d.slug}`} className="underline">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
