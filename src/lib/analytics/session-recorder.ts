"use client";

import type { SessionRecord } from "@/types/session";
import { generateId } from "@/lib/utils";

const SESSIONS_KEY = "tanymkids_sessions";

export function getSessions(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? "[]") as SessionRecord[];
  } catch {
    return [];
  }
}

export function saveSession(session: Omit<SessionRecord, "id">): SessionRecord {
  const record: SessionRecord = { ...session, id: generateId() };
  const sessions = getSessions();
  sessions.unshift(record);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 100)));
  return record;
}

export function getSessionStats() {
  const sessions = getSessions();
  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + s.durationSec, 0) / 60,
  );
  const avgAccuracy =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.avgAccuracy, 0) / sessions.length
      : 0;
  const totalStars = sessions.reduce((sum, s) => sum + s.starsEarned, 0);

  return { sessions, totalMinutes, avgAccuracy, totalStars, sessionCount: sessions.length };
}
