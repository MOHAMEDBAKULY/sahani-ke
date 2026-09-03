"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";
import { localize, pathFor } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { projectMercator } from "@/lib/geo";
import { AtlasBackdrop } from "./AtlasMap";
import type { HydratedTrip } from "@/lib/types";
import Link from "next/link";

const W = 700;
const H = 780;

export function TripRouteMap({ trip, locale }: { trip: HydratedTrip; locale: Locale }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (trip.route.length < 2) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % trip.route.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [trip.route.length]);

  const line = trip.route
    .map((pt) => {
      const p = projectMercator(pt.latitude, pt.longitude, W, H);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className="relative bg-carbon-ink text-highlighter-mint">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[60vh] w-full">
        <AtlasBackdrop />
        <polyline points={line} fill="none" stroke="#e2ffcc" strokeWidth="1.6" />
        {trip.route.map((pt, i) => {
          const p = projectMercator(pt.latitude, pt.longitude, W, H);
          const on = i === step;
          return (
            <g key={pt._id} transform={`translate(${p.x},${p.y})`}>
              <circle r={on ? 12 : 6} fill="none" stroke="#e2ffcc" strokeWidth="1.5" />
              {on ? <circle r="3" fill="#e2ffcc" /> : null}
            </g>
          );
        })}
      </svg>
      <ol className="flex flex-col gap-4 px-6 py-8 md:px-12">
        {trip.route.map((pt, i) => (
          <li key={pt._id} className={i === step ? "font-bold" : ""}>
            <p className="caption">
              {pt.order} · {pt.arrivalDate}
            </p>
            <Link href={pathFor(locale, `/destinations/${pt.destination.slug}`)} className="inline-link">
              {localize(pt.destination.name, locale)}
            </Link>
            {pt.notes ? <p className="mt-1 text-[12px] normal-case">{localize(pt.notes, locale)}</p> : null}
          </li>
        ))}
      </ol>
      <p className="caption px-6 pb-8 md:px-12">{t("route", locale)}</p>
    </div>
  );
}
