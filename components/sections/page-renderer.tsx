import type { Page } from "@/lib/types/Pages"
import { isLegalPageSlug, isProductPageSlug, AUDIENCES_SLUG } from "@/lib/utils"
import HomeRenderer from "./home-renderer"
import ProductRenderer from "./product-renderer"
import LegalPageRenderer from "./legal-page-renderer"
import AudiencesRenderer from "./audiences-renderer"

type Props = {
  page: Page
  initialAudienceTab?: string
}

/**
 * Chooses the renderer family for the current page.
 * Section-level rendering lives in the page-specific renderers.
 */
export default function PageRenderer({ page, initialAudienceTab }: Props) {
  if (isLegalPageSlug(page.slug)) {
    return <LegalPageRenderer sections={page.sections} pageId={page.id} />
  }

  if (page.slug === AUDIENCES_SLUG) {
    return (
      <AudiencesRenderer
        sections={page.sections}
        pageId={page.id}
        initialTab={initialAudienceTab}
      />
    )
  }

  if (page.type === "product" || isProductPageSlug(page.slug)) {
    return <ProductRenderer sections={page.sections} pageId={page.id} />
  }

  return <HomeRenderer sections={page.sections} pageId={page.id} />
}
