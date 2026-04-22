"use client"

import { useState, useEffect, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BlogEditor } from "./blog-editor"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { createPost, updatePost } from "@/lib/actions/blog"
import type { AdminPostRow } from "./blogs-template"
import type { TipTapDocument } from "@/lib/types/content"
import type { PostFormValues } from "@/lib/types/Posts"
import { toast } from "sonner"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const EMPTY_FORM: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  cover_image: "",
  status: "draft",
  seo_title: "",
  seo_description: "",
  content: null,
}

type PostDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  post?: AdminPostRow | null
}

export function PostDialog({ open, onOpenChange, post }: PostDialogProps) {
  const isEditing = !!post
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)
  const [form, setForm] = useState<PostFormValues>(EMPTY_FORM)

  useEffect(() => {
    if (!open) {
      setError(null)
      setSlugEdited(false)
      return
    }
    if (post) {
      setForm({
        title: post.title ?? "",
        slug: post.slug ?? "",
        excerpt: post.excerpt ?? "",
        cover_image: (post as { cover_image?: string | null }).cover_image ?? "",
        status: (post.status as "draft" | "published") ?? "draft",
        seo_title: (post as { seo_title?: string | null }).seo_title ?? "",
        seo_description:
          (post as { seo_description?: string | null }).seo_description ?? "",
        content: (post as { content?: TipTapDocument | null }).content ?? null,
      })
      setSlugEdited(true)
    } else {
      setForm(EMPTY_FORM)
      setSlugEdited(false)
    }
  }, [open, post])

  function set<K extends keyof PostFormValues>(
    key: K,
    value: PostFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleTitleChange(title: string) {
    set("title", title)
    if (!slugEdited) set("slug", generateSlug(title))
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      setError("El título es obligatorio.")
      return
    }
    setError(null)

    startTransition(async () => {
      const result = isEditing
        ? await updatePost(post!.id, form)
        : await createPost(form)

      if (result.error) {
        toast.error(result.error)
        setError(result.error)
        return
      }
      toast.success(
        isEditing ? "Blog guardado correctamente" : "Blog creado correctamente",
      )
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] max-w-3xl! overflow-y-auto flex-col gap-0 p-0">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>
            {isEditing ? "Editar blog" : "Nuevo blog"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-5 px-6 py-5">
            {error && (
              <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pd-title">Título *</Label>
                <Input
                  id="pd-title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Mi blog"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-slug">Slug (URL)</Label>
                <Input
                  id="pd-slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    set("slug", e.target.value)
                  }}
                  placeholder="mi-blog"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-status">Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    set("status", v as "draft" | "published")
                  }
                >
                  <SelectTrigger id="pd-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label>Imagen de portada</Label>
                <ImagePicker
                  value={form.cover_image || null}
                  onChange={(url) => set("cover_image", url ?? "")}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pd-excerpt">Resumen</Label>
                <Textarea
                  id="pd-excerpt"
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="Breve resumen que se muestra en las tarjetas…"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Contenido</Label>
              <BlogEditor
                value={form.content}
                onChange={(doc) => set("content", doc)}
              />
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full rounded-md border px-4"
            >
              <AccordionItem value="seo" className="border-0">
                <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline data-[state=open]:text-foreground">
                  Campos SEO
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="pd-seo-title">Título SEO</Label>
                      <Input
                        id="pd-seo-title"
                        value={form.seo_title}
                        onChange={(e) => set("seo_title", e.target.value)}
                        placeholder="Sustituye al título en los resultados de búsqueda"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="pd-seo-desc">Descripción SEO</Label>
                      <Textarea
                        id="pd-seo-desc"
                        rows={2}
                        value={form.seo_description}
                        onChange={(e) =>
                          set("seo_description", e.target.value)
                        }
                        placeholder="~155 caracteres — se muestra en los fragmentos de búsqueda"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? isEditing
                ? "Guardando…"
                : "Creando…"
              : isEditing
                ? "Guardar cambios"
                : "Crear blog"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
