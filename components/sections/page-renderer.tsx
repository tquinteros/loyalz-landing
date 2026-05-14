import type { Page } from "@/lib/types/Pages"
import { isLegalPageSlug } from "@/lib/utils"
import HomeRenderer from "./home-renderer"
import ProductRenderer from "./product-renderer"
import LegalPageRenderer from "./legal-page-renderer"

type Props = {
  page: Page
}

/**
 * Chooses the renderer family for the current page.
 * Section-level rendering lives in the page-specific renderers.
 */
export default function PageRenderer({ page }: Props) {
  if (isLegalPageSlug(page.slug)) {
    return <LegalPageRenderer sections={page.sections} />
  }

  if (page.type === "product") {
    return <ProductRenderer sections={page.sections} />
  }

  return <HomeRenderer sections={page.sections} />
}
