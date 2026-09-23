"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import {
  getParentHomeShortcuts,
  parentHomeShortcutDesc,
} from "@/components/parent/parent-nav-icons";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentHomePage() {
  const { t } = useI18n();
  const shortcuts = useMemo(() => getParentHomeShortcuts(t), [t]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <CardTitle className="text-xl">{t.parent.homeWelcome}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">{t.parent.homeWelcomeDesc}</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {shortcuts.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="flex h-full flex-row items-start gap-3 p-4 transition-shadow hover:shadow-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-bold text-foreground">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {parentHomeShortcutDesc(t, item.href)}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
