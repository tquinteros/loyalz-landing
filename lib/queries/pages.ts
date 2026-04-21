import { createPublicClient } from "@/lib/supabase/public"
import type { AnyPageSection, Page } from "@/lib/types/Pages"

export const publicPageQueryKey = (slug: string) =>
  ["public-page", slug] as const
export const publicPageTag = (slug: string) => `public-page:${slug}`
export const PUBLIC_PAGES_TAG = "public-pages"

const PAGE_COLUMNS =
  "id, slug, title, sections, status, seo_title, seo_description, created_at, updated_at"

/**
 * Plain read-only public fetcher for a page by slug. Client-safe (no `'use cache'`).
 * Used by TanStack Query on the client. On the server, prefer
 * `fetchPublicPageBySlugCached` from `./pages.server` so responses are
 * cached and tagged.
 *
 * Returns `null` when the page does not exist (or is not published) so callers
 * can distinguish not-found from errors.
 */
export async function fetchPublicPageBySlug(
  slug: string,
): Promise<Page | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("pages")
    .select(PAGE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  return {
    ...data,
    sections: normalizeSections(data.sections),
  } as Page
}

/**
 * Guard against corrupt DB values: the renderer expects an array of sections.
 * Anything else (null / object / string) is coerced to an empty list so the
 * page still renders instead of crashing.
 */
function normalizeSections(value: unknown): AnyPageSection[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (s): s is AnyPageSection =>
      !!s && typeof s === "object" && "type" in s && "id" in s,
  )
}
