import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { loadStore, saveStore } from "@/lib/cms";
import type { CmsStore } from "@/lib/types";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const store = loadStore();
  return NextResponse.json(store);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const next = (await request.json()) as CmsStore;
  saveStore(next);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    collection: keyof CmsStore;
    id: string;
    patch: Record<string, unknown>;
  };
  const store = loadStore();
  const list = store[body.collection];
  if (!Array.isArray(list)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  const idx = list.findIndex((item) => {
    const rec = item as { _id?: string; id?: string };
    return rec._id === body.id || rec.id === body.id;
  });
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  list[idx] = { ...list[idx], ...body.patch } as never;
  saveStore(store);
  return NextResponse.json({ success: true, item: list[idx] });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { collection: keyof CmsStore; item: Record<string, unknown> };
  const store = loadStore();
  const list = store[body.collection];
  if (!Array.isArray(list)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  (list as unknown[]).push(body.item);
  saveStore(store);
  return NextResponse.json({ success: true });
}
