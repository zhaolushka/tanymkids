"use client";

import { useEffect, useRef } from "react";

interface LessonDemoVideoProps {
  src: string;
  playing: boolean;
  taskIndex: number;
  taskCount: number;
  playbackRate: number;
  layout?: "overlay" | "below" | "split";
  /** Бүкіл видео циклмен — «өзің» кезеңі */
  fullLoop?: boolean;
}

const DEMO_ASPECT = "608 / 1080";
const SEGMENT_LOOP_EPS = 0.06;

function segmentBounds(
  taskIndex: number,
  taskCount: number,
  duration: number,
): { start: number; end: number } {
  if (taskCount <= 0 || !Number.isFinite(duration)) {
    return { start: 0, end: duration || 0 };
  }
  const start = (taskIndex / taskCount) * duration;
  const end =
    taskIndex >= taskCount - 1 ? duration : ((taskIndex + 1) / taskCount) * duration;
  return { start, end };
}

export function LessonDemoVideo({
  src,
  playing,
  taskIndex,
  taskCount,
  playbackRate,
  layout = "below",
  fullLoop = false,
}: LessonDemoVideoProps) {
  const fullLoopRef = useRef(fullLoop);
  fullLoopRef.current = fullLoop;
  const videoRef = useRef<HTMLVideoElement>(null);
  const playingRef = useRef(playing);
  const taskIndexRef = useRef(taskIndex);
  const taskCountRef = useRef(taskCount);
  playingRef.current = playing;
  taskIndexRef.current = taskIndex;
  taskCountRef.current = taskCount;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seekToTask = () => {
      if (fullLoopRef.current) {
        if (video.currentTime > 0.2) video.currentTime = 0;
        if (playingRef.current) void video.play().catch(() => {});
        return;
      }
      const { start } = segmentBounds(taskIndex, taskCount, video.duration);
      if (!Number.isFinite(start)) return;
      if (Math.abs(video.currentTime - start) > 0.2) {
        video.currentTime = start;
      }
      if (playingRef.current) {
        void video.play().catch(() => {});
      }
    };

    if (video.readyState >= 1) {
      seekToTask();
    } else {
      video.addEventListener("loadedmetadata", seekToTask, { once: true });
      return () => video.removeEventListener("loadedmetadata", seekToTask);
    }
  }, [taskIndex, taskCount, src, fullLoop]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      void video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loopSegment = () => {
      if (!playingRef.current || !Number.isFinite(video.duration)) return;
      if (fullLoopRef.current) {
        if (video.currentTime >= video.duration - SEGMENT_LOOP_EPS) {
          video.currentTime = 0;
        }
        return;
      }
      const { start, end } = segmentBounds(
        taskIndexRef.current,
        taskCountRef.current,
        video.duration,
      );
      if (video.currentTime >= end - SEGMENT_LOOP_EPS) {
        video.currentTime = start;
        if (video.paused) {
          void video.play().catch(() => {});
        }
      }
    };

    const onEnded = () => {
      if (!playingRef.current) return;
      if (fullLoopRef.current) {
        video.currentTime = 0;
        void video.play().catch(() => {});
        return;
      }
      const { start } = segmentBounds(
        taskIndexRef.current,
        taskCountRef.current,
        video.duration,
      );
      video.currentTime = start;
      void video.play().catch(() => {});
    };

    video.addEventListener("timeupdate", loopSegment);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", loopSegment);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    if (!playing) return;

    const id = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || !playingRef.current) return;
      if (video.readyState >= 2 && video.paused) {
        void video.play().catch(() => {});
      }
    }, 500);

    return () => window.clearInterval(id);
  }, [playing]);

  const wrapperClass =
    layout === "split"
      ? "h-full w-full min-h-0 rounded-2xl border-2 border-white/90 bg-black p-1.5 shadow-lg"
      : layout === "below"
        ? "mx-auto w-full max-w-[280px] rounded-2xl border-2 border-white/90 bg-black p-1.5 shadow-lg"
        : "absolute bottom-2 right-2 z-10 w-[42%] max-w-[240px] rounded-2xl border-2 border-white/90 bg-black p-1 shadow-lg";

  return (
    <div
      className={wrapperClass}
      style={
        layout === "split"
          ? { aspectRatio: DEMO_ASPECT, maxHeight: "min(42vh, 100%)" }
          : { aspectRatio: DEMO_ASPECT }
      }
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted
        preload="auto"
        className="h-full w-full rounded-xl object-contain object-center"
      />
    </div>
  );
}
