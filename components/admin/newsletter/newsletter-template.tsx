"use client"

import { useState, useTransition } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Send, Users } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { deleteCampaign, deleteSubscriber } from "@/lib/actions/newsletter"
import type { Subscriber, Campaign } from "@/lib/actions/newsletter"
import { CampaignEditorModal } from "./campaign-editor-modal"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value: string | null) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
}

function campaignStatusVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "sent") return "default"
  if (status === "sending") return "secondary"
  if (status === "failed") return "destructive"
  return "outline"
}

function campaignStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Borrador",
    sending: "Enviando",
    sent: "Enviado",
    failed: "Fallido",
  }
  return map[status] ?? status
}

function subscriberStatusVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  return status === "active" ? "default" : "secondary"
}

function subscriberStatusLabel(status: string): string {
  return status === "active" ? "Activo" : "Desuscrito"
}

// ─── Subscribers tab ──────────────────────────────────────────────────────────

type SubscribersTabProps = {
  subscribers: Subscriber[]
  error?: string | null
}

function SubscribersTab({ subscribers, error }: SubscribersTabProps) {
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null)
  const [isPending, startTransition] = useTransition()

  const activeCount = subscribers.filter((s) => s.status === "active").length

  function handleDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      try {
        const result = await deleteSubscriber(deleteTarget.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Suscriptor eliminado")
        setDeleteTarget(null)
      } catch {
        toast.error("Ocurrió un error inesperado.")
      }
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Suscriptores</CardTitle>
              <CardDescription>
                {error
                  ? "No se pudieron cargar los suscriptores."
                  : (
                    <span className="flex items-center gap-1.5 mt-1">
                      <Users className="size-3.5" />
                      <span>
                        <strong>{activeCount}</strong> activos de{" "}
                        <strong>{subscribers.length}</strong> totales
                      </span>
                    </span>
                  )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay suscriptores.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Idioma</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="min-w-[160px]">Suscripto</TableHead>
                  <TableHead className="w-[60px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground uppercase text-xs">
                      {sub.locale}
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscriberStatusVariant(sub.status)}>
                        {subscriberStatusLabel(sub.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(sub.subscribed_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(sub)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar suscriptor</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que querés eliminar a{" "}
              <span className="font-medium text-foreground">{deleteTarget?.email}</span>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Campaigns tab ────────────────────────────────────────────────────────────

type CampaignsTabProps = {
  campaigns: Campaign[]
  error?: string | null
}

function CampaignsTab({ campaigns, error }: CampaignsTabProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)
  const [isPending, startTransition] = useTransition()

  function openCreate() {
    setEditingCampaign(null)
    setEditorOpen(true)
  }

  function openEdit(campaign: Campaign) {
    setEditingCampaign(campaign)
    setEditorOpen(true)
  }

  function handleDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      try {
        const result = await deleteCampaign(deleteTarget.id)
        if (result.error) {
          toast.error(result.error)
          return
        }
        toast.success("Campaña eliminada")
        setDeleteTarget(null)
      } catch {
        toast.error("Ocurrió un error inesperado.")
      }
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Campañas</CardTitle>
              <CardDescription>
                {error
                  ? "No se pudieron cargar las campañas."
                  : `${campaigns.length} ${campaigns.length === 1 ? "campaña" : "campañas"}`}
              </CardDescription>
            </div>
            <Button onClick={openCreate} size="sm" className="shrink-0">
              <Plus className="size-4" />
              Nueva campaña
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay campañas.{" "}
              <button
                type="button"
                onClick={openCreate}
                className="text-foreground underline underline-offset-2"
              >
                Crea la primera
              </button>
              .
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Asunto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Audiencia</TableHead>
                  <TableHead>Enviados</TableHead>
                  <TableHead className="min-w-[160px]">Enviado</TableHead>
                  <TableHead className="min-w-[160px]">Creado</TableHead>
                  <TableHead className="w-[88px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium max-w-[240px]">
                      <span className="line-clamp-2">{campaign.subject}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaignStatusVariant(campaign.status)}>
                        {campaignStatusLabel(campaign.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {campaign.audience === "all" ? "Todos" : campaign.audience.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {campaign.sent_count > 0 ? campaign.sent_count : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(campaign.sent_at)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(campaign.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={campaign.status === "sent" ? "Ver campaña" : "Editar"}
                          onClick={() => openEdit(campaign)}
                        >
                          {campaign.status === "sent" ? (
                            <Send className="size-4" />
                          ) : (
                            <Pencil className="size-4" />
                          )}
                        </Button>
                        {campaign.status === "draft" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Eliminar"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(campaign)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CampaignEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        campaign={editingCampaign}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar campaña</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que querés eliminar la campaña{" "}
              <span className="font-medium text-foreground">
                &ldquo;{deleteTarget?.subject}&rdquo;
              </span>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Main template ────────────────────────────────────────────────────────────

export type NewsletterTemplateProps = {
  subscribers: Subscriber[]
  campaigns: Campaign[]
  subscribersError?: string | null
  campaignsError?: string | null
}

export default function NewsletterTemplate({
  subscribers,
  campaigns,
  subscribersError,
  campaignsError,
}: NewsletterTemplateProps) {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Newsletter</h1>
        <p className="text-sm text-muted-foreground">
          Gestioná suscriptores y enviá campañas de email.
        </p>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="subscribers">
            Suscriptores
            {subscribers.filter((s) => s.status === "active").length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-px font-medium">
                {subscribers.filter((s) => s.status === "active").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
          <CampaignsTab campaigns={campaigns} error={campaignsError} />
        </TabsContent>

        <TabsContent value="subscribers" className="mt-4">
          <SubscribersTab subscribers={subscribers} error={subscribersError} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
