import type { Post } from "@/lib/types/Posts"

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Pick up to `count` published posts excluding the current slug. */
export function pickRandomRelatedPosts(
  posts: Post[],
  excludeSlug: string,
  count = 3,
): Post[] {
  const candidates = posts.filter((post) => post.slug !== excludeSlug)
  if (candidates.length <= count) return candidates
  return shuffleArray(candidates).slice(0, count)
}
