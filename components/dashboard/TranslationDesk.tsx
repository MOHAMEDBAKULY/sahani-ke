"use client";

import { useState } from "react";
import type { Localized } from "@/lib/types";
import { OutlinedButton } from "@/components/ui/OutlinedButton";

type Row = { _id: string; slug: string; title: Localized; excerpt: Localized };

export function TranslationDesk({ stories }: { stories: Row[] }) {
  const [current, setCurrent] = useState(stories[0]?._id || "");
  const story = stories.find((s) => s._id === current) || stories[0];
  const [titleAr, setTitleAr] = useState(story?.title.ar || "");
  const [excerptAr, setExcerptAr] = useState(story?.excerpt.ar || "");
  const [msg, setMsg] = useState("");

  function select(id: string) {
    const next = stories.find((s) => s._id === id);
    setCurrent(id);
    setTitleAr(next?.title.ar || "");
    setExcerptAr(next?.excerpt.ar || "");
    setMsg("");
  }

  async function save() {
    if (!story) return;
    const res = await fetch("/api/admin/store", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collection: "stories",
        id: story._id,
        patch: {
          title: { en: story.title.en, ar: titleAr },
          excerpt: { en: story.excerpt.en, ar: excerptAr },
        },
      }),
    });
    setMsg(res.ok ? "Translation saved." : "Save failed.");
  }

  if (!story) return null;

  return (
    <div>
      <select value={current} onChange={(e) => select(e.target.value)} className="mb-8">
        {stories.map((s) => (
          <option key={s._id} value={s._id}>
            {s.title.en}
          </option>
        ))}
      </select>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="caption mb-2">English</p>
          <p className="font-display text-[40px] leading-[0.9]">{story.title.en}</p>
          <p className="mt-4 text-[16px] normal-case">{story.excerpt.en}</p>
        </div>
        <div>
          <p className="caption mb-2">Arabic</p>
          <textarea dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} rows={2} />
          <textarea dir="rtl" className="mt-4" value={excerptAr} onChange={(e) => setExcerptAr(e.target.value)} rows={5} />
        </div>
      </div>
      <div className="mt-6">
        <OutlinedButton type="button" onClick={save}>
          Save Arabic
        </OutlinedButton>
        {msg ? <p className="caption mt-3">{msg}</p> : null}
      </div>
    </div>
  );
}
