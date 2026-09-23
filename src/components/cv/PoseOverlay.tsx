"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import {
  POSE_BODY_CONNECTIONS,
  POSE_BODY_JOINTS,
  POSE_COLORS,
  poseHighlightIndices,
} from "@/lib/cv/pose-connections";
import {
  getVideoContentRect,
  landmarkToCanvas,
  readVideoDimensions,
} from "@/lib/cv/video-content-rect";
import type { Landmark } from "@/types/exercise";

interface PoseOverlayProps {
  landmarks: Landmark[];
  mirrored?: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
  exerciseId?: string;
}

export function PoseOverlay({
  landmarks,
  mirrored = true,
  videoRef,
  exerciseId,
}: PoseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLayoutTick, setVideoLayoutTick] = useState(0);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;
    const bump = () => setVideoLayoutTick((value) => value + 1);
    video.addEventListener("loadedmetadata", bump);
    return () => video.removeEventListener("loadedmetadata", bump);
  }, [videoRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (landmarks.length < 11) return;

    const { width: vw, height: vh } = readVideoDimensions(videoRef?.current ?? null);
    const rect = getVideoContentRect(canvas.width, canvas.height, vw, vh);
    const highlights = new Set(poseHighlightIndices(exerciseId ?? ""));

    drawPose(ctx, landmarks, rect, mirrored, highlights);
  }, [landmarks, mirrored, videoRef, videoLayoutTick, exerciseId]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[15]">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function drawPose(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  contentRect: { x: number; y: number; width: number; height: number },
  mirrored: boolean,
  highlights: Set<number>,
) {
  const toCanvas = (point: Landmark) => landmarkToCanvas(point, contentRect, mirrored);
  const points = landmarks.map(toCanvas);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const [from, to] of POSE_BODY_CONNECTIONS) {
    if (from >= landmarks.length || to >= landmarks.length) continue;
    const start = points[from];
    const end = points[to];
    if (!start || !end) continue;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = POSE_COLORS.line;
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  for (const index of POSE_BODY_JOINTS) {
    if (index >= landmarks.length) continue;
    const point = points[index];
    if (!point) continue;
    const highlighted = highlights.has(index);
    const isHead = index === 0;
    const radius = highlighted ? 14 : isHead ? 10 : 9;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = highlighted ? POSE_COLORS.highlight : isHead ? "#fcd34d" : POSE_COLORS.joint;
    ctx.fill();
    ctx.strokeStyle = "rgba(45, 27, 105, 0.85)";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (highlighted) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 22, 0, Math.PI * 2);
      ctx.strokeStyle = POSE_COLORS.highlight;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}
