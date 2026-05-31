import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  fetchPublicPostBySlugCached,
  fetchPublicPostsCached,
} from "@/lib/queries/blog.server"
import { pickRandomRelatedPosts } from "@/lib/blogs/related-posts"
import BlogDetailClient from "@/components/blogs/blog-detail-client"
import { BlogsDetailSkeleton } from "@/components/blogs/blogs-skeleton"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPublicPostBySlugCached(slug)

  if (!post) return {}

  const title = post.seo_title || post.title
  const description = post.seo_description || post.excerpt || undefined

  return { title, description }
}

export default function BlogPostPage({ params }: PageProps) {
  return (
    <Suspense fallback={<BlogsDetailSkeleton />}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

async function BlogPostContent({ params }: PageProps) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([
    fetchPublicPostBySlugCached(slug),
    fetchPublicPostsCached(),
  ])

  if (!post) notFound()

  const relatedPosts = pickRandomRelatedPosts(allPosts, slug, 3)

  return (
    <BlogDetailClient
      slug={slug}
      initialData={post}
      relatedPosts={relatedPosts}
    />
  )
}
