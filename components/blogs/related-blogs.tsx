"use client"

import Link from "next/link"
import type { LocalizedString } from "@/lib/types/Pages"
import type { Post } from "@/lib/types/Posts"
import { useT } from "@/providers/language-provider"
import { BlogPostCard } from "@/components/blogs/blog-post-card"
import { Button } from "@/components/ui/button"
import { SectionWrapper } from "@/components/sections/section-wrapper"

const RELATED_BLOGS_COPY = {
  label: { es: "Publicaciones", en: "Posts" },
  title: { es: "Más novedades", en: "More news" },
  description: {
    es: "No te pierdas de las últimas noticias",
    en: "Don't miss the latest news",
  },
  cta: { es: "Más publicaciones", en: "More posts" },
} satisfies Record<string, LocalizedString>

type RelatedBlogsProps = {
  posts: Post[]
}

export function RelatedBlogs({ posts }: RelatedBlogsProps) {
  const t = useT()

  if (posts.length === 0) return null

  return (
    <SectionWrapper className="bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="flex items-center gap-3 rounded border border-black/10 p-2 px-3">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="10" height="10" rx="2" fill="currentColor" />
          </svg>
          <p className="text-xs tracking-widest text-background sm:text-[14px]">
            {t(RELATED_BLOGS_COPY.label)}
          </p>
        </div>

        <h2 className="mt-6 text-[56px] font-bold leading-none tracking-tight text-background">
          {t(RELATED_BLOGS_COPY.title)}
        </h2>

        <p className="mt-4 max-w-xl text-base text-background/70 sm:text-lg">
          {t(RELATED_BLOGS_COPY.description)}
        </p>

        <ul className="mt-12 grid w-full list-none grid-cols-1 gap-8 p-0 text-left sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {posts.map((post) => (
            <li key={post.id} className="min-w-0">
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>

        <Button
          asChild
          size="lg"
          className="mt-12 rounded-[10px] px-8 py-6 text-base font-semibold"
        >
          <Link href="/blogs">{t(RELATED_BLOGS_COPY.cta)}</Link>
        </Button>
      </div>
    </SectionWrapper>
  )
}
