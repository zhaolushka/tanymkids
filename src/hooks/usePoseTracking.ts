"use client";

import { useEffect, useRef, useState } from "react";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import {
  bumpMediaPipeVideoTimestampMs,
  resetMediaPipeVideoClock,
  nextMediaPipeVideoTimestampMs,
} from "@/lib/cv/mediapipe-video-clock";
import { getPoseLandmarker, resetPoseLandmarker } from "@/lib/cv/pose-detector";
import type { Landmark } from "@/types/exercise";

const POSE_CLOCK = "pose";

function isTimestampMismatchError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("timestamp mismatch") || msg.includes("Packet timestamp");
}

async function recreatePoseLandmarker(): Promise<PoseLandmarker> {
  resetMediaPipeVideoClock(POSE_CLOCK);
  await resetPoseLandmarker();
  return getPoseLandmarker();
}

export function usePoseTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [detected, setDetected] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const rafRef = useRef<number>(0);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const recoveringRef = useRef(false);
  const resetClockOnStartRef = useRef(true);

  useEffect(() => {
    if (!enabled) {
      setLandmarks([]);
      setDetected(false);
      setLoading(false);
      setModelReady(false);
      setModelError(null);
      landmarkerRef.current = null;
      void resetPoseLandmarker();
      resetMediaPipeVideoClock(POSE_CLOCK);
      resetClockOnStartRef.current = true;
      return;
    }

    let cancelled = false;
    setLoading(true);
    setModelReady(false);
    setModelError(null);

    async function init() {
      try {
        if (resetClockOnStartRef.current) {
          resetMediaPipeVideoClock(POSE_CLOCK);
          resetClockOnStartRef.current = false;
        }
        const landmarker = await getPoseLandmarker();
        if (cancelled) return;
        landmarkerRef.current = landmarker;
        setModelReady(true);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("Pose model failed:", err);
        setModelError("pose");
        setModelReady(false);
        setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !modelReady || modelError) return;

    const recoverLandmarker = async () => {
      if (recoveringRef.current) return;
      recoveringRef.current = true;
      try {
        landmarkerRef.current = await recreatePoseLandmarker();
      } catch (err) {
        console.error("Pose recover failed:", err);
        setModelError("pose");
        setModelReady(false);
      } finally {
        recoveringRef.current = false;
      }
    };

    const detect = () => {
      if (recoveringRef.current) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      const timestampMs = nextMediaPipeVideoTimestampMs(POSE_CLOCK);
      try {
        const result = landmarker.detectForVideo(video, timestampMs);
        const raw = result.landmarks[0];
        if (raw && raw.length >= 11) {
          setLandmarks(raw.map((l) => ({ x: l.x, y: l.y, z: l.z })));
          setDetected(true);
        } else {
          setDetected(false);
        }
      } catch (err) {
        if (isTimestampMismatchError(err)) {
          void recoverLandmarker();
        }
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        bumpMediaPipeVideoTimestampMs(POSE_CLOCK, 1000);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    rafRef.current = requestAnimationFrame(detect);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, modelReady, modelError, videoRef]);

  return { landmarks, loading, detected, modelError };
}
