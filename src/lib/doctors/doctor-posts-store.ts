import type { DoctorPost } from "@/types/doctor";

const STORAGE_KEY = "tanymkids-doctor-posts-v1";

type Store = Record<string, DoctorPost[]>;

const seedPosts: Store = {
  "dr-ainur-lfk": [
    {
      id: "seed-1",
      doctorId: "dr-ainur-lfk",
      caption: "Үйде ЛФК: мойын қимылы — TanymKids сабағымен бірге жаттығыңыз.",
      createdAt: "2026-03-01T10:00:00.000Z",
    },
    {
      id: "seed-2",
      doctorId: "dr-ainur-lfk",
      caption: "4 повторения лучше, чем один длинный подход — так детям проще.",
      createdAt: "2026-02-20T14:30:00.000Z",
    },
  ],
};

function readStore(): Store {
  if (typeof window === "undefined") return { ...seedPosts };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = { ...seedPosts };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return { ...seedPosts, ...JSON.parse(raw) } as Store;
  } catch {
    return { ...seedPosts };
  }
}

function writeStore(store: Store): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getDoctorPosts(doctorId: string): DoctorPost[] {
  const store = readStore();
  const posts = store[doctorId] ?? [];
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function addDoctorPost(doctorId: string, caption: string): DoctorPost {
  const trimmed = caption.trim();
  if (!trimmed) throw new Error("empty");
  const post: DoctorPost = {
    id: `post-${Date.now()}`,
    doctorId,
    caption: trimmed,
    createdAt: new Date().toISOString(),
  };
  const store = readStore();
  const list = store[doctorId] ?? [];
  store[doctorId] = [post, ...list];
  writeStore(store);
  return post;
}
