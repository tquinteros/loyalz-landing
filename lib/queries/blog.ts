import { createPublicClient } from "@/lib/supabase/public"
import type { FullPost, Post } from "@/lib/types/Posts"

export const publicPostsQueryKey = ["public-posts"] as const
export const PUBLIC_POSTS_TAG = "public-posts"

export const publicPostQueryKey = (slug: string) =>
  ["public-post", slug] as const
export const publicPostTag = (slug: string) => `public-post:${slug}`

/**
 * Plain read-only public fetcher for the blog list. Client-safe (no `'use cache'`).
 * Used by TanStack Query on the client. On the server, use `fetchPublicPostsCached`
 * from `./blog.server` instead so responses are cached and tagged.
 */
export async function fetchPublicPosts(): Promise<Post[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, status, published_at, seo_title, seo_description, created_at, updated_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Post[]
}

/**
 * Plain read-only public fetcher for a single post by slug. Client-safe.
 * On the server, use `fetchPublicPostBySlugCached` for caching + tagging.
 *
 * Returns `null` when the post does not exist so callers can distinguish
 * not-found from errors.
 */
export async function fetchPublicPostBySlug(
  slug: string,
): Promise<FullPost | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, status, published_at, seo_title, seo_description, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as FullPost | null) ?? null
}
