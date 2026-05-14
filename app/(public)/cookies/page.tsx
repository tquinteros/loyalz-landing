import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchPublicPageBySlugCached } from "@/lib/queries/pages.server"
import PageClient from "@/components/pages/page-client"
import { PageSkeleton } from "@/components/pages/page-skeleton"
import { COOKIES_SLUG } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublicPageBySlugCached(COOKIES_SLUG)
  if (!page) return {}
  return {
    title: page.seo_title ?? page.title,
    description: page.seo_description ?? undefined,
  }
}

export default async function CookiesPage() {
  const page = await fetchPublicPageBySlugCached(COOKIES_SLUG)
  if (!page) notFound()

  return (
    <main className="min-h-screen">
      <Suspense fallback={<PageSkeleton />}>
        <PageClient slug={COOKIES_SLUG} initialData={page} />
      </Suspense>
    </main>
  )
}
