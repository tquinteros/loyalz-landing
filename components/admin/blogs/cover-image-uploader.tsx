"use client"

import { useRef, useState, useEffect } from "react"
import { ImageIcon, X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

type CoverImageUploaderProps = {
  currentUrl: string
  onFileChange: (file: File | null) => void
  className?: string
}

export function CoverImageUploader({
  currentUrl,
  onFileChange,
  className,
}: CoverImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    setBlobUrl(null)
    setRemoved(false)
  }, [currentUrl])

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  const previewSrc = blobUrl ?? (removed ? null : currentUrl || null)

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (blobUrl) URL.revokeObjectURL(blobUrl)
    const next = URL.createObjectURL(file)
    setBlobUrl(next)
    setRemoved(false)
    onFileChange(file)

    e.target.value = ""
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
    setRemoved(true)
    onFileChange(null)
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {previewSrc ? (
        <div
          className="group relative cursor-pointer overflow-hidden rounded-lg border"
          onClick={() => inputRef.current?.click()}
          title="Haz clic para cambiar la imagen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="Portada"
            className="aspect-video w-full object-cover transition-opacity group-hover:opacity-60"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Upload className="size-6 text-foreground drop-shadow" />
            <span className="text-xs font-medium text-foreground drop-shadow">
              Cambiar imagen
            </span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            title="Quitar imagen"
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
          >
            <X className="size-4" />
          </button>

          {blobUrl && (
            <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              Nueva
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:bg-muted/40 hover:text-foreground"
        >
          <ImageIcon className="size-8" />
          <span className="text-sm">
            Haz clic para subir imagen de portada
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WEBP — máx. 5 MB
          </span>
        </button>
      )}
    </div>
  )
}
