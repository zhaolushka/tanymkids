"use client";

import { useEffect, useState } from "react";
import { kk } from "@/i18n/kk";
import { getStars } from "@/lib/gamification/rewards";

export function PetWidget() {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    setStars(getStars());
  }, []);

  const level = Math.floor(stars / 10);
  const pet = level >= 3 ? "🦋" : level >= 1 ? "🐣" : "🥚";

  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-6 shadow-md">
      <span className="text-7xl">{pet}</span>
      <p className="text-lg font-bold text-kid-purple">{kk.rewards.pet}</p>
      <p className="text-sm text-muted-foreground">
        {kk.rewards.level} {level}
      </p>
    </div>
  );
}
