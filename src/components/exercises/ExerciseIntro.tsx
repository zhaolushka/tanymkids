"use client";

import { ExerciseDemoPlayer } from "@/components/exercises/ExerciseDemoPlayer";
import { Mascot } from "@/components/kid/Mascot";
import { Button } from "@/components/ui/button";
import { kk } from "@/i18n/kk";
import type { Exercise } from "@/types/exercise";

interface ExerciseIntroProps {
  exercise: Exercise;
  onStart: () => void;
}

export function ExerciseIntro({ exercise, onStart }: ExerciseIntroProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-4xl font-bold text-kid-purple">
        {exercise.emoji} {exercise.title}
      </h1>

      <ExerciseDemoPlayer exercise={exercise} />

      <Mascot message={`${exercise.instruction} ${kk.feedback.repeatDemo}`} />

      <Button variant="kid" size="xl" onClick={onStart}>
        {kk.demo.ready}
      </Button>
    </div>
  );
}
