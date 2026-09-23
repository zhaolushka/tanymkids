"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthFlowStepper } from "@/components/auth/AuthFlowStepper";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";
import type { AppRole } from "@/lib/auth/constants";

export function RoleModeScreen() {
  const { t } = useI18n();
  const auth = t.auth;
  const router = useRouter();
  const params = useSearchParams();
  const hintDoctor = params.get("hint") === "doctor";
  const { role: sessionRole, loading, authenticated, signOut } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const parentFlowLabels = [
    auth.flowStepRole,
    auth.flowStepAccount,
    auth.flowStepPin,
    auth.flowStepWho,
  ] as const;

  useEffect(() => {
    if (params.get("reason") === "kid") {
      setToast(auth.childBlockedToast);
      const id = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(id);
    }
  }, [params, auth.childBlockedToast]);

  const pick = async (picked: AppRole) => {
    setBusy(true);
    try {
      if (!loading && authenticated && sessionRole === picked) {
        if (picked === "parent") {
          router.push("/login/who");
          return;
        }
        router.push("/doctor/home");
        return;
      }
      if (!loading && authenticated && sessionRole !== picked) {
        await signOut();
      }
      router.push(`/login/account?role=${picked}`);
    } finally {
      setBusy(false);
    }
  };

  const childHint = () => {
    setToast(auth.childBlockedToast);
    setTimeout(() => setToast(null), 3500);
  };

  const loggedInLabel =
    sessionRole === "doctor"
      ? auth.roleModeLoggedDoctor
      : sessionRole === "parent"
        ? auth.roleModeLoggedParent
        : null;

  return (
    <AuthPageShell hideBackLink>
      <AuthFlowStepper current={1} labels={[...parentFlowLabels]} />

      {toast && (
        <div
          role="status"
          className="mb-4 rounded-2xl bg-[#1a1d26] px-4 py-3 text-center text-xs leading-relaxed text-white"
        >
          {toast}
        </div>
      )}

      <div className="text-center">
        <p className="text-5xl" aria-hidden>
          🐻
        </p>
        <h1 className="mt-2 text-2xl font-extrabold">{auth.title}</h1>
        <p className="mt-2 text-sm text-[var(--ptm-muted)]">{auth.pickWhoDesc}</p>
      </div>

      <p className="text-center text-sm font-bold">{auth.pickWho}</p>

      {!loading && authenticated && loggedInLabel && (
        <div className="rounded-xl border border-[var(--ptm-accent)]/20 bg-[var(--ptm-accent)]/5 px-3 py-2 text-center text-xs text-[var(--ptm-text)]">
          {loggedInLabel}
        </div>
      )}

      <div className="space-y-3">
        <RoleCard
          emoji="👨‍👩‍👧"
          title={auth.tabParent}
          desc={auth.roleParentDesc}
          accent
          disabled={busy}
          onClick={() => pick("parent")}
        />
        <RoleCard
          emoji="🩺"
          title={auth.tabDoctor}
          desc={auth.roleDoctorDesc}
          highlight={hintDoctor}
          disabled={busy}
          onClick={() => pick("doctor")}
        />
        <RoleCard
          emoji="🧒"
          title={auth.tabChild}
          desc={auth.roleChildDesc}
          disabled
          onClick={childHint}
        />
        <p className="text-center text-[11px] text-[var(--ptm-muted)]">{auth.childCardHint}</p>
      </div>

      {!loading && authenticated && (
        <Button
          type="button"
          variant="outline"
          className="mt-2 w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await signOut();
            setBusy(false);
          }}
        >
          {auth.signOut}
        </Button>
      )}
    </AuthPageShell>
  );
}

function RoleCard({
  emoji,
  title,
  desc,
  onClick,
  accent,
  highlight,
  disabled,
}: {
  emoji: string;
  title: string;
  desc: string;
  onClick: () => void;
  accent?: boolean;
  highlight?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[20px] border p-4 text-left shadow-[var(--ptm-shadow)] transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-55 ${
        highlight
          ? "border-[var(--ptm-accent)] ring-2 ring-[var(--ptm-accent)]/30"
          : accent
            ? "border-[var(--ptm-accent)]/25 bg-[var(--ptm-card,#fff)]"
            : "border-transparent bg-[var(--ptm-card,#fff)]"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--ptm-accent)]/10 text-2xl">
        {emoji}
      </div>
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--ptm-muted)]">{desc}</p>
      </div>
    </button>
  );
}
