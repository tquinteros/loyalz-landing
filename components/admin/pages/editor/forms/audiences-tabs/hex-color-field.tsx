"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Props = {
  label?: string
  value: string
  onChange: (hex: string) => void
  placeholder?: string
}

export function HexColorField({
  label = "Color de fondo (hex)",
  value,
  onChange,
  placeholder = "#F8F5EF",
}: Props) {
  const safe = value?.trim() || placeholder

  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-14 p-1"
        />
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
