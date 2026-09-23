"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { LfkSession } from "@/components/exercises/LfkSession";
import { SuccessAnimation } from "@/components/kid/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { lfkExercises } from "@/lib/exercises/catalog";
import { kk } from "@/i18n/kk";

export function LfkWorkoutSession() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const exercise = lfkExercises[index];
  const total = lfkExercises.length;

  const onStepComplete = useCallback(() => {
    if (index >= total - 1) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }, [index, total]);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="glass-card w-full space-y-3 p-8 text-center">
          <span className="text-6xl">🎉</span>
          <h2 className="text-3xl font-extrabold text-kid-purple">{kk.lfk.workoutDone}</h2>
        </div>
        <SuccessAnimation stars={3} />
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="kid"
            size="lg"
            onClick={() => {
              setDone(false);
              setIndex(0);
            }}
          >
            🔄
          </Button>
          <Link href="/kid/lfk">
            <Button variant="outline" size="lg">
              {kk.kid.backMenu}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <LfkSession
      exercise={exercise}
      stepIndex={index + 1}
      stepCount={total}
      onStepComplete={onStepComplete}
      backHref="/kid/lfk"
    />
  );
}
