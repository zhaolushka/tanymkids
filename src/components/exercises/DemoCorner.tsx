"use client";

import { useState } from "react";
import { ExerciseDemoPlayer } from "@/components/exercises/ExerciseDemoPlayer";
import { kk } from "@/i18n/kk";
import type { Exercise } from "@/types/exercise";

interface DemoCornerProps {
  exercise: Exercise;
}

export function DemoCorner({ exercise }: DemoCornerProps) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-3 left-3 z-20 rounded-full bg-kid-purple px-4 py-2 text-sm font-bold text-white shadow-lg"
      >
        📺 {kk.demo.howTo}
      </button>
    );
  }

  return (
    <div className="absolute bottom-3 left-3 z-20 w-[140px] overflow-hidden rounded-2xl border-2 border-white bg-white/95 shadow-xl sm:w-[180px]">
      <div className="flex items-center justify-between bg-kid-purple px-2 py-1">
        <span className="text-xs font-bold text-white">{kk.demo.example}</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-white/80 hover:text-white"
          aria-label={kk.demo.hideExample}
        >
          ✕
        </button>
      </div>
      <ExerciseDemoPlayer exercise={exercise} compact showSteps={false} />
    </div>
  );
}
