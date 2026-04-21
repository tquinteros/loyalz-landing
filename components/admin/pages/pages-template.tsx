"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Blocks, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react"
import { PageDialog } from "./page-dialog"
import { DeletePageDialog } from "./delete-page-dialog"
import type { AnyPageSection } from "@/lib/types/Pages"

export type AdminPageRow = {
  id: string
  title: string
  slug: string
  sections: AnyPageSection[]
  status: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string | null
  updated_at: string | null
}

function formatDate(value: string | null) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
}

function statusBadgeVariant(
  status: string | null,
): "default" | "secondary" | "outline" | "destructive" {
  const s = (status ?? "draft").toLowerCase()
  if (s === "published") return "default"
  if (s === "archived") return "secondary"
  if (s === "draft") return "outline"
  return "secondary"
}

function statusLabel(status: string | null): string {
  const s = (status ?? "draft").toLowerCase()
  if (s === "published") return "Publicado"
  if (s === "archived") return "Archivado"
  if (s === "draft") return "Borrador"
  return status ?? "Borrador"
}

function publicHref(slug: string): string {
  return slug === "home" ? "/" : `/${slug}`
}

function sectionCount(sections: AnyPageSection[] | null | undefined): number {
  if (!Array.isArray(sections)) return 0
  return sections.filter((s) => s && typeof s === "object").length
}

type PagesTemplateProps = {
  pages: AdminPageRow[]
  error?: string | null
}

export default function PagesTemplate({ pages, error }: PagesTemplateProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<AdminPageRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminPageRow | null>(null)

  function openCreate() {
    setEditingPage(null)
    setDialogOpen(true)
  }

  function openEdit(page: AdminPageRow) {
    setEditingPage(page)
    setDialogOpen(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Controla el contenido dinámico de cada página del sitio.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="shrink-0">
          <Plus className="size-4" />
          Nueva página
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las páginas</CardTitle>
          <CardDescription>
            {error
              ? "No se pudieron cargar las páginas. Revisa las políticas RLS de Supabase y el error siguiente."
              : `${pages.length} ${pages.length === 1 ? "página" : "páginas"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {!error && pages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay páginas.{" "}
              <button
                type="button"
                onClick={openCreate}
                className="text-foreground underline underline-offset-2"
              >
                Crea tu primera página
              </button>
              .
            </p>
          ) : null}

          {!error && pages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Título</TableHead>
                  <TableHead className="min-w-[140px]">Slug</TableHead>
                  <TableHead className="w-[110px]">Estado</TableHead>
                  <TableHead className="w-[110px] text-right">
                    Secciones
                  </TableHead>
                  <TableHead className="min-w-[140px]">Actualizado</TableHead>
                  <TableHead className="w-[160px] text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="max-w-[240px] font-medium">
                      <span className="line-clamp-2">{page.title}</span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      /{page.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(page.status)}>
                        {statusLabel(page.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {sectionCount(page.sections)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(page.updated_at ?? page.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          title="Ver en el sitio"
                        >
                          <Link
                            href={publicHref(page.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          title="Editar secciones"
                        >
                          <Link href={`/admin/pages/${page.id}/edit`}>
                            <Blocks className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar metadatos"
                          onClick={() => openEdit(page)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Eliminar"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(page)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>

      <PageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        page={editingPage}
      />

      {deleteTarget ? (
        <DeletePageDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
          pageId={deleteTarget.id}
          pageTitle={deleteTarget.title}
          pageSlug={deleteTarget.slug}
        />
      ) : null}
    </section>
  )
}
