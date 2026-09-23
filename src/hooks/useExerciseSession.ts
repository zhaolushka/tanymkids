"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FeedbackStatus } from "@/components/kid/ExerciseFeedback";
import { addStars, starsForAccuracy } from "@/lib/gamification/rewards";
import { saveSession } from "@/lib/analytics/session-recorder";
import { kk } from "@/i18n/kk";
import type { EvaluationResult } from "@/types/exercise";
import type { ExerciseResultRecord } from "@/types/session";

interface UseExerciseSessionOptions {
  exerciseId: string;
  module: "lfk" | "hands";
  holdDurationMs: number;
  onComplete?: (stars: number) => void;
  onWrong?: (hint: string) => void;
}

export function useExerciseSession({
  exerciseId,
  module,
  holdDurationMs,
  onComplete,
  onWrong,
}: UseExerciseSessionOptions) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stars, setStars] = useState(0);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("waiting");
  const [hint, setHint] = useState<string | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const resultsRef = useRef<ExerciseResultRecord[]>([]);
  const lastWrongHintRef = useRef<string | null>(null);

  const processFrame = useCallback(
    (result: EvaluationResult) => {
      if (completed) return;

      if (result.partial) {
        holdStartRef.current = null;
        setFeedbackStatus("almost");
        setHint(result.hint ?? kk.feedback.almostPartial);
        return;
      }

      if (result.success) {
        setFeedbackStatus("correct");
        setHint(null);

        if (holdStartRef.current === null) {
          holdStartRef.current = Date.now();
        }
        const elapsed = Date.now() - holdStartRef.current;
        const pct = Math.min(100, (elapsed / holdDurationMs) * 100);
        setProgress(pct);

        if (elapsed >= holdDurationMs) {
          const earned = starsForAccuracy(result.accuracy);
          setStars(earned);
          setCompleted(true);
          addStars(earned);
          onComplete?.(earned);

          const record: ExerciseResultRecord = {
            exerciseId,
            accuracy: result.accuracy,
            starsEarned: earned,
            completedAt: new Date().toISOString(),
          };
          resultsRef.current.push(record);

          saveSession({
            childId: "local",
            module,
            durationSec: Math.round((Date.now() - startTimeRef.current) / 1000),
            avgAccuracy: result.accuracy,
            starsEarned: earned,
            exercises: resultsRef.current,
            startedAt: new Date(startTimeRef.current).toISOString(),
            endedAt: new Date().toISOString(),
          });
        }
      } else {
        holdStartRef.current = null;
        setProgress((p) => Math.max(0, p - 1));
        setFeedbackStatus("wrong");
        const wrongHint = result.hint ?? kk.feedback.wrongDefault;
        setHint(wrongHint);

        if (lastWrongHintRef.current !== wrongHint) {
          lastWrongHintRef.current = wrongHint;
          onWrong?.(wrongHint);
        }
      }
    },
    [completed, exerciseId, holdDurationMs, module, onComplete, onWrong],
  );

  const setDetecting = useCallback((message?: string) => {
    setFeedbackStatus("detecting");
    setHint(message ?? null);
  }, []);

  const setWaiting = useCallback((message?: string) => {
    setFeedbackStatus("waiting");
    setHint(message ?? null);
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setCompleted(false);
    setStars(0);
    setFeedbackStatus("waiting");
    setHint(null);
    holdStartRef.current = null;
    lastWrongHintRef.current = null;
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    reset();
  }, [exerciseId, reset]);

  return {
    progress,
    completed,
    stars,
    feedbackStatus,
    hint,
    processFrame,
    setDetecting,
    setWaiting,
    reset,
  };
}
