import type { HandGesture } from "@/types/lesson";
import type { EvaluationResult, Landmark } from "@/types/exercise";
import { fingerStretchRatio, isFingerExtended } from "@/lib/cv/hand-landmarks";
import { LESSON_GESTURE_PASS, scoreGestureForLesson } from "@/lib/cv/gesture-score-lesson";
import { isFist, isGoatGesture, isOpenPalm, isRingGesture } from "@/lib/cv/gestures";
import { kk } from "@/i18n/kk";
import { lessonsKk } from "@/i18n/lessons";

export function isPeaceGesture(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const indexUp = isFingerExtended(landmarks, 8, 6, 5);
  const middleUp = isFingerExtended(landmarks, 12, 10, 9);
  const ringDown = !isFingerExtended(landmarks, 16, 14, 13);
  const pinkyDown = !isFingerExtended(landmarks, 20, 18, 17);
  return indexUp && middleUp && ringDown && pinkyDown;
}

export function isIndexUpGesture(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const indexUp = isFingerExtended(landmarks, 8, 6, 5);
  const middleDown = !isFingerExtended(landmarks, 12, 10, 9);
  const ringDown = !isFingerExtended(landmarks, 16, 14, 13);
  const pinkyDown = !isFingerExtended(landmarks, 20, 18, 17);
  return indexUp && middleDown && ringDown && pinkyDown;
}

/** Ж смягчён требования для детских сабақтар */
export function isIndexUpGestureForLesson(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const indexRatio = fingerStretchRatio(landmarks, 8, 6, 5);
  const middleRatio = fingerStretchRatio(landmarks, 12, 10, 9);
  const ringRatio = fingerStretchRatio(landmarks, 16, 14, 13);
  const pinkyRatio = fingerStretchRatio(landmarks, 20, 18, 17);

  const indexUp = indexRatio > 1.02;
  const othersNotHigher =
    middleRatio < indexRatio + 0.12 &&
    ringRatio < indexRatio + 0.08 &&
    pinkyRatio < indexRatio + 0.08;

  return indexUp && othersNotHigher;
}

export function isPeaceGestureForLesson(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const indexRatio = fingerStretchRatio(landmarks, 8, 6, 5);
  const middleRatio = fingerStretchRatio(landmarks, 12, 10, 9);
  const ringRatio = fingerStretchRatio(landmarks, 16, 14, 13);
  const pinkyRatio = fingerStretchRatio(landmarks, 20, 18, 17);

  const indexUp = indexRatio > 1.02;
  const middleUp = middleRatio > 1.02;
  const ringDown = ringRatio < 1.22;
  const pinkyDown = pinkyRatio < 1.22;

  return indexUp && middleUp && ringDown && pinkyDown;
}

function lessonGestureOk(landmarks: Landmark[], gesture: HandGesture): boolean {
  switch (gesture) {
    case "index_up":
      return isIndexUpGestureForLesson(landmarks) || isIndexUpGesture(landmarks);
    case "peace":
      return isPeaceGestureForLesson(landmarks) || isPeaceGesture(landmarks);
    case "palm":
      return isOpenPalm(landmarks);
    case "fist":
      return isFist(landmarks);
    case "ring":
      return isRingGesture(landmarks);
    case "goat":
      return isGoatGesture(landmarks);
    default:
      return false;
  }
}

function hintForGesture(gesture: HandGesture): string {
  const hints: Record<HandGesture, string> = {
    palm: kk.hands.hints.showPalm,
    fist: kk.hands.hints.palmOrFist,
    ring: kk.hands.hints.ringJoin,
    goat: kk.hands.hints.goatDemo,
    peace: lessonsKk.hints.peace,
    index_up: lessonsKk.hints.indexUp,
  };
  return hints[gesture];
}

export function checkGestureForLesson(
  landmarks: Landmark[],
  gesture: HandGesture,
): EvaluationResult {
  if (landmarks.length < 21) {
    return { success: false, accuracy: 0, hint: lessonsKk.kid.hands };
  }

  const score = scoreGestureForLesson(landmarks, gesture);
  if (score >= LESSON_GESTURE_PASS || lessonGestureOk(landmarks, gesture)) {
    return { success: true, accuracy: Math.max(score, 0.85) };
  }

  if (score >= 0.28) {
    return {
      success: false,
      accuracy: score,
      partial: true,
      hint: lessonsKk.kid.almost,
    };
  }

  const legacy = checkGesture(landmarks, gesture);
  if (legacy.success) return legacy;

  return {
    success: false,
    accuracy: score,
    hint: lessonsKk.kid.again,
  };
}

export function checkGesture(landmarks: Landmark[], gesture: HandGesture): EvaluationResult {
  if (landmarks.length < 21) {
    return { success: false, accuracy: 0, hint: kk.hands.hints.showPalm };
  }

  const ok =
    (gesture === "palm" && isOpenPalm(landmarks)) ||
    (gesture === "fist" && isFist(landmarks)) ||
    (gesture === "ring" && isRingGesture(landmarks)) ||
    (gesture === "goat" && isGoatGesture(landmarks)) ||
    (gesture === "peace" && isPeaceGesture(landmarks)) ||
    (gesture === "index_up" && isIndexUpGesture(landmarks));

  if (ok) return { success: true, accuracy: 1 };
  return { success: false, accuracy: 0.25, hint: hintForGesture(gesture) };
}
