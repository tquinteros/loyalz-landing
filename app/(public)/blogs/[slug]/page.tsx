import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import type { FullPost } from "@/lib/types/Posts"
import BlogDetail from "@/components/blogs/blog-detail"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("posts")
    .select("title, seo_title, seo_description, excerpt")
    .eq("slug", slug)
    .maybeSingle()

  if (!data) return {}

  const title = data.seo_title || data.title
  const description = data.seo_description || data.excerpt || undefined

  return { title, description }
}

export default function BlogPostPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="container mx-auto px-5 py-10">Cargando…</div>}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

async function BlogPostContent({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, status, published_at, seo_title, seo_description, created_at, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    return (
      <div className="container mx-auto px-5 py-10 lg:px-0">
        <p className="text-destructive">Error: {error.message}</p>
        <Link
          href="/blogs"
          className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← Volver al blog
        </Link>
      </div>
    )
  }

  if (!data) {
    notFound()
  }

  return <BlogDetail post={data as FullPost} />
}
