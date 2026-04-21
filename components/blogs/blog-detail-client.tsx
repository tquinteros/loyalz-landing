"use client"

import { useQuery } from "@tanstack/react-query"
import BlogDetail from "@/components/blogs/blog-detail"
import {
  fetchPublicPostBySlug,
  publicPostQueryKey,
} from "@/lib/queries/blog"
import type { FullPost } from "@/lib/types/Posts"

type Props = {
  slug: string
  initialData: FullPost
}

export default function BlogDetailClient({ slug, initialData }: Props) {
  const { data } = useQuery({
    queryKey: publicPostQueryKey(slug),
    queryFn: () => fetchPublicPostBySlug(slug),
    initialData,
    staleTime: 1000 * 60 * 5,
  })

  return <BlogDetail post={data ?? initialData} />
}
