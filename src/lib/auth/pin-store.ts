import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function resolveStoredPinHash(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<string | null> {
  const demoHash = cookieStore.get(AUTH_COOKIE.pinHash)?.value;
  if (demoHash) return demoHash;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("parent_pins")
    .select("pin_hash")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.pin_hash ?? null;
}

export async function hasParentPinConfigured(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<boolean> {
  const hash = await resolveStoredPinHash(cookieStore);
  return Boolean(hash);
}
