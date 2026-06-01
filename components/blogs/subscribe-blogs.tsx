"use client"

import Link from "next/link"
import type { LocalizedString } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { NewsletterSubscribeForm } from "@/components/newsletter-subscribe-form"
import { SectionWrapper } from "@/components/sections/section-wrapper"

const SUBSCRIBE_BLOGS_COPY = {
  titleLine1: { es: "Mantenete al tanto", en: "Stay up to date" },
  titleLine2: { es: "sobre Loyalz", en: "about Loyalz" },
  description: {
    es: "Suscríbete a nuestro boletín para mantenerte al día con las novedades y lanzamientos.",
    en: "Subscribe to our newsletter to stay up to date with news and releases.",
  },
  emailPlaceholder: {
    es: "Dejanos tu mail",
    en: "Leave us your email",
  },
  subscribe: {
    es: "Suscribite",
    en: "Subscribe",
  },
  legalPrefix: {
    es: "Al hacer clic en Suscribite, confirmás que estás de acuerdo con nuestros ",
    en: "By clicking Subscribe you're confirming that you agree with our ",
  },
  legalTerms: {
    es: "Términos y Condiciones",
    en: "Terms and Conditions",
  },
  legalSuffix: { es: ".", en: "." },
} satisfies Record<string, LocalizedString>

export function SubscribeBlogs() {
  const t = useT()

  return (
    <SectionWrapper className="bg-foreground text-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight text-background sm:text-[56px] sm:leading-none">
          {t(SUBSCRIBE_BLOGS_COPY.titleLine1)}
          <br />
          {t(SUBSCRIBE_BLOGS_COPY.titleLine2)}
        </h2>

        <p className="mt-6 max-w-xl text-base text-background sm:text-lg">
          {t(SUBSCRIBE_BLOGS_COPY.description)}
        </p>

        <NewsletterSubscribeForm
          variant="inverted"
          placeholder={t(SUBSCRIBE_BLOGS_COPY.emailPlaceholder)}
          buttonLabel={t(SUBSCRIBE_BLOGS_COPY.subscribe)}
          className="mt-10 w-full max-w-xl"
        />

        <p className="mt-6 max-w-xl text-[10px] leading-relaxed text-background/70 sm:text-xs">
          {t(SUBSCRIBE_BLOGS_COPY.legalPrefix)}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-background"
          >
            {t(SUBSCRIBE_BLOGS_COPY.legalTerms)}
          </Link>
          {t(SUBSCRIBE_BLOGS_COPY.legalSuffix)}
        </p>
      </div>
    </SectionWrapper>
  )
}
