"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { kk } from "@/i18n/kk";
import { ru } from "@/i18n/ru";
import {
  LOCALE_STORAGE_KEY,
  type Locale,
  type Messages,
} from "@/i18n/types";

const messagesByLocale: Record<Locale, Messages> = {
  kk: kk as Messages,
  ru,
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "kk";
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "ru" ? "ru" : "kk";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("kk");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "ru" ? "ru" : "kk";
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: messagesByLocale[locale],
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: "kk", setLocale: () => {}, t: kk };
  }
  return ctx;
}
