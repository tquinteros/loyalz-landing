"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Loader2, Upload, X, ImageIcon, Copy, Check } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { uploadMediaFile } from "@/lib/actions/media"
import { toast } from "sonner"
import type { MediaItem } from "@/lib/actions/media"
import { DeleteMediaDialog } from "./delete-media-dialog"

type MediaLibraryTemplateProps = {
  items: MediaItem[]
  error?: string | null
}

function formatSize(bytes: number | null): string {
  if (bytes == null || Number.isNaN(bytes)) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaLibraryTemplate({
  items: initialItems,
  error,
}: MediaLibraryTemplateProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<MediaItem[]>(initialItems)
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const [isUploading, startUploadTransition] = useTransition()
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (files.length === 0) return

    startUploadTransition(async () => {
      const uploaded: MediaItem[] = []
      let failed = 0

      for (const file of files) {
        const fd = new FormData()
        fd.append("file", file)
        const result = await uploadMediaFile(fd)
        if (result.error || !result.data) {
          console.error("[MediaLibrary] upload error:", result.error)
          failed++
          continue
        }
        uploaded.push({
          path: result.data.path,
          name: file.name,
          url: result.data.url,
          size: file.size,
          mimeType: file.type || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      if (uploaded.length > 0) {
        setItems((prev) => [...uploaded, ...prev])
        toast.success(
          uploaded.length === 1
            ? "Imagen subida correctamente"
            : `${uploaded.length} imágenes subidas`,
        )
      }
      if (failed > 0) {
        toast.error(
          failed === 1
            ? "No se pudo subir una imagen"
            : `No se pudieron subir ${failed} imágenes`,
        )
      }
    })
  }

  function handleDeleted(path: string) {
    setItems((prev) => prev.filter((item) => item.path !== path))
  }

  async function handleCopyUrl(url: string, path: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedPath(path)
      toast.success("URL copiada al portapapeles")
      setTimeout(() => {
        setCopiedPath((current) => (current === path ? null : current))
      }, 1500)
    } catch (err) {
      console.error("[MediaLibrary] copy error:", err)
      toast.error("No se pudo copiar la URL")
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Imágenes
          </h1>
          <p className="text-sm text-muted-foreground">
            Biblioteca de imágenes almacenadas en la nube.
          </p>
        </div>
        <div className="shrink-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
            disabled={isUploading}
          />
          <Button
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {isUploading ? "Subiendo…" : "Subir imagen"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las imágenes</CardTitle>
          <CardDescription>
            {error
              ? "No se pudieron cargar las imágenes."
              : `${items.length} ${items.length === 1 ? "imagen" : "imágenes"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {!error && items.length === 0 ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex aspect-3/1 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:bg-muted/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ImageIcon className="size-8" />
              <span className="text-sm">
                Aún no hay imágenes. Haz clic para subir la primera.
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, WEBP, GIF, AVIF
              </span>
            </button>
          ) : null}

          {!error && items.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((item) => {
                const isCopied = copiedPath === item.path
                return (
                  <div
                    key={item.path}
                    className="group relative overflow-hidden rounded-lg border bg-muted/30"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition-transform group-hover:scale-105"
                        unoptimized
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      title="Eliminar imagen"
                      className={cn(
                        "absolute right-2 top-2 rounded-full bg-background/90 p-1 text-foreground shadow-sm transition-opacity",
                        "hover:bg-destructive hover:text-destructive-foreground",
                        "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100",
                      )}
                    >
                      <X className="size-4" />
                      <span className="sr-only">Eliminar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url, item.path)}
                      title="Copiar URL"
                      className={cn(
                        "absolute left-2 top-2 rounded-full bg-background/90 p-1 text-foreground shadow-sm transition-opacity",
                        "hover:bg-primary hover:text-primary-foreground",
                        "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100",
                      )}
                    >
                      {isCopied ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                      <span className="sr-only">Copiar URL</span>
                    </button>

                    <div className="space-y-0.5 px-2 py-1.5">
                      <p
                        className="truncate text-xs font-medium"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatSize(item.size)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {deleteTarget ? (
        <DeleteMediaDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
          path={deleteTarget.path}
          name={deleteTarget.name}
          onDeleted={handleDeleted}
        />
      ) : null}
    </section>
  )
}
