"use client"

import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { subscribeToNewsletter } from "@/lib/actions/newsletter"
import { useLanguage, type Locale } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

type NewsletterSubscribeFormProps = {
  placeholder: string
  buttonLabel: string
  className?: string
  /** `inverted` for dark (bg-foreground) surfaces — light borders and text. */
  variant?: "default" | "inverted"
}

const UNEXPECTED_ERROR: Record<Locale, string> = {
  es: "Ocurrió un error. Intenta de nuevo.",
  en: "Something went wrong. Please try again.",
}

const INPUT_VARIANT = {
  default:
    "rounded-[12px] focus-visible:border-foreground/50 placeholder:text-foreground/50 focus-visible:ring-foreground/20",
  inverted:
    "rounded-[12px] border-background text-background placeholder:text-background/50 focus-visible:border-background/50 focus-visible:ring-background/20",
} as const

const BUTTON_VARIANT = {
  default: "rounded-[12px] border border-foreground",
  inverted:
    "rounded-[12px] border border-background bg-transparent text-background shadow-none hover:bg-transparent hover:text-background hover:opacity-90",
} as const

export function NewsletterSubscribeForm({
  placeholder,
  buttonLabel,
  className,
  variant = "default",
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
          className={cn(
            "min-h-12 w-full min-w-0 flex-1 px-4 py-3 sm:py-6",
            INPUT_VARIANT[variant],
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          variant={variant === "inverted" ? "ghost" : "default"}
          className={cn(
            "w-full shrink-0 px-4 py-3 sm:w-auto sm:self-stretch sm:py-6",
            BUTTON_VARIANT[variant],
          )}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            buttonLabel
          )}
        </Button>
      </div>
    </form>
  )
}
