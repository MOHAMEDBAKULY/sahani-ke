"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/copy";

export function ShareToolbar({ title, locale }: { title: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className="outlined-btn" onClick={share}>
      {copied ? t("copied", locale) : t("share", locale)}
    </button>
  );
}
