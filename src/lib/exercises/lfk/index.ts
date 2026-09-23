import { mirrorLandmarks } from "@/lib/cv/mirror-landmarks";
import { kk } from "@/i18n/kk";
import type { EvaluationResult, Landmark } from "@/types/exercise";
import { passScoreForLfkExercise, scoreForLfkExercise } from "./lfk-pose-score";

function poseOrNull(landmarks: Landmark[]): Landmark[] | null {
  return landmarks.length >= 33 ? landmarks : null;
}

function hintForExercise(exerciseId: string): string {
  switch (exerciseId) {
    case "neck_turn":
      return kk.lfk.hints.neckTurn;
    case "neck_tilt":
      return kk.lfk.hints.neckTilt;
    case "forearms_up":
      return kk.lfk.hints.forearmsUp;
    case "stand_calm":
      return kk.lfk.hints.standCalm;
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
  const raw = poseOrNull(landmarks);
  if (!raw) {
    return { success: false, accuracy: 0, hint: kk.lfk.hints.standInFrame };
  }

  const pose = mirrorLandmarks(raw);
  const score = scoreForLfkExercise(exerciseId, pose);
  const pass = passScoreForLfkExercise(exerciseId);
  const accuracy = score / 100;

  if (score >= pass) {
    return { success: true, accuracy: Math.max(accuracy, 0.55) };
  }

  if (score >= pass - 10) {
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
  neck_turn: (l) => evaluateScored("neck_turn", l),
  neck_tilt: (l) => evaluateScored("neck_tilt", l),
  forearms_up: (l) => evaluateScored("forearms_up", l),
  stand_calm: (l) => evaluateScored("stand_calm", l),
  grow_up: (l) => evaluateScored("grow_up", l),
  wings: (l) => evaluateScored("wings", l),
  airplane: (l) => evaluateScored("airplane", l),
  small_big: (l) => evaluateScored("small_big", l),
  bow_forward: (l) => evaluateScored("bow_forward", l),
};
