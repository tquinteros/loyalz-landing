import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ContentRenderer } from "@/components/blogs/content-renderer"
import type { FullPost } from "@/lib/types/Posts"
import Image from "next/image"
import { SectionWrapper } from "../sections/section-wrapper"

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
    <SectionWrapper className="min-h-screen max-w-5xl mx-auto">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1 text-sm font-medium text-background underline-offset-4 hover:underline"
      >
        ← Todos los blogs
      </Link>

      <header className="mt-8 space-y-3 pb-8">
        {/* <div className="flex flex-wrap items-center gap-2">
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
        </div> */}

        <h1 className="text-3xl font-bold tracking-tight sm:text-[56px]">
          {post.title}
        </h1>
        <span className="text-[16px] font-bold text-background/30">
          {publishedLabel} • Lectura de {post.reading_time} Min
        </span>
        {/* {post.excerpt ? (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        ) : null} */}
      </header>

      {post.cover_image ? (
        <div className="mt-8 overflow-hidden rounded-xl">
          <Image
            width={1000}
            height={1000}
            src={post.cover_image}
            loading="eager"
            alt={post.title}
            className="aspect-video w-full bg-background/10 object-cover"
          />
        </div>
      ) : null}

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
    </SectionWrapper>
  )
}

export default BlogDetail
