import { redirect } from "next/navigation";
import Image from "next/image";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";

export default async function MediaAdmin() {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const media = loadStore().media;
  return (
    <div>
      <h1 className="font-display text-[48px] leading-[0.9]">Media library</h1>
      <div className="mt-8 flex flex-wrap gap-6">
        {media.map((m) => (
          <figure key={m._id} className="w-40">
            {m.kind === "image" ? (
              <Image src={m.url} alt={m.alt.en} width={320} height={220} className="aspect-[3/2] w-full object-cover" />
            ) : (
              <p className="caption">{m.kind}</p>
            )}
            <figcaption className="caption mt-2">{m.credit}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
