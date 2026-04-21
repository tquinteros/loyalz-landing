"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CTA, HeroSectionProps } from "@/lib/types/Pages"

type Props = {
  value: HeroSectionProps
  onChange: (next: HeroSectionProps) => void
}

function CtaFields({
  label,
  value,
  onChange,
}: {
  label: string
  value: CTA | undefined
  onChange: (next: CTA | undefined) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          placeholder="Texto del botón"
          value={value?.label ?? ""}
          onChange={(e) => {
            const next = { ...(value ?? { label: "", href: "" }), label: e.target.value }
            onChange(next.label || next.href ? next : undefined)
          }}
        />
        <Input
          placeholder="/ruta"
          value={value?.href ?? ""}
          onChange={(e) => {
            const next = { ...(value ?? { label: "", href: "" }), href: e.target.value }
            onChange(next.label || next.href ? next : undefined)
          }}
        />
      </div>
    </div>
  )
}

export function HeroForm({ value, onChange }: Props) {
  const set = <K extends keyof HeroSectionProps>(
    key: K,
    next: HeroSectionProps[K],
  ) => onChange({ ...value, [key]: next })

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="hero-eyebrow">Eyebrow</Label>
        <Input
          id="hero-eyebrow"
          value={value.eyebrow ?? ""}
          onChange={(e) => set("eyebrow", e.target.value || undefined)}
          placeholder="Anuncio corto en mayúsculas"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-title">Título *</Label>
        <Input
          id="hero-title"
          value={value.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Convierte a cada cliente…"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-subtitle">Subtítulo</Label>
        <Textarea
          id="hero-subtitle"
          rows={3}
          value={value.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value || undefined)}
        />
      </div>

      <CtaFields
        label="CTA principal"
        value={value.primaryCta}
        onChange={(next) => set("primaryCta", next)}
      />
      <CtaFields
        label="CTA secundario"
        value={value.secondaryCta}
        onChange={(next) => set("secondaryCta", next)}
      />
    </div>
  )
}
