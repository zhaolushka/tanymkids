import lessonsData from "@/data/lessons/lfk-lessons.json";
import type { Lesson } from "@/types/lesson";

export const lfkLessons = lessonsData as Lesson[];

export function getLfkLesson(id: string): Lesson | undefined {
  return lfkLessons.find((lesson) => lesson.id === id);
}
