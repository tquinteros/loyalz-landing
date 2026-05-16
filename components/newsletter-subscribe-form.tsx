"use client"

import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { subscribeToNewsletter } from "@/lib/actions/newsletter"
import { useLanguage, type Locale } from "@/providers/language-provider"

type NewsletterSubscribeFormProps = {
  placeholder: string
  buttonLabel: string
  className?: string
}

const UNEXPECTED_ERROR: Record<Locale, string> = {
  es: "Ocurrió un error. Intenta de nuevo.",
  en: "Something went wrong. Please try again.",
}

export function NewsletterSubscribeForm({
  placeholder,
  buttonLabel,
  className,
}: NewsletterSubscribeFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { locale } = useLanguage()

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => subscribeToNewsletter(formData),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(result.message!)
      if (inputRef.current) inputRef.current.value = ""
    },
    onError: () => {
      toast.error(UNEXPECTED_ERROR[locale])
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("locale", locale)
    mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
        <Input
          ref={inputRef}
          type="email"
          name="email"
          placeholder={placeholder}
          required
          disabled={isPending}
          className="min-h-12 w-full min-w-0 flex-1 px-4 py-3 focus-visible:border-foreground/50 placeholder:text-foreground/50 focus-visible:ring-foreground/20 sm:py-6"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full shrink-0 border border-foreground px-4 py-3 sm:w-auto sm:self-stretch sm:py-6"
        >
          {isPending ? "…" : buttonLabel}
        </Button>
      </div>
    </form>
  )
}
