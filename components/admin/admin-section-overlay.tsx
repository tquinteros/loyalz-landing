"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { Pencil } from "lucide-react"
import { useAdminMode } from "@/components/admin/admin-mode-context"

type Props = {
  pageId: string
  sectionId: string
  children: ReactNode
}

/**
 * Wraps a public section with a clickable overlay when Admin Mode is active.
 * Clicking navigates to the page editor with the section pre-selected.
 */
export function AdminSectionOverlay({ pageId, sectionId, children }: Props) {
  const { adminMode } = useAdminMode()
  const router = useRouter()

  if (!adminMode) {
    return <>{children}</>
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/admin/pages/${pageId}/edit?section=${sectionId}`)
  }

  return (
    <div className="relative group" onClick={handleClick}>
      {children}
      {/* Overlay — pointer-events-auto captures all clicks inside the section */}
      <div
        className="pointer-events-auto absolute inset-0 z-50 cursor-pointer border-2 border-dashed border-blue-500/60 bg-blue-500/5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        aria-hidden
      >
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
          <Pencil className="size-3" />
          Editar sección
        </div>
      </div>
    </div>
  )
}
