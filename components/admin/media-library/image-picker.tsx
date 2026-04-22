"use client"

import { useRef, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Check, ImageIcon, Loader2, RefreshCw, Upload, X } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { getMediaItems, uploadMediaFile } from "@/lib/actions/media"
import type { MediaItem } from "@/lib/actions/media"
import { toast } from "sonner"

export const MEDIA_QUERY_KEY = ["admin", "media-items"] as const

type ImagePickerProps = {
  value: string | null
  onChange: (url: string | null) => void
  className?: string
  /** Aspect ratio for the preview / upload dropzone. */
  aspect?: "video" | "square"
}

/**
 * Unified image picker. Shows a preview of the currently selected image (if
 * any) and a tabbed control to either upload a new image (immediate upload to
 * the shared Supabase media bucket) or select an existing image fetched CSR
 * via react-query.
 */
export function ImagePicker({
  value,
  onChange,
  className,
  aspect = "video",
}: ImagePickerProps) {
  const queryClient = useQueryClient()
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video"

  const [tab, setTab] = useState<"upload" | "existing">(() =>
    value ? "existing" : "upload",
  )

  function handleUploaded(url: string) {
    onChange(url)
    queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY })
    setTab("existing")
  }

  function handleToggleSelect(url: string) {
    if (value === url) {
      onChange(null)
      return
    }
    onChange(url)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "upload" | "existing")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="upload">Subir imagen</TabsTrigger>
          <TabsTrigger value="existing">Usar imagen existente</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="mt-3">
          <UploadPanel
            aspectClass={aspectClass}
            onUploaded={handleUploaded}
          />
        </TabsContent>
        <TabsContent value="existing" className="mt-3">
          <ExistingImagesPanel
            value={value}
            onToggle={handleToggleSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

type UploadPanelProps = {
  aspectClass: string
  onUploaded: (url: string) => void
}

function UploadPanel({ aspectClass, onUploaded }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setError(null)
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const result = await uploadMediaFile(fd)
      if (result.error || !result.data) {
        const msg = result.error ?? "Error al subir la imagen."
        setError(msg)
        toast.error(msg)
        return
      }
      onUploaded(result.data.url)
      toast.success("Imagen subida correctamente")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
        disabled={isUploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:bg-muted/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60",
          aspectClass,
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="size-8 animate-spin" />
            <span className="text-sm">Subiendo imagen…</span>
          </>
        ) : (
          <>
            <Upload className="size-8" />
            <span className="text-sm">Haz clic para subir una imagen</span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG, WEBP, GIF, AVIF
            </span>
          </>
        )}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

type ExistingImagesPanelProps = {
  value: string | null
  onToggle: (url: string) => void
}

function ExistingImagesPanel({ value, onToggle }: ExistingImagesPanelProps) {
  const { data, isLoading, isFetching, error, refetch } = useQuery<
    MediaItem[],
    Error
  >({
    queryKey: MEDIA_QUERY_KEY,
    queryFn: async () => {
      const result = await getMediaItems()
      if (result.error) throw new Error(result.error)
      return result.data ?? []
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          No se pudieron cargar las imágenes: {error.message}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="size-3" /> Reintentar
        </button>
      </div>
    )
  }

  const items = data ?? []

  if (items.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
        <ImageIcon className="size-8" />
        <p className="text-sm">Aún no hay imágenes en la biblioteca.</p>
        <p className="text-xs">Sube una en la pestaña «Subir imagen».</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "imagen" : "imágenes"}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          title="Actualizar"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw
            className={cn("size-3", isFetching && "animate-spin")}
          />
          Actualizar
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto rounded-lg border p-2">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {items.map((item) => {
            const selected = value === item.url
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onToggle(item.url)}
                title={
                  selected
                    ? "Haz clic para quitar esta imagen"
                    : item.name
                }
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-md border bg-muted transition-all",
                  selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "hover:border-primary",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                {selected ? (
                  <>
                    <span className="absolute right-1 top-1 rounded-full bg-primary p-0.5 text-primary-foreground shadow transition-opacity group-hover:opacity-0">
                      <Check className="size-3" />
                    </span>
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-1 rounded-full bg-destructive px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-destructive-foreground shadow">
                        <X className="size-3" />
                        Quitar
                      </span>
                    </span>
                  </>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
