"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SectionWrapper } from "./section-wrapper"
import type { ContactFormSectionProps } from "@/lib/types/Pages"

type Props = ContactFormSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

/**
 * Stubbed client contact form — only handles local UI state today.
 * The submit handler is a placeholder; wire it to a Server Action when
 * the backend side is in place.
 */
export default function ContactFormSection({
  title,
  subtitle,
  submitLabel = "Submit",
  backgroundImage,
  className,
}: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    await new Promise((r) => setTimeout(r, 600))
    setStatus("done")
  }

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="max-w-2xl"
    >
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title ? (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      )}

      {status === "done" ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-base font-medium">Thanks — we’ll be in touch.</p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-4 rounded-xl border bg-card p-6 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="cf-name">Name</Label>
            <Input id="cf-name" name="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cf-email">Email</Label>
            <Input id="cf-email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="cf-company">Company</Label>
            <Input id="cf-company" name="company" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="cf-message">Message</Label>
            <Textarea id="cf-message" name="message" rows={4} />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : submitLabel}
            </Button>
          </div>
        </form>
      )}
    </SectionWrapper>
  )
}
