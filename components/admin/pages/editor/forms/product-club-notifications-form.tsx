"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type {
  LocalizedString,
  ProductClubNotificationsSectionProps,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: ProductClubNotificationsSectionProps
  onChange: (next: ProductClubNotificationsSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductClubNotificationsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductClubNotificationsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductClubNotificationsSectionProps>(
    key: K,
    next: ProductClubNotificationsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label (badge superior)"
        idPrefix="product-club-notifs-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Gratis"
        placeholderEn="Free"
      />

      <LocalizedField
        label="Título *"
        idPrefix="product-club-notifs-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Notificaciones Push"
        placeholderEn="Push Notifications"
      />

      <LocalizedField
        label="Descripción *"
        idPrefix="product-club-notifs-description"
        multiline
        rows={3}
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Reactivá clientes sin costo. Mandales promociones, recordatorios o mensajes de cumpleaños directo al celular."
        placeholderEn="Re-engage customers for free. Send promos, reminders or birthday messages straight to their phone."
      />

      <div className="space-y-2">
        <Label>Notificaciones flotantes (máx. 3)</Label>
        <p className="text-xs text-muted-foreground">
          Aparecen como badges con blur alrededor del teléfono.
        </p>
        <ItemsField<LocalizedString>
          items={local.notifications ?? []}
          onChange={(notifications) => set("notifications", notifications)}
          createItem={() => ({
            es: "¡Nueva notificación de tu marca! 🎉",
            en: "New notification from your brand! 🎉",
          })}
          addLabel="Añadir notificación"
          emptyLabel="Sin notificaciones."
          itemLabel={(it, i) => translate(it) || `Notificación ${i + 1}`}
          renderItem={(item, update) => (
            <LocalizedField
              label="Texto *"
              idPrefix={`product-club-notifs-item-${translate(item)}`}
              value={item}
              onChange={(next) => {
                if (next) update(next)
              }}
              multiline
              rows={2}
              placeholderEs="¡Disfruta un 50% de descuento en nuestro local hoy! ☕️"
              placeholderEn="Enjoy 50% off at our shop today! ☕️"
            />
          )}
        />
      </div>
    </div>
  )
}
