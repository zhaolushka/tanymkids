import { TaskFingerBadges } from "@/components/kid/TaskFingerBadges";
import { lessonsKk } from "@/i18n/lessons";
import { taskUsesFingerBadges } from "@/lib/lessons/finger-labels";
import type { LessonTask } from "@/types/lesson";

interface LessonTransitionOverlayProps {
  pauseCountdown: number;
  nextTask: LessonTask | null;
  taskJustCompleted: boolean;
  transitioning: boolean;
  onTapNext?: () => void;
  repIndex?: number;
  repCount?: number;
  roundIndex?: number;
  roundCount?: number;
}

export function LessonTransitionOverlay({
  nextTask,
  taskJustCompleted,
  transitioning,
  onTapNext,
  repIndex = 0,
  repCount = 1,
  roundIndex = 0,
  roundCount = 1,
}: LessonTransitionOverlayProps) {
  if (taskJustCompleted) {
    const moreReps = repIndex < repCount - 1;
    const nextRound = !moreReps && roundIndex < roundCount - 1;
    const taskDone = !moreReps && !nextRound;
    return (
      <button
        type="button"
        onClick={onTapNext}
        className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-kid-green/35 backdrop-blur-sm touch-manipulation"
        aria-label={lessonsKk.skipTask}
      >
        <div className="glass-card px-10 py-8 text-center pointer-events-none">
          <p className="text-5xl">{taskDone ? "🎉" : nextRound ? "📺" : "👍"}</p>
          <p className="mt-2 text-2xl font-extrabold text-kid-purple">
            {taskDone ? lessonsKk.taskDone : nextRound ? lessonsKk.roundAgain : lessonsKk.kid.again}
          </p>
          {moreReps ? (
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              {lessonsKk.repLabel} {repIndex + 2}/{repCount}
              {roundCount > 1 ? ` · ${lessonsKk.roundLabel} ${roundIndex + 1}/${roundCount}` : ""}
            </p>
          ) : nextRound ? (
            <p className="mt-2 text-sm font-bold text-muted-foreground">
              {lessonsKk.roundLabel} {roundIndex + 2}/{roundCount}
            </p>
          ) : (
            <p className="mt-2 text-sm font-bold text-kid-orange">{lessonsKk.skipShort} →</p>
          )}
        </div>
      </button>
    );
  }

  if (!transitioning || !nextTask) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center bg-kid-purple/25 pt-4 backdrop-blur-[2px]">
      <div className="rounded-2xl bg-white/90 px-4 py-2 shadow-md">
        {taskUsesFingerBadges(nextTask) ? (
          <TaskFingerBadges task={nextTask} size="md" />
        ) : (
          nextTask.emoji && <p className="text-3xl">{nextTask.emoji}</p>
        )}
      </div>
    </div>
  );
}
