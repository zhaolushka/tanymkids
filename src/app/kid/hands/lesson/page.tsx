"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LessonCard } from "@/components/kid/LessonCard";
import { handLessons } from "@/lib/lessons/catalog";
import { getCompletedLessons, isLessonUnlocked } from "@/lib/lessons/progress";
import { kk } from "@/i18n/kk";
import { lessonsKk } from "@/i18n/lessons";

export default function HandsLessonListPage() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCompletedLessons());
  }, []);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-kid-purple">{lessonsKk.title}</h1>
          <p className="mt-1 text-muted-foreground">{lessonsKk.subtitle}</p>
        </div>
        <Link href="/kid/hands" className="text-sm text-muted-foreground hover:underline">
          {kk.kid.backMenu}
        </Link>
      </div>

      <div className="grid gap-4">
        {handLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            number={lesson.number}
            title={lesson.title}
            description={lesson.description}
            emoji={lesson.emoji}
            durationMin={lesson.durationMin}
            taskCount={lesson.tasks.length}
            unlocked={isLessonUnlocked(lesson.id, completed)}
            completed={completed.includes(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}
