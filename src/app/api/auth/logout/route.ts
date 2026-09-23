import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/session-cookies";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
