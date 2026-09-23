"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CameraView } from "@/components/cv/CameraView";
import { GhostPoseOverlay } from "@/components/cv/GhostPoseOverlay";
import { PoseOverlay } from "@/components/cv/PoseOverlay";
import { ExerciseDemoPlayer } from "@/components/exercises/ExerciseDemoPlayer";
import { KidLessonFeedback } from "@/components/kid/KidLessonFeedback";
import { ProgressBar } from "@/components/kid/ProgressBar";
import { SuccessAnimation } from "@/components/kid/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { useExerciseSession } from "@/hooks/useExerciseSession";
import { usePoseTracking } from "@/hooks/usePoseTracking";
import { lfkEvaluators } from "@/lib/exercises/lfk";
import { kk } from "@/i18n/kk";
import type { Exercise } from "@/types/exercise";

interface LfkSessionProps {
  exercise: Exercise;
  stepIndex?: number;
  stepCount?: number;
  onStepComplete?: () => void;
  backHref?: string;
}

export function LfkSession({
  exercise,
  stepIndex,
  stepCount,
  onStepComplete,
  backHref = "/kid/lfk",
}: LfkSessionProps) {
  const [started, setStarted] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [celebrateDone, setCelebrateDone] = useState(false);
  const chainAdvanceRef = useRef(false);
  const [stepGateOpen, setStepGateOpen] = useState(true);

  const { videoRef, connectVideoRef, ready, loading, error, retry, requestFromUserGesture } =
    useCamera({
      enabled: true,
      autoStart: false,
    });

  const poseActive = started && ready && !error;
  const { landmarks, loading: poseLoading, detected, modelError } = usePoseTracking(
    videoRef,
    poseActive,
  );

  const {
    progress,
    completed,
    stars,
    feedbackStatus,
    hint,
    processFrame,
    setDetecting,
    setWaiting,
  } = useExerciseSession({
    exerciseId: exercise.id,
    module: "lfk",
    holdDurationMs: exercise.holdDurationMs,
  });

  const beginExercise = () => {
    setStartingCamera(true);
    void requestFromUserGesture()
      .then((ok) => {
        if (ok) setStarted(true);
      })
      .finally(() => setStartingCamera(false));
  };

  useEffect(() => {
    setStepGateOpen(false);
    const timer = setTimeout(() => setStepGateOpen(true), 500);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  useEffect(() => {
    if (!started || !ready || completed) return;
    if (!stepGateOpen) {
      setWaiting(kk.lfk.hints.nextPose);
      return;
    }
    if (landmarks.length < 33) {
      setWaiting(detected ? kk.lfk.poseSearch : kk.lfk.poseSearch);
      return;
    }

    setDetecting(kk.lfk.detecting);
    const evaluator = lfkEvaluators[exercise.id];
    if (!evaluator) return;
    processFrame(evaluator(landmarks));
  }, [
    landmarks,
    detected,
    started,
    ready,
    completed,
    exercise.id,
    stepGateOpen,
    processFrame,
    setDetecting,
    setWaiting,
  ]);

  useEffect(() => {
    if (!completed || chainAdvanceRef.current) return;
    if (onStepComplete) {
      chainAdvanceRef.current = true;
      const timer = setTimeout(() => {
        onStepComplete();
        chainAdvanceRef.current = false;
      }, 1200);
      return () => clearTimeout(timer);
    }
    setCelebrateDone(true);
  }, [completed, onStepComplete]);

  useEffect(() => {
    setCelebrateDone(false);
    chainAdvanceRef.current = false;
  }, [exercise.id]);

  const showSplit = started && !error;
  const showOverlays = started && ready && !error && !completed;

  return (
    <div className="flex flex-col gap-5">
      {!started ? (
        <>
          <Link href={backHref} className="text-sm text-muted-foreground hover:underline">
            {kk.kid.backMenu}
          </Link>
          <div className="glass-card space-y-4 p-8 text-center">
            <span className="text-5xl">{exercise.emoji}</span>
            <h1 className="text-2xl font-extrabold text-kid-purple">{exercise.title}</h1>
            {stepIndex != null && stepCount != null && (
              <div className="flex justify-center gap-1">
                {Array.from({ length: stepCount }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-8 rounded-full ${
                      i + 1 <= stepIndex ? "bg-kid-green" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
            <p className="text-muted-foreground">{exercise.instruction}</p>
            <p className="text-sm text-muted-foreground">{kk.camera.allow}</p>
            <Button variant="kid" size="lg" onClick={beginExercise} disabled={startingCamera || loading}>
              {startingCamera || loading ? kk.camera.loading : kk.demo.ready}
            </Button>
          </div>
          <div className="mx-auto w-full max-w-md">
            <ExerciseDemoPlayer exercise={exercise} showSteps={false} />
          </div>
        </>
      ) : (
        <div className="glass-card flex flex-col items-center gap-1 px-4 py-3 text-center">
          <div className="flex w-full items-center justify-between">
            <Link href={backHref} className="text-sm text-muted-foreground hover:underline">
              {kk.kid.backMenu}
            </Link>
            {stepIndex != null && stepCount != null && (
              <span className="text-sm font-bold text-kid-purple">
                {stepIndex}/{stepCount}
              </span>
            )}
          </div>
          <span className="text-5xl leading-none">{exercise.emoji}</span>
          <h2 className="text-2xl font-extrabold text-kid-purple">{exercise.title}</h2>
        </div>
      )}

      {/* Камера әрқашан бір div-те — remount болмасын */}
      <div
        className={
          showSplit
            ? "mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-2 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] sm:gap-4"
            : "mx-auto w-full max-w-3xl"
        }
      >
        <div
          className={
            started
              ? "flex min-h-0 w-full flex-col gap-1.5"
              : "pointer-events-none fixed left-0 top-0 -z-10 h-[480px] w-[640px] overflow-hidden opacity-0"
          }
        >
          {started && (
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-kid-purple sm:text-xs">
              {kk.lfk.labelYou}
            </p>
          )}
          <div className="camera-frame relative mx-auto aspect-[4/3] w-full max-h-[min(58vh,560px)] overflow-hidden rounded-3xl bg-black">
            <CameraView
              videoRef={connectVideoRef}
              fit="contain"
              loading={(started || startingCamera) && (loading || (!ready && !error))}
              className="absolute inset-0 h-full w-full"
            />

            {showOverlays && (
              <>
                <GhostPoseOverlay exerciseId={exercise.id} videoRef={videoRef} />
                {landmarks.length >= 11 && (
                  <PoseOverlay landmarks={landmarks} exerciseId={exercise.id} videoRef={videoRef} />
                )}
                {poseLoading && (
                  <div className="absolute inset-x-0 top-2 z-20 mx-auto w-fit rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">
                    {kk.lfk.poseLoading}
                  </div>
                )}
                {!poseLoading && !modelError && !detected && (
                  <div className="absolute inset-x-0 bottom-2 z-20 mx-auto max-w-[90%] rounded-xl bg-kid-orange/90 px-3 py-2 text-center text-sm font-bold text-white">
                    {kk.lfk.poseSearch}
                  </div>
                )}
                {modelError && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/75 p-4 text-center text-white">
                    <p className="text-sm">{kk.lfk.poseFailed}</p>
                    <Button variant="kid" size="default" onClick={() => window.location.reload()}>
                      {kk.camera.retry}
                    </Button>
                  </div>
                )}
              </>
            )}

            {started && !ready && !loading && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 text-center text-white">
                <p className="text-sm">{kk.camera.allow}</p>
                <Button variant="kid" onClick={retry}>
                  {kk.camera.retry}
                </Button>
              </div>
            )}
            {completed && celebrateDone && !onStepComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-kid-green/30 text-6xl">
                🎉
              </div>
            )}
          </div>
        </div>

        {showSplit && (
          <div className="flex min-h-0 flex-col gap-1.5">
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-kid-orange sm:text-xs">
              {kk.lfk.labelDemo}
            </p>
            <div className="flex aspect-[4/3] max-h-[min(58vh,560px)] w-full items-center justify-center self-start overflow-hidden rounded-3xl border-2 border-kid-purple/15 bg-white p-2">
              <ExerciseDemoPlayer exercise={exercise} compact={false} showSteps={false} autoPlay />
            </div>
          </div>
        )}
      </div>

      {started && error && (
        <div className="glass-card flex flex-col items-center gap-3 p-4 text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="kid" onClick={retry}>
            {kk.camera.retry}
          </Button>
        </div>
      )}

      {started && !error && !completed && (
        <div className="glass-card space-y-3 p-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-4xl">{exercise.emoji}</span>
            {detected && <span className="text-2xl" title="pose ok">🟢</span>}
            {poseLoading && <span className="text-2xl">⏳</span>}
          </div>
          <KidLessonFeedback status={feedbackStatus} waitingLabel={kk.lfk.kid.body} />
          {hint && feedbackStatus !== "correct" && (
            <p className="text-center text-sm font-medium text-muted-foreground">{hint}</p>
          )}
          <ProgressBar progress={progress} />
        </div>
      )}

      {started && !error && completed && !onStepComplete && celebrateDone && (
        <div className="flex flex-col items-center gap-4">
          <SuccessAnimation stars={stars} />
          <Link href={backHref}>
            <Button variant="kid" size="lg">
              {kk.lfk.nextExercise}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
