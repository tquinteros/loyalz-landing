import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { fetchPublicPostBySlugCached } from "@/lib/queries/blog.server"
import BlogDetailClient from "@/components/blogs/blog-detail-client"

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
    <Suspense fallback={null}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

async function BlogPostContent({ params }: PageProps) {
  const { slug } = await params
  const post = await fetchPublicPostBySlugCached(slug)

  if (!post) notFound()

  return <BlogDetailClient slug={slug} initialData={post} />
}
