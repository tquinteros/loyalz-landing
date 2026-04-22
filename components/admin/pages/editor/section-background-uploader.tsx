"use client"

import { useRef, useState } from "react"
import { ImageIcon, Loader2, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadSectionBackground } from "@/lib/actions/pages"

type Props = {
  value: string | null
  onChange: (url: string | null) => void
  className?: string
}

/**
 * Section background image uploader. Uploads immediately on pick and reports
 * the resulting public URL back to the parent so the editor keeps its
 * `backgroundImage` field as a plain string (same shape as before).
 */
export function SectionBackgroundUploader({
  value,
  onChange,
  className,
}: Props) {
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
      const result = await uploadSectionBackground(fd)
      if (result.error) {
        setError(result.error)
        return
      }
      onChange(result.url ?? null)
    } finally {
      setIsUploading(false)
    }
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    setError(null)
    onChange(null)
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
        disabled={isUploading}
      />

      {value ? (
        <div
          className="group relative cursor-pointer overflow-hidden rounded-lg border"
          onClick={() => !isUploading && inputRef.current?.click()}
          title="Haz clic para cambiar la imagen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Fondo de sección"
            className="aspect-video w-full object-cover transition-opacity group-hover:opacity-60"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {isUploading ? (
              <Loader2 className="size-6 animate-spin text-foreground drop-shadow" />
            ) : (
              <Upload className="size-6 text-foreground drop-shadow" />
            )}
            <span className="text-xs font-medium text-foreground drop-shadow">
              {isUploading ? "Subiendo…" : "Cambiar imagen"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            title="Quitar imagen"
            disabled={isUploading}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100 disabled:pointer-events-none"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:bg-muted/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-8 animate-spin" />
              <span className="text-sm">Subiendo imagen…</span>
            </>
          ) : (
            <>
              <ImageIcon className="size-8" />
              <span className="text-sm">
                Haz clic para subir imagen de fondo
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, WEBP — se superpone con un overlay oscuro
              </span>
            </>
          )}
        </button>
      )}

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
