import type { HandGesture } from "@/types/lesson";
import type { Landmark } from "@/types/exercise";
import { fingerStretchRatio } from "@/lib/cv/hand-landmarks";
import { distance } from "@/lib/cv/angles";

export const LESSON_GESTURE_PASS = 0.42;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scoreFingerUp(landmarks: Landmark[], tip: number, pip: number, mcp: number): number {
  const ratio = fingerStretchRatio(landmarks, tip, pip, mcp);
  return clamp((ratio - 0.98) / 0.32, 0, 1);
}

function scoreFingerDown(landmarks: Landmark[], tip: number, pip: number, mcp: number): number {
  const ratio = fingerStretchRatio(landmarks, tip, pip, mcp);
  return clamp((1.28 - ratio) / 0.38, 0, 1);
}

function scoreIndexUp(landmarks: Landmark[]): number {
  const index = scoreFingerUp(landmarks, 8, 6, 5);
  const middle = scoreFingerDown(landmarks, 12, 10, 9);
  const ring = scoreFingerDown(landmarks, 16, 14, 13);
  const pinky = scoreFingerDown(landmarks, 20, 18, 17);
  return index * 0.45 + middle * 0.2 + ring * 0.18 + pinky * 0.17;
}

function scorePeace(landmarks: Landmark[]): number {
  const index = scoreFingerUp(landmarks, 8, 6, 5);
  const middle = scoreFingerUp(landmarks, 12, 10, 9);
  const ring = scoreFingerDown(landmarks, 16, 14, 13);
  const pinky = scoreFingerDown(landmarks, 20, 18, 17);
  return index * 0.28 + middle * 0.28 + ring * 0.22 + pinky * 0.22;
}

function scorePalm(landmarks: Landmark[]): number {
  const ups = [
    scoreFingerUp(landmarks, 8, 6, 5),
    scoreFingerUp(landmarks, 12, 10, 9),
    scoreFingerUp(landmarks, 16, 14, 13),
    scoreFingerUp(landmarks, 20, 18, 17),
  ];
  const avg = ups.reduce((sum, value) => sum + value, 0) / ups.length;
  const count = ups.filter((value) => value > 0.35).length;
  return clamp(avg * 0.65 + (count / 4) * 0.35, 0, 1);
}

function scoreFist(landmarks: Landmark[]): number {
  const downs = [
    scoreFingerDown(landmarks, 8, 6, 5),
    scoreFingerDown(landmarks, 12, 10, 9),
    scoreFingerDown(landmarks, 16, 14, 13),
    scoreFingerDown(landmarks, 20, 18, 17),
  ];
  return downs.reduce((sum, value) => sum + value, 0) / downs.length;
}

function scoreRing(landmarks: Landmark[]): number {
  if (landmarks.length < 21) return 0;
  const ringDist = distance(landmarks[4], landmarks[8]);
  const joinScore = clamp((0.2 - ringDist) / 0.12, 0, 1);
  const others =
    (scoreFingerDown(landmarks, 12, 10, 9) +
      scoreFingerDown(landmarks, 16, 14, 13) +
      scoreFingerDown(landmarks, 20, 18, 17)) /
    3;
  return joinScore * 0.55 + others * 0.45;
}

function scoreGoat(landmarks: Landmark[]): number {
  const ringUp = scoreFingerUp(landmarks, 16, 14, 13);
  const pinkyUp = scoreFingerUp(landmarks, 20, 18, 17);
  const indexDown = scoreFingerDown(landmarks, 8, 6, 5);
  const middleDown = scoreFingerDown(landmarks, 12, 10, 9);
  return ringUp * 0.28 + pinkyUp * 0.28 + indexDown * 0.22 + middleDown * 0.22;
}

export function scoreGestureForLesson(landmarks: Landmark[], gesture: HandGesture): number {
  if (landmarks.length < 21) return 0;

  switch (gesture) {
    case "index_up":
      return scoreIndexUp(landmarks);
    case "peace":
      return scorePeace(landmarks);
    case "palm":
      return scorePalm(landmarks);
    case "fist":
      return scoreFist(landmarks);
    case "ring":
      return scoreRing(landmarks);
    case "goat":
      return scoreGoat(landmarks);
    default:
      return 0;
  }
}
