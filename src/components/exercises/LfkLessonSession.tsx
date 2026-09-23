"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CameraView } from "@/components/cv/CameraView";
import { GhostPoseOverlay } from "@/components/cv/GhostPoseOverlay";
import { PoseOverlay } from "@/components/cv/PoseOverlay";
import { LessonDemoVideo } from "@/components/exercises/LessonDemoVideo";
import { LessonTransitionOverlay } from "@/components/exercises/LessonTransitionOverlay";
import { lfkLessonPlaybackRate } from "@/lib/lessons/playback-rate";
import { getPoseLandmarker } from "@/lib/cv/pose-detector";
import { KidLessonFeedback } from "@/components/kid/KidLessonFeedback";
import { LessonProgressHeader } from "@/components/kid/LessonProgressHeader";
import { ProgressBar } from "@/components/kid/ProgressBar";
import { SuccessAnimation } from "@/components/kid/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { KidSkipStepButton } from "@/components/kid/KidSkipStepButton";
import { useCamera } from "@/hooks/useCamera";
import { useLessonSession } from "@/hooks/useLessonSession";
import { usePoseTracking } from "@/hooks/usePoseTracking";
import { vibrateNextExercise, vibrateSuccess } from "@/lib/haptics";
import { lfkEvaluators } from "@/lib/exercises/lfk";
import { kk } from "@/i18n/kk";
import { lessonsKk } from "@/i18n/lessons";
import type { Lesson } from "@/types/lesson";

interface LfkLessonSessionProps {
  lesson: Lesson;
}

