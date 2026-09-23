const STORAGE_KEY = "tanymkids-completed-lessons";

export function getCompletedLessons(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const LESSON_ORDER = ["neuro-7", "lesson-2", "lesson-3", "lesson-4"];

export function isLessonUnlocked(_lessonId: string, _completed: string[]): boolean {
  return true;
}

export function markLessonComplete(lessonId: string): void {
  if (typeof window === "undefined") return;
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed, lessonId]));
  }
}
