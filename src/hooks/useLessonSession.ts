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
const REP_FLASH_MS = 380;
const WRONG_GRACE_MS = 900;
const PROGRESS_TICK_MS = 120;
/** Кадров подряд «дұрыс» прежде чем начать отсчёт удержания */
const MIN_SUCCESS_FRAMES = 14;

interface UseLessonSessionOptions {
  lesson: Lesson;
  active: boolean;
}

export function useLessonSession({ lesson, active }: UseLessonSessionOptions) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [repIndex, setRepIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
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
  const successStreakRef = useRef(0);
  const repTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTask: LessonTask = lesson.tasks[taskIndex];
  const holdDurationMs = currentTask.holdDurationMs;
  const isSoloTask = currentTask.mode === "solo_practice";
  const soloGestures = currentTask.soloGestures ?? [];
  const soloStepsTotal = soloGestures.length;
  const repCount = Math.max(1, currentTask.repeatCount ?? 1);
  const roundCount = Math.max(1, currentTask.demoRounds ?? 1);
  const useReps = !isSoloTask && (repCount > 1 || roundCount > 1);

  const resetHold = useCallback(() => {
    holdStartRef.current = null;
    wrongSinceRef.current = null;
    lastProgressUiRef.current = 0;
    poseConfirmedRef.current = false;
    successStreakRef.current = 0;
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

  const clearRepTimeout = useCallback(() => {
    if (repTimeoutRef.current) {
      clearTimeout(repTimeoutRef.current);
      repTimeoutRef.current = null;
    }
  }, []);

  const advanceRep = useCallback(() => {
    if (advancingRef.current) return;

    const earned = starsForAccuracy(1);
    setTotalStars((value) => value + earned);
    addStars(earned);
    setTaskJustCompleted(true);
    resetHold();
    clearRepTimeout();

    if (repIndex >= repCount - 1) {
      if (roundIndex >= roundCount - 1) {
        repTimeoutRef.current = setTimeout(() => {
          repTimeoutRef.current = null;
          setTaskJustCompleted(false);
          startTransition();
        }, REP_FLASH_MS);
        return;
      }

      repTimeoutRef.current = setTimeout(() => {
        repTimeoutRef.current = null;
        setRepIndex(0);
        setRoundIndex((value) => value + 1);
        setTaskJustCompleted(false);
        setFeedbackStatus("detecting");
      }, REP_FLASH_MS);
      return;
    }

    repTimeoutRef.current = setTimeout(() => {
      repTimeoutRef.current = null;
      setRepIndex((value) => value + 1);
      setTaskJustCompleted(false);
      setFeedbackStatus("detecting");
    }, REP_FLASH_MS);
  }, [resetHold, repIndex, repCount, roundIndex, roundCount, startTransition, clearRepTimeout]);

  const skipToNextRep = useCallback(() => {
    clearRepTimeout();
    setTaskJustCompleted(false);
    if (repIndex >= repCount - 1) {
      if (roundIndex >= roundCount - 1) {
        startTransition();
        return;
      }
      setRepIndex(0);
      setRoundIndex((value) => value + 1);
      resetHold();
      setFeedbackStatus("detecting");
      return;
    }
    setRepIndex((value) => value + 1);
    resetHold();
    setFeedbackStatus("detecting");
  }, [clearRepTimeout, repIndex, repCount, roundIndex, roundCount, startTransition, resetHold]);

  useEffect(() => {
    if (lessonComplete) return;

    advancingRef.current = false;
    resetHold();
    setTaskJustCompleted(false);
    setTransitioning(false);
    setPauseCountdown(0);
    setNextTaskPreview(null);
    setSoloGestureIndex(0);
    setRepIndex(0);
    setRoundIndex(0);
    setFeedbackStatus("detecting");
    setHint(null);
  }, [taskIndex, lessonComplete, resetHold]);

  useEffect(() => {
    if (!active || lessonComplete) return;
    const timer = setInterval(() => setElapsedSec((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [active, lessonComplete]);

  useEffect(() => () => clearRepTimeout(), [clearRepTimeout]);

  const processFrame = useCallback(
    (result: EvaluationResult) => {
      if (!active || lessonComplete || transitioning || taskJustCompleted) return;

      if (result.partial) {
        successStreakRef.current = 0;
        setFeedbackStatus("almost");
        setHint(result.hint ?? null);

        const nowPartial = Date.now();
        if (holdStartRef.current !== null) {
          if (wrongSinceRef.current === null) wrongSinceRef.current = nowPartial;
          if (nowPartial - wrongSinceRef.current >= WRONG_GRACE_MS) {
            resetHold();
          }
        } else {
          wrongSinceRef.current = null;
        }
        return;
      }

      if (result.success) {
        successStreakRef.current += 1;

        if (successStreakRef.current < MIN_SUCCESS_FRAMES) {
          wrongSinceRef.current = null;
          setFeedbackStatus("almost");
          setHint(null);
          return;
        }

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
          } else if (useReps) {
            advanceRep();
          } else {
            startTransition();
          }
        }
        return;
      }

      successStreakRef.current = 0;

      const now = Date.now();
      if (wrongSinceRef.current === null) {
        wrongSinceRef.current = now;
      }
      if (holdStartRef.current !== null && now - wrongSinceRef.current < WRONG_GRACE_MS) {
        return;
      }

      if (result.accuracy >= 0.28) {
        setFeedbackStatus("almost");
        setHint(result.hint ?? null);
        return;
      }

      resetHold();
      setFeedbackStatus("wrong");
      setHint(result.hint ?? null);
    },
    [
      active,
      lessonComplete,
      transitioning,
      taskJustCompleted,
      holdDurationMs,
      isSoloTask,
      useReps,
      resetHold,
      startTransition,
      advanceSoloStep,
      advanceRep,
    ],
  );

  const skipCurrentTask = useCallback(() => {
    if (lessonComplete) return;

    advancingRef.current = false;
    setTaskJustCompleted(false);
    setTransitioning(false);
    setNextTaskPreview(null);
    setPauseCountdown(0);

    if (isSoloTask) {
      if (soloGestureIndex >= soloStepsTotal - 1) {
        startTransition();
      } else {
        setSoloGestureIndex((value) => value + 1);
        resetHold();
        setFeedbackStatus("detecting");
      }
      return;
    }

    if (taskIndex >= lesson.tasks.length - 1) {
      markLessonComplete(lesson.id);
      setLessonComplete(true);
      return;
    }

    setTaskIndex((value) => value + 1);
    resetHold();
    setFeedbackStatus("detecting");
    setHint(null);
  }, [
    lessonComplete,
    isSoloTask,
    soloGestureIndex,
    soloStepsTotal,
    taskIndex,
    lesson.id,
    lesson.tasks.length,
    startTransition,
    resetHold,
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

  const taskUnitProgress = isSoloTask
    ? soloGestureIndex / Math.max(1, soloStepsTotal)
    : useReps
      ? (roundIndex * repCount + repIndex + progress / 100) / (repCount * roundCount)
      : progress / 100;

  const lessonProgress = ((taskIndex + taskUnitProgress) / lesson.tasks.length) * 100;

  const isLfkStyleLesson = lesson.tasks.some((t) => t.mode === "lfk_pose");

  const demoVideoPlaying = lessonComplete
    ? false
    : isSoloTask
      ? true
      : isLfkStyleLesson
        ? active
        : (poseConfirmed || taskJustCompleted || transitioning) && active;

  const demoVideoFullLoop = isSoloTask;

  return {
    currentTask,
    taskIndex,
    taskCount: lesson.tasks.length,
    soloGestureIndex,
    soloStepsTotal,
    repIndex,
    repCount,
    roundIndex,
    roundCount,
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
    skipToNextRep,
  };
}
