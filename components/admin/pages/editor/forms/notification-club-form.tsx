"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import type { NotificationClubSectionProps } from "@/lib/types/Pages"

type Props = {
  value: NotificationClubSectionProps
  onChange: (next: NotificationClubSectionProps) => void
}

type Badge = NotificationClubSectionProps["badges"][number]

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
      <div className="space-y-1.5">
        <Label htmlFor="notification-club-title">Título *</Label>
        <Input
          id="notification-club-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Notificaciones Push"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notification-club-description">Descripción *</Label>
        <Textarea
          id="notification-club-description"
          rows={4}
          value={local.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Badges (marca y mensaje)</Label>
        <ItemsField<Badge>
          items={local.badges ?? []}
          onChange={(badges) => set("badges", badges)}
          createItem={() => ({
            brand: "MARCA",
            message: "Texto del mensaje con emojis opcionales.",
          })}
          addLabel="Añadir badge"
          itemLabel={(it, i) => it.brand || `Badge ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Marca *</Label>
                <Input
                  value={item.brand}
                  onChange={(e) => update({ brand: e.target.value })}
                  placeholder="AIR COFFEE"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mensaje *</Label>
                <Textarea
                  rows={3}
                  value={item.message}
                  onChange={(e) => update({ message: e.target.value })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
