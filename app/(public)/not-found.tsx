import NotFoundRedirect from "@/components/not-found-redirect"

/**
 * Handles notFound() calls from pages inside the (public) layout group.
 * The (public)/layout.tsx already provides Header and Footer, so this
 * component only renders the 404 content — no duplication.
 */
export default function PublicNotFound() {
  return <NotFoundRedirect />
}
