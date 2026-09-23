"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { kk } from "@/i18n/kk";
import { getSessionStats } from "@/lib/analytics/session-recorder";

export function StatsOverview() {
  const [stats, setStats] = useState({
    totalMinutes: 0,
    avgAccuracy: 0,
    totalStars: 0,
    sessionCount: 0,
  });

  useEffect(() => {
    setStats(getSessionStats());
  }, []);

  const items = [
    { label: kk.parent.sessions, value: stats.sessionCount, emoji: "📚" },
    { label: kk.parent.minutes, value: stats.totalMinutes, emoji: "⏱️" },
    { label: kk.parent.accuracy, value: `${Math.round(stats.avgAccuracy * 100)}%`, emoji: "🎯" },
    { label: kk.parent.stars, value: stats.totalStars, emoji: "⭐" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <p className="text-3xl mb-2">{item.emoji}</p>
          <CardTitle>{item.value}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
