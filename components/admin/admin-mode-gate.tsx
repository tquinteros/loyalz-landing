"use client"

import { useEffect } from "react"
import { useAdminMode } from "@/components/admin/admin-mode-context"
import { AdminModeToggle } from "@/components/admin/admin-mode-toggle"

/**
 * Syncs server-resolved admin status into context and mounts the toggle.
 * Rendered inside <Suspense> so the auth check does not block the page shell.
 */
export function AdminModeGate({ isAdmin }: { isAdmin: boolean }) {
  const { setIsAdmin } = useAdminMode()

  useEffect(() => {
    setIsAdmin(isAdmin)
  }, [isAdmin, setIsAdmin])

  if (!isAdmin) return null

  return <AdminModeToggle />
}
