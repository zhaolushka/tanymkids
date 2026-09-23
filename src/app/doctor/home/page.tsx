"use client";

import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { PtmCard, PtmPageTitle } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function DoctorHomePage() {
  const { t } = useI18n();
  const auth = t.auth;

  return (
    <div className="space-y-4">
      <PtmPageTitle title={auth.doctorHomeTitle} subtitle={auth.doctorHomeDesc} />

      <PtmCard className="divide-y divide-[var(--ptm-bg)] overflow-hidden">
        <Link href="/doctor/patients" className="flex items-center gap-3 p-4">
          <Users className="h-5 w-5 text-[var(--ptm-accent)]" aria-hidden />
          <span className="flex-1 text-sm font-bold">{auth.doctorNavPatients}</span>
          <ChevronRight className="h-4 w-4 text-[var(--ptm-muted)]" />
        </Link>
        <Link href="/doctor/messages" className="flex items-center gap-3 p-4">
          <span className="flex-1 text-sm font-medium">{auth.doctorNavMessages}</span>
          <span className="text-xs text-[var(--ptm-muted)]">{t.parent.soon}</span>
        </Link>
      </PtmCard>

      <PtmCard className="p-4">
        <p className="text-xs text-[var(--ptm-muted)]">{auth.doctorDbHint}</p>
      </PtmCard>
    </div>
  );
}
