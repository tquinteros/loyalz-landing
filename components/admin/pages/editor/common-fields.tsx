"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AnyPageSection } from "@/lib/types/Pages"
import { ImagePicker } from "@/components/admin/media-library/image-picker"

type Props = {
  section: AnyPageSection
  onPatch: (patch: Partial<AnyPageSection>) => void
}

/**
 * Fields shared by every section (not inside `props`): background image,
 * extra class overrides, etc. Rendered in every section form.
 */
export function CommonSectionFields({ section, onPatch }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Imagen de fondo</Label>
        <ImagePicker
          value={section.backgroundImage ?? null}
          onChange={(url) => onPatch({ backgroundImage: url })}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="sec-class">Clases CSS extra</Label>
        <Input
          id="sec-class"
          value={section.className ?? ""}
          onChange={(e) => onPatch({ className: e.target.value || null })}
          placeholder="bg-slate-50 py-32 …"
        />
        <p className="text-xs text-muted-foreground">
          Sólo para ajustes avanzados. Se añaden al wrapper de la sección.
        </p>
      </div>
    </div>
  )
}
