"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import type { TestimonialsSectionProps } from "@/lib/types/Pages"

type Props = {
  value: TestimonialsSectionProps
  onChange: (next: TestimonialsSectionProps) => void
}

type TestimonialItem = TestimonialsSectionProps["items"][number]

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
      <div className="space-y-1.5">
        <Label htmlFor="test-title">Título</Label>
        <Input
          id="test-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="test-subtitle">Subtítulo</Label>
        <Textarea
          id="test-subtitle"
          rows={2}
          value={local.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label>Testimonios</Label>
        <ItemsField<TestimonialItem>
          items={local.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({ quote: "", author: "", role: "" })}
          addLabel="Añadir testimonio"
          itemLabel={(it, i) => it.author || `Testimonio ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Cita *</Label>
                <Textarea
                  rows={3}
                  value={item.quote}
                  onChange={(e) => update({ quote: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Autor *</Label>
                <Input
                  value={item.author}
                  onChange={(e) => update({ author: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Rol</Label>
                <Input
                  value={item.role ?? ""}
                  onChange={(e) => update({ role: e.target.value || undefined })}
                  placeholder="CEO, Acme"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Avatar (URL)</Label>
                <Input
                  value={item.avatar ?? ""}
                  onChange={(e) =>
                    update({ avatar: e.target.value || undefined })
                  }
                  placeholder="https://…"
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
