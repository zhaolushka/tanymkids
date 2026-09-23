import { SessionChart } from "@/components/parent/SessionChart";
import { StatsOverview } from "@/components/parent/StatsOverview";
import { Card, CardTitle } from "@/components/ui/card";
import { kk } from "@/i18n/kk";

export default function ParentDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{kk.parent.statsTitle}</h1>
        <p className="text-muted-foreground mt-1">{kk.parent.statsDesc}</p>
      </div>

      <StatsOverview />

      <Card>
        <CardTitle className="mb-4">{kk.parent.activity}</CardTitle>
        <SessionChart />
      </Card>
    </div>
  );
}
