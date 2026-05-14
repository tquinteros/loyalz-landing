import Image from "next/image"
import Link from "next/link"
import { BlogPostCard } from "@/components/blogs/blog-post-card"
import {
  BlogPostMetaRow,
  BlogReadMoreHint,
} from "@/components/blogs/blog-post-meta"
import { SectionWrapper } from "@/components/sections/section-wrapper"
import type { Post } from "@/lib/types/Posts"
import { cn } from "@/lib/utils"

type BlogsPageTemplateProps = {
  posts: Post[]
}

function isFeaturedPost(post: Post): boolean {
  return post.featured === true
}

function FeaturedHero({ post }: { post: Post }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group block min-w-0 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl bg-background/10 shadow-sm ring-1 ring-background/10 transition-shadow group-hover:shadow-md">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-background/50">
              Sin portada
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <BlogPostMetaRow
            category={post.category}
            readingTime={post.reading_time}
          />
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-background sm:text-3xl sm:leading-tight">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="line-clamp-2 max-w-2xl text-base leading-relaxed text-background/70">
              {post.excerpt}
            </p>
          ) : null}
          <BlogReadMoreHint className="mt-1" />
        </div>
      </article>
    </Link>
  )
}

function FeaturedCompact({ post }: { post: Post }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex w-full min-w-0 items-start gap-4 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground sm:gap-5"
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-background/10 ring-1 ring-background/10 sm:size-28 lg:size-32 xl:size-36">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 96px, (max-width: 1280px) 128px, 144px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-1 text-center text-[10px] text-background/50">
            —
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-stretch gap-2.5 pt-0.5 sm:gap-3">
        <BlogPostMetaRow
          category={post.category}
          readingTime={post.reading_time}
          className="gap-2"
        />
        <h4 className="line-clamp-2 text-base font-bold leading-snug text-background sm:text-lg lg:text-xl">
          {post.title}
        </h4>
        <BlogReadMoreHint className="text-sm sm:text-base" />
      </div>
    </Link>
  )
}

const BlogsPageTemplate = ({ posts }: BlogsPageTemplateProps) => {
  const featuredPosts = posts.filter(isFeaturedPost)
  const otherPosts = posts.filter((p) => !isFeaturedPost(p))

  const hasFeatured = featuredPosts.length > 0
  const mainFeatured = hasFeatured ? featuredPosts[0] : null
  const sideFeatured = hasFeatured ? featuredPosts.slice(1) : []

  return (
    <SectionWrapper className="min-h-screen text-background">
      <div className="px-5 lg:px-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 border border-black/10  w-fit p-2 px-3 rounded">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="2" fill="black" />
            </svg>
            <p className="text-xs sm:text-[14px] tracking-widest text-background">
              Publicaciones
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-background sm:text-4xl md:text-5xl">
            Lo último de Loyalz
          </h1>
          <p className="mt-3 text-base text-background/70 sm:text-lg">
            Novedades, guías y actualizaciones del equipo para sacarle más
            partido a tu club.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-background/70">No hay blogs todavía.</p>
        ) : (
          <>
            {hasFeatured && mainFeatured ? (
              <section
                className="mt-14 sm:mt-16"
                aria-labelledby="blogs-featured-heading"
              >
                <h2
                  id="blogs-featured-heading"
                  className="text-xl font-bold tracking-tight text-background sm:text-2xl"
                >
                  Lo más destacado
                </h2>
                <div className="mt-8 grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:items-start lg:gap-10 xl:gap-12">
                  <div className="min-w-0">
                    <FeaturedHero post={mainFeatured} />
                  </div>
                  <ul
                    className={cn(
                      "m-0 flex w-full min-w-0 max-w-none list-none flex-col gap-8 border-t border-background/15 p-0 pt-8 lg:w-full lg:border-t-0 lg:pt-0",
                      sideFeatured.length > 0 &&
                        "lg:border-l lg:border-background/15 lg:pl-8 xl:pl-12",
                    )}
                  >
                    {sideFeatured.map((post) => (
                      <li key={post.id} className="min-w-0 w-full">
                        <FeaturedCompact post={post} />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            <section
              className={cn(hasFeatured ? "mt-16 sm:mt-20" : "mt-14 sm:mt-16")}
              aria-labelledby="blogs-rest-heading"
            >
              <h2
                id="blogs-rest-heading"
                className="text-xl font-bold tracking-tight text-background sm:text-2xl"
              >
                Otras publicaciones
              </h2>
              {otherPosts.length === 0 ? (
                <p className="mt-6 text-background/70">
                  {hasFeatured
                    ? "No hay más publicaciones por ahora."
                    : "No hay blogs todavía."}
                </p>
              ) : (
                <ul className="mt-8 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 m-0">
                  {otherPosts.map((post) => (
                    <li key={post.id} className="min-w-0">
                      <BlogPostCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </SectionWrapper>
  )
}

export default BlogsPageTemplate
