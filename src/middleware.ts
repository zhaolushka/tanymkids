import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth/constants";

const PUBLIC_PREFIXES = ["/login", "/api", "/_next", "/favicon", "/demos", "/models"];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const role = request.cookies.get(AUTH_COOKIE.role)?.value;
  const pinOk = request.cookies.get(AUTH_COOKIE.pinUnlock)?.value === "1";
  const kidMode = request.cookies.get(AUTH_COOKIE.kidMode)?.value === "1";

  if (pathname.startsWith("/parent")) {
    if (role !== "parent") {
      const url = request.nextUrl.clone();
      url.pathname = "/login/mode";
      url.searchParams.set("next", pathname);
      if (role === "doctor") url.searchParams.set("hint", "doctor");
      return NextResponse.redirect(url);
    }
    if (!pinOk) {
      const url = request.nextUrl.clone();
      url.pathname = "/login/pin";
      url.searchParams.set("next", pathname);
      if (kidMode) url.searchParams.set("from", "kid");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/kid")) {
    const role = request.cookies.get(AUTH_COOKIE.role)?.value;
    const kidMode = request.cookies.get(AUTH_COOKIE.kidMode)?.value === "1";
    if (role !== "parent" || !kidMode) {
      const url = request.nextUrl.clone();
      url.pathname = "/login/mode";
      url.searchParams.set("reason", "kid");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/doctor")) {
    if (role !== "doctor") {
      const url = request.nextUrl.clone();
      url.pathname = "/login/mode";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/doctor/:path*", "/kid", "/kid/:path*"],
};
