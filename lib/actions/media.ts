"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

const BUCKET = "loyalz-landing"
const MEDIA_FOLDER = "media"
const LEGACY_FOLDERS = ["covers", "sections"] as const
const MAX_DEPTH = 4

export type MediaItem = {
  path: string
  name: string
  url: string
  size: number | null
  mimeType: string | null
  createdAt: string | null
  updatedAt: string | null
}

type StorageListItem = {
  id: string | null
  name: string
  metadata?: {
    size?: number | null
    mimetype?: string | null
    lastModified?: string | null
  } | null
  created_at?: string | null
  updated_at?: string | null
}

const IMAGE_MIME_REGEX = /^image\//i
const IMAGE_EXT_REGEX = /\.(png|jpe?g|gif|webp|avif|svg|bmp|tiff?)$/i

function isImage(name: string, mime: string | null | undefined): boolean {
  if (mime && IMAGE_MIME_REGEX.test(mime)) return true
  return IMAGE_EXT_REGEX.test(name)
}

async function listRecursive(
  supabase: ReturnType<typeof createAdminClient>,
  prefix: string,
  depth: number,
): Promise<MediaItem[]> {
  if (depth > MAX_DEPTH) return []

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    })

  if (error || !data) return []

  const items: MediaItem[] = []
  const nestedPromises: Promise<MediaItem[]>[] = []

  for (const entry of data as StorageListItem[]) {
    if (entry.name.startsWith(".")) continue
    const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name

    if (entry.id === null) {
      nestedPromises.push(listRecursive(supabase, fullPath, depth + 1))
      continue
    }

    const mime = entry.metadata?.mimetype ?? null
    if (!isImage(entry.name, mime)) continue

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fullPath)

    items.push({
      path: fullPath,
      name: entry.name,
      url: publicData.publicUrl,
      size: entry.metadata?.size ?? null,
      mimeType: mime,
      createdAt: entry.created_at ?? null,
      updatedAt: entry.updated_at ?? null,
    })
  }

  const nested = await Promise.all(nestedPromises)
  return items.concat(...nested)
}

export async function getMediaItems() {
  const supabase = createAdminClient()

  try {
    const roots = [MEDIA_FOLDER, ...LEGACY_FOLDERS]
    const results = await Promise.all(
      roots.map((root) => listRecursive(supabase, root, 0)),
    )

    const flat = results.flat()

    flat.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bDate - aDate
    })

    return { data: flat }
  } catch (err) {
    console.error("[getMediaItems] error:", err)
    return { error: "No se pudieron cargar las imágenes." }
  }
}

export async function uploadMediaFile(formData: FormData) {
  const file = formData.get("file") as File | null
  if (!file) return { error: "No se recibió ningún archivo." }

  if (!isImage(file.name, file.type)) {
    return { error: "El archivo debe ser una imagen." }
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const filename = `${MEDIA_FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = createAdminClient()

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error("[uploadMediaFile] upload error:", uploadError)
    return { error: uploadError.message }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)

  revalidatePath("/admin/media-library")

  return { data: { path: filename, url: data.publicUrl } }
}

export async function deleteMediaFile(path: string) {
  if (!path || typeof path !== "string") {
    return { error: "Ruta de archivo inválida." }
  }

  if (path.includes("..") || path.startsWith("/")) {
    return { error: "Ruta de archivo inválida." }
  }

  const supabase = createAdminClient()

  const { error } = await supabase.storage.from(BUCKET).remove([path])

  if (error) {
    console.error("[deleteMediaFile] error:", error)
    return { error: "No se pudo eliminar la imagen. Intenta de nuevo." }
  }

  revalidatePath("/admin/media-library")

  return { success: true }
}
