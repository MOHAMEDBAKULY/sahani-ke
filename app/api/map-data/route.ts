import { NextRequest, NextResponse } from "next/server";
import { getMapData } from "@/lib/cms";
import type { StoryCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country") || undefined;
  const category = (request.nextUrl.searchParams.get("category") || "") as StoryCategory | "";
  const type = request.nextUrl.searchParams.get("type") || undefined;
  return NextResponse.json(getMapData({ country, category, type }));
}
