import { taskFingerBadges } from "@/lib/lessons/finger-labels";
import type { LessonTask } from "@/types/lesson";

interface TaskFingerBadgesProps {
  task: LessonTask;
  size?: "md" | "lg";
}

export function TaskFingerBadges({ task, size = "md" }: TaskFingerBadgesProps) {
  const badges = taskFingerBadges(task);
  if (badges.length === 0) return null;

  const textClass = size === "lg" ? "text-lg sm:text-xl" : "text-sm sm:text-base";

  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
      {badges.map((label) => (
        <span
          key={label}
          className={`rounded-full bg-kid-purple/15 px-2.5 py-1 font-bold text-kid-purple ${textClass}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
