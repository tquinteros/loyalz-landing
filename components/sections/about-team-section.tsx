"use client"

import Image from "next/image"
import type { AboutTeamSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = AboutTeamSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function AboutTeamSection({
  title,
  description,
  team,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const descriptionText = t(description)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      <div className="space-y-10">
        <div className="space-y-4 text-center">
          {titleText && (
            <h2 className="text-3xl font-bold tracking-tight text-background">{titleText}</h2>
          )}
          {descriptionText && (
            <p className="mx-auto max-w-2xl text-background">
              {descriptionText}
            </p>
          )}
        </div>

        {(team ?? []).length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-4 rounded-4xl border-2 border-background/10 shadow-lg bg-card p-6 text-center"
              >
                <div className="relative size-20 overflow-hidden rounded-full bg-muted">
                  {member.avatarImage ? (
                    <Image
                      src={member.avatarImage}
                      alt={member.fullName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-2xl font-bold text-background">
                      {member.fullName?.[0] ?? "?"}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-background">{member.fullName}</p>
                  <p className="text-sm text-background">
                    {t(member.role)}
                  </p>
                </div>
                {t(member.description) && (
                  <p className="mx-auto max-w-sm text-sm text-background">
                    {t(member.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
