"use client"

import Link from "next/link"
import { useLanguage } from "@/providers/language-provider"

type State = "success" | "error" | "invalid"

type I18nContent = {
  emoji: string
  emojiColor: string
  title: string
  body: string
  back: string
}

const i18n: Record<"es" | "en", Record<State, I18nContent>> = {
  es: {
    success: {
      emoji: "✓",
      emojiColor: "#16a34a",
      title: "Te desuscribiste correctamente",
      body: "Ya no recibirás más emails de nuestro boletín. Lamentamos verte ir.",
      back: "← Volver al inicio",
    },
    error: {
      emoji: "✕",
      emojiColor: "#dc2626",
      title: "Algo salió mal",
      body: "No pudimos procesar tu solicitud. Es posible que el link haya expirado o ya hayas sido desuscripto.",
      back: "← Volver al inicio",
    },
    invalid: {
      emoji: "?",
      emojiColor: "#d97706",
      title: "Link inválido",
      body: "Este link de desuscripción no es válido. Si recibiste un email de LoyalZ, usá el botón de desuscripción que viene en el mismo.",
      back: "← Volver al inicio",
    },
  },
  en: {
    success: {
      emoji: "✓",
      emojiColor: "#16a34a",
      title: "You've been unsubscribed",
      body: "You won't receive any more emails from our newsletter. We're sorry to see you go.",
      back: "← Back to home",
    },
    error: {
      emoji: "✕",
      emojiColor: "#dc2626",
      title: "Something went wrong",
      body: "We couldn't process your request. The link may have expired or you may already be unsubscribed.",
      back: "← Back to home",
    },
    invalid: {
      emoji: "?",
      emojiColor: "#d97706",
      title: "Invalid link",
      body: "This unsubscribe link is not valid. If you received an email from LoyalZ, use the unsubscribe button included in it.",
      back: "← Back to home",
    },
  },
}

type UnsubscribeViewProps = {
  state: State
}

export function UnsubscribeView({ state }: UnsubscribeViewProps) {
  const { locale } = useLanguage()
  const content = i18n[locale][state]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-md space-y-6 text-center">
        <div
          className="mx-auto flex size-16 items-center justify-center rounded-full text-2xl font-bold"
          style={{ backgroundColor: `${content.emojiColor}15`, color: content.emojiColor }}
        >
          {content.emoji}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{content.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{content.body}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {content.back}
        </Link>
      </div>
    </main>
  )
}

export function UnsubscribeSkeleton() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto size-16 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="mx-auto h-7 w-56 animate-pulse rounded-md bg-muted" />
          <div className="mx-auto h-4 w-72 animate-pulse rounded-md bg-muted" />
          <div className="mx-auto h-4 w-48 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="mx-auto h-4 w-32 animate-pulse rounded-md bg-muted" />
      </div>
    </main>
  )
}
