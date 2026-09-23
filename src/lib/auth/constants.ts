export const AUTH_COOKIE = {
  role: "tanym_role",
  userId: "tanym_user_id",
  displayName: "tanym_display_name",
  kidMode: "tanym_kid_mode",
  activeChildId: "tanym_active_child",
  pinUnlock: "tanym_pin_ok",
  pinHash: "tanym_pin_hash",
  demo: "tanym_demo",
} as const;

export type AppRole = "parent" | "doctor";

export const DEMO_DEFAULT_PIN = "1234";

export const PIN_UNLOCK_MAX_AGE_SEC = 60 * 30;
