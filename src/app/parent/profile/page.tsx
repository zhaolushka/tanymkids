"use client";

import Link from "next/link";
import { BarChart3, Sparkles, Users } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentProfilePage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden p-0">
        <div className="h-20 bg-gradient-to-r from-primary/30 to-kid-blue/40" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-card bg-primary/15 text-primary">
            <Users className="h-9 w-9" aria-hidden />
          </div>
          <CardTitle className="mt-3 text-xl">{t.parent.profileName}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.parent.profileRole}</p>
          <p className="mt-3 text-sm">{t.parent.profileBio}</p>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-bold">{t.parent.profileLinks}</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li>
            <Link
              href="/parent/dashboard"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
              {t.parent.childStats}
            </Link>
          </li>
          <li>
            <Link href="/kid" className="inline-flex items-center gap-2 text-primary hover:underline">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              {t.parent.profileOpenKid}
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
