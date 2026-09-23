"use client";

import { useEffect, useState } from "react";
import { kk } from "@/i18n/kk";
import { getStreak } from "@/lib/gamification/rewards";

export function DailyStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  return (
    <div className="rounded-2xl bg-kid-orange px-4 py-2 text-white font-bold">
      🔥 {streak} {streak === 1 ? kk.rewards.day : kk.rewards.days}
    </div>
  );
}
