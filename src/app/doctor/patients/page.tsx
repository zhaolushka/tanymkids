"use client";

import { PtmCard, PtmPageTitle, parentInitials } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function DoctorPatientsPage() {
  const { t } = useI18n();
  const auth = t.auth;
  const fa = t.familyAccess;

  return (
    <div className="space-y-4">
      <PtmPageTitle title={auth.doctorNavPatients} subtitle={auth.doctorPatientsDesc} />

      <PtmCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ptm-accent)]/90 to-[var(--ptm-accent-dark)] text-sm font-bold text-white">
            {parentInitials(fa.childName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold">{fa.childName}</p>
            <p className="text-xs text-[var(--ptm-muted)]">{auth.doctorAccessActive}</p>
          </div>
          <span className="rounded-full bg-[var(--ptm-accent)]/10 px-2.5 py-1 text-[10px] font-bold text-[var(--ptm-accent)]">
            {auth.doctorAccessBadge}
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--ptm-muted)]">{auth.doctorPatientNote}</p>
      </PtmCard>

      <PtmCard className="p-4">
        <p className="text-xs leading-relaxed text-[var(--ptm-muted)]">{auth.doctorPublicProfileHint}</p>
      </PtmCard>
    </div>
  );
}
