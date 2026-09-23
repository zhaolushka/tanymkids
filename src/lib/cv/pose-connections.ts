/** MediaPipe Pose — торс, бас, аяқ (толық дене). */
export const POSE_BODY_CONNECTIONS: ReadonlyArray<[number, number]> = [
  [0, 11],
  [0, 12],
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
];

/** Барлық көрінетін нүктелер */
export const POSE_BODY_JOINTS: readonly number[] = [
  0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28,
];

export const POSE_COLORS = {
  line: "rgba(147, 51, 234, 0.85)",
  joint: "rgba(255, 255, 255, 0.95)",
  highlight: "rgba(34, 197, 94, 0.95)",
  ghostLine: "rgba(251, 146, 60, 0.55)",
  ghostJoint: "rgba(251, 146, 60, 0.75)",
} as const;

/** Ключевые точки для подсветки по упражнению */
export function poseHighlightIndices(exerciseId: string): readonly number[] {
  switch (exerciseId) {
    case "grow_up":
    case "arms_up":
      return [13, 14, 15, 16];
    case "wings":
    case "arms_side":
      return [13, 14, 15, 16];
    case "airplane":
    case "side_bend":
      return [11, 12, 23, 24];
    case "bow_forward":
    case "forward_bend":
      return [0, 11, 12, 15, 16, 23, 24];
    case "small_big":
    case "squat":
      return [23, 24, 25, 26, 27, 28];
    case "one_leg_balance":
      return [27, 28, 25, 26];
    default:
      return [11, 12, 23, 24];
  }
}
