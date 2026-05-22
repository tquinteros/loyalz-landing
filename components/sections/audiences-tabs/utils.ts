export const MARQUEE_COPIES = 4

export function defaultCenterIndex(total: number) {
  if (total <= 0) return 0
  return Math.floor((total - 1) / 2)
}
