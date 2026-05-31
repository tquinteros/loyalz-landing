import type { ProductMechanicsProduct } from "@/lib/types/Pages"

/** Inner screen image inside `/mobile-case.png`, keyed by product page. */
export const PRODUCT_MECHANICS_MOBILE_SCREEN: Record<ProductMechanicsProduct, string> = {
  club: "/products/mobile-club.png",
  reviews: "/products/reviews-club.png",
  ai: "/products/ai.png",
}

export {
  MOBILE_CASE_ASPECT,
  MOBILE_CASE_SRC,
  MOBILE_SCREEN_INSET,
} from "@/lib/audiences/mobile-screens"

export function mobileScreenForProduct(product: ProductMechanicsProduct): string {
  return PRODUCT_MECHANICS_MOBILE_SCREEN[product] ?? PRODUCT_MECHANICS_MOBILE_SCREEN.club
}
