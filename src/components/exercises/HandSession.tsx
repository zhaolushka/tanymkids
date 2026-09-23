"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CameraView } from "@/components/cv/CameraView";
import { HandOverlay } from "@/components/cv/HandOverlay";
import { mirrorHands } from "@/lib/cv/mirror-landmarks";
import { DemoCorner } from "@/components/exercises/DemoCorner";
import { ExerciseIntro } from "@/components/exercises/ExerciseIntro";
import { ExerciseFeedback } from "@/components/kid/ExerciseFeedback";
import { Mascot } from "@/components/kid/Mascot";
import { ProgressBar } from "@/components/kid/ProgressBar";
import { SuccessAnimation } from "@/components/kid/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { useExerciseSession } from "@/hooks/useExerciseSession";
import { useHandTracking } from "@/hooks/useHandTracking";
import { evaluateHands } from "@/lib/exercises/hands";
import { kk } from "@/i18n/kk";
import type { Exercise } from "@/types/exercise";

interface HandSessionProps {
  exercise: Exercise;
}

export function HandSession({ exercise }: HandSessionProps) {
  const [started, setStarted] = useState(false);
  const { videoRef, connectVideoRef, ready, loading, error, retry, requestFromUserGesture } =
    useCamera({
      enabled: true,
      autoStart: false,
    });
  const { hands, detected, loading: modelLoading } = useHandTracking(
    videoRef,
    started && ready,
  );
  const mirroredHands = useMemo(() => mirrorHands(hands), [hands]);
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
    module: "hands",
    holdDurationMs: exercise.holdDurationMs,
  });

  const beginExercise = () => {
    void requestFromUserGesture().then((ok) => {
      if (ok) setStarted(true);
    });
  };

  useEffect(() => {
    if (!started || !ready) return;
    if (!detected || mirroredHands.length === 0) {
      setWaiting(kk.hands.hints.showBoth);
      return;
    }
    if (completed) return;

    setDetecting(
      mirroredHands.length >= 2 ? kk.feedback.bothHandsVisible : kk.feedback.oneHandVisible,
    );
    processFrame(evaluateHands(exercise.id, mirroredHands));
  }, [
    mirroredHands,
    detected,
    started,
    ready,
    completed,
    exercise.id,
    processFrame,
    setDetecting,
    setWaiting,
  ]);

  const cameraShellClass = started
    ? "camera-frame relative"
    : "pointer-events-none fixed left-0 top-0 -z-10 h-[480px] w-[640px] overflow-hidden opacity-0";

  return (
    <div className="flex flex-col gap-6">
      {!started ? (
        <ExerciseIntro exercise={exercise} onStart={beginExercise} />
      ) : error ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Mascot message={error} mood="thinking" />
          <div className="flex gap-3">
            <Button variant="kid" onClick={retry}>
              {kk.camera.retry}
            </Button>
            <Link href="/kid/hands">
              <Button variant="outline">{kk.kid.backMenu}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-kid-purple">
              {exercise.emoji} {exercise.title}
            </h1>
            {!completed && (
              <Mascot
                message={mirroredHands.length >= 2 ? kk.hands.bothHands : kk.hands.showBoth}
              />
            )}
          </div>
        </>
      )}

      <div
        className={`${cameraShellClass} ${started ? "relative mx-auto aspect-[4/3] w-full max-h-[min(58vh,560px)] overflow-hidden rounded-3xl bg-black" : ""}`}
      >
        <CameraView
          videoRef={connectVideoRef}
          fit="contain"
          loading={started && (loading || modelLoading || !ready)}
          className={started ? "absolute inset-0 h-full w-full" : "h-full w-full"}
        />
        {started && ready && !loading && (
          <HandOverlay hands={hands} mirrored videoRef={videoRef} />
        )}
        {started && !completed && !error && <DemoCorner exercise={exercise} />}
        {started && exercise.id === "catch_shape" && !completed && !error && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-2xl border-4 border-dashed border-kid-yellow bg-kid-yellow/20" />
          </div>
        )}
      </div>

      {started && !error && !completed ? (
        <div className="space-y-3">
          <ExerciseFeedback
            status={feedbackStatus}
            hint={hint}
            taskLabel={
              mirroredHands.length >= 2
                ? `${exercise.title} ${kk.hands.bothHandsTask}`
                : exercise.title
            }
          />
          <ProgressBar progress={progress} />
        </div>
      ) : started && !error && completed ? (
        <div className="flex flex-col items-center gap-4">
          <SuccessAnimation stars={stars} />
          <Link href="/kid/hands">
            <Button variant="kid" size="lg">
              {kk.hands.nextExercise}
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
