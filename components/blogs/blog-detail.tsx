import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ContentRenderer } from "@/components/blogs/content-renderer"
import type { FullPost } from "@/lib/types/Posts"
import Image from "next/image"

function formatDate(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString("es", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const BlogDetail = ({ post }: { post: FullPost }) => {
  const publishedLabel = formatDate(post.published_at ?? post.created_at)

  return (
    <article className="container mx-auto max-w-3xl px-5 py-10 lg:px-0">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Todos los blogs
      </Link>

      {post.cover_image ? (
        <div className="mt-8 overflow-hidden rounded-xl">
          <Image
            width={1000}
            height={1000}
            src={post.cover_image}
            loading="eager"
            alt={post.title}
            className="aspect-video w-full bg-accent object-cover"
          />
        </div>
      ) : null}

      <header className="mt-8 space-y-3 border-b pb-8">
        <div className="flex flex-wrap items-center gap-2">
          {post.status === "published" ? (
            <Badge variant="default">Publicado</Badge>
          ) : (
            <Badge variant="outline">Borrador</Badge>
          )}
          {publishedLabel ? (
            <span className="text-sm text-muted-foreground">
              {publishedLabel}
            </span>
          ) : null}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        ) : null}
      </header>

      {post.content ? (
        <div className="mt-8">
          <ContentRenderer content={post.content} />
        </div>
      ) : (
        <p className="mt-8 text-sm italic text-muted-foreground">
          Este blog aún no tiene contenido.
        </p>
      )}

      <footer className="mt-16 border-t pt-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Volver al blog
        </Link>
      </footer>
    </article>
  )
}

export default BlogDetail
