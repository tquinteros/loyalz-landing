"use client"

import { useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteMediaFile } from "@/lib/actions/media"
import { toast } from "sonner"

type DeleteMediaDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  path: string
  name: string
  onDeleted?: (path: string) => void
}

export function DeleteMediaDialog({
  open,
  onOpenChange,
  path,
  name,
  onDeleted,
}: DeleteMediaDialogProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteMediaFile(path)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Imagen eliminada correctamente")
        onDeleted?.(path)
        onOpenChange(false)
      } catch (err) {
        console.error("[DeleteMediaDialog] unexpected error:", err)
        toast.error("Ocurrió un error inesperado. Intenta de nuevo.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar imagen</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar{" "}
            <span className="font-medium text-foreground">
              &ldquo;{name}&rdquo;
            </span>
            ? Esta acción no se puede deshacer y la imagen se borrará del
            almacenamiento.
          </DialogDescription>
        </DialogHeader>
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
