"use client";

import Link from "next/link";
import { BarChart3, Bell, Globe, Lock, User, type LucideIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/LocaleProvider";

type SettingsRow = {
  href: string;
  label: string;
  Icon: LucideIcon;
  soon?: boolean;
};

const rowIconClass = "h-5 w-5 shrink-0 text-muted-foreground";

export default function ParentSettingsPage() {
  const { t } = useI18n();

  const sections: SettingsRow[] = [
    { href: "/parent/profile", label: t.parent.settingsProfile, Icon: User },
    { href: "/parent/dashboard", label: t.parent.settingsChild, Icon: BarChart3 },
    { href: "/parent/messages", label: t.parent.settingsNotifications, Icon: Bell, soon: true },
    { href: "#", label: t.parent.settingsPrivacy, Icon: Lock, soon: true },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t.parent.settingsTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.parent.settingsDesc}</p>
      </div>

      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Globe className={rowIconClass} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{t.parent.settingsLanguage}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.parent.languageHint}</p>
            <LanguageSwitcher className="mt-3" />
          </div>
        </div>
      </Card>

      <Card className="divide-y divide-border overflow-hidden p-0">
        {sections.map((item) => (
          <div key={item.label}>
            {item.soon ? (
              <div className="flex items-center justify-between px-4 py-3 text-muted-foreground">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <item.Icon className={rowIconClass} aria-hidden />
                  {item.label}
                </span>
                <span className="text-xs">{t.parent.soon}</span>
              </div>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted/40"
              >
                <item.Icon className={rowIconClass} aria-hidden />
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </Card>
      <Link href="/" className="text-center text-sm text-muted-foreground hover:text-primary">
        {t.parent.exitKid}
      </Link>
    </div>
  );
}
