"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ContactFormSectionProps } from "@/lib/types/Pages"

type Props = {
  value: ContactFormSectionProps
  onChange: (next: ContactFormSectionProps) => void
}

export function ContactFormForm({ value, onChange }: Props) {
  const set = <K extends keyof ContactFormSectionProps>(
    key: K,
    next: ContactFormSectionProps[K],
  ) => onChange({ ...value, [key]: next })

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cf-title">Título</Label>
        <Input
          id="cf-title"
          value={value.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cf-subtitle">Subtítulo</Label>
        <Textarea
          id="cf-subtitle"
          rows={2}
          value={value.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cf-submit">Texto del botón</Label>
        <Input
          id="cf-submit"
          value={value.submitLabel ?? ""}
          onChange={(e) => set("submitLabel", e.target.value || undefined)}
          placeholder="Enviar"
        />
      </div>
    </div>
  )
}
