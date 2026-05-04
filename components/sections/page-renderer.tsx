import type { Page } from "@/lib/types/Pages"
import HomeRenderer from "./home-renderer"
import ProductRenderer from "./product-renderer"

type Props = {
  page: Page
}

/**
 * Chooses the renderer family for the current page.
 * Section-level rendering lives in the page-specific renderers.
 */
export default function PageRenderer({ page }: Props) {
  if (page.type === "product") {
    return <ProductRenderer sections={page.sections} />
  }

  return <HomeRenderer sections={page.sections} />
}
