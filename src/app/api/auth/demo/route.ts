import { NextResponse } from "next/server";
import type { AppRole } from "@/lib/auth/constants";
import { clearKidMode, setRoleCookies } from "@/lib/auth/session-cookies";

export async function POST(request: Request) {
  const body = (await request.json()) as { role?: AppRole; displayName?: string };
  const role = body.role === "doctor" ? "doctor" : "parent";
  const displayName =
    body.displayName?.trim() ||
    (role === "doctor" ? "Айнур Қ. (демо)" : "Demo Parent");

  const userId = role === "doctor" ? "demo-doctor" : "demo-parent";
  const res = NextResponse.json({ ok: true, role, displayName });
  setRoleCookies(res, { role, userId, displayName, demo: true });
  clearKidMode(res);
  return res;
}
