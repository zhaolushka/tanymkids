"use client";

import { useEffect, useRef, useState } from "react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";
import {
  bumpMediaPipeVideoTimestampMs,
  resetMediaPipeVideoClock,
  nextMediaPipeVideoTimestampMs,
} from "@/lib/cv/mediapipe-video-clock";
import { getHandLandmarker, resetHandLandmarker, type HandLandmarkerResult } from "@/lib/cv/hand-detector";
import type { Landmark } from "@/types/exercise";

const HAND_CLOCK = "hand";

function mapLandmarks(raw: { x: number; y: number; z: number }[]): Landmark[] {
  return raw.map((l) => ({ x: l.x, y: l.y, z: l.z }));
}

function isTimestampMismatchError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("timestamp mismatch") || msg.includes("Packet timestamp");
}

async function createFreshHandLandmarker(): Promise<HandLandmarker> {
  resetMediaPipeVideoClock(HAND_CLOCK);
  await resetHandLandmarker();
  return getHandLandmarker();
}

export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [hands, setHands] = useState<Landmark[][]>([]);
  const [detected, setDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const rafRef = useRef<number>(0);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const recoveringRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setHands([]);
      setDetected(false);
      setLoading(false);
      setModelReady(false);
      landmarkerRef.current = null;
      void resetHandLandmarker();
      resetMediaPipeVideoClock(HAND_CLOCK);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setModelReady(false);

    async function init() {
      try {
        const landmarker = await createFreshHandLandmarker();
        if (cancelled) return;
        landmarkerRef.current = landmarker;
        setModelReady(true);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setModelReady(false);
          setLoading(false);
        }
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !modelReady) return;

    const recoverLandmarker = async () => {
      if (recoveringRef.current) return;
      recoveringRef.current = true;
      try {
        landmarkerRef.current = await createFreshHandLandmarker();
      } finally {
        recoveringRef.current = false;
      }
    };

    const tick = () => {
      if (recoveringRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const timestampMs = nextMediaPipeVideoTimestampMs(HAND_CLOCK);
      try {
        const result: HandLandmarkerResult = landmarker.detectForVideo(video, timestampMs);

        if (result.landmarks.length > 0) {
          setHands(result.landmarks.map(mapLandmarks));
          setDetected(true);
        } else {
          setHands([]);
          setDetected(false);
        }
      } catch (err) {
        if (isTimestampMismatchError(err)) {
          void recoverLandmarker();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        bumpMediaPipeVideoTimestampMs(HAND_CLOCK, 1000);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, modelReady, videoRef]);

  const primaryHand = hands[0] ?? [];

  return { hands, primaryHand, landmarks: primaryHand, detected, loading };
}
