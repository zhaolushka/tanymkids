import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, type AppRole } from "@/lib/auth/constants";
import { hasParentPinConfigured } from "@/lib/auth/pin-store";

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get(AUTH_COOKIE.role)?.value as AppRole | undefined;
  const userId = cookieStore.get(AUTH_COOKIE.userId)?.value;
  const displayName = cookieStore.get(AUTH_COOKIE.displayName)?.value;
  const kidMode = cookieStore.get(AUTH_COOKIE.kidMode)?.value === "1";
  const activeChildId = cookieStore.get(AUTH_COOKIE.activeChildId)?.value;
  const demo = cookieStore.get(AUTH_COOKIE.demo)?.value === "1";

  if (!role || !userId) {
    return NextResponse.json({ authenticated: false });
  }

  const hasParentPin =
    role === "parent" ? await hasParentPinConfigured(cookieStore) : false;

  return NextResponse.json({
    authenticated: true,
    role,
    userId,
    displayName: displayName ?? "",
    kidMode,
    activeChildId: activeChildId ?? null,
    demo,
    hasParentPin,
  });
}
