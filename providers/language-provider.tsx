"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { t as translate } from "@/lib/utils"
import type { LocalizedString } from "@/lib/types/Pages"

export type Locale = "es" | "en"

export const SUPPORTED_LOCALES: ReadonlyArray<Locale> = ["es", "en"] as const
export const DEFAULT_LOCALE: Locale = "es"
const STORAGE_KEY = "loyalz.locale"

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Resolve a `LocalizedString` (or plain string) using the current locale. */
  t: (value?: LocalizedString | string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en"
}

type Props = {
  children: ReactNode
  /** Optional initial locale (e.g. from cookies / SSR). Falls back to default. */
  initialLocale?: Locale
}

export function LanguageProvider({ children, initialLocale }: Props) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (isLocale(stored)) {
        setLocaleState(stored)
      }
    } catch {
      // ignore storage access errors (private mode, etc.)
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore
      }
    }
  }, [])

  const t = useCallback(
    (value?: LocalizedString | string) => translate(value, locale),
    [locale],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used inside a <LanguageProvider>")
  }
  return ctx
}

/** Convenience hook returning just the translation helper. */
export function useT() {
  return useLanguage().t
}
