"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CTASectionProps } from "@/lib/types/Pages"

type Props = {
  value: CTASectionProps
  onChange: (next: CTASectionProps) => void
}

export function CtaForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<CTASectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof CTASectionProps>(key: K, next: CTASectionProps[K]) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cta-title">Title</Label>
        <Input
          id="cta-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
          placeholder="Ready to get started?"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cta-label">Label</Label>
        <Input
          id="cta-label"
          value={local.label ?? ""}
          onChange={(e) => set("label", e.target.value || undefined)}
          placeholder="Contact us"
        />
      </div>
    </div>
  )
}