export function LfkLessonSession({ lesson }: LfkLessonSessionProps) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);

  useEffect(() => {
    void getPoseLandmarker().catch(() => {});
  }, []);
  const { videoRef, connectVideoRef, ready, loading, error, retry, requestFromUserGesture } =
    useCamera({ enabled: true, autoStart: false });

  const beginSession = () => {
    setStartingCamera(true);
    void requestFromUserGesture()
      .then((ok) => {
        if (ok) setSessionStarted(true);
      })
      .finally(() => setStartingCamera(false));
  };

  const poseActive = sessionStarted && ready && !error;
  const { landmarks, detected, loading: poseLoading } = usePoseTracking(videoRef, poseActive);

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
    lessonProgress,
    progress,
    feedbackStatus,
    hint,
    processFrame,
    setDetecting,
    setWaiting,
    skipCurrentTask,
    skipToNextRep,
    repIndex,
    repCount,
    roundIndex,
    roundCount,
  } = useLessonSession({ lesson, active: sessionStarted && ready });

  const prevTaskIndexRef = useRef(-1);

  useEffect(() => {
    if (!sessionStarted || !ready || lessonComplete) return;
    if (prevTaskIndexRef.current === taskIndex) return;
    if (taskIndex > 0 && prevTaskIndexRef.current >= 0) {
      vibrateNextExercise();
    }
    prevTaskIndexRef.current = taskIndex;
  }, [taskIndex, sessionStarted, ready, lessonComplete]);

  useEffect(() => {
    if (lessonComplete) vibrateSuccess();
  }, [lessonComplete]);

  useEffect(() => {
    if (taskJustCompleted && repIndex < repCount - 1) {
      vibrateSuccess();
    }
  }, [taskJustCompleted, repIndex, repCount]);

  const handleOverlayTap = () => {
    const moreReps = repIndex < repCount - 1;
    const nextRound = !moreReps && roundIndex < roundCount - 1;
    if (taskJustCompleted && (moreReps || nextRound)) {
      skipToNextRep();
    } else {
      skipCurrentTask();
    }
  };

  const exerciseId = currentTask.lfkExerciseId ?? "grow_up";
  const showOverlay = transitioning || taskJustCompleted;
  const playbackRate = lfkLessonPlaybackRate();

  const processFrameRef = useRef(processFrame);
  const setWaitingRef = useRef(setWaiting);
  const setDetectingRef = useRef(setDetecting);
  const currentTaskRef = useRef(currentTask);
  const landmarksRef = useRef(landmarks);

  processFrameRef.current = processFrame;
  setWaitingRef.current = setWaiting;
  setDetectingRef.current = setDetecting;
  currentTaskRef.current = currentTask;
  landmarksRef.current = landmarks;

  useEffect(() => {
    if (!ready || lessonComplete || showOverlay || !sessionStarted) return;

    let raf = 0;
    const tick = () => {
      const task = currentTaskRef.current;
      const frame = landmarksRef.current;
      const evalId = task.lfkExerciseId ?? "grow_up";
      const evaluator = lfkEvaluators[evalId];

      if (frame.length < 33) {
        setWaitingRef.current(kk.lfk.poseSearch);
      } else if (evaluator) {
        setDetectingRef.current(kk.lfk.detecting);
        processFrameRef.current(evaluator(frame));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, lessonComplete, showOverlay, sessionStarted, taskIndex]);

  if (lessonComplete) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="glass-card w-full space-y-3 p-8 text-center">
          <span className="text-6xl">🎉</span>
          <h2 className="text-3xl font-extrabold text-kid-purple">{lessonsKk.complete}</h2>
          <p className="text-lg text-muted-foreground">{lesson.title}</p>
        </div>
        <SuccessAnimation stars={Math.min(3, Math.ceil(totalStars / lesson.tasks.length))} />
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/kid/lfk/lesson">
            <Button variant="kid" size="lg">
              {kk.lfk.nextExercise}
            </Button>
          </Link>
          <Link href="/kid/lfk">
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

  return (
    <div className="flex flex-col gap-5">
      {!sessionStarted ? (
        <>
          <Link href="/kid/lfk/lesson" className="text-sm text-muted-foreground hover:underline">
            {kk.kid.backMenu}
          </Link>
          <div className="glass-card space-y-4 p-8 text-center">
            <span className="text-5xl">{lesson.emoji}</span>
            <h1 className="text-2xl font-extrabold text-kid-purple">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
            <Button variant="kid" size="lg" onClick={beginSession} disabled={startingCamera || loading}>
              {startingCamera || loading ? kk.camera.loading : lessonsKk.start}
            </Button>
            {error && (
              <div className="space-y-2 pt-2">
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
            !sessionStarted
              ? "pointer-events-none fixed left-0 top-0 -z-10 h-[480px] w-[640px] overflow-hidden [visibility:hidden]"
              : "flex min-h-0 w-full flex-col gap-1.5"
          }
        >
          {showSplit && (
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-kid-purple sm:text-xs">
              {kk.lfk.labelYou}
            </p>
          )}
          <div className="camera-frame relative mx-auto aspect-[4/3] w-full max-h-[min(58vh,560px)] overflow-hidden rounded-3xl bg-black">
            <CameraView
              videoRef={connectVideoRef}
              fit="contain"
              loading={(sessionStarted || startingCamera) && (loading || (!ready && !error))}
              className="absolute inset-0 h-full w-full"
            />
            {sessionStarted && ready && !showOverlay && landmarks.length >= 11 && (
              <>
                <GhostPoseOverlay exerciseId={exerciseId} videoRef={videoRef} />
                <PoseOverlay landmarks={landmarks} exerciseId={exerciseId} videoRef={videoRef} />
              </>
            )}
            {sessionStarted && !ready && !loading && !error && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 text-center text-white">
                <p className="text-sm">{kk.camera.allow}</p>
                <Button variant="kid" onClick={retry}>
                  {kk.camera.retry}
                </Button>
              </div>
            )}
            {sessionStarted && (
              <LessonTransitionOverlay
                pauseCountdown={pauseCountdown}
                nextTask={nextTaskPreview}
                taskJustCompleted={taskJustCompleted}
                transitioning={transitioning}
                onTapNext={handleOverlayTap}
                repIndex={repIndex}
                repCount={repCount}
                roundIndex={roundIndex}
                roundCount={roundCount}
              />
            )}
          </div>
        </div>

        {hasDemo && showSplit && (
          <div className="flex min-h-0 flex-col gap-1.5">
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-kid-orange sm:text-xs">
              {kk.lfk.labelDemo}
            </p>
            <div className="flex aspect-[608/1080] max-h-[min(58vh,560px)] w-full items-center justify-center self-start rounded-3xl bg-muted/30 p-1">
              <LessonDemoVideo
                src={lesson.demoVideo!}
                playing={demoVideoPlaying && sessionStarted}
                taskIndex={taskIndex}
                taskCount={taskCount}
                playbackRate={playbackRate}
                layout="split"
                segmentStartSec={currentTask.demoStartSec}
                segmentEndSec={currentTask.demoEndSec}
              />
            </div>
          </div>
        )}
      </div>

      {sessionStarted && error && (
        <div className="glass-card flex flex-col items-center gap-3 p-4 text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="kid" onClick={retry}>
            {kk.camera.retry}
          </Button>
        </div>
      )}

      {sessionStarted && (
        <div className="glass-card space-y-3 p-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-4xl">{currentTask.emoji}</span>
            {detected && <span className="text-2xl">🟢</span>}
            {poseLoading && <span className="text-2xl">⏳</span>}
          </div>
          {!error && (
            <>
              {!showOverlay && (
                <>
                  <KidLessonFeedback status={feedbackStatus} waitingLabel={kk.lfk.kid.body} />
                  {feedbackStatus !== "correct" && (
                    <p className="text-center text-sm font-medium text-muted-foreground">
                      {hint ??
                        (feedbackStatus === "wrong" ? kk.lfk.hints.watchDemo : currentTask.instruction)}
                    </p>
                  )}
                  <ProgressBar progress={progress} />
                  {(repCount > 1 || roundCount > 1) && (
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <p className="text-xs font-bold text-kid-purple">
                        {lessonsKk.repLabel}: {repIndex + 1}/{repCount}
                        {roundCount > 1 && (
                          <span className="text-muted-foreground">
                            {" "}
                            · {lessonsKk.roundLabel} {roundIndex + 1}/{roundCount}
                          </span>
                        )}
                      </p>
                      <div className="flex justify-center gap-2">
                        {Array.from({ length: repCount }).map((_, index) => (
                          <div
                            key={index}
                            className={`h-3 w-3 rounded-full transition-colors ${
                              index < repIndex
                                ? "bg-kid-green"
                                : index === repIndex
                                  ? "bg-kid-yellow"
                                  : "bg-white/60 ring-1 ring-kid-purple/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
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
