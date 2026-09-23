import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { setKidMode } from "@/lib/auth/session-cookies";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const role = cookieStore.get(AUTH_COOKIE.role)?.value;
  if (role !== "parent") {
    return NextResponse.json({ error: "parent_required" }, { status: 403 });
  }

  const body = (await request.json()) as { childId?: string };
  const childId = body.childId?.trim() || "demo-child-aisha";

  const res = NextResponse.json({ ok: true, childId });
  setKidMode(res, childId);
  return res;
}
