import { NextRequest, NextResponse } from "next/server";
import { loadStore, saveStore } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const existing = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (existing.length >= 8) return true;
  existing.push(now);
  hits.set(ip, existing);
  return false;
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
  }

  const body = (await request.json()) as { email?: string; language?: string; website?: string };
  if (body.website) {
    return NextResponse.json({ success: true, message: "Subscribed successfully." });
  }
  const email = (body.email || "").trim().toLowerCase();
  const language: Locale = isLocale(body.language || "") ? (body.language as Locale) : "en";
  if (!validEmail(email)) {
    return NextResponse.json({ success: false, message: "Please enter a valid email." }, { status: 400 });
  }

  const store = loadStore();
  if (!store.subscribers.some((s) => s.email === email)) {
    store.subscribers.push({
      id: `sub-${Date.now()}`,
      email,
      language,
      subscribedAt: new Date().toISOString(),
      status: process.env.RESEND_API_KEY ? "pending" : "confirmed",
    });
    saveStore(store);
  }

  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sahani.KE <dispatch@sahani.ke>",
          to: email,
          subject: "Confirm your Sahani.KE dispatch",
          text: "Reply to this note by visiting the atlas — you are on the weekly list.",
        }),
      });
    } catch {
      /* local store still succeeded */
    }
  }

  return NextResponse.json({ success: true, message: "Subscribed successfully." });
}
