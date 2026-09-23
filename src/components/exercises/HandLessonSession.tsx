"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CameraView } from "@/components/cv/CameraView";
import { GhostHandOverlay } from "@/components/cv/GhostHandOverlay";
import { HandOverlay } from "@/components/cv/HandOverlay";
import { LessonDemoVideo } from "@/components/exercises/LessonDemoVideo";
import { LessonTransitionOverlay } from "@/components/exercises/LessonTransitionOverlay";
import { mirrorHands } from "@/lib/cv/mirror-landmarks";
import { lessonPlaybackRate } from "@/lib/lessons/playback-rate";
import { KidLessonFeedback } from "@/components/kid/KidLessonFeedback";
import { LessonProgressHeader } from "@/components/kid/LessonProgressHeader";
import { Mascot } from "@/components/kid/Mascot";
import { ProgressBar } from "@/components/kid/ProgressBar";
import { TaskFingerBadges } from "@/components/kid/TaskFingerBadges";
import { soloStepBadges, taskUsesFingerBadges } from "@/lib/lessons/finger-labels";
import { SuccessAnimation } from "@/components/kid/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { KidSkipStepButton } from "@/components/kid/KidSkipStepButton";
import { useCamera } from "@/hooks/useCamera";
import { useHandTracking } from "@/hooks/useHandTracking";
import { useLessonSession } from "@/hooks/useLessonSession";
import { evaluateLessonTask, getTaskGhostGestures } from "@/lib/exercises/hands/evaluate-lesson-task";
import { kk } from "@/i18n/kk";
import { lessonsKk } from "@/i18n/lessons";
import type { Lesson } from "@/types/lesson";

interface HandLessonSessionProps {
  lesson: Lesson;
}

