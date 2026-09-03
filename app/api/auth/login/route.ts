import { NextRequest, NextResponse } from "next/server";
import { passwordOk, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string; demo?: boolean };
  if (body.demo || (body.password && passwordOk(body.password))) {
    await setSessionCookie();
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, message: "Invalid desk password." }, { status: 401 });
}
