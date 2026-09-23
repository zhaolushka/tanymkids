"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, Star, Target, type LucideIcon } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/LocaleProvider";
import { getSessionStats } from "@/lib/analytics/session-recorder";

export function StatsOverview({ telemed }: { telemed?: boolean }) {
  const { t } = useI18n();
  const [stats, setStats] = useState({
    totalMinutes: 0,
    avgAccuracy: 0,
    totalStars: 0,
    sessionCount: 0,
  });

  useEffect(() => {
    setStats(getSessionStats());
  }, []);

  const items: { label: string; value: string | number; Icon: LucideIcon }[] = [
    { label: t.parent.sessions, value: stats.sessionCount, Icon: BookOpen },
    { label: t.parent.minutes, value: stats.totalMinutes, Icon: Clock },
    { label: t.parent.accuracy, value: `${Math.round(stats.avgAccuracy * 100)}%`, Icon: Target },
    { label: t.parent.stars, value: stats.totalStars, Icon: Star },
  ];

  if (telemed) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-[var(--ptm-radius-md)] bg-[var(--ptm-card)] p-3 text-center shadow-[var(--ptm-shadow-sm)]"
          >
            <div className="mb-1 flex justify-center text-[var(--ptm-accent)]">
              <item.Icon className="h-7 w-7" aria-hidden />
            </div>
            <p className="text-lg font-bold text-[var(--ptm-text)]">{item.value}</p>
            <p className="text-xs text-[var(--ptm-muted)]">{item.label}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <div className="mb-2 flex justify-center text-primary">
            <item.Icon className="h-8 w-8" aria-hidden />
          </div>
          <CardTitle>{item.value}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
