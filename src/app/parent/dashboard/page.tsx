"use client";

import { SessionChart } from "@/components/parent/SessionChart";
import { StatsOverview } from "@/components/parent/StatsOverview";
import { PtmCard, PtmPageTitle } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentDashboardPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <PtmPageTitle title={t.parent.statsTitle} subtitle={t.parent.statsDesc} />
      <StatsOverview telemed />
      <PtmCard className="p-4">
        <p className="mb-3 text-sm font-bold">{t.parent.activity}</p>
        <SessionChart telemed />
      </PtmCard>
    </div>
  );
}
