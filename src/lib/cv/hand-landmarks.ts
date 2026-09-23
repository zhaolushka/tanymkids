import type { Landmark } from "@/types/exercise";
import { distance } from "./angles";

function distance3d(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

/** Насколько палец выпрямлен: >1.2 = поднят, <1.15 = согнут */
export function fingerStretchRatio(
  landmarks: Landmark[],
  tipIdx: number,
  pipIdx: number,
  mcpIdx: number,
): number {
  if (landmarks.length < 21) return 0;
  const tipToMcp = distance3d(landmarks[tipIdx], landmarks[mcpIdx]);
  const pipToMcp = distance3d(landmarks[pipIdx], landmarks[mcpIdx]);
  if (pipToMcp === 0) return 0;
  return tipToMcp / pipToMcp;
}

export function isFingerExtended(
  landmarks: Landmark[],
  tipIdx: number,
  pipIdx: number,
  mcpIdx: number,
): boolean {
  return fingerStretchRatio(landmarks, tipIdx, pipIdx, mcpIdx) > 1.12;
}

export function isFingerFolded(
  landmarks: Landmark[],
  tipIdx: number,
  pipIdx: number,
  mcpIdx: number,
): boolean {
  return fingerStretchRatio(landmarks, tipIdx, pipIdx, mcpIdx) < 1.22;
}

export function isThumbExtended(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  return fingerStretchRatio(landmarks, 4, 3, 2) > 1.05;
}

export function getExtendedFingers(landmarks: Landmark[]): boolean[] {
  return [
    isThumbExtended(landmarks),
    isFingerExtended(landmarks, 8, 6, 5),
    isFingerExtended(landmarks, 12, 10, 9),
    isFingerExtended(landmarks, 16, 14, 13),
    isFingerExtended(landmarks, 20, 18, 17),
  ];
}
