import { distance } from "@/lib/cv/angles";
import { fingerStretchRatio } from "@/lib/cv/hand-landmarks";
import { isFist, isGoatGesture, isOpenPalm, isRingGesture } from "@/lib/cv/gestures";
import { evaluateBothHands } from "@/lib/exercises/hands/evaluate-both-hands";
import { kk } from "@/i18n/kk";
import type { EvaluationResult, Landmark } from "@/types/exercise";

function evaluateGoatSingle(landmarks: Landmark[]): EvaluationResult {
  if (landmarks.length < 21) {
    return { success: false, accuracy: 0, hint: kk.hands.hints.showPalm };
  }

  if (isGoatGesture(landmarks)) {
    return { success: true, accuracy: 1 };
  }

  const ringRatio = fingerStretchRatio(landmarks, 16, 14, 13);
  const pinkyRatio = fingerStretchRatio(landmarks, 20, 18, 17);
  const indexRatio = fingerStretchRatio(landmarks, 8, 6, 5);
  const middleRatio = fingerStretchRatio(landmarks, 12, 10, 9);

  const ringUp = ringRatio >= 1.04;
  const pinkyUp = pinkyRatio >= 1.03;

  if (!ringUp || !pinkyUp) {
    return { success: false, accuracy: 0.35, hint: kk.hands.hints.goatRaise };
  }

  if (indexRatio > ringRatio - 0.08 || middleRatio > pinkyRatio - 0.08) {
    return { success: false, accuracy: 0.4, hint: kk.hands.hints.goatFold };
  }

  return { success: false, accuracy: 0.5, hint: kk.hands.hints.goatDemo };
}

function evaluateRingSingle(landmarks: Landmark[]): EvaluationResult {
  if (landmarks.length < 21) {
    return { success: false, accuracy: 0, hint: kk.hands.hints.showPalm };
  }

  if (isRingGesture(landmarks)) {
    return { success: true, accuracy: 1 };
  }

  const ringDist = distance(landmarks[4], landmarks[8]);
  if (ringDist >= 0.14) {
    return { success: false, accuracy: 0.3, hint: kk.hands.hints.ringJoin };
  }

  return { success: false, accuracy: 0.3, hint: kk.hands.hints.ringStraight };
}

function evaluatePalmFistSingle(landmarks: Landmark[]): EvaluationResult {
  if (landmarks.length < 21) {
    return { success: false, accuracy: 0, hint: kk.hands.hints.showPalm };
  }

  if (isOpenPalm(landmarks) || isFist(landmarks)) {
    return { success: true, accuracy: 0.9 };
  }

  return { success: false, accuracy: 0.2, hint: kk.hands.hints.palmOrFist };
}

function evaluateCatchShapeSingle(landmarks: Landmark[]): EvaluationResult {
  if (landmarks.length < 21) {
    return { success: false, accuracy: 0, hint: kk.hands.hints.toFrame };
  }

  const indexTip = landmarks[8];
  const inZone =
    indexTip.x > 0.25 && indexTip.x < 0.75 && indexTip.y > 0.22 && indexTip.y < 0.78;

  if (inZone) return { success: true, accuracy: 1 };

  return { success: false, accuracy: 0.3, hint: kk.hands.hints.moveToFrame };
}

export function evaluateHands(exerciseId: string, hands: Landmark[][]): EvaluationResult {
  const evaluators: Record<string, (landmarks: Landmark[]) => EvaluationResult> = {
    goat: evaluateGoatSingle,
    ring: evaluateRingSingle,
    palm_fist: evaluatePalmFistSingle,
    catch_shape: evaluateCatchShapeSingle,
  };

  const evaluateSingle = evaluators[exerciseId];
  if (!evaluateSingle) {
    return { success: false, accuracy: 0, hint: kk.hands.hints.notFound };
  }

  if (exerciseId === "catch_shape") {
    if (hands.length === 0) {
      return { success: false, accuracy: 0, hint: kk.hands.hints.toFrame };
    }
    const results = hands.map(evaluateCatchShapeSingle);
    const best = results.find((result) => result.success);
    if (best) return best;
    return results[0] ?? { success: false, accuracy: 0, hint: kk.hands.hints.moveToFrame };
  }

  return evaluateBothHands(hands, evaluateSingle);
}
