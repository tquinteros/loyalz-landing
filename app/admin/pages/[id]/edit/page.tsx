import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPage } from "@/lib/actions/pages"
import { PageEditor } from "@/components/admin/pages/editor/page-editor"
import type { AnyPageSection } from "@/lib/types/Pages"
import { PageEditorSkeleton } from "@/components/admin/pages/editor/page-editor-skeleton"
type Params = { id: string }

type Props = {
  params: Promise<Params>
}

/**
 * The page component must stay synchronous: any `await` here (including
 * `await params`) counts as uncached data access outside `<Suspense>` under
 * Next's `cacheComponents` mode and blocks the static shell.
 *
 * All uncached work — resolving `params` and loading the page row — lives
 * inside `EditorLoader`, which is rendered behind the Suspense boundary.
 */
export default function AdminPageEditorRoute({ params }: Props) {
  return (
    <Suspense fallback={<PageEditorSkeleton />}>
      <EditorLoader params={params} />
    </Suspense>
  )
}

async function EditorLoader({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const { data, error } = await getPage(id)

  if (error || !data) notFound()

  const page = data as {
    id: string
    title: string
    slug: string
    sections: AnyPageSection[] | null
  }

  return (
    <PageEditor
      pageId={page.id}
      pageTitle={page.title}
      pageSlug={page.slug}
      initialSections={Array.isArray(page.sections) ? page.sections : []}
    />
  )
}