export function HandLessonSession({ lesson }: HandLessonSessionProps) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const { videoRef, connectVideoRef, ready, loading, error, retry, requestFromUserGesture } =
    useCamera({
      enabled: true,
      autoStart: false,
    });

  const beginSession = () => {
    setStartingCamera(true);
    void requestFromUserGesture()
      .then((ok) => {
        if (ok) setSessionStarted(true);
      })
      .finally(() => {
        setStartingCamera(false);
      });
  };
  const { hands, detected, loading: modelLoading } = useHandTracking(
    videoRef,
    sessionStarted && ready,
  );
  const mirroredHands = useMemo(() => mirrorHands(hands), [hands]);

  const {
    currentTask,
    taskIndex,
    taskCount,
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
    isSoloTask,
    soloGestureIndex,
    soloStepsTotal,
    lessonProgress,
    progress,
    feedbackStatus,
    hint,
    processFrame,
    setDetecting,
    setWaiting,
    skipCurrentTask,
  } = useLessonSession({ lesson, active: sessionStarted && ready });

  const ghostGestures = getTaskGhostGestures(currentTask, soloGestureIndex);
  const showOverlay = transitioning || taskJustCompleted;
  const playbackRate = lessonPlaybackRate(taskIndex, taskCount);

  const processFrameRef = useRef(processFrame);
  const setWaitingRef = useRef(setWaiting);
  const setDetectingRef = useRef(setDetecting);
  const mirroredHandsRef = useRef(mirroredHands);
  const detectedRef = useRef(detected);
  const currentTaskRef = useRef(currentTask);
  const soloGestureIndexRef = useRef(soloGestureIndex);

  processFrameRef.current = processFrame;
  setWaitingRef.current = setWaiting;
  setDetectingRef.current = setDetecting;
  mirroredHandsRef.current = mirroredHands;
  detectedRef.current = detected;
  currentTaskRef.current = currentTask;
  soloGestureIndexRef.current = soloGestureIndex;

  useEffect(() => {
    if (!ready || lessonComplete || showOverlay) return;

    let raf = 0;
    let lastHadHands = false;
    let showNoHandsHint = true;

    const tick = () => {
      const task = currentTaskRef.current;
      const frameHands = mirroredHandsRef.current;
      const hasHands = detectedRef.current && frameHands.length > 0;

      if (hasHands) {
        showNoHandsHint = true;
        if (!lastHadHands) {
          setDetectingRef.current();
        }
        lastHadHands = true;
        processFrameRef.current(
          evaluateLessonTask(task, frameHands, {
            soloGestureIndex: soloGestureIndexRef.current,
          }),
        );
      } else {
        if (showNoHandsHint || lastHadHands) {
          setWaitingRef.current();
          showNoHandsHint = false;
        }
        lastHadHands = false;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, lessonComplete, showOverlay, taskIndex, soloGestureIndex]);

  if (lessonComplete) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="glass-card w-full space-y-3 p-8 text-center">
          <span className="text-6xl">🎉</span>
          <h2 className="text-3xl font-extrabold text-kid-purple">{lessonsKk.complete}</h2>
          <p className="text-lg text-muted-foreground">{lesson.title}</p>
          <p className="text-2xl font-bold text-kid-orange">
            {totalStars} ⭐ {kk.success.stars}
          </p>
        </div>
        <SuccessAnimation stars={Math.min(3, Math.ceil(totalStars / lesson.tasks.length))} />
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/kid/hands/lesson">
            <Button variant="kid" size="lg">
              {lessonsKk.nextLesson}
            </Button>
          </Link>
          <Link href="/kid/hands">
            <Button variant="outline" size="lg">
              {kk.kid.backMenu}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasDemo = Boolean(lesson.demoVideo);
  const showSplit = sessionStarted && hasDemo;
  const cameraPreStart = !sessionStarted;

  return (
    <div className="flex flex-col gap-5">
      {!sessionStarted ? (
        <>
          <Link href="/kid/hands/lesson" className="text-sm text-muted-foreground hover:underline">
            {lessonsKk.backToList}
          </Link>
          <div className="glass-card space-y-4 p-8 text-center">
            <span className="text-5xl">{lesson.emoji}</span>
            <h1 className="text-2xl font-extrabold text-kid-purple">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
            <p className="text-sm text-muted-foreground">{kk.camera.allow}</p>
            <Button variant="kid" size="lg" onClick={beginSession} disabled={startingCamera || loading}>
              {startingCamera || loading ? kk.camera.loading : lessonsKk.start}
            </Button>
            {ready && !sessionStarted && (
              <p className="text-sm font-medium text-kid-purple">{kk.camera.readyPreview}</p>
            )}
            {error && !sessionStarted && (
              <div className="space-y-2">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" onClick={retry}>
                  {kk.camera.retry}
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Link href="/kid/hands/lesson" className="text-sm text-muted-foreground hover:underline">
              {lessonsKk.backToList}
            </Link>
            {lesson.demoVideo && (
              <span className="text-2xl" aria-hidden>
                {poseConfirmed ? "▶️" : "⏸️"}
              </span>
            )}
          </div>
          <LessonProgressHeader
            lessonTitle={lesson.title}
            taskIndex={taskIndex}
            taskCount={taskCount}
            taskTitle={currentTask.title}
            elapsedSec={elapsedSec}
            durationMin={lesson.durationMin}
            lessonProgress={lessonProgress}
          />
        </>
      )}

      <div
        className={
          showSplit
            ? "mx-auto grid w-full max-w-6xl grid-cols-2 items-start gap-2 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] sm:gap-4"
            : "mx-auto w-full max-w-3xl"
        }
      >
        <div
          className={
            cameraPreStart
              ? "pointer-events-none fixed left-0 top-0 -z-10 h-[480px] w-[640px] overflow-hidden [visibility:hidden]"
              : "flex min-h-0 w-full flex-col gap-1.5"
          }
        >
          {showSplit && (
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-kid-purple sm:text-xs">
              {lessonsKk.labelYou}
            </p>
          )}
          <div className="camera-frame relative mx-auto aspect-[4/3] w-full max-h-[min(58vh,560px)] overflow-hidden rounded-3xl bg-black">
            <CameraView
              videoRef={connectVideoRef}
              fit="contain"
              loading={(sessionStarted || startingCamera) && (loading || (!ready && !error))}
              className="absolute inset-0 h-full w-full"
            />
            {sessionStarted && !ready && !loading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 text-center text-white">
                <p className="text-sm">{kk.camera.allow}</p>
                <Button variant="kid" onClick={retry}>
                  {kk.camera.retry}
                </Button>
              </div>
            )}
            {sessionStarted && ready && !loading && !showOverlay && (
              <>
                <GhostHandOverlay
                  leftGesture={ghostGestures.left}
                  rightGesture={ghostGestures.right}
                  opacity={0.5}
                  videoRef={videoRef}
                />
                <HandOverlay hands={hands} mirrored videoRef={videoRef} />
              </>
            )}
            {sessionStarted && (
              <LessonTransitionOverlay
                pauseCountdown={pauseCountdown}
                nextTask={nextTaskPreview}
                taskJustCompleted={taskJustCompleted}
                transitioning={transitioning}
                onTapNext={skipCurrentTask}
              />
            )}
          </div>
        </div>

        {hasDemo && (
          <div
            className={
              showSplit ? "flex min-h-0 flex-col gap-1.5" : "hidden"
            }
          >
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-kid-orange sm:text-xs">
              {lessonsKk.labelDemo}
            </p>
            <div className="flex aspect-[608/1080] max-h-[min(58vh,560px)] w-full items-center justify-center self-start rounded-3xl bg-muted/30 p-1 sm:max-w-full">
              {ready ? (
                <LessonDemoVideo
                  src={lesson.demoVideo!}
                  playing={demoVideoPlaying}
                  taskIndex={taskIndex}
                  taskCount={taskCount}
                  playbackRate={isSoloTask ? 1 : playbackRate}
                  layout="split"
                  fullLoop={demoVideoFullLoop}
                />
              ) : (
                <p className="px-4 text-center text-sm text-muted-foreground">{kk.camera.loading}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {sessionStarted && error && (
        <div className="glass-card flex flex-col items-center gap-3 p-4 text-center">
          <Mascot message={error} mood="thinking" />
          <Button variant="kid" onClick={retry}>
            {kk.camera.retry}
          </Button>
        </div>
      )}

      {sessionStarted && (
      <div className="glass-card space-y-3 p-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {isSoloTask ? (
            <>
              <span className="text-4xl">💪</span>
              <span className="text-xl font-extrabold text-kid-purple">{lessonsKk.kid.solo}</span>
              <div className="flex w-full justify-center gap-1 pt-1">
                {Array.from({ length: soloStepsTotal }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full ${
                      index <= soloGestureIndex ? "bg-kid-green" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {soloStepBadges(currentTask, soloGestureIndex).map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-kid-orange/20 px-2.5 py-1 text-base font-bold text-kid-orange"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </>
          ) : taskUsesFingerBadges(currentTask) ? (
            <TaskFingerBadges task={currentTask} size="lg" />
          ) : (
            currentTask.emoji && <span className="text-4xl">{currentTask.emoji}</span>
          )}
          {modelLoading && <span className="text-2xl">⏳</span>}
        </div>

        {!error && (
          <>
            {!showOverlay && (
              <>
                <KidLessonFeedback status={feedbackStatus} />
                <ProgressBar progress={progress} />
              </>
            )}
            <div className="flex justify-center pt-2">
              <KidSkipStepButton onSkip={skipCurrentTask} disabled={lessonComplete} />
            </div>
          </>
        )}
      </div>
      )}
    </div>
  );
}
