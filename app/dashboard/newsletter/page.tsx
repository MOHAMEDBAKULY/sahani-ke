import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";

export default async function NewsletterAdmin() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const subscribers = loadStore().subscribers;
  const csv = ["email,language,status,subscribedAt", ...subscribers.map((s) => `${s.email},${s.language},${s.status},${s.subscribedAt}`)].join("\n");

  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Newsletter</h1>
      <p className="caption mt-3">{subscribers.length} subscribers</p>
      <a
        className="outlined-btn mt-6 inline-flex"
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
        download="sahani-subscribers.csv"
      >
        Export CSV
      </a>
      <ul className="mt-8 flex flex-col gap-2">
        {subscribers.map((s) => (
          <li key={s.id} className="caption">
            {s.email} · {s.language} · {s.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
