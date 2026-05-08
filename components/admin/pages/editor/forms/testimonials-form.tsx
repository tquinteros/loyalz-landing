"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type {
  TestimonialsSectionProps,
  LocalizedString,
} from "@/lib/types/Pages"

type Props = {
  value: TestimonialsSectionProps
  onChange: (next: TestimonialsSectionProps) => void
}

type TestimonialItem = TestimonialsSectionProps["items"][number]

type LocalizedBadgeInputProps = {
  label: string
  value?: LocalizedString[]
  onChange: (next: LocalizedString[]) => void
  placeholder?: string
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

/**
 * Tag-style editor for `LocalizedString[]`. Editing happens per-locale via two
 * input strips (ES / EN) so each tag is fully translatable. Tags are matched
 * by index between the two strips.
 */
function LocalizedBadgeInput({
  label,
  value,
  onChange,
  placeholder,
}: LocalizedBadgeInputProps) {
  const tags: LocalizedString[] = Array.isArray(value) ? value : []

  function patch(index: number, locale: "es" | "en", text: string) {
    const next = tags.map((t, i) =>
      i === index ? { ...t, [locale]: text } : t,
    )
    onChange(next)
  }

  function remove(index: number) {
    onChange(tags.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...tags, { es: "", en: "" }])
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      {tags.length === 0 ? (
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Sin badges.
        </p>
      ) : (
        <ul className="space-y-2">
          {tags.map((tag, i) => (
            <li
              key={i}
              className="grid items-end gap-2 rounded-md border bg-card p-2 sm:grid-cols-[1fr_1fr_auto]"
            >
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  ES
                </Label>
                <Input
                  value={tag.es ?? ""}
                  onChange={(e) => patch(i, "es", e.target.value)}
                  placeholder={placeholder}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  EN
                </Label>
                <Input
                  value={tag.en ?? ""}
                  onChange={(e) => patch(i, "en", e.target.value)}
                  placeholder={placeholder}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Eliminar badge"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={add}
        className="rounded-md border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
      >
        Añadir badge
      </button>
    </div>
  )
}

export function TestimonialsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<TestimonialsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof TestimonialsSectionProps>(
    key: K,
    next: TestimonialsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título"
        idPrefix="test-title"
        value={local.title}
        onChange={(next) => set("title", next)}
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="test-subtitle"
        multiline
        rows={2}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
      />

      <div className="space-y-2">
        <Label>Testimonios</Label>
        <ItemsField<TestimonialItem>
          items={local.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({
            logo: "",
            badges: [],
            summary: { es: "", en: "" },
            author: "",
            place: { es: "", en: "" },
            avatar: "",
          })}
          addLabel="Añadir testimonio"
          itemLabel={(it, i) => it.author || `Testimonio ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Logo (URL)</Label>
                <Input
                  value={item.logo ?? ""}
                  onChange={(e) => update({ logo: e.target.value || undefined })}
                  placeholder="https://..."
                />
              </div>

              <LocalizedBadgeInput
                label="Badges"
                value={item.badges}
                onChange={(badges) => update({ badges })}
                placeholder="+6.000 miembros / +6,000 members"
              />

              <LocalizedField
                label="Resumen"
                required
                multiline
                rows={3}
                value={
                  // Migrate legacy `quote` if present
                  typeof item.summary === "string"
                    ? { es: item.summary, en: "" }
                    : (item.summary as LocalizedString | undefined) ??
                      (typeof item.quote === "string"
                        ? { es: item.quote, en: "" }
                        : (item.quote as LocalizedString | undefined))
                }
                onChange={(next) =>
                  update({ summary: next ?? EMPTY_LOCALIZED })
                }
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Autor *</Label>
                  <Input
                    value={item.author}
                    onChange={(e) => update({ author: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Avatar (URL)</Label>
                  <Input
                    value={item.avatar ?? ""}
                    onChange={(e) =>
                      update({ avatar: e.target.value || undefined })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <LocalizedField
                label="Lugar"
                value={
                  typeof item.place === "string"
                    ? { es: item.place, en: "" }
                    : (item.place as LocalizedString | undefined) ??
                      (typeof item.role === "string"
                        ? { es: item.role, en: "" }
                        : (item.role as LocalizedString | undefined))
                }
                onChange={(next) => update({ place: next })}
                placeholderEs="Marley Coffee"
                placeholderEn="Marley Coffee"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
