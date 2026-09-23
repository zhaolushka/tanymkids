"use client";

import {
  FilesetResolver,
  PoseLandmarker,
  type PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";

let poseLandmarker: PoseLandmarker | null = null;

const POSE_LITE =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

const POSE_FULL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task";

async function createLandmarker(
  modelAssetPath: string,
  delegate: "GPU" | "CPU",
): Promise<PoseLandmarker> {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  return PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath,
      delegate,
    },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.35,
    minPosePresenceConfidence: 0.35,
    minTrackingConfidence: 0.35,
  });
}

export async function getPoseLandmarker(): Promise<PoseLandmarker> {
  if (poseLandmarker) return poseLandmarker;

  const attempts: Array<{ model: string; delegate: "GPU" | "CPU" }> = [
    { model: POSE_LITE, delegate: "GPU" },
    { model: POSE_LITE, delegate: "CPU" },
    { model: POSE_FULL, delegate: "GPU" },
    { model: POSE_FULL, delegate: "CPU" },
  ];

  let lastError: unknown;
  for (const { model, delegate } of attempts) {
    try {
      poseLandmarker = await createLandmarker(model, delegate);
      return poseLandmarker;
    } catch (err) {
      lastError = err;
      poseLandmarker = null;
    }
  }

  throw lastError ?? new Error("Pose landmarker unavailable");
}

export type { PoseLandmarkerResult };
