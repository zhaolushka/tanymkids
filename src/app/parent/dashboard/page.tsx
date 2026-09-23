"use client";

import { SessionChart } from "@/components/parent/SessionChart";
import { StatsOverview } from "@/components/parent/StatsOverview";
import { Card, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentDashboardPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{t.parent.statsTitle}</h1>
        <p className="mt-1 text-muted-foreground">{t.parent.statsDesc}</p>
      </div>

      <StatsOverview />

      <Card>
        <CardTitle className="mb-4">{t.parent.activity}</CardTitle>
        <SessionChart />
      </Card>
    </div>
  );
}
