/** Саусақ сабақтары: в начале чуть медленнее */
export function lessonPlaybackRate(taskIndex: number, taskCount: number): number {
  if (taskCount <= 1) return 0.4;
  const t = taskIndex / (taskCount - 1);
  return Math.min(1, 0.35 + t * 0.65);
}

/** ЛФК: нормальная скорость видео с первого шага */
export function lfkLessonPlaybackRate(): number {
  return 1;
}
