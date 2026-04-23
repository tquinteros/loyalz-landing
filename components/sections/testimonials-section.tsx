import { Quote } from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import type { TestimonialsSectionProps } from "@/lib/types/Pages"

type Props = TestimonialsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function TestimonialsSection({
  title,
  subtitle,
  items,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      {(title || subtitle) && (
        <div className="mx-auto mb-12 max-w-2xl text-center">
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="flex h-full flex-col justify-between rounded-xl border bg-card p-6"
          >
            <Quote className="size-5 text-primary" />
            <blockquote className="mt-4 text-base leading-relaxed">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {item.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {item.author.slice(0, 1)}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">{item.author}</div>
                {item.role ? (
                  <div className="text-xs text-muted-foreground">
                    {item.role}
                  </div>
                ) : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionWrapper>
  )
}
