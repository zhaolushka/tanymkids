"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FeedbackStatus } from "@/components/kid/ExerciseFeedback";
import { addStars, starsForAccuracy } from "@/lib/gamification/rewards";
import { markLessonComplete } from "@/lib/lessons/progress";
import { kk } from "@/i18n/kk";
import { lessonsKk } from "@/i18n/lessons";
import type { EvaluationResult } from "@/types/exercise";
import type { Lesson, LessonTask } from "@/types/lesson";

const SUCCESS_FLASH_MS = 500;
const GAP_BEFORE_NEXT_TASK_MS = 700;
const SOLO_STEP_FLASH_MS = 450;
const WRONG_GRACE_MS = 1100;
const PROGRESS_TICK_MS = 120;

interface UseLessonSessionOptions {
  lesson: Lesson;
  active: boolean;
}

export function useLessonSession({ lesson, active }: UseLessonSessionOptions) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [soloGestureIndex, setSoloGestureIndex] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [pauseCountdown, setPauseCountdown] = useState(0);
  const [nextTaskPreview, setNextTaskPreview] = useState<LessonTask | null>(null);
  const [totalStars, setTotalStars] = useState(0);
  const [progress, setProgress] = useState(0);
  const [taskJustCompleted, setTaskJustCompleted] = useState(false);
  const [poseConfirmed, setPoseConfirmed] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("detecting");
  const [hint, setHint] = useState<string | null>(null);

  const holdStartRef = useRef<number | null>(null);
  const advancingRef = useRef(false);
  const wrongSinceRef = useRef<number | null>(null);
  const lastProgressUiRef = useRef(0);
  const poseConfirmedRef = useRef(false);

  const currentTask: LessonTask = lesson.tasks[taskIndex];
  const holdDurationMs = currentTask.holdDurationMs;
  const isSoloTask = currentTask.mode === "solo_practice";
  const soloGestures = currentTask.soloGestures ?? [];
  const soloStepsTotal = soloGestures.length;

  const resetHold = useCallback(() => {
    holdStartRef.current = null;
    wrongSinceRef.current = null;
    lastProgressUiRef.current = 0;
    poseConfirmedRef.current = false;
    setProgress(0);
    setPoseConfirmed(false);
  }, []);

  const startTransition = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    const earned = starsForAccuracy(1);
    setTotalStars((value) => value + earned);
    addStars(earned);
    setTaskJustCompleted(true);
    setPoseConfirmed(false);

    if (taskIndex >= lesson.tasks.length - 1) {
      setTimeout(() => {
        markLessonComplete(lesson.id);
        setLessonComplete(true);
      }, SUCCESS_FLASH_MS);
      return;
    }

    const next = lesson.tasks[taskIndex + 1];
    setNextTaskPreview(next);

    setTimeout(() => {
      setTaskJustCompleted(false);
      setTransitioning(true);
      setPauseCountdown(0);
    }, SUCCESS_FLASH_MS);

    setTimeout(() => {
      setTaskIndex((value) => value + 1);
      setTransitioning(false);
      setNextTaskPreview(null);
      setPauseCountdown(0);
      advancingRef.current = false;
      resetHold();
      setFeedbackStatus("detecting");
      setHint(null);
    }, SUCCESS_FLASH_MS + GAP_BEFORE_NEXT_TASK_MS);
  }, [lesson.id, lesson.tasks, taskIndex, resetHold]);

  const advanceSoloStep = useCallback(() => {
    if (advancingRef.current) return;

    const earned = starsForAccuracy(1);
    setTotalStars((value) => value + earned);
    addStars(earned);
    setTaskJustCompleted(true);
    resetHold();

    if (soloGestureIndex >= soloStepsTotal - 1) {
      setTimeout(() => {
        setTaskJustCompleted(false);
        startTransition();
      }, SOLO_STEP_FLASH_MS);
      return;
    }

    setTimeout(() => {
      setSoloGestureIndex((value) => value + 1);
      setTaskJustCompleted(false);
      setFeedbackStatus("detecting");
    }, SOLO_STEP_FLASH_MS);
  }, [resetHold, soloGestureIndex, soloStepsTotal, startTransition]);

  useEffect(() => {
    if (lessonComplete) return;

    advancingRef.current = false;
    resetHold();
    setTaskJustCompleted(false);
    setTransitioning(false);
    setPauseCountdown(0);
    setNextTaskPreview(null);
    setSoloGestureIndex(0);
    setFeedbackStatus("detecting");
    setHint(null);
  }, [taskIndex, lessonComplete, resetHold]);

  useEffect(() => {
    if (!active || lessonComplete) return;
    const timer = setInterval(() => setElapsedSec((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [active, lessonComplete]);

  const processFrame = useCallback(
    (result: EvaluationResult) => {
      if (!active || lessonComplete || transitioning || taskJustCompleted) return;

      if (result.partial) {
        wrongSinceRef.current = null;
        setFeedbackStatus("almost");
        setHint(null);
        return;
      }

      if (result.success) {
        wrongSinceRef.current = null;

        if (!poseConfirmedRef.current) {
          poseConfirmedRef.current = true;
          setPoseConfirmed(true);
        }

        setFeedbackStatus("correct");
        setHint(null);

        if (holdStartRef.current === null) {
          holdStartRef.current = Date.now();
        }

        const elapsed = Date.now() - holdStartRef.current;
        const nextProgress = Math.min(100, (elapsed / holdDurationMs) * 100);
        const now = Date.now();
        if (now - lastProgressUiRef.current >= PROGRESS_TICK_MS || nextProgress >= 100) {
          lastProgressUiRef.current = now;
          setProgress(nextProgress);
        }

        if (elapsed >= holdDurationMs) {
          if (isSoloTask) {
            advanceSoloStep();
          } else {
            startTransition();
          }
        }
        return;
      }

      const now = Date.now();
      if (wrongSinceRef.current === null) {
        wrongSinceRef.current = now;
      }
      if (holdStartRef.current !== null && now - wrongSinceRef.current < WRONG_GRACE_MS) {
        return;
      }

      if (result.accuracy >= 0.22) {
        setFeedbackStatus("almost");
        setHint(null);
        return;
      }

      resetHold();
      setFeedbackStatus("wrong");
      setHint(null);
    },
    [
      active,
      lessonComplete,
      transitioning,
      taskJustCompleted,
      holdDurationMs,
      isSoloTask,
      resetHold,
      startTransition,
      advanceSoloStep,
    ],
  );

  const skipCurrentTask = useCallback(() => {
    if (lessonComplete || transitioning || taskJustCompleted) return;
    if (isSoloTask) {
      advanceSoloStep();
      return;
    }
    startTransition();
  }, [
    lessonComplete,
    transitioning,
    taskJustCompleted,
    isSoloTask,
    advanceSoloStep,
    startTransition,
  ]);

  const setWaiting = useCallback(
    (message?: string) => {
      resetHold();
      setFeedbackStatus("waiting");
      setHint(message ?? kk.hands.hints.showBoth);
    },
    [resetHold],
  );

  const setDetecting = useCallback((_message?: string) => {
    setFeedbackStatus("detecting");
    setHint(null);
  }, []);

  const lessonProgress =
    ((taskIndex + (isSoloTask ? soloGestureIndex / Math.max(1, soloStepsTotal) : progress / 100)) /
      lesson.tasks.length) *
    100;

  const demoVideoPlaying = isSoloTask
    ? !lessonComplete
    : (poseConfirmed || taskJustCompleted || transitioning) && !lessonComplete;

  const demoVideoFullLoop = isSoloTask;

  return {
    currentTask,
    taskIndex,
    taskCount: lesson.tasks.length,
    soloGestureIndex,
    soloStepsTotal,
    isSoloTask,
    lessonComplete,
    totalStars,
    elapsedSec,
    transitioning,
    pauseCountdown,
    nextTaskPreview,
    taskJustCompleted,
    poseConfirmed,
    demoVideoPlaying,
    demoVideoFullLoop,
    lessonProgress,
    taskProgress: progress,
    progress,
    feedbackStatus,
    hint,
    processFrame,
    setDetecting,
    setWaiting,
    skipCurrentTask,
  };
}
