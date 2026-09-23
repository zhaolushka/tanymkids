import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { hashPin, isValidPinFormat } from "@/lib/auth/pin";
import { resolveStoredPinHash } from "@/lib/auth/pin-store";
import { setPinHashCookie, setPinUnlock } from "@/lib/auth/session-cookies";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { pin?: string; action?: "verify" | "set" };
  const pin = body.pin ?? "";
  const action = body.action ?? "verify";

  if (!isValidPinFormat(pin)) {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const pinHash = await hashPin(pin);

  if (action === "set") {
    const role = cookieStore.get(AUTH_COOKIE.role)?.value;
    if (role !== "parent") {
      return NextResponse.json({ error: "parent_required" }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    const res = NextResponse.json({ ok: true });

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("parent_pins").upsert({
          user_id: user.id,
          pin_hash: pinHash,
          updated_at: new Date().toISOString(),
        });
      } else {
        setPinHashCookie(res, pinHash);
      }
    } else {
      setPinHashCookie(res, pinHash);
    }

    return res;
  }

  const stored = await resolveStoredPinHash(cookieStore);
  if (!stored) {
    return NextResponse.json({ error: "pin_not_set" }, { status: 400 });
  }

  if (stored !== pinHash) {
    return NextResponse.json({ error: "wrong_pin" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setPinUnlock(res);
  return res;
}
