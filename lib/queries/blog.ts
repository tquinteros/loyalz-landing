import { createPublicClient } from "@/lib/supabase/public"
import type { Post } from "@/lib/types/Posts"

export const publicPostsQueryKey = ["public-posts"] as const
export const PUBLIC_POSTS_TAG = "public-posts"

/**
 * Plain read-only public fetcher. Client-safe (no `'use cache'`, no server-only imports).
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
