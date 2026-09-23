"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { PtmCard } from "@/components/parent/parent-telemed-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";

export function ParentPinSettings() {
  const { t } = useI18n();
  const auth = t.auth;
  const { role, setParentPin } = useAuth();
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (role !== "parent") return null;

  const save = async () => {
    setMessage(null);
    setError(null);
    if (pin !== confirm) {
      setError(auth.pinMismatch);
      return;
    }
    setBusy(true);
    const result = await setParentPin(pin);
    setBusy(false);
    if (!result.ok) {
      setError(auth.pinError);
      return;
    }
    setPin("");
    setConfirm("");
    setMessage(auth.pinSaved);
  };

  return (
    <PtmCard className="p-4">
      <div className="flex gap-3">
        <Lock className="h-5 w-5 shrink-0 text-[var(--ptm-muted)]" aria-hidden />
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-medium">{auth.pinSettingsTitle}</p>
            <p className="mt-1 text-xs text-[var(--ptm-muted)]">{auth.pinSettingsDesc}</p>
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder={auth.pinNew}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl border border-[var(--ptm-bg)] bg-[var(--ptm-bg)] px-3 py-2 text-sm"
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder={auth.pinConfirmField}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl border border-[var(--ptm-bg)] bg-[var(--ptm-bg)] px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {message && <p className="text-xs text-green-600">{message}</p>}
          <Button type="button" disabled={busy || pin.length < 4} onClick={save}>
            {auth.pinSave}
          </Button>
        </div>
      </div>
    </PtmCard>
  );
}
