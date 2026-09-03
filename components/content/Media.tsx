"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/copy";

export function AudioPlayer({ src, locale }: { src: string; locale: Locale }) {
  return (
    <div className="border border-current p-4">
      <p className="caption mb-3">{t("listen", locale)}</p>
      <audio controls className="w-full" preload="none">
        <source src={src} />
      </audio>
    </div>
  );
}

export function VideoEmbed({ url }: { url: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden border border-current">
      <iframe
        src={url}
        title="Video"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
