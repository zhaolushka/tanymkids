"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AuthFlowStepper } from "@/components/auth/AuthFlowStepper";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AppRole } from "@/lib/auth/constants";

export function LoginScreen() {
  const { t } = useI18n();
  const auth = t.auth;
  const router = useRouter();
  const params = useSearchParams();
  const roleParam = params.get("role");
  const role: AppRole | null =
    roleParam === "doctor" ? "doctor" : roleParam === "parent" ? "parent" : null;

  const { signInDemo, signInWithPassword, refresh, role: sessionRole, loading } = useAuth();

  const parentFlowLabels = [
    auth.flowStepRole,
    auth.flowStepAccount,
    auth.flowStepPin,
    auth.flowStepWho,
  ] as const;
  const doctorFlowLabels = [
    auth.flowDoctorStepRole,
    auth.flowDoctorStepAccount,
    auth.flowDoctorStepCabinet,
  ] as const;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const doctorNext = "/doctor/home";

  useEffect(() => {
    if (!role) {
      router.replace("/login/mode");
      return;
      return;
    }
    if (loading || !role) return;
    if (sessionRole === "parent" && role === "parent") router.replace("/login/who");
    if (sessionRole === "doctor" && role === "doctor") router.replace("/doctor/home");
  }, [role, loading, sessionRole, router]);

  const afterParentAuth = async () => {
    const session = await refresh();
    if (session.hasParentPin) {
      router.push("/login/who");
    } else {
      router.push("/login/setup-pin");
    }
    router.refresh();
  };

  const afterDoctorAuth = () => {
    router.push(doctorNext);
    router.refresh();
  };

  const onDemo = async () => {
    if (!role) return;
    setBusy(true);
    setError(null);
    try {
      await signInDemo(role);
      if (role === "parent") await afterParentAuth();
      else afterDoctorAuth();
    } finally {
      setBusy(false);
    }
  };

  const onSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setBusy(true);
    setError(null);
    const result = await signInWithPassword(email, password, role);
    setBusy(false);
    if (!result.ok) {
      setError(mapError(auth, result.error));
      return;
    }
    if (role === "parent") await afterParentAuth();
    else afterDoctorAuth();
  };

  if (!role) return null;

  const stepperLabels = role === "doctor" ? doctorFlowLabels : parentFlowLabels;

  return (
    <AuthPageShell>
      <AuthFlowStepper current={2} labels={[...stepperLabels]} />

      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-[var(--ptm-text)]">
          {role === "parent" ? auth.parentSignIn : auth.doctorSignIn}
        </h1>
        <p className="mt-2 text-sm text-[var(--ptm-muted)]">{auth.subtitle}</p>
      </div>

      <Link
        href="/login/mode"
        className="flex items-center gap-1 text-sm font-semibold text-[var(--ptm-accent,#2F6BFF)]"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        {auth.backToPick}
      </Link>

      <Card className="space-y-4 rounded-[20px] border-none p-5 shadow-[var(--ptm-shadow)]">
        {role === "doctor" && (
          <p className="text-xs text-[var(--ptm-muted)]">{auth.doctorSignInHint}</p>
        )}

        {isSupabaseConfigured() && (
          <form onSubmit={onSupabase} className="space-y-3">
            <input
              type="text"
              required
              autoComplete="username"
              placeholder={auth.emailOrPhonePlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--ptm-bg)] bg-[var(--ptm-bg,#F4F6FB)] px-3 py-2.5 text-sm"
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder={auth.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--ptm-bg)] bg-[var(--ptm-bg,#F4F6FB)] px-3 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-[var(--ptm-accent,#2F6BFF)]" disabled={busy}>
              {auth.signIn}
            </Button>
          </form>
        )}

        {isSupabaseConfigured() && (
          <p className="text-center text-xs text-[var(--ptm-muted)]">{auth.orDemo}</p>
        )}

        <Button type="button" variant="kid" className="w-full" disabled={busy} onClick={onDemo}>
          {auth.demoContinue}
        </Button>
      </Card>
    </AuthPageShell>
  );
}

function mapError(
  auth: { errorWrongRole: string; errorNoDb: string; errorGeneric: string },
  code?: string,
) {
  if (code === "wrong_role") return auth.errorWrongRole;
  if (code === "supabase_not_configured") return auth.errorNoDb;
  return auth.errorGeneric;
}
