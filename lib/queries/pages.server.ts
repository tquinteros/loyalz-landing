import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import {
  fetchPublicPageBySlug,
  PUBLIC_PAGES_TAG,
  publicPageTag,
} from "./pages"
import type { Page } from "@/lib/types/Pages"

/**
 * Server-only cached wrapper around `fetchPublicPageBySlug`.
 * Tagged per-slug and also under the list tag so either invalidates it.
 * Invalidate from a Server Action with
 *   `updateTag(publicPageTag(slug))` or `updateTag(PUBLIC_PAGES_TAG)`.
 */
export async function fetchPublicPageBySlugCached(
  slug: string,
): Promise<Page | null> {
  "use cache"
  cacheTag(publicPageTag(slug))
  cacheTag(PUBLIC_PAGES_TAG)
  cacheLife("minutes")
  return fetchPublicPageBySlug(slug)
}
