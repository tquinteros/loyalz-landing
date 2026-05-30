import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchPublicPageBySlugCached } from "@/lib/queries/pages.server"
import PageClient from "@/components/pages/page-client"
import { PageSkeleton } from "@/components/pages/page-skeleton"
import { AUDIENCES_SLUG } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublicPageBySlugCached(AUDIENCES_SLUG)
  if (!page) return {}
  return {
    title: page.seo_title ?? page.title,
    description: page.seo_description ?? undefined,
  }
}

type Props = {
  searchParams: Promise<{ tab?: string }>
}

/**
 * Keep this synchronous: awaiting `searchParams` (or page data) here counts
 * as uncached access outside `<Suspense>` and blocks the layout shell.
 */
export default function AudiencesPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<PageSkeleton />}>
        <AudiencesPageLoader searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function AudiencesPageLoader({ searchParams }: Props) {
  const [page, { tab }] = await Promise.all([
    fetchPublicPageBySlugCached(AUDIENCES_SLUG),
    searchParams,
  ])
  if (!page) notFound()

  return (
    <PageClient
      slug={AUDIENCES_SLUG}
      initialData={page}
      initialAudienceTab={tab}
    />
  )
}
