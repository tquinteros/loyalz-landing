"use client"

import { useQuery } from "@tanstack/react-query"
import PageRenderer from "@/components/sections/page-renderer"
import {
  fetchPublicPageBySlug,
  publicPageQueryKey,
} from "@/lib/queries/pages"
import type { Page } from "@/lib/types/Pages"

type Props = {
  slug: string
  initialData: Page
}

export default function PageClient({ slug, initialData }: Props) {
  const { data } = useQuery({
    queryKey: publicPageQueryKey(slug),
    queryFn: () => fetchPublicPageBySlug(slug),
    initialData,
    staleTime: 0,
    // staleTime: 1000 * 60 * 5,
  })

  const page = data ?? initialData

  return <PageRenderer page={page} />
}
 