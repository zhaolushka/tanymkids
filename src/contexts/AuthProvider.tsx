"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppRole } from "@/lib/auth/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthSession = {
  authenticated: boolean;
  role: AppRole | null;
  userId: string | null;
  displayName: string;
  kidMode: boolean;
  activeChildId: string | null;
  demo: boolean;
  hasParentPin: boolean;
};

type AuthContextValue = AuthSession & {
  loading: boolean;
  refresh: () => Promise<AuthSession>;
  signInDemo: (role: AppRole) => Promise<void>;
  signOut: () => Promise<void>;
  startKidSession: (childId?: string) => Promise<void>;
  startKidFromLanding: () => Promise<void>;
  verifyPin: (pin: string) => Promise<{ ok: boolean; error?: string }>;
  setParentPin: (pin: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithPassword: (
    email: string,
    password: string,
    role: AppRole,
  ) => Promise<{ ok: boolean; error?: string }>;
};

const empty: AuthSession = {
  authenticated: false,
  role: null,
  userId: null,
  displayName: "",
  kidMode: false,
  activeChildId: null,
  demo: false,
  hasParentPin: false,
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<AuthSession> {
  const res = await fetch("/api/auth/me", { credentials: "same-origin" });
  if (!res.ok) return empty;
  const data = await res.json();
  if (!data.authenticated) return empty;
  return data as AuthSession;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(empty);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await fetchSession();
    setSession(next);
    return next;
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const signInDemo = useCallback(
    async (role: AppRole) => {
      await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      await refresh();
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(empty);
  }, []);

  const startKidSession = useCallback(
    async (childId?: string) => {
      await fetch("/api/auth/kid-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId }),
      });
      await refresh();
    },
    [refresh],
  );

  const startKidFromLanding = useCallback(async () => {
    await fetch("/api/auth/kid-landing", { method: "POST" });
    await refresh();
  }, [refresh]);

  const verifyPin = useCallback(async (pin: string) => {
    const res = await fetch("/api/auth/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, action: "verify" }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error as string };
    await refresh();
    return { ok: true };
  }, [refresh]);

  const setParentPin = useCallback(async (pin: string) => {
    const res = await fetch("/api/auth/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, action: "set" }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error as string };
    return { ok: true };
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string, role: AppRole) => {
      if (!isSupabaseConfigured()) {
        return { ok: false, error: "supabase_not_configured" };
      }
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { ok: false, error: "supabase_not_configured" };

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return { ok: false, error: error?.message ?? "auth_failed" };
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, display_name")
        .eq("id", data.user.id)
        .maybeSingle();

      const profileRole = (profile?.role as AppRole | undefined) ?? role;
      if (profileRole !== role) {
        await supabase.auth.signOut();
        return { ok: false, error: "wrong_role" };
      }

      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: profileRole,
          userId: data.user.id,
          displayName: profile?.display_name ?? data.user.email ?? "",
        }),
      });
      await refresh();
      return { ok: true };
    },
    [refresh],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...session,
      loading,
      refresh,
      signInDemo,
      signOut,
      startKidSession,
      startKidFromLanding,
      verifyPin,
      setParentPin,
      signInWithPassword,
    }),
    [
      session,
      loading,
      refresh,
      signInDemo,
      signOut,
      startKidSession,
      startKidFromLanding,
      verifyPin,
      setParentPin,
      signInWithPassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
