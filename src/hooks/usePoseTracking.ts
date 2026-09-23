"use client";

import { useEffect, useRef, useState } from "react";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import { getPoseLandmarker } from "@/lib/cv/pose-detector";
import type { Landmark } from "@/types/exercise";

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
  const timestampMsRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setLandmarks([]);
      setDetected(false);
      setLoading(false);
      setModelReady(false);
      setModelError(null);
      landmarkerRef.current = null;
      timestampMsRef.current = 0;
      return;
    }

    let cancelled = false;
    setLoading(true);
    setModelReady(false);
    setModelError(null);

    async function init() {
      try {
        const landmarker = await getPoseLandmarker();
        if (cancelled) return;
        landmarkerRef.current = landmarker;
        timestampMsRef.current = 0;
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

    const detect = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(detect);
        return;
      }

      timestampMsRef.current += 33;
      try {
        const result = landmarker.detectForVideo(video, timestampMsRef.current);
        const raw = result.landmarks[0];
        if (raw && raw.length >= 11) {
          setLandmarks(raw.map((l) => ({ x: l.x, y: l.y, z: l.z })));
          setDetected(true);
        } else {
          setDetected(false);
        }
      } catch {
        // skip frame
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, modelReady, modelError, videoRef]);

  return { landmarks, loading, detected, modelError };
}
