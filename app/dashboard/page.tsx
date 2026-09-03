import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { analytics, loadStore } from "@/lib/cms";
import Link from "next/link";

export default async function DashboardHome() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const stats = analytics();
  const store = loadStore();

  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Overview</h1>
      <p className="caption mt-3">{store.settings.name} · {store.settings.wordmark}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Stat label="Published" value={stats.stories.published} />
        <Stat label="Draft" value={stats.stories.draft} />
        <Stat label="Scheduled" value={stats.stories.scheduled} />
        <Stat label="Subscribers" value={stats.subscribers} />
        <Stat label="Destinations" value={stats.destinations} />
        <Stat label="Trips" value={stats.trips} />
      </div>
      <div className="mt-12">
        <p className="caption mb-4">Story statuses</p>
        <ul className="flex flex-col gap-2">
          {store.stories.map((s) => (
            <li key={s._id} className="caption">
              <Link href={`/dashboard/stories/${s._id}`} className="underline">
                {s.title.en}
              </Link>{" "}
              · {s.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-forest-charcoal p-4">
      <p className="caption">{label}</p>
      <p className="font-display mt-2 text-[48px] leading-[0.9]">{value}</p>
    </div>
  );
}
