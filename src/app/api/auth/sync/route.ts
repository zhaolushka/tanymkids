import { NextResponse } from "next/server";
import type { AppRole } from "@/lib/auth/constants";
import { clearKidMode, setRoleCookies } from "@/lib/auth/session-cookies";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    role?: AppRole;
    userId?: string;
    displayName?: string;
  };

  if (!body.role || !body.userId) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  setRoleCookies(res, {
    role: body.role,
    userId: body.userId,
    displayName: body.displayName ?? "",
    demo: false,
  });
  clearKidMode(res);
  return res;
}
