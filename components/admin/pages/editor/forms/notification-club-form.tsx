"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type {
  NotificationClubSectionProps,
  LocalizedString,
} from "@/lib/types/Pages"

type Props = {
  value: NotificationClubSectionProps
  onChange: (next: NotificationClubSectionProps) => void
}

type Badge = NotificationClubSectionProps["badges"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function NotificationClubForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<NotificationClubSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof NotificationClubSectionProps>(
    key: K,
    next: NotificationClubSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="notification-club-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Notificaciones Push"
        placeholderEn="Push Notifications"
      />

      <LocalizedField
        label="Descripción *"
        idPrefix="notification-club-description"
        multiline
        rows={4}
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
      />

      <div className="space-y-2">
        <Label>Badges (marca y mensaje)</Label>
        <ItemsField<Badge>
          items={local.badges ?? []}
          onChange={(badges) => set("badges", badges)}
          createItem={() => ({
            brand: "MARCA",
            message: {
              es: "Texto del mensaje con emojis opcionales.",
              en: "Message copy with optional emojis.",
            },
          })}
          addLabel="Añadir badge"
          itemLabel={(it, i) => it.brand || `Badge ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Marca *</Label>
                <Input
                  value={item.brand}
                  onChange={(e) => update({ brand: e.target.value })}
                  placeholder="AIR COFFEE"
                />
              </div>
              <LocalizedField
                label="Mensaje"
                required
                multiline
                rows={3}
                value={item.message}
                onChange={(next) =>
                  update({ message: next ?? EMPTY_LOCALIZED })
                }
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
