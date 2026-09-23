"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { lessonsKk } from "@/i18n/lessons";

interface LessonCardProps {
  id: string;
  number: number;
  title: string;
  description: string;
  emoji: string;
  durationMin: number;
  taskCount: number;
  unlocked: boolean;
  completed: boolean;
}

export function LessonCard({
  id,
  number,
  title,
  description,
  emoji,
  durationMin,
  taskCount,
  unlocked,
  completed,
}: LessonCardProps) {
  const content = (
    <div
      className={cn(
        "lesson-card group relative overflow-hidden p-6 transition-all",
        unlocked ? "cursor-pointer hover:-translate-y-1" : "cursor-not-allowed opacity-60",
        completed && "ring-2 ring-kid-green/50",
      )}
    >
      <div className="absolute -right-4 -top-4 text-8xl opacity-10 transition group-hover:opacity-20">
        {emoji}
      </div>

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-lg",
            completed
              ? "bg-gradient-to-br from-kid-green to-emerald-500"
              : unlocked
                ? "bg-gradient-to-br from-primary to-violet-400"
                : "bg-gray-300",
          )}
        >
          {completed ? "✓" : number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <h3 className="text-lg font-bold text-kid-purple">{title}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-kid-blue/15 px-2.5 py-1 text-kid-purple">
              ~{durationMin} {lessonsKk.minutes}
            </span>
            <span className="rounded-full bg-kid-yellow/20 px-2.5 py-1 text-kid-purple">
              {taskCount} {lessonsKk.tasks}
            </span>
            {!unlocked && (
              <span className="rounded-full bg-gray-200 px-2.5 py-1 text-gray-600">
                🔒 {lessonsKk.locked}
              </span>
            )}
            {completed && (
              <span className="rounded-full bg-kid-green/20 px-2.5 py-1 text-green-700">
                ✓ {lessonsKk.done}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={`/kid/hands/lesson/${id}`} className="block">
      {content}
    </Link>
  );
}
