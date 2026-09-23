"use client";

import Link from "next/link";
import { BarChart3, ChevronRight, Home, Settings, Shield, Sparkles } from "lucide-react";
import { OpenKidLessonLink } from "@/components/auth/OpenKidLessonLink";
import { PtmCard, PtmPageTitle, parentInitials } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentProfilePage() {
  const { t } = useI18n();
  const tm = t.telemed;
  const fa = t.familyAccess;

  return (
    <div className="space-y-4">
      <PtmPageTitle title={t.parent.navProfile} />
      <PtmCard className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[var(--ptm-accent)] to-[var(--ptm-accent-dark)]" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--ptm-card)] bg-[var(--ptm-bg)] text-lg font-bold text-[var(--ptm-accent)]">
            {parentInitials(tm.userName)}
          </div>
          <p className="mt-3 text-xl font-bold">{t.parent.profileName}</p>
          <p className="text-sm text-[var(--ptm-muted)]">{t.parent.profileRole}</p>
          <p className="mt-2 text-sm">{t.parent.profileBio}</p>
        </div>
      </PtmCard>

      <div>
        <p className="mb-2 text-sm font-bold text-[var(--ptm-text)]">{fa.familyProfiles}</p>
        <PtmCard className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ptm-accent)]/90 to-[var(--ptm-accent-dark)] text-sm font-bold text-white">
            {parentInitials(fa.childName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold">{fa.childName}</p>
            <p className="text-xs text-[var(--ptm-muted)]">{fa.profileAccessSubtitle}</p>
          </div>
          <Link
            href="/parent/family-access"
            className="shrink-0 rounded-xl bg-[var(--ptm-accent)] px-3 py-2 text-xs font-bold text-white"
          >
            {fa.manageAccess}
          </Link>
        </PtmCard>
      </div>

      <PtmCard className="divide-y divide-[var(--ptm-bg)]">
        <RowLink href="/parent/dashboard" icon={BarChart3} label={t.parent.childStats} />
        <RowLink href="/parent/family-access" icon={Shield} label={fa.title} />
        <RowLink href="/parent/settings" icon={Settings} label={t.parent.navSettings} />
        <OpenKidLessonLink icon={Sparkles} label={t.parent.switchChildMode} />
        <RowLink href="/" icon={Home} label={t.parent.exitKid} />
      </PtmCard>
    </div>
  );
}

function RowLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Settings;
  label: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium">
      <Icon className="h-5 w-5 text-[var(--ptm-accent)]" aria-hidden />
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-[var(--ptm-muted)]" aria-hidden />
    </Link>
  );
}
