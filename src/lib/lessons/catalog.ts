import lessonsData from "@/data/lessons/hands-lessons.json";
import type { Lesson } from "@/types/lesson";

export const handLessons = lessonsData as Lesson[];

export function getHandLesson(id: string): Lesson | undefined {
  return handLessons.find((lesson) => lesson.id === id);
}
