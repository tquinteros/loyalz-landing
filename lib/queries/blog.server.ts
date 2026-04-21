import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import {
  fetchPublicPostBySlug,
  fetchPublicPosts,
  PUBLIC_POSTS_TAG,
  publicPostTag,
} from "./blog"
import type { FullPost, Post } from "@/lib/types/Posts"

/**
 * Server-only cached wrapper around `fetchPublicPosts`.
 * Invalidate with `updateTag(PUBLIC_POSTS_TAG)` from a Server Action.
 */
export async function fetchPublicPostsCached(): Promise<Post[]> {
  "use cache"
  cacheTag(PUBLIC_POSTS_TAG)
  cacheLife("minutes")
  return fetchPublicPosts()
}

/**
 * Server-only cached wrapper around `fetchPublicPostBySlug`.
 * Tagged per-slug and also under the list tag so either invalidates it.
 * Invalidate with `updateTag(publicPostTag(slug))` or `updateTag(PUBLIC_POSTS_TAG)`.
 */
export async function fetchPublicPostBySlugCached(
  slug: string,
): Promise<FullPost | null> {
  "use cache"
  cacheTag(publicPostTag(slug))
  cacheTag(PUBLIC_POSTS_TAG)
  cacheLife("minutes")
  return fetchPublicPostBySlug(slug)
}
