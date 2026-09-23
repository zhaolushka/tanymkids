"use client";

import { kk } from "@/i18n/kk";

export type FeedbackStatus = "waiting" | "detecting" | "almost" | "correct" | "wrong";

interface ExerciseFeedbackProps {
  status: FeedbackStatus;
  hint?: string | null;
  taskLabel?: string;
}

export function ExerciseFeedback({ status, hint, taskLabel }: ExerciseFeedbackProps) {
  if (status === "waiting") {
    return (
      <div className="rounded-2xl bg-kid-orange/15 px-4 py-3 text-center">
        <p className="text-lg font-bold text-kid-orange">
          {hint ?? kk.feedback.standFull}
        </p>
      </div>
    );
  }

  if (status === "detecting") {
    return (
      <div className="rounded-2xl bg-white/90 px-4 py-3 text-center shadow-sm">
        <p className="text-lg font-medium text-kid-purple">
          {hint ?? kk.feedback.repeatDemo}
        </p>
      </div>
    );
  }

  if (status === "almost") {
    return (
      <div className="rounded-2xl bg-kid-yellow/25 px-4 py-3 text-center ring-2 ring-kid-yellow">
        <p className="text-lg font-bold text-kid-purple">
          👍 {hint ?? kk.feedback.almostDefault}
        </p>
      </div>
    );
  }

  if (status === "correct") {
    return (
      <div className="rounded-2xl bg-kid-green/20 px-4 py-3 text-center ring-2 ring-kid-green">
        <p className="text-lg font-bold text-green-700">
          ✓ {kk.feedback.correct} {taskLabel ? `${taskLabel} — ${kk.feedback.hold}` : kk.feedback.hold}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-red-100 px-4 py-3 text-center ring-2 ring-red-400 animate-pulse">
      <p className="text-lg font-bold text-red-700">
        ⚠ {kk.feedback.wrong} {hint ?? kk.feedback.lookDemo}
      </p>
    </div>
  );
}
