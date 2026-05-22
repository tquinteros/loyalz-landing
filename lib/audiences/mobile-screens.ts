/** Screen image inside `/mobile-case.png`, keyed by audiences tab `key`. */
export const AUDIENCE_TAB_MOBILE_SCREEN: Record<string, string> = {
  cafes: "/coffe-mobile.png",
  restaurantes: "/restaurant-mobile.png",
  "delivery-first": "/delivery-mobile.png",
}

export const MOBILE_CASE_SRC = "/mobile-case.png"

/** Native `mobile-case.png` dimensions — keeps layout proportional. */
export const MOBILE_CASE_ASPECT = 449 / 495

/**
 * Screen window inside the case overlay (%).
 * Tuned for `public/mobile-case.png` (449×495).
 */
export const MOBILE_SCREEN_INSET = {
  top: "5.5%",
  left: "6.8%",
  right: "6.8%",
  bottom: "5.5%",
} as const

export function mobileScreenForTab(tabKey: string): string {
  return AUDIENCE_TAB_MOBILE_SCREEN[tabKey] ?? AUDIENCE_TAB_MOBILE_SCREEN.cafes
}
