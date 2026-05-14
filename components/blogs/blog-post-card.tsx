import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/lib/types/Posts"
import { cn } from "@/lib/utils"
import {
  BlogPostMetaRow,
  BlogReadMoreHint,
} from "@/components/blogs/blog-post-meta"

type BlogPostCardProps = {
  post: Post
  className?: string
}

export function BlogPostCard({ post, className }: BlogPostCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "group block h-full min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground",
        className,
      )}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-transparent transition-shadow hover:shadow-md">
        <div className="relative aspect-[16/10] w-full shrink-0 bg-background/10">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-background/50">
              Sin portada
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <BlogPostMetaRow
            category={post.category}
            readingTime={post.reading_time}
          />
          <h3 className="line-clamp-2 text-xl md:text-2xl font-bold leading-snug tracking-tight text-background">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="line-clamp-3 text-[16px] leading-relaxed text-background/70">
              {post.excerpt}
            </p>
          ) : (
            <p className="text-sm italic text-background/60">No hay resumen</p>
          )}
          <div className="mt-auto pt-1">
            <BlogReadMoreHint />
          </div>
        </div>
      </article>
    </Link>
  )
}
