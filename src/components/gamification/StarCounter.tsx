"use client";

import { useEffect, useState } from "react";
import { getStars } from "@/lib/gamification/rewards";

export function StarCounter() {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    setStars(getStars());
    const interval = setInterval(() => setStars(getStars()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-lg font-bold text-kid-purple shadow-md">
      <span>⭐</span>
      <span>{stars}</span>
    </div>
  );
}
