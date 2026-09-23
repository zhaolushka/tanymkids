"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedExerciseDemo } from "@/components/exercises/AnimatedExerciseDemo";
import { kk } from "@/i18n/kk";
import type { Exercise } from "@/types/exercise";

interface ExerciseDemoPlayerProps {
  exercise: Exercise;
  compact?: boolean;
  autoPlay?: boolean;
  showSteps?: boolean;
}

export function ExerciseDemoPlayer({
  exercise,
  compact = false,
  autoPlay = true,
  showSteps = true,
}: ExerciseDemoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoAvailable, setVideoAvailable] = useState(Boolean(exercise.demoVideo));
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setVideoAvailable(Boolean(exercise.demoVideo));
    setStepIndex(0);
  }, [exercise.id, exercise.demoVideo]);

  useEffect(() => {
    if (!showSteps || exercise.steps.length <= 1) return;
    const timer = setInterval(() => {
      setStepIndex((current) => (current + 1) % exercise.steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [exercise.steps, showSteps]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoAvailable || !autoPlay) return;
    void video.play().catch(() => {
      setVideoAvailable(false);
    });
  }, [videoAvailable, autoPlay, exercise.id]);

  return (
    <div className={`flex flex-col gap-4 ${compact ? "" : "w-full max-w-md mx-auto"}`}>
      <div className="relative overflow-hidden rounded-3xl border-4 border-kid-purple/20 bg-white shadow-lg">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-kid-purple px-3 py-1 text-xs font-bold text-white">
          {kk.demo.watchHow}
        </div>

        {videoAvailable && exercise.demoVideo ? (
          <video
            ref={videoRef}
            key={exercise.demoVideo}
            className={`w-full object-contain ${compact ? "max-h-40" : "max-h-[min(58vh,420px)] aspect-[4/3]"}`}
            src={exercise.demoVideo}
            poster={exercise.demoPoster}
            autoPlay={autoPlay}
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            onError={() => setVideoAvailable(false)}
          />
        ) : (
          <div className={compact ? "py-2" : "py-4"}>
            <AnimatedExerciseDemo exerciseId={exercise.id} compact={compact} />
          </div>
        )}
      </div>

      {showSteps && !compact && (
        <div className="rounded-2xl bg-white/90 px-4 py-3 text-left shadow-sm">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-kid-purple">
            {kk.demo.step} {stepIndex + 1} {kk.demo.of} {exercise.steps.length}
          </p>
          <p className="text-lg font-medium">{exercise.steps[stepIndex]}</p>
          <div className="mt-3 flex gap-2">
            {exercise.steps.map((_, index) => (
              <span
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index === stepIndex ? "bg-kid-green" : "bg-kid-purple/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
