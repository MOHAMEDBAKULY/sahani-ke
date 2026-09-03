"use client";

import { useState } from "react";
import Link from "next/link";
import type { Country, Locale } from "@/lib/types";
import { localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { projectMercator } from "@/lib/geo";
import { PinIcon } from "@/components/ui/IconBadge";
import { OutlinedButton } from "@/components/ui/OutlinedButton";
import type { MapPoint, MapRoute } from "./types";

export type { MapPoint, MapRoute };

const COAST: [number, number][] = [
  [35.8, -5.8], [33.6, -7.6], [27.1, -13.4], [23.7, -15.9], [14.7, -17.4],
  [9.5, -13.7], [5.3, -4.0], [5.6, 0.2], [6.5, 3.4], [4.0, 9.7], [0.4, 9.5],
  [-4.3, 11.6], [-8.8, 13.2], [-17.0, 11.8], [-22.9, 14.5], [-28.5, 16.4],
  [-34.0, 18.4], [-34.4, 19.2], [-33.9, 25.6], [-29.9, 31.0], [-25.9, 32.6],
  [-15.0, 40.5], [-6.8, 39.3], [-4.0, 39.7], [2.0, 45.3], [11.8, 51.3],
  [12.0, 43.4], [15.6, 39.5], [22.0, 36.9], [27.2, 33.8], [31.2, 32.3],
  [31.2, 29.9], [32.9, 21.9], [32.9, 13.2], [36.8, 10.2], [36.8, 3.0],
  [35.8, -0.6], [35.8, -5.8],
];

const MADAGASCAR: [number, number][] = [
  [-12.0, 49.2], [-15.7, 50.3], [-25.0, 47.1], [-25.6, 45.2], [-21.7, 43.3], [-15.0, 46.3], [-12.0, 49.2],
];

const W = 700;
const H = 780;

function poly(points: [number, number][]) {
  return points
    .map(([lat, lng]) => {
      const p = projectMercator(lat, lng, W, H);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
}

export function AtlasBackdrop() {
  return (
    <>
      <rect width={W} height={H} fill="#161b13" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx={W / 2}
          cy={H / 2}
          r={40 + i * 42}
          fill="none"
          stroke="#84907f"
          strokeOpacity="0.18"
          strokeWidth="0.6"
        />
      ))}
      <polygon points={poly(COAST)} fill="#2d3329" stroke="#e2ffcc" strokeWidth="1.2" />
      <polygon points={poly(MADAGASCAR)} fill="#2d3329" stroke="#e2ffcc" strokeWidth="1" />
    </>
  );
}

export function AtlasMap({
  locale,
  countries,
  points,
  routes,
  highlightId,
}: {
  locale: Locale;
  countries: Country[];
  points: MapPoint[];
  routes: MapRoute[];
  highlightId?: string;
}) {
  const [active, setActive] = useState<MapPoint | null>(null);

  if (!points.length) {
    return (
      <div className="section-dark px-6 py-16 md:px-12">
        <p className="caption mb-8">{t("fallbackMap", locale)}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh] w-full bg-carbon-ink text-highlighter-mint">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[70vh] w-full" role="img" aria-label="Africa atlas">
        <AtlasBackdrop />
        {routes.map((route) => {
          const d = route.points
            .map((pt) => {
              const p = projectMercator(pt.latitude, pt.longitude, W, H);
              return `${p.x},${p.y}`;
            })
            .join(" ");
          return (
            <polyline
              key={route.id}
              points={d}
              fill="none"
              stroke="#e2ffcc"
              strokeWidth="1.4"
              strokeDasharray="6 5"
              opacity="0.7"
            />
          );
        })}
        {points.map((point) => {
          const p = projectMercator(point.latitude, point.longitude, W, H);
          const selected = active?.id === point.id || highlightId === point.id;
          return (
            <g
              key={point.id}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={localize(point.name, locale)}
              onClick={() => setActive(point)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActive(point);
              }}
            >
              <circle r={selected ? 11 : 7} fill="none" stroke="#e2ffcc" strokeWidth="1.5" />
              <circle r="2" fill="#e2ffcc" />
            </g>
          );
        })}
      </svg>
      {active ? (
        <div className="absolute start-6 bottom-6 max-w-sm border border-highlighter-mint bg-carbon-ink p-4">
          <p className="caption">
            {localize(active.countryName, locale)} · {active.storyCount} {t("storiesCount", locale)}
          </p>
          <p className="font-display mt-2 text-[40px] leading-[0.9]">{localize(active.name, locale)}</p>
          <div className="mt-4 flex gap-3">
            <OutlinedButton href={pathFor(locale, `/destinations/${active.slug}`)}>
              {t("exploreJourney", locale)}
            </OutlinedButton>
            <button type="button" className="caption" onClick={() => setActive(null)}>
              {t("close", locale)}
            </button>
          </div>
        </div>
      ) : (
        <p className="caption absolute start-6 bottom-6 flex items-center gap-2">
          <PinIcon /> {countries.length} {t("filterCountry", locale)}
        </p>
      )}
    </div>
  );
}

export function DestinationListFallback({ locale, points }: { locale: Locale; points: MapPoint[] }) {
  return (
    <ul className="flex flex-col gap-4 px-6 py-10 md:px-12">
      {points.map((p) => (
        <li key={p.id}>
          <Link href={pathFor(locale, `/destinations/${p.slug}`)} className="inline-link">
            {localize(p.name, locale)}
          </Link>
          <span className="caption ms-3">
            {localize(p.countryName, locale)} · {p.storyCount}
          </span>
        </li>
      ))}
    </ul>
  );
}
