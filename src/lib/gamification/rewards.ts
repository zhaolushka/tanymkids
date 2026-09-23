const STARS_KEY = "tanymkids_stars";
const STREAK_KEY = "tanymkids_streak";
const LAST_DATE_KEY = "tanymkids_last_date";

export function getStars(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(STARS_KEY) ?? 0);
}

export function addStars(count: number): number {
  const total = getStars() + count;
  localStorage.setItem(STARS_KEY, String(total));
  updateStreak();
  return total;
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(STREAK_KEY) ?? 0);
}

function updateStreak(): void {
  const today = new Date().toDateString();
  const last = localStorage.getItem(LAST_DATE_KEY);
  const streak = getStreak();

  if (last === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const newStreak = last === yesterday.toDateString() ? streak + 1 : 1;
  localStorage.setItem(STREAK_KEY, String(newStreak));
  localStorage.setItem(LAST_DATE_KEY, today);
}

export function starsForAccuracy(accuracy: number): number {
  if (accuracy >= 0.8) return 3;
  if (accuracy >= 0.5) return 2;
  if (accuracy >= 0.3) return 1;
  return 0;
}
