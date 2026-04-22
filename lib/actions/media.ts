"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { MEDIA_PAGE_SIZE } from "./media.constants"

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

function sortMediaItems(items: MediaItem[]) {
  items.sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
    if (bDate !== aDate) return bDate - aDate
    // Tiebreaker on path (desc) keeps pagination stable when timestamps match.
    if (a.path === b.path) return 0
    return a.path < b.path ? 1 : -1
  })
}

type MediaCursor = {
  createdAt: string | null
  path: string
}

function encodeCursor(cursor: MediaCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url")
}

function decodeCursor(value: string): MediaCursor | null {
  try {
    const json = Buffer.from(value, "base64url").toString("utf8")
    const parsed = JSON.parse(json) as MediaCursor
    if (typeof parsed?.path !== "string") return null
    return parsed
  } catch {
    return null
  }
}

async function listAllMediaItems(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<MediaItem[]> {
  const roots = [MEDIA_FOLDER, ...LEGACY_FOLDERS]
  const results = await Promise.all(
    roots.map((root) => listRecursive(supabase, root, 0)),
  )
  const flat = results.flat()
  sortMediaItems(flat)
  return flat
}

export async function getMediaItems() {
  const supabase = createAdminClient()

  try {
    const flat = await listAllMediaItems(supabase)
    return { data: flat }
  } catch (err) {
    console.error("[getMediaItems] error:", err)
    return { error: "No se pudieron cargar las imágenes." }
  }
}

export type MediaItemsPage = {
  items: MediaItem[]
  nextCursor: string | null
  total: number
}

export async function getMediaItemsPage(params?: {
  cursor?: string | null
  limit?: number
}): Promise<{ data?: MediaItemsPage; error?: string }> {
  const supabase = createAdminClient()
  const limit = Math.max(1, Math.min(params?.limit ?? MEDIA_PAGE_SIZE, 100))
  const cursor = params?.cursor ?? null

  try {
    const flat = await listAllMediaItems(supabase)

    let startIndex = 0
    if (cursor) {
      const decoded = decodeCursor(cursor)
      if (decoded) {
        const idx = flat.findIndex((item) => item.path === decoded.path)
        if (idx >= 0) startIndex = idx + 1
      }
    }

    const page = flat.slice(startIndex, startIndex + limit)
    const hasMore = startIndex + limit < flat.length
    const last = page[page.length - 1]
    const nextCursor =
      hasMore && last
        ? encodeCursor({ createdAt: last.createdAt, path: last.path })
        : null

    return {
      data: {
        items: page,
        nextCursor,
        total: flat.length,
      },
    }
  } catch (err) {
    console.error("[getMediaItemsPage] error:", err)
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
