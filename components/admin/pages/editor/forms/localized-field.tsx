"use client"

import { useId } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { LocalizedString } from "@/lib/types/Pages"

type Common = {
  label?: string
  required?: boolean
  className?: string
  /** Optional outer id; ES/EN inputs derive ids from it. */
  idPrefix?: string
  placeholderEs?: string
  placeholderEn?: string
  /** `comfortable` — larger labels/inputs for wide editors (e.g. audiences). */
  variant?: "default" | "comfortable"
}

type SingleLineProps = Common & {
  multiline?: false
  rows?: never
}

type MultiLineProps = Common & {
  multiline: true
  rows?: number
}

type Props = (SingleLineProps | MultiLineProps) & {
  value?: LocalizedString
  onChange: (next: LocalizedString | undefined) => void
}

/**
 * Small helper for editing a `LocalizedString` (`{ es?, en? }`) with two
 * stacked inputs. Keeps the form code DRY across sections.
 */
export function LocalizedField({
  label,
  required,
  className,
  idPrefix,
  placeholderEs,
  placeholderEn,
  variant = "default",
  value,
  onChange,
  ...rest
}: Props) {
  const reactId = useId()
  const baseId = idPrefix ?? reactId
  const multiline = "multiline" in rest && rest.multiline === true
  const rows = "rows" in rest && rest.rows ? rest.rows : 2

  function update(patch: Partial<LocalizedString>) {
    const next: LocalizedString = { ...(value ?? {}), ...patch }
    if (next.es !== undefined && next.es === "") delete next.es
    if (next.en !== undefined && next.en === "") delete next.en
    if (!next.es && !next.en) {
      onChange(undefined)
      return
    }
    onChange(next)
  }

  const comfortable = variant === "comfortable"
  const fieldClass = comfortable ? "text-sm" : undefined

  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      {label ? (
        <Label className={comfortable ? "text-sm font-medium" : "text-xs"}>
          {label}
          {required ? " *" : null}
        </Label>
      ) : null}

      <div
        className={
          comfortable
            ? "grid gap-3 md:grid-cols-2"
            : "grid gap-2 sm:grid-cols-2"
        }
      >
        <div className="space-y-1.5">
          <Label
            htmlFor={`${baseId}-es`}
            className={
              comfortable
                ? "text-xs uppercase tracking-wider text-muted-foreground"
                : "text-[10px] uppercase tracking-wider text-muted-foreground"
            }
          >
            ES
          </Label>
          {multiline ? (
            <Textarea
              id={`${baseId}-es`}
              rows={rows}
              className={fieldClass}
              value={value?.es ?? ""}
              onChange={(e) => update({ es: e.target.value })}
              placeholder={placeholderEs}
            />
          ) : (
            <Input
              id={`${baseId}-es`}
              className={comfortable ? "h-10 text-sm" : undefined}
              value={value?.es ?? ""}
              onChange={(e) => update({ es: e.target.value })}
              placeholder={placeholderEs}
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor={`${baseId}-en`}
            className={
              comfortable
                ? "text-xs uppercase tracking-wider text-muted-foreground"
                : "text-[10px] uppercase tracking-wider text-muted-foreground"
            }
          >
            EN
          </Label>
          {multiline ? (
            <Textarea
              id={`${baseId}-en`}
              rows={rows}
              className={fieldClass}
              value={value?.en ?? ""}
              onChange={(e) => update({ en: e.target.value })}
              placeholder={placeholderEn}
            />
          ) : (
            <Input
              id={`${baseId}-en`}
              className={comfortable ? "h-10 text-sm" : undefined}
              value={value?.en ?? ""}
              onChange={(e) => update({ en: e.target.value })}
              placeholder={placeholderEn}
            />
          )}
        </div>
      </div>
    </div>
  )
}
