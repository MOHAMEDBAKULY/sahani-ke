import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSession } from "@/lib/session";

const LOCALES = ["en", "ar"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/login")) {
    const token = request.cookies.get("sahani_session")?.value;
    if (!isValidSession(token)) {
      const login = new URL("/dashboard/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/feed.xml") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  const first = pathname.split("/").filter(Boolean)[0];
  const locale = LOCALES.includes(first) ? first : null;

  if (!locale) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
