"use client";

import { useEffect, useRef } from "react";
import type { MapPoint } from "./types";
import type { Locale } from "@/lib/types";
import { localize } from "@/lib/i18n";

export function MapboxAtlas({
  token,
  points,
  locale,
}: {
  token: string;
  points: MapPoint[];
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (!ref.current || cancelled) return;
      mapboxgl.accessToken = token;
      const instance = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [32, 2],
        zoom: 3.1,
        attributionControl: false,
      });
      map = instance;
      instance.on("load", () => {
        points.forEach((p) => {
          const el = document.createElement("button");
          el.className = "caption";
          el.style.cssText =
            "width:16px;height:16px;border:1.5px solid #e2ffcc;background:transparent;border-radius:999px;cursor:pointer";
          el.setAttribute("aria-label", localize(p.name, locale));
          new mapboxgl.Marker(el).setLngLat([p.longitude, p.latitude]).addTo(instance);
        });
      });
    })().catch(() => {
      /* SVG atlas remains the failover */
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [token, points, locale]);

  return <div ref={ref} className="h-[70vh] w-full bg-carbon-ink" />;
}
