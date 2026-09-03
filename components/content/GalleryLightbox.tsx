"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/copy";

export function GalleryLightbox({ images, locale }: { images: string[]; locale: Locale }) {
  const [active, setActive] = useState<number | null>(null);
  if (!images.length) return null;

  return (
    <section className="px-6 py-[67px] md:px-12">
      <p className="caption mb-6">{t("gallery", locale)}</p>
      <div className="flex flex-wrap gap-6">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className="relative aspect-[3/2] w-full max-w-sm overflow-hidden"
            onClick={() => setActive(i)}
          >
            <Image src={src} alt="" width={800} height={533} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {active !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-ink/90 p-6"
          onClick={() => setActive(null)}
        >
          <Image
            src={images[active]}
            alt=""
            width={1600}
            height={1066}
            className="max-h-[90vh] w-auto object-contain"
          />
        </div>
      ) : null}
    </section>
  );
}
