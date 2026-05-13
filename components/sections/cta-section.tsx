"use client"

import type { CTASectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = CTASectionProps & {
    backgroundImage?: string | null
    className?: string | null
}

const CTASection = ({ title, label, backgroundImage, className }: Props) => {
    const t = useT()
    const labelText = t(label) || t({ es: "Insight", en: "Insight" })
    const titleText =
        t(title) ||
        t({ es: "¿Listo para empezar?", en: "Ready to get started?" })

    return (
        <SectionWrapper
            backgroundImage={backgroundImage}
            className={`${className} bg-[#F8F5EF] pt-0!`}
        >
            <div className="px-16 py-16 bg-black rounded-4xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="10" height="10" rx="2" fill="#F8F5EF" />
                    </svg>
                    <span className="text-foreground">{labelText}</span>
                </div>
                <h2 className="text-3xl max-w-7xl font-semibold text-foreground tracking-tight sm:text-6xl">
                    {titleText}
                </h2>
            </div>
        </SectionWrapper>
    )
}

export default CTASection
