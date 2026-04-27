"use server"

import { revalidatePath, updateTag } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { PUBLIC_PAGES_TAG, publicPageTag } from "@/lib/queries/pages"
import type {
  AnyPageSection,
  PageFormValues,
  PageVersion,
} from "@/lib/types/Pages"

const PAGE_COLUMNS =
  "id, slug, title, sections, status, seo_title, seo_description, created_at, updated_at"
const PAGE_VERSION_COLUMNS =
  "id, page_id, title, slug, sections, status, seo_title, seo_description, page_created_at, page_updated_at, snapshot_at, created_by"

const STORAGE_BUCKET = "loyalz-landing"

type PageSnapshotRow = {
  id: string
  title: string
  slug: string
  sections: unknown
  status: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string | null
  updated_at: string | null
}

type AdminUserResult =
  | { userId: string; error?: never }
  | { userId?: never; error: string }

async function getAdminUserId(): Promise<AdminUserResult> {
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.getClaims()

  const userId = authData?.claims?.sub
  if (authError || typeof userId !== "string" || !userId) {
    return { error: "No autorizado." }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (profileError || profile?.role !== "admin") {
    return { error: "No autorizado." }
  }

  return { userId }
}

function normalizeSections(value: unknown): AnyPageSection[] {
  return Array.isArray(value) ? (value as AnyPageSection[]) : []
}

function sectionsChanged(a: unknown, b: unknown) {
  return (
    JSON.stringify(normalizeSections(a)) !== JSON.stringify(normalizeSections(b))
  )
}

async function createPageVersion(
  supabase: ReturnType<typeof createAdminClient>,
  page: PageSnapshotRow,
  userId: string,
) {
  const { error } = await supabase.from("page_versions").insert({
    page_id: page.id,
    title: page.title,
    slug: page.slug,
    sections: normalizeSections(page.sections),
    status: page.status,
    seo_title: page.seo_title,
    seo_description: page.seo_description,
    page_created_at: page.created_at,
    page_updated_at: page.updated_at,
    created_by: userId,
  })

  return error?.message ?? null
}

export async function uploadSectionBackground(formData: FormData) {
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

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
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pages")
    .select(PAGE_COLUMNS)
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function getPage(id: string) {
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pages")
    .select(PAGE_COLUMNS)
    .eq("id", id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getPageVersions(pageId: string) {
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("page_versions")
    .select(PAGE_VERSION_COLUMNS)
    .eq("page_id", pageId)
    .order("snapshot_at", { ascending: false })
    .limit(50)

  if (error) return { error: error.message }

  return {
    data: (data ?? []).map((version) => ({
      ...version,
      sections: normalizeSections(version.sections),
    })) as PageVersion[],
  }
}

export async function createPage(values: PageFormValues) {
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

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
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

  const supabase = createAdminClient()

  const slug = values.slug || generateSlug(values.title)
  if (!slug) return { error: "El slug es obligatorio." }

  const { data: existing, error: existingError } = await supabase
    .from("pages")
    .select(PAGE_COLUMNS)
    .eq("id", id)
    .single()

  if (existingError) return { error: existingError.message }

  if (
    existing.title !== values.title ||
    existing.slug !== slug ||
    existing.status !== values.status ||
    (existing.seo_title ?? "") !== values.seo_title ||
    (existing.seo_description ?? "") !== values.seo_description
  ) {
    const historyError = await createPageVersion(
      supabase,
      existing as PageSnapshotRow,
      admin.userId,
    )
    if (historyError) return { error: historyError }
  }

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
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

  const supabase = createAdminClient()

  const { data: existing, error: existingError } = await supabase
    .from("pages")
    .select(PAGE_COLUMNS)
    .eq("id", id)
    .single()

  if (existingError) return { error: existingError.message }

  if (sectionsChanged(existing.sections, sections)) {
    const historyError = await createPageVersion(
      supabase,
      existing as PageSnapshotRow,
      admin.userId,
    )
    if (historyError) return { error: historyError }
  }

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
  const admin = await getAdminUserId()
  if ("error" in admin) return { error: admin.error }

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
