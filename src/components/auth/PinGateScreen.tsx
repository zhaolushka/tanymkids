"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthFlowStepper } from "@/components/auth/AuthFlowStepper";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { PinKeypad } from "@/components/auth/PinKeypad";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";

export function PinGateScreen() {
  const { t } = useI18n();
  const auth = t.auth;
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/parent/home";
  const fromKid = params.get("from") === "kid";
  const { verifyPin, demo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [busy, setBusy] = useState(false);

  const onComplete = async (pin: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await verifyPin(pin);
    setBusy(false);
    if (!result.ok) {
      setError(result.error === "wrong_pin" ? auth.pinWrong : auth.pinError);
      setShake((k) => k + 1);
      return;
    }
    router.push(next);
    router.refresh();
  };

  const flowLabels = [auth.flowStepRole, auth.flowStepAccount, auth.flowStepPin, auth.flowStepMode] as const;

  return (
    <AuthPageShell showMascot={false}>
      <AuthFlowStepper current={3} labels={[...flowLabels]} />
      <h1 className="text-center text-xl font-extrabold sm:text-2xl">{auth.pinEnterTitle}</h1>
      <p className="mt-2 text-center text-sm text-[var(--ptm-muted)]">
        {fromKid ? auth.pinSubtitleKid : auth.pinEnterDesc}
      </p>

      <div className="mt-4 rounded-[20px] bg-[var(--ptm-card,#fff)] p-4 shadow-[var(--ptm-shadow)]">
        <PinKeypad shakeKey={shake} error={error} onDigitChange={() => setError(null)} onComplete={onComplete} />
        {demo && (
          <p className="mt-2 text-center text-xs text-[var(--ptm-muted)]">
            {auth.demoPinHint} <code className="rounded bg-[var(--ptm-bg)] px-1">1234</code>
          </p>
        )}
      </div>

      <button
        type="button"
        className="mt-6 text-center text-sm text-[var(--ptm-muted)]"
        onClick={() => alert(auth.forgotPinStub)}
      >
        {auth.forgotPin}
      </button>

      <p className="mt-4 text-center text-sm">
        {fromKid ? (
          <Link href="/kid" className="font-medium text-[var(--ptm-accent,#2F6BFF)] hover:underline">
            {auth.pinBackKid}
          </Link>
        ) : (
          <Link href="/login/who" className="font-medium text-[var(--ptm-accent,#2F6BFF)] hover:underline">
            {auth.backToWho}
          </Link>
        )}
      </p>
    </AuthPageShell>
  );
}
