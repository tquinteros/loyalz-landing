"use client"

import React from "react"
import Link from "next/link"
import { ContentRenderer } from "@/components/blogs/content-renderer"
import { RelatedBlogs } from "@/components/blogs/related-blogs"
import type { FullPost, Post } from "@/lib/types/Posts"
import type { LocalizedString } from "@/lib/types/Pages"
import Image from "next/image"
import { SectionWrapper } from "../sections/section-wrapper"
import { useLanguage, useT } from "@/providers/language-provider"
import type { Locale } from "@/providers/language-provider"

const BLOG_DETAIL_COPY = {
  backToAll: { es: "← Todos los blogs", en: "← All blogs" },
  backToBlog: { es: "← Volver al blog", en: "← Back to blog" },
  noContent: {
    es: "Este blog aún no tiene contenido.",
    en: "This post doesn't have content yet.",
  },
} satisfies Record<string, LocalizedString>

function formatDate(iso: string | null, locale: Locale) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(locale === "en" ? "en-US" : "es", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function readingTimeLabel(minutes: number | null | undefined, locale: Locale) {
  if (minutes == null || !Number.isFinite(minutes)) return null
  const m = Math.round(minutes)
  if (m < 1) return null
  return locale === "en" ? `${m} min read` : `Lectura de ${m} Min`
}

type BlogDetailProps = {
  post: FullPost
  relatedPosts?: Post[]
}

const BlogDetail = ({ post, relatedPosts = [] }: BlogDetailProps) => {
  const t = useT()
  const { locale } = useLanguage()
  const publishedLabel = formatDate(post.published_at ?? post.created_at, locale)
  const readingLabel = readingTimeLabel(post.reading_time, locale)
  const metaParts = [publishedLabel, readingLabel].filter(Boolean)

  return (
    <>
      <SectionWrapper className="min-h-screen max-w-5xl mx-auto text-background">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1 text-sm font-medium text-background underline-offset-4 hover:underline"
        >
          {t(BLOG_DETAIL_COPY.backToAll)}
        </Link>

        <header className="mt-8 space-y-3 pb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-[56px] sm:leading-none">
            {post.title}
          </h1>
          {metaParts.length > 0 ? (
            <span className="text-[16px] font-bold text-background/30">
              {metaParts.join(" • ")}
            </span>
          ) : null}
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
          <p className="mt-8 text-sm italic text-background/60">
            {t(BLOG_DETAIL_COPY.noContent)}
          </p>
        )}

        <footer className="mt-16 border-t border-background/15 pt-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-background/60 underline-offset-4 hover:text-background hover:underline"
          >
            {t(BLOG_DETAIL_COPY.backToBlog)}
          </Link>
        </footer>
      </SectionWrapper>

      <RelatedBlogs posts={relatedPosts} />
    </>
  )
}

export default BlogDetail
