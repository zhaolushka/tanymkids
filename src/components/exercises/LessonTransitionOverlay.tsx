import { TaskFingerBadges } from "@/components/kid/TaskFingerBadges";
import { lessonsKk } from "@/i18n/lessons";
import { taskUsesFingerBadges } from "@/lib/lessons/finger-labels";
import type { LessonTask } from "@/types/lesson";

interface LessonTransitionOverlayProps {
  pauseCountdown: number;
  nextTask: LessonTask | null;
  taskJustCompleted: boolean;
  transitioning: boolean;
}

export function LessonTransitionOverlay({
  nextTask,
  taskJustCompleted,
  transitioning,
}: LessonTransitionOverlayProps) {
  if (taskJustCompleted) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-kid-green/35 backdrop-blur-sm">
        <div className="glass-card px-10 py-8 text-center">
          <p className="text-5xl">🎉</p>
          <p className="mt-2 text-2xl font-extrabold text-kid-purple">{lessonsKk.taskDone}</p>
        </div>
      </div>
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
