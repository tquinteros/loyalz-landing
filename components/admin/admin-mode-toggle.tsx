"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useAdminMode } from "@/components/admin/admin-mode-context"

export function AdminModeToggle() {
  const { isAdmin, adminMode, setAdminMode } = useAdminMode()

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-lg">
      <Pencil className="size-4 text-muted-foreground" />
      <span className="text-sm font-medium">Modo Admin</span>
      <Switch
        checked={adminMode}
        onCheckedChange={setAdminMode}
        aria-label="Activar modo admin"
      />
      {adminMode && (
        <Link
          href="/admin/pages"
          className="ml-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Ir al panel
        </Link>
      )}
    </div>
  )
}
