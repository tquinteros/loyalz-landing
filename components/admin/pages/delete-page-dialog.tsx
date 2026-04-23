"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deletePage } from "@/lib/actions/pages"

type DeletePageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageId: string
  pageTitle: string
  pageSlug: string
}

export function DeletePageDialog({
  open,
  onOpenChange,
  pageId,
  pageTitle,
  pageSlug,
}: DeletePageDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const isHome = pageSlug === "home"

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePage(pageId)
      if (result.error) {
        setError(result.error)
        return
      }
      setError(null)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar página</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar{" "}
            <span className="font-medium text-foreground">
              &ldquo;{pageTitle}&rdquo;
            </span>
            ? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {isHome ? (
          <p className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
            Esta es la página principal del sitio. Si la eliminas, la ruta{" "}
            <code className="font-mono">/</code> devolverá 404 hasta que crees
            otra con el slug <code className="font-mono">home</code>.
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Eliminando…" : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
