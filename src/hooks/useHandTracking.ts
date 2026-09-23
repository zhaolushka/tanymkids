"use client";

import { useEffect, useRef, useState } from "react";
import { getHandLandmarker, type HandLandmarkerResult } from "@/lib/cv/hand-detector";
import type { Landmark } from "@/types/exercise";

function mapLandmarks(raw: { x: number; y: number; z: number }[]): Landmark[] {
  return raw.map((l) => ({ x: l.x, y: l.y, z: l.z }));
}

export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [hands, setHands] = useState<Landmark[][]>([]);
  const [detected, setDetected] = useState(false);
  const [loading, setLoading] = useState(true);
  const rafRef = useRef<number>(0);
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    if (!enabled) {
      setHands([]);
      setDetected(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function init() {
      try {
        await getHandLandmarker();
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || loading) return;

    lastVideoTimeRef.current = -1;

    const detect = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        try {
          const landmarker = await getHandLandmarker();
          const result: HandLandmarkerResult = landmarker.detectForVideo(
            video,
            performance.now(),
          );

          if (result.landmarks.length > 0) {
            setHands(result.landmarks.map(mapLandmarks));
            setDetected(true);
          } else {
            setHands([]);
            setDetected(false);
          }
        } catch {
          // ignore frame errors
        }
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, loading, videoRef]);

  const primaryHand = hands[0] ?? [];

  return { hands, primaryHand, landmarks: primaryHand, detected, loading };
}
