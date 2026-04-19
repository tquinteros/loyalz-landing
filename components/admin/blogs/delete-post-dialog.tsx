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
import { deletePost } from "@/lib/actions/blog"

type DeletePostDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  postTitle: string
}

export function DeletePostDialog({
  open,
  onOpenChange,
  postId,
  postTitle,
}: DeletePostDialogProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deletePost(postId)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar blog</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar{" "}
            <span className="font-medium text-foreground">
              &ldquo;{postTitle}&rdquo;
            </span>
            ? Esta acción no se puede deshacer.
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
