"use server"

import { revalidatePath, updateTag } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import type { PostFormValues } from "@/lib/types/Posts"
import { PUBLIC_POSTS_TAG, publicPostTag } from "@/lib/queries/blog"

const BUCKET = "loyalz-landing"

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}

export async function uploadCoverImage(formData: FormData) {
  const file = formData.get("file") as File | null
  if (!file) return { error: "No se recibió ningún archivo." }

  const ext = file.name.split(".").pop() ?? "jpg"
  const filename = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = createAdminClient()

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) return { error: uploadError.message }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)

  return { url: data.publicUrl }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function createPost(values: PostFormValues) {
  const supabase = createAdminClient()

  const slug = values.slug || generateSlug(values.title)
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: values.title,
      slug,
      excerpt: values.excerpt || null,
      cover_image: values.cover_image || null,
      status: values.status,
      published_at: values.status === "published" ? now : null,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
      content: values.content ?? null,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  updateTag(PUBLIC_POSTS_TAG)
  updateTag(publicPostTag(slug))
  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")

  return { data }
}

export async function updatePost(id: string, values: PostFormValues) {
  const supabase = createAdminClient()

  const slug = values.slug || generateSlug(values.title)

  const { data: existing } = await supabase
    .from("posts")
    .select("slug, status, published_at")
    .eq("id", id)
    .single()

  const beingPublished =
    values.status === "published" && existing?.status !== "published"

  const { data, error } = await supabase
    .from("posts")
    .update({
      title: values.title,
      slug,
      excerpt: values.excerpt || null,
      cover_image: values.cover_image || null,
      status: values.status,
      published_at: beingPublished
        ? new Date().toISOString()
        : (existing?.published_at ?? null),
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
      content: values.content ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single()

  if (error) return { error: error.message }

  updateTag(PUBLIC_POSTS_TAG)
  updateTag(publicPostTag(slug))
  if (existing?.slug && existing.slug !== slug) {
    updateTag(publicPostTag(existing.slug))
    revalidatePath(`/blogs/${existing.slug}`)
  }
  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")
  revalidatePath(`/blogs/${slug}`)

  return { data }
}

export async function deletePost(id: string) {
  if (!id || !isUuid(id)) {
    return { error: "ID de blog inválido." }
  }

  const supabase = createAdminClient()

  const { data: existing, error: fetchError } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle()

  if (fetchError) {
    console.error("[deletePost] fetch error:", fetchError)
    return { error: "No se pudo verificar el blog. Intenta de nuevo." }
  }

  if (!existing) {
    return { error: "El blog ya no existe o fue eliminado." }
  }

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    console.error("[deletePost] delete error:", error)
    return { error: "No se pudo eliminar el blog. Intenta de nuevo." }
  }

  updateTag(PUBLIC_POSTS_TAG)
  if (existing.slug) {
    updateTag(publicPostTag(existing.slug))
    revalidatePath(`/blogs/${existing.slug}`)
  }
  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")

  return { success: true }
}

export async function getPost(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, status, published_at, seo_title, seo_description, created_at, updated_at",
    )
    .eq("id", id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export const getAdminPosts = async () => {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, cover_image, status, published_at, seo_title, seo_description, created_at, updated_at")
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data }
}
