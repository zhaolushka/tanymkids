"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthFlowStepper } from "@/components/auth/AuthFlowStepper";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { PinKeypad } from "@/components/auth/PinKeypad";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";

type Step = "create" | "confirm";

export function PinSetupScreen() {
  const { t } = useI18n();
  const auth = t.auth;
  const router = useRouter();
  const { role, loading, setParentPin, refresh } = useAuth();
  const [step, setStep] = useState<Step>("create");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (role !== "parent") router.replace("/");
  }, [loading, role, router]);

  const onCreate = (pin: string) => {
    setPending(pin);
    setError(null);
    setStep("confirm");
  };

  const onConfirm = async (pin: string) => {
    if (pin !== pending) {
      setError(auth.pinMismatchFlow);
      setShake((k) => k + 1);
      setTimeout(() => {
        setPending(null);
        setStep("create");
        setError(null);
      }, 800);
      return;
    }
    const result = await setParentPin(pin);
    if (!result.ok) {
      setError(auth.pinError);
      setShake((k) => k + 1);
      return;
    }
    await refresh();
    router.push("/login/who");
    router.refresh();
  };

  const flowLabels = [auth.flowStepRole, auth.flowStepAccount, auth.flowStepPin, auth.flowStepWho] as const;

  return (
    <AuthPageShell showMascot={false}>
      <AuthFlowStepper current={3} labels={[...flowLabels]} />
      <h1 className="text-center text-xl font-extrabold sm:text-2xl">
        {step === "create" ? auth.pinCreateTitle : auth.pinRepeatTitle}
      </h1>
      <p className="mt-2 text-center text-sm text-[var(--ptm-muted)]">{auth.pinCreateDesc}</p>

      <div className="mt-4 rounded-[20px] bg-[var(--ptm-card,#fff)] p-4 shadow-[var(--ptm-shadow)]">
        <PinKeypad
          key={step}
          shakeKey={shake}
          error={error}
          onDigitChange={() => setError(null)}
          onComplete={step === "create" ? onCreate : onConfirm}
        />
      </div>
    </AuthPageShell>
  );
}
