"use client"

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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

function hasMeaningfulContent(doc: TipTapDocument | null): boolean {
  if (!doc?.content?.length) return false

  const stack = [...doc.content]
  while (stack.length > 0) {
    const node = stack.pop()
    if (!node) continue

    if ("text" in node && typeof node.text === "string" && node.text.trim()) {
      return true
    }
    if (node.type === "image") {
      return true
    }
    if ("content" in node && Array.isArray(node.content)) {
      stack.push(...node.content)
    }
  }

  return false
}

const postSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio."),
  slug: z.string().trim().min(1, "El slug es obligatorio."),
  excerpt: z.string().trim().min(1, "El resumen es obligatorio."),
  cover_image: z.string().trim().min(1, "La imagen de portada es obligatoria."),
  status: z.enum(["draft", "published"]),
  seo_title: z.string(),
  seo_description: z.string(),
  content: z
    .custom<TipTapDocument | null>()
    .refine(
      (value) => hasMeaningfulContent(value ?? null),
      "El contenido es obligatorio.",
    ),
})

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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: EMPTY_FORM,
  })

  const form = watch()

  useEffect(() => {
    if (!open) {
      setError(null)
      setSlugEdited(false)
      reset(EMPTY_FORM)
      return
    }
    if (post) {
      reset({
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
      reset(EMPTY_FORM)
      setSlugEdited(false)
    }
  }, [open, post, reset])

  function handleTitleChange(title: string) {
    setValue("title", title, { shouldValidate: true })
    if (!slugEdited) {
      setValue("slug", generateSlug(title), { shouldValidate: true })
    }
  }

  const onSubmit = handleSubmit((values) => {
    setError(null)

    startTransition(async () => {
      const result = isEditing
        ? await updatePost(post!.id, values)
        : await createPost(values)

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
  })

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
                  {...register("title")}
                  value={form.title ?? ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Mi blog"
                />
                {errors.title?.message && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-slug">Slug (URL)</Label>
                <Input
                  id="pd-slug"
                  {...register("slug")}
                  value={form.slug ?? ""}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setValue("slug", e.target.value, { shouldValidate: true })
                  }}
                  placeholder="mi-blog"
                />
                {errors.slug?.message && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-status">Estado</Label>
                <Select
                  value={form.status ?? "draft"}
                  onValueChange={(v) => {
                    setValue("status", v as "draft" | "published")
                  }}
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
                  onChange={(url) =>
                    setValue("cover_image", url ?? "", { shouldValidate: true })
                  }
                />
                {errors.cover_image?.message && (
                  <p className="text-sm text-destructive">
                    {errors.cover_image.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pd-excerpt">Resumen</Label>
                <Textarea
                  id="pd-excerpt"
                  rows={2}
                  {...register("excerpt")}
                  value={form.excerpt ?? ""}
                  onChange={(e) =>
                    setValue("excerpt", e.target.value, { shouldValidate: true })
                  }
                  placeholder="Breve resumen que se muestra en las tarjetas…"
                />
                {errors.excerpt?.message && (
                  <p className="text-sm text-destructive">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Contenido</Label>
              <BlogEditor
                value={form.content}
                onChange={(doc) =>
                  setValue("content", doc, { shouldValidate: true })
                }
              />
              {errors.content?.message && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
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
                        {...register("seo_title")}
                        value={form.seo_title ?? ""}
                        onChange={(e) => setValue("seo_title", e.target.value)}
                        placeholder="Sustituye al título en los resultados de búsqueda"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="pd-seo-desc">Descripción SEO</Label>
                      <Textarea
                        id="pd-seo-desc"
                        rows={2}
                        {...register("seo_description")}
                        value={form.seo_description ?? ""}
                        onChange={(e) => setValue("seo_description", e.target.value)}
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
          <Button onClick={onSubmit} disabled={isPending}>
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
