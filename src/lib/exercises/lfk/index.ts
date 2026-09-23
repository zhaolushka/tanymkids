import { kk } from "@/i18n/kk";
import type { EvaluationResult, Landmark } from "@/types/exercise";
import { LFK_PASS_SCORE, scoreForLfkExercise } from "./lfk-pose-score";

function poseOrNull(landmarks: Landmark[]): Landmark[] | null {
  return landmarks.length >= 33 ? landmarks : null;
}

function hintForExercise(exerciseId: string): string {
  switch (exerciseId) {
    case "grow_up":
      return kk.lfk.hints.growUp;
    case "wings":
      return kk.lfk.hints.wings;
    case "airplane":
      return kk.lfk.hints.airplane;
    case "small_big":
      return kk.lfk.hints.smallBig;
    case "bow_forward":
      return kk.lfk.hints.bowForward;
    default:
      return kk.lfk.hints.watchDemo;
  }
}

function evaluateScored(exerciseId: string, landmarks: Landmark[]): EvaluationResult {
  const pose = poseOrNull(landmarks);
  if (!pose) {
    return { success: false, accuracy: 0, hint: kk.lfk.hints.standInFrame };
  }

  const score = scoreForLfkExercise(exerciseId, pose);
  const accuracy = score / 100;

  if (score >= LFK_PASS_SCORE) {
    return { success: true, accuracy: Math.max(accuracy, 0.55) };
  }

  if (score >= LFK_PASS_SCORE - 12) {
    return {
      success: false,
      accuracy,
      partial: true,
      hint: kk.lfk.hints.almost,
    };
  }

  return { success: false, accuracy, hint: hintForExercise(exerciseId) };
}

export const lfkEvaluators: Record<string, (landmarks: Landmark[]) => EvaluationResult> = {
  grow_up: (l) => evaluateScored("grow_up", l),
  wings: (l) => evaluateScored("wings", l),
  airplane: (l) => evaluateScored("airplane", l),
  small_big: (l) => evaluateScored("small_big", l),
  bow_forward: (l) => evaluateScored("bow_forward", l),
};
