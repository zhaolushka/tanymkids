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
import { useI18n } from "@/i18n/LocaleProvider";
import { getSessions } from "@/lib/analytics/session-recorder";

type ChartPoint = {
  date: string;
  minutes: number;
  accuracy: number;
};

export function SessionChart({ telemed }: { telemed?: boolean }) {
  const { t, locale } = useI18n();
  const barFill = telemed ? "#2f6bff" : "#7c3aed";
  const [data, setData] = useState<ChartPoint[] | null>(null);

  useEffect(() => {
    const dateLocale = locale === "ru" ? "ru-RU" : "kk-KZ";
    const sessions = getSessions().slice(0, 7).reverse();
    setData(
      sessions.map((s) => ({
        date: new Date(s.startedAt).toLocaleDateString(dateLocale, {
          day: "numeric",
          month: "short",
        }),
        minutes: Math.round(s.durationSec / 60),
        accuracy: Math.round(s.avgAccuracy * 100),
      })),
    );
  }, [locale]);

  if (data === null) {
    return (
      <div
        className={`h-[250px] w-full rounded-xl ${telemed ? "bg-[var(--ptm-bg)]" : "bg-muted/30"}`}
        aria-hidden
      />
    );
  }

  if (data.length === 0) {
    return (
      <p className={`py-8 text-center ${telemed ? "text-[var(--ptm-muted)]" : "text-muted-foreground"}`}>
        {t.parent.noData}
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="minutes" fill={barFill} name={t.parent.minutes} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
