"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { OutlinedButton } from "@/components/ui/OutlinedButton";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [instagram, setInstagram] = useState(settings.social.instagram);
  const [x, setX] = useState(settings.social.x);
  const [pinterest, setPinterest] = useState(settings.social.pinterest);
  const [bioEn, setBioEn] = useState(settings.bio.en);
  const [bioAr, setBioAr] = useState(settings.bio.ar);
  const [titleEn, setTitleEn] = useState(settings.seo.defaultTitle.en);
  const [titleAr, setTitleAr] = useState(settings.seo.defaultTitle.ar);
  const [msg, setMsg] = useState("");

  async function save() {
    const res = await fetch("/api/admin/store", { method: "GET" });
    const store = await res.json();
    store.settings = {
      ...store.settings,
      bio: { en: bioEn, ar: bioAr },
      social: { instagram, x, pinterest },
      seo: {
        ...store.settings.seo,
        defaultTitle: { en: titleEn, ar: titleAr },
      },
    };
    const put = await fetch("/api/admin/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    });
    setMsg(put.ok ? "Saved." : "Failed.");
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <p className="caption">Profile · {settings.name}</p>
      <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram" />
      <input value={x} onChange={(e) => setX(e.target.value)} placeholder="X" />
      <input value={pinterest} onChange={(e) => setPinterest(e.target.value)} placeholder="Pinterest" />
      <textarea value={titleEn} onChange={(e) => setTitleEn(e.target.value)} rows={2} />
      <textarea dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} rows={2} />
      <textarea value={bioEn} onChange={(e) => setBioEn(e.target.value)} rows={5} />
      <textarea dir="rtl" value={bioAr} onChange={(e) => setBioAr(e.target.value)} rows={5} />
      <OutlinedButton type="button" onClick={save}>
        Save
      </OutlinedButton>
      {msg ? <p className="caption">{msg}</p> : null}
    </div>
  );
}
