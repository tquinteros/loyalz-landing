import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;


export const HOME_SLUG = "home" as const
export const ABOUT_SLUG = "about" as const
export const BLOGS_SLUG = "blogs" as const
export const CLUB_SLUG = "club" as const
export const TERMS_SLUG = "terms" as const
export const PRIVACY_SLUG = "privacy" as const
export const COOKIES_SLUG = "cookies" as const

/** CMS pages that use `LegalPageRenderer` (single legal-document style layout). */
export const LEGAL_PAGE_SLUGS = ["terms", "privacy", "cookies"] as const
export type LegalPageSlug = (typeof LEGAL_PAGE_SLUGS)[number]

export function isLegalPageSlug(slug: string): slug is LegalPageSlug {
  return (LEGAL_PAGE_SLUGS as readonly string[]).includes(slug)
}

export function t(
  value?: string | { es?: string; en?: string },
  locale: "es" | "en" = "es",
) {
  if (!value) return ""

  if (typeof value === "string") {
    return value
  }

  return value[locale] || value.es || value.en || ""
}