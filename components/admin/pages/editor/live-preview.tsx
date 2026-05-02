"use client"

import PageRenderer from "@/components/sections/page-renderer"
import type { AnyPageSection, Page } from "@/lib/types/Pages"

type Props = {
  sections: AnyPageSection[]
  pageType?: string | null
}

/**
 * Live preview of the page using the exact same `PageRenderer` used on the
 * public site, so the admin is always WYSIWYG.
 *
 * Wrapped in a bordered sandbox so its styles don't visually collide with
 * the admin chrome.
 */
export function LivePreview({ sections, pageType = "home" }: Props) {
  const previewPage: Page = {
    id: "preview",
    slug: "preview",
    type: pageType,
    title: "Preview",
    sections,
    status: null,
    seo_title: null,
    seo_description: null,
    created_at: null,
    updated_at: null,
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-[1400px] overflow-hidden">
        <PageRenderer page={previewPage} />
      </div>
    </div>
  )
}
