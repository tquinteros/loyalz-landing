"use client"

import type { ReactNode } from "react"

type Props = {
  title: string
  description?: string
  children: ReactNode
}

/** Flat section wrapper — replaces nested accordions in the tab editor. */
export function FormSectionPanel({ title, description, children }: Props) {
  return (
    <section className="space-y-4">
      <header className="space-y-1 border-b pb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  )
}
