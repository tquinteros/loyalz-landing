import type { TipTapDocument } from "./content"

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  cover_image?: string | null
  featured?: boolean | null
  category?: string | null
  reading_time?: number | null
}

export type FullPost = Post & {
  content: TipTapDocument | null
  cover_image: string | null
  seo_title: string | null
  seo_description: string | null
}

export type PostFormValues = {
  title: string
  slug: string
  excerpt: string
  cover_image: string
  status: "draft" | "published"
  featured: boolean
  category: string
  reading_time: number | null
  seo_title: string
  seo_description: string
  content: TipTapDocument | null
}
