import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const AUDIENCES_SLUG = "audiences" as const

/** Query param for pre-selecting an audiences tab, e.g. `/audiences?tab=cafes`. */
export const AUDIENCES_TAB_QUERY = "tab" as const

/** Tab keys on the audiences page (must match CMS `AudienceTabItem.key`). */
export const AUDIENCE_TAB_KEYS = [
  "cafes",
  "restaurantes",
  "delivery-first",
] as const
export type AudienceTabKey = (typeof AUDIENCE_TAB_KEYS)[number]

export function isAudienceTabKey(key: string): key is AudienceTabKey {
  return (AUDIENCE_TAB_KEYS as readonly string[]).includes(key)
}

export function audiencesHref(tab?: AudienceTabKey | string): string {
  if (tab && isAudienceTabKey(tab)) {
    return `/${AUDIENCES_SLUG}?${AUDIENCES_TAB_QUERY}=${tab}`
  }
  return `/${AUDIENCES_SLUG}`
}

/** Pick `requested` when it exists in CMS tabs; otherwise the first tab key. */
export function resolveAudienceTabKey(
  requested: string | undefined | null,
  availableKeys: string[],
): string {
  if (requested && availableKeys.includes(requested)) {
    return requested
  }
  return availableKeys[0] ?? ""
}
export const HOME_SLUG = "home" as const
export const ABOUT_SLUG = "about" as const
export const BLOGS_SLUG = "blogs" as const
export const CLUB_SLUG = "club" as const
export const AI_SLUG = "ai" as const
export const POS_SLUG = "pos" as const
export const REVIEWS_SLUG = "reviews" as const
export const TERMS_SLUG = "terms" as const

/** All product page slugs — used to route to ProductRenderer when page.type is not set. */
export const PRODUCT_PAGE_SLUGS = ["club", "ai", "pos", "reviews"] as const
export type ProductPageSlug = (typeof PRODUCT_PAGE_SLUGS)[number]

export function isProductPageSlug(slug: string): slug is ProductPageSlug {
  return (PRODUCT_PAGE_SLUGS as readonly string[]).includes(slug)
}
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