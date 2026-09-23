import { assignHandsByScreenPosition } from "@/lib/cv/assign-hands";
import { LESSON_GESTURE_PASS, scoreGestureForLesson } from "@/lib/cv/gesture-score-lesson";
import { lessonsKk } from "@/i18n/lessons";
import type { EvaluationResult, Landmark } from "@/types/exercise";
import type { HandGesture, LessonTask } from "@/types/lesson";

function getGhostGestures(
  task: LessonTask,
  soloGestureIndex = 0,
): {
  left: HandGesture | null;
  right: HandGesture | null;
} {
  if (task.mode === "solo_practice" && task.soloGestures?.length) {
    const gesture = task.soloGestures[soloGestureIndex] ?? task.soloGestures[0];
    return { left: gesture, right: gesture };
  }
  if (task.mode === "both_same" && task.gesture) {
    return { left: task.gesture, right: task.gesture };
  }
  return {
    left: task.leftGesture ?? null,
    right: task.rightGesture ?? null,
  };
}

function scoreHand(landmarks: Landmark[], gesture: HandGesture): number {
  return scoreGestureForLesson(landmarks, gesture);
}

function passScore(score: number): boolean {
  return score >= LESSON_GESTURE_PASS;
}

export function evaluateLessonTask(
  task: LessonTask,
  hands: Landmark[][],
  options?: { soloGestureIndex?: number },
): EvaluationResult {
  const { left, right } = getGhostGestures(task, options?.soloGestureIndex);
  const { screenLeft, screenRight } = assignHandsByScreenPosition(hands);

  if (!screenLeft && !screenRight) {
    return { success: false, accuracy: 0, hint: lessonsKk.kid.hands };
  }

  if (task.mode === "solo_practice") {
    const gestures = task.soloGestures ?? [];
    const gesture = gestures[options?.soloGestureIndex ?? 0];
    if (!gesture) {
      return { success: false, accuracy: 0, hint: lessonsKk.kid.again };
    }

    const visible = screenLeft ?? screenRight;
    if (visible) {
      const score = scoreHand(visible, gesture);
      if (passScore(score)) {
        return { success: true, accuracy: score };
      }
      if (score >= 0.26) {
        return { success: false, accuracy: score, partial: true, hint: lessonsKk.kid.almost };
      }
    }

    if (screenLeft && screenRight) {
      const leftScore = scoreHand(screenLeft, gesture);
      const rightScore = scoreHand(screenRight, gesture);
      const best = Math.max(leftScore, rightScore);
      const avg = (leftScore + rightScore) / 2;
      if (passScore(best) || passScore(avg)) {
        return { success: true, accuracy: Math.max(best, avg) };
      }
      if (avg >= 0.26) {
        return { success: false, accuracy: avg, partial: true, hint: lessonsKk.kid.almost };
      }
    }

    return { success: false, accuracy: 0.15, hint: lessonsKk.kid.again };
  }

  if (task.mode === "both_same" && left) {
    if (!screenLeft || !screenRight) {
      const visible = screenLeft ?? screenRight;
      if (visible) {
        const score = scoreHand(visible, left);
        if (passScore(score)) {
          return { success: true, accuracy: score };
        }
        if (score >= 0.26) {
          return { success: false, accuracy: score, partial: true, hint: lessonsKk.kid.almost };
        }
      }
      return { success: false, accuracy: 0.2, hint: lessonsKk.kid.hands };
    }

    const leftScore = scoreHand(screenLeft, left);
    const rightScore = scoreHand(screenRight, left);
    const avg = (leftScore + rightScore) / 2;

    if (passScore(avg) || (passScore(leftScore) && passScore(rightScore))) {
      return { success: true, accuracy: avg };
    }
    if (avg >= 0.26 || passScore(leftScore) || passScore(rightScore)) {
      return { success: false, accuracy: avg, partial: true, hint: lessonsKk.kid.almost };
    }

    return { success: false, accuracy: avg, hint: lessonsKk.kid.again };
  }

  if (!left || !right) {
    return { success: false, accuracy: 0, hint: lessonsKk.kid.again };
  }

  if (!screenLeft || !screenRight) {
    const visible = screenLeft ?? screenRight;
    const expected = screenLeft ? left : right;
    if (visible && expected) {
      const score = scoreHand(visible, expected);
      if (passScore(score)) {
        return { success: true, accuracy: score };
      }
      if (score >= 0.26) {
        return { success: false, accuracy: score, partial: true, hint: lessonsKk.kid.almost };
      }
    }
    return { success: false, accuracy: 0.2, hint: lessonsKk.kid.hands };
  }

  const leftScore = scoreHand(screenLeft, left);
  const rightScore = scoreHand(screenRight, right);
  const avg = (leftScore + rightScore) / 2;

  if (passScore(avg) || (passScore(leftScore) && passScore(rightScore))) {
    return { success: true, accuracy: avg };
  }

  if (passScore(leftScore) || passScore(rightScore) || avg >= 0.3) {
    return {
      success: false,
      accuracy: avg,
      partial: true,
      hint: lessonsKk.kid.almost,
    };
  }

  return { success: false, accuracy: avg, hint: lessonsKk.kid.again };
}

export function getTaskGhostGestures(
  task: LessonTask,
  soloGestureIndex = 0,
): {
  left: HandGesture | null;
  right: HandGesture | null;
} {
  return getGhostGestures(task, soloGestureIndex);
}
