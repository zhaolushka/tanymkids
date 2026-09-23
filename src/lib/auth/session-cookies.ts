import type { NextResponse } from "next/server";
import { AUTH_COOKIE, type AppRole, PIN_UNLOCK_MAX_AGE_SEC } from "@/lib/auth/constants";

const base = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function setRoleCookies(
  res: NextResponse,
  opts: {
    role: AppRole;
    userId: string;
    displayName: string;
    demo?: boolean;
  },
) {
  res.cookies.set(AUTH_COOKIE.role, opts.role, { ...base, httpOnly: true, maxAge: 60 * 60 * 24 * 14 });
  res.cookies.set(AUTH_COOKIE.userId, opts.userId, { ...base, httpOnly: true, maxAge: 60 * 60 * 24 * 14 });
  res.cookies.set(AUTH_COOKIE.displayName, opts.displayName, { ...base, httpOnly: false, maxAge: 60 * 60 * 24 * 14 });
  if (opts.demo) {
    res.cookies.set(AUTH_COOKIE.demo, "1", { ...base, httpOnly: true, maxAge: 60 * 60 * 24 * 14 });
  }
}

export function clearAuthCookies(res: NextResponse) {
  for (const name of Object.values(AUTH_COOKIE)) {
    res.cookies.set(name, "", { ...base, maxAge: 0 });
  }
}

export function setKidMode(res: NextResponse, activeChildId: string) {
  res.cookies.set(AUTH_COOKIE.kidMode, "1", { ...base, httpOnly: true, maxAge: 60 * 60 * 24 });
  res.cookies.set(AUTH_COOKIE.activeChildId, activeChildId, { ...base, httpOnly: false, maxAge: 60 * 60 * 24 });
  res.cookies.set(AUTH_COOKIE.pinUnlock, "", { ...base, maxAge: 0 });
}

export function clearKidMode(res: NextResponse) {
  res.cookies.set(AUTH_COOKIE.kidMode, "", { ...base, maxAge: 0 });
  res.cookies.set(AUTH_COOKIE.activeChildId, "", { ...base, maxAge: 0 });
  res.cookies.set(AUTH_COOKIE.pinUnlock, "", { ...base, maxAge: 0 });
}

export function setPinUnlock(res: NextResponse) {
  res.cookies.set(AUTH_COOKIE.pinUnlock, "1", {
    ...base,
    httpOnly: true,
    maxAge: PIN_UNLOCK_MAX_AGE_SEC,
  });
  res.cookies.set(AUTH_COOKIE.kidMode, "", { ...base, maxAge: 0 });
}

export function setPinHashCookie(res: NextResponse, pinHash: string) {
  res.cookies.set(AUTH_COOKIE.pinHash, pinHash, {
    ...base,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
  });
}
