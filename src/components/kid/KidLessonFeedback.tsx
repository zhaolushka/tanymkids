"use client";

import type { FeedbackStatus } from "@/components/kid/ExerciseFeedback";
import { lessonsKk } from "@/i18n/lessons";

interface KidLessonFeedbackProps {
  status: FeedbackStatus;
  /** Короткая подпись для «жду камеру» (по умолчанию — қол) */
  waitingLabel?: string;
}

const statusVisual: Record<
  FeedbackStatus,
  { emoji: string; label: string; className: string }
> = {
  waiting: {
    emoji: "👋",
    label: lessonsKk.kid.hands,
    className: "bg-kid-orange/20 ring-kid-orange",
  },
  detecting: {
    emoji: "👀",
    label: lessonsKk.kid.copy,
    className: "bg-white/90 ring-kid-purple/30",
  },
  almost: {
    emoji: "👍",
    label: lessonsKk.kid.almost,
    className: "bg-kid-yellow/25 ring-kid-yellow",
  },
  correct: {
    emoji: "⭐",
    label: lessonsKk.kid.hold,
    className: "bg-kid-green/25 ring-kid-green",
  },
  wrong: {
    emoji: "🔄",
    label: lessonsKk.kid.again,
    className: "bg-red-100/90 ring-red-300",
  },
};

export function KidLessonFeedback({ status, waitingLabel }: KidLessonFeedbackProps) {
  const visual = { ...statusVisual[status] };
  if (status === "waiting" && waitingLabel) {
    visual.label = waitingLabel;
  }

  return (
    <div
      className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-4 ring-2 ${visual.className}`}
    >
      <span className="text-5xl leading-none" aria-hidden>
        {visual.emoji}
      </span>
      <span className="text-xl font-extrabold text-kid-purple">{visual.label}</span>
    </div>
  );
}
