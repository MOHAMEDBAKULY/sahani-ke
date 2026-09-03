import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loadStore } from "@/lib/cms";
import { StoryEditor } from "@/components/dashboard/StoryEditor";

export default async function StoryEdit({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/dashboard/login");
  const { id } = await params;
  const story = loadStore().stories.find((s) => s._id === id);
  if (!story) notFound();
  return (
    <div>
      <h1 className="font-display text-[40px] leading-[0.9]">Edit story</h1>
      <div className="mt-8">
        <StoryEditor story={story} />
      </div>
    </div>
  );
}
