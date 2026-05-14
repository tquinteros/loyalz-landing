"use client"

import type { LocalizedString } from "@/lib/types/Pages"
import { useLanguage } from "@/providers/language-provider"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

const NOT_FOUND_COPY = {
    description: { es: "No pudimos encontrar la página.", en: "We couldn't find the page." },
    description2: {
        es: "La página que buscas no existe o ocurrió otro error.",
        en: "The page you are looking for does not exist or another error occurred.",
    },
    redirect: { es: "Volver al inicio", en: "Return to the home page" },
} satisfies Record<string, LocalizedString>

function AccentSquare({ className, fill }: { className?: string; fill: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <rect width="23" height="23" rx="4" fill={fill} />
        </svg>
    )
}

const NotFoundRedirect = () => {
    const router = useRouter()
    const { t } = useLanguage()

    return (
        <div className="flex min-h-[80dvh] w-full max-w-full items-center justify-center overflow-x-hidden bg-foreground px-4 py-10 text-background sm:px-6 sm:py-12">
            <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 sm:gap-8">
                <div className="flex w-full justify-center px-6 sm:px-10 md:px-14">
                    <div className="relative mx-auto w-fit max-w-full min-w-0">
                        <h3 className="text-center text-[clamp(5rem,22vw,15rem)] font-bold leading-none tracking-tight">
                            404
                        </h3>
                        <AccentSquare
                            fill="#8C7F1F"
                            className="pointer-events-none absolute top-[22%] -left-[6%] h-[clamp(0.75rem,3.5vw,1.4375rem)] w-[clamp(0.75rem,3.5vw,1.4375rem)] sm:-left-[8%] sm:top-[26%]"
                        />
                        <AccentSquare
                            fill="#EC491E"
                            className="pointer-events-none absolute top-[40%] left-[8%] h-[clamp(0.75rem,3.5vw,1.4375rem)] w-[clamp(0.75rem,3.5vw,1.4375rem)] sm:left-[4%] sm:top-[44%]"
                        />
                        <AccentSquare
                            fill="#754390"
                            className="pointer-events-none absolute top-[26%] -right-[4%] h-[clamp(0.75rem,3.5vw,1.4375rem)] w-[clamp(0.75rem,3.5vw,1.4375rem)] sm:-right-[6%] sm:top-[30%]"
                        />
                        <AccentSquare
                            fill="#013662"
                            className="pointer-events-none absolute -right-[8%] bottom-[4%] h-[clamp(0.75rem,3.5vw,1.4375rem)] w-[clamp(0.75rem,3.5vw,1.4375rem)] sm:-right-[10%] sm:bottom-[2%]"
                        />
                    </div>
                </div>
                <div className="flex w-full max-w-xl flex-col items-center justify-center gap-3 text-center sm:gap-4">
                    <p className="text-balance text-xl font-bold sm:text-2xl md:text-[32px]">
                        {t(NOT_FOUND_COPY.description)}
                    </p>
                    <p className="text-balance px-1 text-sm leading-relaxed text-background/90 sm:text-base">
                        {t(NOT_FOUND_COPY.description2)}
                    </p>
                    <Button className="mt-1 w-full max-w-xs py-5 sm:mt-2 sm:w-auto" onClick={() => router.push("/")}>
                        {t(NOT_FOUND_COPY.redirect)}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundRedirect
