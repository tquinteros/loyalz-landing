"use server"

import { revalidatePath, updateTag } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { PUBLIC_PAGES_TAG, publicPageTag } from "@/lib/queries/pages"
import type { AnyPageSection, PageFormValues } from "@/lib/types/Pages"

const PAGE_COLUMNS =
  "id, slug, title, sections, status, seo_title, seo_description, created_at, updated_at"

const STORAGE_BUCKET = "loyalz-landing"

export async function uploadSectionBackground(formData: FormData) {
  const file = formData.get("file") as File | null
  if (!file) return { error: "No se recibió ningún archivo." }

  const ext = file.name.split(".").pop() ?? "jpg"
  const filename = `sections/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const supabase = createAdminClient()

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) return { error: uploadError.message }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)

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

/**
 * Public-site path for a given slug. The home page lives at `/`, every other
 * slug at `/<slug>` (routes created later). We revalidate these paths on
 * mutation so the landing reflects the latest admin edits immediately.
 */
function publicPathFor(slug: string): string {
  return slug === "home" ? "/" : `/${slug}`
}

export async function getAdminPages() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pages")
    .select(PAGE_COLUMNS)
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function getPage(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pages")
    .select(PAGE_COLUMNS)
    .eq("id", id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function createPage(values: PageFormValues) {
  const supabase = createAdminClient()

  const slug = values.slug || generateSlug(values.title)
  if (!slug) return { error: "El slug es obligatorio." }

  const initialSections: AnyPageSection[] = []

  const { data, error } = await supabase
    .from("pages")
    .insert({
      title: values.title,
      slug,
      status: values.status,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
      sections: initialSections,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  updateTag(PUBLIC_PAGES_TAG)
  updateTag(publicPageTag(slug))
  revalidatePath("/admin/pages")
  revalidatePath(publicPathFor(slug))

  return { data }
}

export async function updatePage(id: string, values: PageFormValues) {
  const supabase = createAdminClient()

  const slug = values.slug || generateSlug(values.title)
  if (!slug) return { error: "El slug es obligatorio." }

  const { data: existing } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single()

  const { data, error } = await supabase
    .from("pages")
    .update({
      title: values.title,
      slug,
      status: values.status,
      seo_title: values.seo_title || null,
      seo_description: values.seo_description || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single()

  if (error) return { error: error.message }

  updateTag(PUBLIC_PAGES_TAG)
  updateTag(publicPageTag(slug))
  if (existing?.slug && existing.slug !== slug) {
    updateTag(publicPageTag(existing.slug))
    revalidatePath(publicPathFor(existing.slug))
  }
  revalidatePath("/admin/pages")
  revalidatePath(publicPathFor(slug))

  return { data }
}

export async function updatePageSections(
  id: string,
  sections: AnyPageSection[],
) {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single()

  const { data, error } = await supabase
    .from("pages")
    .update({
      sections,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single()

  if (error) return { error: error.message }

  updateTag(PUBLIC_PAGES_TAG)
  if (existing?.slug) {
    updateTag(publicPageTag(existing.slug))
    revalidatePath(publicPathFor(existing.slug))
  }
  revalidatePath("/admin/pages")

  return { data }
}

export async function deletePage(id: string) {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("pages").delete().eq("id", id)

  if (error) return { error: error.message }

  updateTag(PUBLIC_PAGES_TAG)
  if (existing?.slug) {
    updateTag(publicPageTag(existing.slug))
    revalidatePath(publicPathFor(existing.slug))
  }
  revalidatePath("/admin/pages")

  return { success: true }
}
