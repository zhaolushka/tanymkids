"use client";

import { useEffect, useState } from "react";
import styles from "./exercise-demos.module.css";

interface AnimatedExerciseDemoProps {
  exerciseId: string;
  compact?: boolean;
}

function StickFigure({ variant }: { variant: string }) {
  return (
    <div className={`${styles.demoStage} ${compactClass(styles, variant)}`}>
      <div className={styles.figure}>
        <div className={styles.head} />
        <div className={styles.body} />
        <div className={`${styles.arm} ${styles.armLeft}`} />
        <div className={`${styles.arm} ${styles.armRight}`} />
        <div className={`${styles.leg} ${styles.legLeft}`} />
        <div className={`${styles.leg} ${styles.legRight}`} />
      </div>
    </div>
  );
}

function compactClass(styles: Record<string, string>, variant: string): string {
  const map: Record<string, string> = {
    grow_up: styles.armsUp,
    wings: styles.armsSide,
    airplane: styles.sideBend,
    bow_forward: styles.forwardBend,
    small_big: styles.squat,
    arms_up: styles.armsUp,
    arms_side: styles.armsSide,
    side_bend: styles.sideBend,
    forward_bend: styles.forwardBend,
    squat: styles.squat,
    one_leg_balance: styles.balance,
    goat: styles.goat,
    ring: styles.ring,
    palm_fist: styles.palmFist,
    catch_shape: styles.catchShape,
  };
  return map[variant] ?? "";
}

function HandGestureDemo({ exerciseId }: { exerciseId: string }) {
  const [palm, setPalm] = useState(true);

  useEffect(() => {
    if (exerciseId !== "palm_fist") return;
    const timer = setInterval(() => setPalm((v) => !v), 1200);
    return () => clearInterval(timer);
  }, [exerciseId]);

  const emojiMap: Record<string, string> = {
    goat: "🤘",
    ring: "👌",
    palm_fist: palm ? "🖐️" : "✊",
    catch_shape: "☝️",
  };

  return (
    <div className={`${styles.handStage} ${compactClass(styles, exerciseId)}`}>
      <span className={styles.handEmoji} role="img" aria-hidden>
        {emojiMap[exerciseId] ?? "🖐️"}
      </span>
    </div>
  );
}

export function AnimatedExerciseDemo({ exerciseId, compact = false }: AnimatedExerciseDemoProps) {
  const lfkIds = [
    "grow_up",
    "wings",
    "airplane",
    "bow_forward",
    "small_big",
    "arms_up",
    "arms_side",
    "side_bend",
    "forward_bend",
    "squat",
    "one_leg_balance",
  ];

  if (lfkIds.includes(exerciseId)) {
    return (
      <div className={compact ? "scale-75 origin-center" : ""}>
        <StickFigure variant={exerciseId} />
      </div>
    );
  }

  return (
    <div className={compact ? "scale-75 origin-center" : ""}>
      <HandGestureDemo exerciseId={exerciseId} />
    </div>
  );
}
