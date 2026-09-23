"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { kk } from "@/i18n/kk";
import { getSessions } from "@/lib/analytics/session-recorder";

type ChartPoint = {
  date: string;
  minutes: number;
  accuracy: number;
};

export function SessionChart() {
  const [data, setData] = useState<ChartPoint[] | null>(null);

  useEffect(() => {
    const sessions = getSessions().slice(0, 7).reverse();
    setData(
      sessions.map((s) => ({
        date: new Date(s.startedAt).toLocaleDateString("kk-KZ", {
          day: "numeric",
          month: "short",
        }),
        minutes: Math.round(s.durationSec / 60),
        accuracy: Math.round(s.avgAccuracy * 100),
      })),
    );
  }, []);

  if (data === null) {
    return (
      <div
        className="h-[250px] w-full rounded-xl bg-muted/30"
        aria-hidden
      />
    );
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">{kk.parent.noData}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="minutes" fill="#7c3aed" name={kk.parent.minutes} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
