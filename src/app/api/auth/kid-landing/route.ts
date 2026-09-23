import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { setKidMode } from "@/lib/auth/session-cookies";

/** Child opens app from landing without parent cabinet — kid mode, PIN required for /parent. */
export async function POST() {
  const cookieStore = await cookies();
  const role = cookieStore.get(AUTH_COOKIE.role)?.value;

  const res = NextResponse.json({ ok: true });
  if (role === "parent") {
    setKidMode(res, cookieStore.get(AUTH_COOKIE.activeChildId)?.value || "demo-child-aisha");
  } else {
    res.cookies.set(AUTH_COOKIE.kidMode, "1", {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    res.cookies.set(AUTH_COOKIE.activeChildId, "demo-child-aisha", {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24,
    });
  }
  return res;
}
