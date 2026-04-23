"use client"

import PageRenderer from "@/components/sections/page-renderer"
import type { AnyPageSection } from "@/lib/types/Pages"

type Props = {
  sections: AnyPageSection[]
}

/**
 * Live preview of the page using the exact same `PageRenderer` used on the
 * public site, so the admin is always WYSIWYG.
 *
 * Wrapped in a bordered sandbox so its styles don't visually collide with
 * the admin chrome.
 */
export function LivePreview({ sections }: Props) {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-[1400px] overflow-hidden">
        <PageRenderer sections={sections} />
      </div>
    </div>
  )
}
