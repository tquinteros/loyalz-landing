import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionWrapper } from "./section-wrapper"
import type { HeroSectionProps } from "@/lib/types/Pages"

type Props = HeroSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function HeroSection({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="max-w-4xl text-center"
    >
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-80">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      {subtitle ? (
        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">{subtitle}</p>
      ) : null}

      {(primaryCta || secondaryCta) && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {primaryCta ? (
            <Button asChild size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          ) : null}
          {secondaryCta ? (
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          ) : null}
        </div>
      )}
    </SectionWrapper>
  )
}
