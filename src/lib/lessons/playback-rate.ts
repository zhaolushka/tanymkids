/** Сначала медленно, к концу урока — почти нормальная скорость */
export function lessonPlaybackRate(taskIndex: number, taskCount: number): number {
  if (taskCount <= 1) return 0.4;
  const t = taskIndex / (taskCount - 1);
  return Math.min(1, 0.35 + t * 0.65);
}
