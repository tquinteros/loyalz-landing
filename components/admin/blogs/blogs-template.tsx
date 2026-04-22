"use client"

import { useState } from "react"
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
import { Plus, Pencil, Trash2 } from "lucide-react"
import { PostDialog } from "./post-dialog"
import { DeletePostDialog } from "./delete-post-dialog"
import type { TipTapDocument } from "@/lib/types/content"

export type AdminPostRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  content?: TipTapDocument | null
  cover_image?: string | null
  seo_title?: string | null
  seo_description?: string | null
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

type BlogsTemplateProps = {
  posts: AdminPostRow[]
  error?: string | null
}

export default function BlogsTemplate({ posts, error }: BlogsTemplateProps) {
  const [postDialogOpen, setPostDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<AdminPostRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminPostRow | null>(null)

  function openCreate() {
    setEditingPost(null)
    setPostDialogOpen(true)
  }

  function openEdit(post: AdminPostRow) {
    setEditingPost(post)
    setPostDialogOpen(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Blogs
          </h1>
          <p className="text-sm text-muted-foreground">
            Controla el contenido de los blogs.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="shrink-0">
          <Plus className="size-4" />
          Nuevo blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los blogs</CardTitle>
          <CardDescription>
            {error
              ? "No se pudieron cargar los blogs. Revisa las políticas RLS de Supabase y el error siguiente."
              : `${posts.length} ${posts.length === 1 ? "blog" : "blogs"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {!error && posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay blogs.{" "}
              <button
                type="button"
                onClick={openCreate}
                className="text-foreground underline underline-offset-2"
              >
                Crea tu primer blog
              </button>
              .
            </p>
          ) : null}

          {!error && posts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Título</TableHead>
                  <TableHead className="w-[100px]">Estado</TableHead>
                  <TableHead className="min-w-[140px]">Publicado</TableHead>
                  <TableHead className="min-w-[140px]">Creado</TableHead>
                  <TableHead className="min-w-[200px]">Resumen</TableHead>
                  <TableHead className="w-[88px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-[220px] font-medium">
                      <span className="line-clamp-2">{post.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(post.status)}>
                        {statusLabel(post.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(post.published_at)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(post.created_at)}
                    </TableCell>
                    <TableCell className="max-w-[280px] text-muted-foreground">
                      <span className="line-clamp-2">
                        {post.excerpt ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          onClick={() => openEdit(post)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Eliminar"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(post)}
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

      <PostDialog
        open={postDialogOpen}
        onOpenChange={setPostDialogOpen}
        post={editingPost}
      />

      {deleteTarget ? (
        <DeletePostDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
          postId={deleteTarget.id}
          postTitle={deleteTarget.title}
        />
      ) : null}
    </section>
  )
}
