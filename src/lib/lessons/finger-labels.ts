import type { HandGesture, LessonTask } from "@/types/lesson";

export const fingerKk = {
  index: "көрсетші",
  middle: "әрте",
  ring: "сақина",
  pinky: "шошқа",
  palm: "алақан",
  fist: "жумырық",
  goat: "ешкі",
} as const;

export function labelsForGesture(gesture: HandGesture): string[] {
  switch (gesture) {
    case "index_up":
      return [fingerKk.index];
    case "peace":
      return [fingerKk.index, fingerKk.middle];
    case "ring":
      return [fingerKk.ring];
    case "palm":
      return [fingerKk.palm];
    case "fist":
      return [fingerKk.fist];
    case "goat":
      return [fingerKk.goat];
    default:
      return [];
  }
}

export function taskFingerBadges(task: LessonTask): string[] {
  const badges = new Set<string>();

  if (task.mode === "both_same" && task.gesture) {
    labelsForGesture(task.gesture).forEach((label) => badges.add(label));
  } else {
    if (task.leftGesture) labelsForGesture(task.leftGesture).forEach((label) => badges.add(label));
    if (task.rightGesture) labelsForGesture(task.rightGesture).forEach((label) => badges.add(label));
  }

  return [...badges];
}

export function taskUsesFingerBadges(task: LessonTask): boolean {
  return taskFingerBadges(task).length > 0;
}

export function soloStepBadges(task: LessonTask, soloGestureIndex: number): string[] {
  if (task.mode !== "solo_practice" || !task.soloGestures?.length) {
    return taskFingerBadges(task);
  }
  const gesture = task.soloGestures[soloGestureIndex];
  return gesture ? labelsForGesture(gesture) : [fingerKk.palm];
}
