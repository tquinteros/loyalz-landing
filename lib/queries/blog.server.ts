import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { fetchPublicPosts, PUBLIC_POSTS_TAG } from "./blog"
import type { Post } from "@/lib/types/Posts"

/**
 * Server-only cached wrapper around `fetchPublicPosts`.
 * Use this in RSCs. Invalidate with `updateTag(PUBLIC_POSTS_TAG)` in Server Actions.
 */
export async function fetchPublicPostsCached(): Promise<Post[]> {
  "use cache"
  cacheTag(PUBLIC_POSTS_TAG)
  cacheLife("minutes")
  return fetchPublicPosts()
}
