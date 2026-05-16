"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Save, Eye } from "lucide-react"
import { createCampaign, updateCampaign, sendCampaign } from "@/lib/actions/newsletter"
import type { Campaign } from "@/lib/actions/newsletter"
import { CampaignEmailPreview } from "@/components/admin/newsletter/campaign-email-preview"

const campaignSchema = z.object({
  subject: z.string().min(1, "El asunto es obligatorio"),
  preview_text: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || /^https?:\/\/.+/.test(v), {
      message: "Debe ser una URL válida",
    }),
  cta_label: z.string().optional(),
  cta_href: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || /^https?:\/\/.+/.test(v), {
      message: "Debe ser una URL válida",
    }),
  locale: z.string(),
  audience: z.string(),
})

type CampaignFormValues = z.infer<typeof campaignSchema>

type CampaignEditorModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: Campaign | null
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: "Borrador",
    sending: "Enviando",
    sent: "Enviado",
    failed: "Fallido",
  }
  return map[status] ?? status
}

function statusVariant(status: string): "outline" | "default" | "secondary" | "destructive" {
  if (status === "sent") return "default"
  if (status === "sending") return "secondary"
  if (status === "failed") return "destructive"
  return "outline"
}

export function CampaignEditorModal({
  open,
  onOpenChange,
  campaign,
}: CampaignEditorModalProps) {
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const queryClient = useQueryClient()

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      subject: "",
      preview_text: "",
      title: "",
      description: "",
      image_url: "",
      cta_label: "",
      cta_href: "",
      locale: "es",
      audience: "all",
    },
  })

  useEffect(() => {
    form.reset(
      campaign
        ? {
            subject: campaign.subject ?? "",
            preview_text: campaign.preview_text ?? "",
            title: campaign.title ?? "",
            description: campaign.description ?? "",
            image_url: campaign.image_url ?? "",
            cta_label: campaign.cta_label ?? "",
            cta_href: campaign.cta_href ?? "",
            locale: campaign.locale ?? "es",
            audience: campaign.audience ?? "all",
          }
        : {
            subject: "",
            preview_text: "",
            title: "",
            description: "",
            image_url: "",
            cta_label: "",
            cta_href: "",
            locale: "es",
            audience: "all",
          },
    )
  }, [campaign, form])

  const watchedValues = form.watch()
  const isSent = campaign?.status === "sent"
  const isSending = campaign?.status === "sending"
  const isReadOnly = isSent || isSending

  const saveMutation = useMutation({
    mutationFn: (values: CampaignFormValues) =>
      campaign ? updateCampaign(campaign.id, values) : createCampaign(values),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(campaign ? "Campaña actualizada" : "Campaña creada como borrador")
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] })
      onOpenChange(false)
    },
    onError: () => toast.error("Ocurrió un error inesperado."),
  })

  const sendMutation = useMutation({
    mutationFn: (id: string) => sendCampaign(id),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error)
        return
      }
      if ("warning" in result && result.warning) {
        toast.warning(result.warning as string)
      } else {
        toast.success(`Campaña enviada a ${result.sentCount} suscriptores`)
      }
      queryClient.invalidateQueries({ queryKey: ["newsletter-campaigns"] })
      onOpenChange(false)
    },
    onError: () => toast.error("Ocurrió un error inesperado al enviar."),
  })

  const isPending = saveMutation.isPending || sendMutation.isPending

  function handleSendConfirm() {
    if (!campaign) return
    setSendConfirmOpen(false)
    sendMutation.mutate(campaign.id)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] max-w-7xl! overflow-hidden p-0 flex flex-col">
          <DialogHeader className="shrink-0 flex flex-row items-center justify-between gap-4 px-6 pt-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold">
                {campaign ? "Editar campaña" : "Nueva campaña"}
              </DialogTitle>
              {campaign ? (
                <Badge variant={statusVariant(campaign.status)}>
                  {statusLabel(campaign.status)}
                </Badge>
              ) : null}
            </div>
            <div className="flex items-center gap-2 pr-8">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview((v) => !v)}
              >
                <Eye className="size-4 mr-1" />
                {showPreview ? "Ocultar preview" : "Ver preview"}
              </Button>
            </div>
          </DialogHeader>

          <DialogDescription className="sr-only">
            Editor de campaña de newsletter con vista previa en tiempo real
          </DialogDescription>

          <div className="flex flex-1 overflow-hidden">
            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))}
                className="flex flex-col w-full max-w-md border-r overflow-y-auto"
              >
                <div className="flex-1 space-y-4 p-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asunto *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="¡Novedad imperdible de LoyalZ!"
                            disabled={isReadOnly}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preview_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preview text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Texto que se ve en la bandeja de entrada..."
                            disabled={isReadOnly}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Gran titular del email"
                            disabled={isReadOnly}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contenido principal del email..."
                            className="min-h-[100px] resize-none"
                            disabled={isReadOnly}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de imagen</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            disabled={isReadOnly}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="cta_label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto del CTA</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ver más"
                              disabled={isReadOnly}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cta_href"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL del CTA</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://loyalz.ar/..."
                              disabled={isReadOnly}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="locale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idioma</FormLabel>
                          <Select
                            disabled={isReadOnly}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="en">Inglés</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audiencia</FormLabel>
                          <Select
                            disabled={isReadOnly}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="es">Solo español</SelectItem>
                              <SelectItem value="en">Solo inglés</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="shrink-0 border-t px-6 py-4 flex flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  {!isReadOnly && (
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isPending}
                    >
                      <Save className="size-4 mr-1" />
                      {saveMutation.isPending ? "Guardando…" : "Guardar borrador"}
                    </Button>
                  )}
                  {campaign && !isReadOnly && (
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={() => setSendConfirmOpen(true)}
                    >
                      <Send className="size-4 mr-1" />
                      Enviar campaña
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>

            {/* Live preview */}
            {showPreview && (
              <div className="flex-1 overflow-y-auto bg-muted/40 p-6">
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Vista previa
                </p>
                <CampaignEmailPreview
                  title={watchedValues.title || watchedValues.subject || "Título del email"}
                  description={watchedValues.description}
                  imageUrl={watchedValues.image_url}
                  ctaLabel={watchedValues.cta_label}
                  ctaHref={watchedValues.cta_href}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={sendConfirmOpen} onOpenChange={setSendConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Enviar campaña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción enviará la campaña{" "}
              <span className="font-medium text-foreground">
                &ldquo;{campaign?.subject}&rdquo;
              </span>{" "}
              a todos los suscriptores activos del público seleccionado. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendConfirm} disabled={isPending}>
              <Send className="size-4 mr-1" />
              {sendMutation.isPending ? "Enviando…" : "Sí, enviar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
