"use client";

import { PtmCard, PtmPageTitle } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function DoctorMessagesPage() {
  const { t } = useI18n();
  const auth = t.auth;

  return (
    <div className="space-y-4">
      <PtmPageTitle title={auth.doctorNavMessages} subtitle={t.parent.messagesDesc} />
      <PtmCard className="p-6 text-center">
        <p className="text-sm text-[var(--ptm-muted)]">{t.parent.messagesEmpty}</p>
        <p className="mt-2 text-xs text-[var(--ptm-muted)]">{t.parent.soon}</p>
      </PtmCard>
    </div>
  );
}
