import type { kk } from "@/i18n/kk";

export type Locale = "kk" | "ru";

type DeepString<T> = T extends string ? string : { [K in keyof T]: DeepString<T[K]> };

export type Messages = DeepString<typeof kk>;

export const LOCALE_STORAGE_KEY = "tanymkids-locale";

export const localeLabels: Record<Locale, string> = {
  kk: "Қазақша",
  ru: "Русский",
};
