"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContentStatus, Story } from "@/lib/types";
import { OutlinedButton } from "@/components/ui/OutlinedButton";

export function StoryEditor({ story }: { story: Story }) {
  const router = useRouter();
  const [titleEn, setTitleEn] = useState(story.title.en);
  const [titleAr, setTitleAr] = useState(story.title.ar);
  const [excerptEn, setExcerptEn] = useState(story.excerpt.en);
  const [excerptAr, setExcerptAr] = useState(story.excerpt.ar);
  const [status, setStatus] = useState<ContentStatus>(story.status);
  const [scheduledAt, setScheduledAt] = useState(story.scheduledAt || "");
  const [message, setMessage] = useState("");

  async function save() {
    const res = await fetch("/api/admin/store", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collection: "stories",
        id: story._id,
        patch: {
          title: { en: titleEn, ar: titleAr },
          excerpt: { en: excerptEn, ar: excerptAr },
          status,
          scheduledAt: scheduledAt || undefined,
        },
      }),
    });
    setMessage(res.ok ? "Saved." : "Could not save.");
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="caption">Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)}>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="caption">Schedule</span>
        <input type="datetime-local" value={scheduledAt.slice(0, 16)} onChange={(e) => setScheduledAt(e.target.value)} />
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="caption">Title EN</span>
          <textarea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} rows={2} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="caption">Title AR</span>
          <textarea dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} rows={2} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="caption">Excerpt EN</span>
          <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} rows={4} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="caption">Excerpt AR</span>
          <textarea dir="rtl" value={excerptAr} onChange={(e) => setExcerptAr(e.target.value)} rows={4} />
        </label>
      </div>
      <OutlinedButton type="button" onClick={save}>
        Save
      </OutlinedButton>
      {message ? <p className="caption">{message}</p> : null}
    </div>
  );
}
