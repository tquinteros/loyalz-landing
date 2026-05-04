"use client"

import { type KeyboardEvent, useEffect, useId, useState } from "react"
import { X } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import { Badge } from "@/components/ui/badge"
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

type BadgeTagInputProps = {
  label: string
  value?: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

function BadgeTagInput({
  label,
  value,
  onChange,
  placeholder,
}: BadgeTagInputProps) {
  const id = useId()
  const [inputValue, setInputValue] = useState("")
  const tags = Array.isArray(value) ? value : []

  function addTag(raw: string) {
    const tag = raw.trim()

    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }

    setInputValue("")
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    }

    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}{" "}
        <span className="text-xs font-normal text-muted-foreground">
          (Enter o coma para agregar)
        </span>
      </Label>

      <div
        className="flex min-h-11 w-full cursor-text flex-wrap content-start items-start gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => document.getElementById(id)?.focus()}
      >
        {tags.map((tag, i) => (
          <Badge
            key={`${tag}-${i}`}
            variant="secondary"
            className="flex h-6 items-center gap-1 text-xs font-normal"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="rounded-full p-0.5 hover:bg-muted-foreground/20"
              aria-label={`Eliminar ${tag}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}

        <input
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue)
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[140px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
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
          createItem={() => ({
            logo: "",
            badges: [],
            summary: "",
            author: "",
            place: "",
            avatar: "",
          })}
          addLabel="Añadir testimonio"
          itemLabel={(it, i) => it.author || `Testimonio ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Logo (URL)</Label>
                <Input
                  value={item.logo ?? ""}
                  onChange={(e) => update({ logo: e.target.value || undefined })}
                  placeholder="https://..."
                />
              </div>

              <div className="sm:col-span-2">
                <BadgeTagInput
                  label="Badges"
                  value={item.badges}
                  onChange={(badges) => update({ badges })}
                  placeholder="+6.000 miembros"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Resumen *</Label>
                <Textarea
                  rows={3}
                  value={item.summary ?? item.quote ?? ""}
                  onChange={(e) => update({ summary: e.target.value })}
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
                <Label className="text-xs">Lugar</Label>
                <Input
                  value={item.place ?? item.role ?? ""}
                  onChange={(e) => update({ place: e.target.value || undefined })}
                  placeholder="Marley Coffee"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
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
          )}
        />
      </div>
    </div>
  )
}
