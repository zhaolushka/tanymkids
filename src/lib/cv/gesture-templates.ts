import type { HandGesture } from "@/types/lesson";
import type { Landmark } from "@/types/exercise";

/** Упрощённый шаблон открытой ладони (локальные координаты, запястье в 0,0) */
const OPEN_PALM: Landmark[] = [
  { x: 0, y: 0, z: 0 },
  { x: -0.04, y: -0.06, z: 0 },
  { x: -0.06, y: -0.12, z: 0 },
  { x: -0.07, y: -0.18, z: 0 },
  { x: -0.08, y: -0.24, z: 0 },
  { x: -0.02, y: -0.22, z: 0 },
  { x: -0.02, y: -0.32, z: 0 },
  { x: -0.02, y: -0.42, z: 0 },
  { x: -0.02, y: -0.52, z: 0 },
  { x: 0.02, y: -0.22, z: 0 },
  { x: 0.02, y: -0.33, z: 0 },
  { x: 0.02, y: -0.44, z: 0 },
  { x: 0.02, y: -0.54, z: 0 },
  { x: 0.06, y: -0.21, z: 0 },
  { x: 0.06, y: -0.31, z: 0 },
  { x: 0.06, y: -0.41, z: 0 },
  { x: 0.06, y: -0.51, z: 0 },
  { x: 0.1, y: -0.19, z: 0 },
  { x: 0.1, y: -0.28, z: 0 },
  { x: 0.1, y: -0.36, z: 0 },
  { x: 0.1, y: -0.44, z: 0 },
];

function cloneLandmarks(landmarks: Landmark[]): Landmark[] {
  return landmarks.map((point) => ({ ...point }));
}

function foldFinger(landmarks: Landmark[], mcp: number, pip: number, dip: number, tip: number) {
  const mcpPt = landmarks[mcp];
  landmarks[pip] = { x: mcpPt.x + (landmarks[pip].x - mcpPt.x) * 0.35, y: mcpPt.y + (landmarks[pip].y - mcpPt.y) * 0.35, z: 0 };
  landmarks[dip] = { x: mcpPt.x + (landmarks[dip].x - mcpPt.x) * 0.25, y: mcpPt.y + (landmarks[dip].y - mcpPt.y) * 0.25, z: 0 };
  landmarks[tip] = { x: mcpPt.x + (landmarks[tip].x - mcpPt.x) * 0.15, y: mcpPt.y + (landmarks[tip].y - mcpPt.y) * 0.15, z: 0 };
}

function extendFinger(landmarks: Landmark[], mcp: number, pip: number, dip: number, tip: number, extra = 0.06) {
  const dir = { x: landmarks[tip].x - landmarks[mcp].x, y: landmarks[tip].y - landmarks[mcp].y };
  landmarks[tip] = { x: landmarks[tip].x + dir.x * extra, y: landmarks[tip].y + dir.y * extra, z: 0 };
}

function buildLocalGesture(gesture: HandGesture): Landmark[] {
  const lm = cloneLandmarks(OPEN_PALM);

  switch (gesture) {
    case "palm":
      return lm;
    case "fist":
      foldFinger(lm, 5, 6, 7, 8);
      foldFinger(lm, 9, 10, 11, 12);
      foldFinger(lm, 13, 14, 15, 16);
      foldFinger(lm, 17, 18, 19, 20);
      foldFinger(lm, 2, 3, 4, 4);
      return lm;
    case "ring":
      lm[4] = { x: lm[8].x - 0.02, y: lm[8].y + 0.02, z: 0 };
      foldFinger(lm, 9, 10, 11, 12);
      foldFinger(lm, 13, 14, 15, 16);
      foldFinger(lm, 17, 18, 19, 20);
      return lm;
    case "goat":
      foldFinger(lm, 5, 6, 7, 8);
      foldFinger(lm, 9, 10, 11, 12);
      extendFinger(lm, 13, 14, 15, 16, 0.12);
      extendFinger(lm, 17, 18, 19, 20, 0.1);
      return lm;
    case "peace":
      extendFinger(lm, 5, 6, 7, 8, 0.08);
      extendFinger(lm, 9, 10, 11, 12, 0.08);
      foldFinger(lm, 13, 14, 15, 16);
      foldFinger(lm, 17, 18, 19, 20);
      return lm;
    case "index_up":
      extendFinger(lm, 5, 6, 7, 8, 0.1);
      foldFinger(lm, 9, 10, 11, 12);
      foldFinger(lm, 13, 14, 15, 16);
      foldFinger(lm, 17, 18, 19, 20);
      return lm;
    default:
      return lm;
  }
}

export function buildGhostHand(
  gesture: HandGesture,
  centerX: number,
  centerY: number,
  scale: number,
  flipX: boolean,
): Landmark[] {
  const local = buildLocalGesture(gesture);
  return local.map((point) => ({
    x: centerX + (flipX ? -point.x : point.x) * scale,
    y: centerY + point.y * scale,
    z: point.z,
  }));
}

export function buildGhostPair(
  leftGesture: HandGesture | null,
  rightGesture: HandGesture | null,
): { left: Landmark[] | null; right: Landmark[] | null } {
  return {
    left: leftGesture ? buildGhostHand(leftGesture, 0.28, 0.58, 1.15, false) : null,
    right: rightGesture ? buildGhostHand(rightGesture, 0.72, 0.58, 1.15, true) : null,
  };
}
