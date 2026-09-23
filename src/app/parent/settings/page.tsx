"use client";

import Link from "next/link";
import { BarChart3, Bell, Globe, Lock, User, type LucideIcon } from "lucide-react";
import { ParentPinSettings } from "@/components/auth/ParentPinSettings";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { PtmCard, PtmPageTitle } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentSettingsPage() {
  const { t } = useI18n();

  const rows: { href: string; label: string; Icon: LucideIcon; soon?: boolean }[] = [
    { href: "/parent/profile", label: t.parent.settingsProfile, Icon: User },
    { href: "/parent/dashboard", label: t.parent.settingsChild, Icon: BarChart3 },
    { href: "/parent/messages", label: t.parent.settingsNotifications, Icon: Bell, soon: true },
    { href: "/parent/family-access", label: t.parent.settingsPrivacy, Icon: Lock },
  ];

  return (
    <div className="space-y-4">
      <PtmPageTitle title={t.parent.settingsTitle} subtitle={t.parent.settingsDesc} />
      <ParentPinSettings />
      <PtmCard className="p-4">
        <div className="flex gap-3">
          <Globe className="h-5 w-5 shrink-0 text-[var(--ptm-muted)]" aria-hidden />
          <div className="flex-1">
            <p className="text-sm font-medium">{t.parent.settingsLanguage}</p>
            <p className="mt-1 text-xs text-[var(--ptm-muted)]">{t.parent.languageHint}</p>
            <LanguageSwitcher className="mt-3" telemed />
          </div>
        </div>
      </PtmCard>
      <PtmCard className="divide-y divide-[var(--ptm-bg)] overflow-hidden">
        {rows.map((item) =>
          item.soon ? (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-3 text-[var(--ptm-muted)]"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <item.Icon className="h-5 w-5" aria-hidden />
                {item.label}
              </span>
              <span className="text-xs">{t.parent.soon}</span>
            </div>
          ) : (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm font-medium">
              <item.Icon className="h-5 w-5 text-[var(--ptm-muted)]" aria-hidden />
              {item.label}
            </Link>
          ),
        )}
      </PtmCard>
    </div>
  );
}
