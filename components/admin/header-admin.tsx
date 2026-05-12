"use client"

import { forwardRef, useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { SheetClose } from "@/components/ui/sheet"

export type HeaderAdminLinkProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
  children: React.ReactNode
  /** When set, wraps the link in `SheetClose` so the mobile sheet closes on navigation. */
  variant?: "default" | "sheet"
}

/**
 * Renders a link to `/admin` only when the current user has `profiles.role === "admin"`.
 * Otherwise renders nothing (no loading or error UI).
 */
const HeaderAdminLink = forwardRef<HTMLAnchorElement, HeaderAdminLinkProps>(function HeaderAdminLink(
  { className, children, prefetch = false, variant = "default", ...rest },
  ref,
) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    const verifyAdmin = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (cancelled) return

      if (userError || !userData.user) {
        setShow(false)
        return
      }

      const userId = userData.user.id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle()

      if (cancelled) return

      if (profileError || profile?.role !== "admin") {
        setShow(false)
        return
      }

      setShow(true)
    }

    void verifyAdmin()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void verifyAdmin()
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  if (!show) return null

  const link = (
    <Link ref={ref} href="/admin" prefetch={prefetch} className={className} {...rest}>
      {children}
    </Link>
  )

  if (variant === "sheet") {
    return <SheetClose asChild>{link}</SheetClose>
  }

  return link
})

export default HeaderAdminLink
