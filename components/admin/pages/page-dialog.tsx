"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { createPage, updatePage } from "@/lib/actions/pages"
import type { PageFormValues } from "@/lib/types/Pages"
import type { AdminPageRow } from "./pages-template"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const EMPTY_FORM: PageFormValues = {
  title: "",
  slug: "",
  status: "draft",
  seo_title: "",
  seo_description: "",
}

const pageSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio."),
  slug: z.string().trim().min(1, "El slug es obligatorio."),
  status: z.enum(["draft", "published"]),
  seo_title: z.string(),
  seo_description: z.string(),
})

type PageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  page?: AdminPageRow | null
}

export function PageDialog({ open, onOpenChange, page }: PageDialogProps) {
  const isEditing = !!page
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
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
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
    if (page) {
      reset({
        title: page.title ?? "",
        slug: page.slug ?? "",
        status: (page.status as "draft" | "published") ?? "draft",
        seo_title: page.seo_title ?? "",
        seo_description: page.seo_description ?? "",
      })
      setSlugEdited(true)
    } else {
      reset(EMPTY_FORM)
      setSlugEdited(false)
    }
  }, [open, page, reset])

  function handleTitleChange(title: string) {
    setValue("title", title, { shouldValidate: true })
    if (!slugEdited) {
      setValue("slug", generateSlug(title), { shouldValidate: true })
    }
  }

  const onSubmit = handleSubmit((values) => {
    setError(null)

    startTransition(async () => {
      const payload: PageFormValues = {
        ...values,
        slug: values.slug || generateSlug(values.title),
      }

      const result = isEditing
        ? await updatePage(page!.id, payload)
        : await createPage(payload)

      if (result.error) {
        setError(result.error)
        return
      }

      onOpenChange(false)
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] max-w-2xl! flex-col gap-0 overflow-y-auto p-0">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>
            {isEditing ? "Editar página" : "Nueva página"}
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
                  placeholder="Mi página"
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
                  disabled={form.slug === "home"}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setValue("slug", e.target.value, { shouldValidate: true })
                  }}
                  placeholder="mi-pagina"
                />
                {errors.slug?.message && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  La página <code className="font-mono">home</code> no puede ser editada.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pd-status">Estado</Label>
                <Select
                  value={form.status ?? "draft"}
                  disabled={form.slug === "home"}
                  onValueChange={(v) =>
                    setValue("status", v as "draft" | "published")
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
            </div>

            {!isEditing && (
              <p className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                Las secciones se añaden desde el editor de la página tras
                crearla.
              </p>
            )}

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
                : "Crear página"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
