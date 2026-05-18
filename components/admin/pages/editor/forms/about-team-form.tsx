"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { AboutTeamSectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: AboutTeamSectionProps
  onChange: (next: AboutTeamSectionProps) => void
}

type TeamMember = AboutTeamSectionProps["team"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function AboutTeamForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<AboutTeamSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof AboutTeamSectionProps>(
    key: K,
    next: AboutTeamSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="about-team-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Nuestro equipo"
        placeholderEn="Our team"
      />

      <LocalizedField
        label="Descripción"
        idPrefix="about-team-description"
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Las personas detrás de Loyalz."
        placeholderEn="The people behind Loyalz."
        multiline
        rows={3}
      />

      <div className="space-y-2">
        <Label>Miembros del equipo</Label>
        <ItemsField<TeamMember>
          items={local.team ?? []}
          onChange={(team) => set("team", team)}
          createItem={() => ({
            avatarImage: "",
            fullName: "",
            role: { es: "", en: "" },
            description: { es: "", en: "" },
          })}
          addLabel="Añadir miembro"
          emptyLabel="Sin miembros."
          itemLabel={(it, i) => it.fullName || `Miembro ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Avatar</Label>
                <ImagePicker
                  value={item.avatarImage || null}
                  onChange={(url) => update({ avatarImage: url ?? "" })}
                  aspect="square"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nombre completo *</Label>
                <Input
                  value={item.fullName ?? ""}
                  onChange={(e) => update({ fullName: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>
              <LocalizedField
                label="Rol *"
                value={item.role}
                onChange={(next) =>
                  update({ role: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="CEO"
                placeholderEn="CEO"
              />
              <LocalizedField
                label="Descripción"
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Descripción del miembro..."
                placeholderEn="Member description..."
                multiline
                rows={2}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
