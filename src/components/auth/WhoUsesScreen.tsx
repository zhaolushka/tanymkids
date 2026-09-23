"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthFlowStepper } from "@/components/auth/AuthFlowStepper";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";

/** После входа родителя: кто сейчас пользуется устройством — родитель или ребёнок. */
export function WhoUsesScreen() {
  const { t } = useI18n();
  const auth = t.auth;
  const router = useRouter();
  const { role, loading, startKidSession, refresh } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (role !== "parent") {
      router.replace("/login/mode");
    }
  }, [loading, role, router]);

  const openParent = () => {
    router.push("/login/pin?next=/parent/home");
  };

  const openChild = async () => {
    await startKidSession("demo-child-aisha");
    await refresh();
    router.push("/kid");
  };

  const flowLabels = [
    auth.flowStepRole,
    auth.flowStepAccount,
    auth.flowStepPin,
    auth.flowStepWho,
  ] as const;

  return (
    <AuthPageShell showMascot={false}>
      <AuthFlowStepper current={4} labels={[...flowLabels]} />
      <h1 className="text-center text-2xl font-extrabold">{auth.modePickTitle}</h1>
      <p className="mt-2 text-center text-sm text-[var(--ptm-muted)]">{auth.modePickDesc}</p>

      <div className="mt-8 flex flex-1 flex-col gap-3 sm:gap-4">
        <button
          type="button"
          onClick={openParent}
          className="min-h-[140px] rounded-[20px] bg-gradient-to-br from-[var(--ptm-accent,#2F6BFF)] to-[var(--ptm-accent-dark,#1e4fd4)] p-5 text-left text-white shadow-[var(--ptm-shadow)] transition hover:scale-[1.01]"
        >
          <span className="text-4xl">👤</span>
          <p className="mt-2 text-lg font-extrabold">{auth.tabParent}</p>
          <p className="mt-1 text-xs leading-relaxed opacity-90">{auth.modeParentDesc}</p>
        </button>

        <button
          type="button"
          onClick={openChild}
          className="min-h-[140px] rounded-[20px] border border-kid-purple/20 bg-[var(--ptm-card,#fff)] p-5 text-left shadow-[var(--ptm-shadow)] transition hover:scale-[1.01]"
        >
          <span className="text-4xl">🐻</span>
          <p className="mt-2 text-lg font-extrabold">{auth.tabChild}</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ptm-muted)]">{auth.modeChildDesc}</p>
        </button>
      </div>
    </AuthPageShell>
  );
}
