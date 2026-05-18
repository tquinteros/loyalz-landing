"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { LocalizedField } from "./localized-field"
import type { AboutSeparatorSectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: AboutSeparatorSectionProps
  onChange: (next: AboutSeparatorSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function AboutSeparatorForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<AboutSeparatorSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof AboutSeparatorSectionProps>(
    key: K,
    next: AboutSeparatorSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="about-separator-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Nuestra historia"
        placeholderEn="Our story"
      />
    </div>
  )
}
