"use client"

import { useQuery } from "@tanstack/react-query"
import BlogsPageTemplate from "@/components/blogs/blogs-page-template"
import {
  fetchPublicPosts,
  publicPostsQueryKey,
} from "@/lib/queries/blog"
import type { Post } from "@/lib/types/Posts"

type Props = {
  initialData: Post[]
}

export default function BlogsClient({ initialData }: Props) {
  const { data } = useQuery({
    queryKey: publicPostsQueryKey,
    queryFn: fetchPublicPosts,
    initialData,
    staleTime: 1000 * 60 * 5,
  })

  return <BlogsPageTemplate posts={data ?? initialData} />
}
