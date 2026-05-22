"use client"

import type { AudienceProblemProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"

type Props = {
  data: AudienceProblemProps | undefined
}

export function AudienceProblemBlock({ data }: Props) {
  const t = useT()
  if (!data) return null

  const labelText = t(data.label)
  const titleText = t(data.title)
  const descriptionText = t(data.description)
  const solutions = data.solutions ?? []

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center justify-center gap-4">
        {labelText ? (
          <div className="flex w-fit items-center justify-center gap-3 rounded border border-background p-2 px-3">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="10" height="10" rx="2" fill="currentColor" />
            </svg>
            <p className="text-xs tracking-widest text-background/80">
              {labelText}
            </p>
          </div>
        ) : null}
        {titleText ? (
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold leading-tight tracking-tight text-background sm:text-4xl lg:text-[56px]">
            {titleText}
          </h2>
        ) : null}
        {descriptionText ? (
          <p className="mt-3 text-center text-base text-background sm:text-[17px] sm:leading-relaxed">
            {descriptionText}
          </p>
        ) : null}
      </div>

      {solutions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol, i) => {
            const solLabel = t(sol.label)
            const solTitle = t(sol.title)
            const solDesc = t(sol.description)
            const cardBg = sol.backgroundColor?.trim() || "#F8F5EF"

            return (
              <div
                key={i}
                className="row-span-3 grid grid-rows-subgrid gap-2 rounded-4xl p-8 text-foreground"
                style={{ backgroundColor: cardBg }}
              >
                <span
                  className={cn(
                    "mb-3 text-xs font-semibold sm:text-2xl text-foreground/60",
                    !solLabel && "invisible",
                  )}
                >
                  {solLabel || "\u00A0"}
                </span>
                <h4
                  className={cn(
                    "text-base font-bold leading-[1.1] sm:text-[32px]",
                    !solTitle && "invisible",
                  )}
                >
                  {solTitle || "\u00A0"}
                </h4>
                <p
                  className={cn(
                    "text-sm leading-relaxed text-foreground sm:text-[16px]",
                    !solDesc && "invisible",
                  )}
                >
                  {solDesc || "\u00A0"}
                </p>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
