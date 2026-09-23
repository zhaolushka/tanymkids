"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { POSE_BODY_CONNECTIONS, POSE_BODY_JOINTS, POSE_COLORS } from "@/lib/cv/pose-connections";
import { getGhostPoseForExercise } from "@/lib/cv/pose-templates";
import {
  getVideoContentRect,
  landmarkToCanvas,
  readVideoDimensions,
} from "@/lib/cv/video-content-rect";
import type { Landmark } from "@/types/exercise";

interface GhostPoseOverlayProps {
  exerciseId: string;
  opacity?: number;
  mirrored?: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
}

export function GhostPoseOverlay({
  exerciseId,
  opacity = 0.48,
  mirrored = true,
  videoRef,
}: GhostPoseOverlayProps) {
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

    const ghost = getGhostPoseForExercise(exerciseId);
    if (!ghost) return;

    const { width: vw, height: vh } = readVideoDimensions(videoRef?.current ?? null);
    const rect = getVideoContentRect(canvas.width, canvas.height, vw, vh);

    drawGhostPose(ctx, ghost, rect, mirrored, opacity);
  }, [exerciseId, mirrored, opacity, videoRef, videoLayoutTick]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[10]">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function drawGhostPose(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  contentRect: { x: number; y: number; width: number; height: number },
  mirrored: boolean,
  opacity: number,
) {
  const toCanvas = (point: Landmark) => landmarkToCanvas(point, contentRect, mirrored);
  const points = landmarks.map(toCanvas);

  ctx.globalAlpha = opacity;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const [from, to] of POSE_BODY_CONNECTIONS) {
    const start = points[from];
    const end = points[to];
    if (!start || !end) continue;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = POSE_COLORS.ghostLine;
    ctx.lineWidth = 6;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  for (const index of POSE_BODY_JOINTS) {
    const point = points[index];
    if (!point) continue;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = POSE_COLORS.ghostJoint;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}
