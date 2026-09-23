import { kk } from "@/i18n/kk";

interface LessonProgressHeaderProps {
  lessonTitle: string;
  taskIndex: number;
  taskCount: number;
  taskTitle: string;
  elapsedSec: number;
  durationMin: number;
  lessonProgress: number;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LessonProgressHeader({
  lessonTitle,
  taskIndex,
  taskCount,
  taskTitle,
  elapsedSec,
  durationMin,
  lessonProgress,
}: LessonProgressHeaderProps) {
  return (
    <div className="glass-card space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{lessonTitle}</p>
          <h2 className="text-xl font-bold text-kid-purple">
            {taskIndex + 1}/{taskCount} · {taskTitle}
          </h2>
        </div>
        <div className="rounded-2xl bg-kid-purple/10 px-3 py-1.5 text-sm font-bold text-kid-purple">
          {formatTime(elapsedSec)} / ~{durationMin} {kk.lessons.minutes}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>{kk.lessons.progress}</span>
          <span>{Math.round(lessonProgress)}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-kid-blue to-primary transition-all duration-300"
            style={{ width: `${Math.min(100, lessonProgress)}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: taskCount }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-all ${
              index < taskIndex
                ? "bg-kid-green"
                : index === taskIndex
                  ? "bg-kid-yellow animate-pulse"
                  : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
