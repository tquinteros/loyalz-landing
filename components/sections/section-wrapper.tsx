import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  /** Optional image URL painted behind the section. */
  backgroundImage?: string | null
  /**
   * Solid background (e.g. hex/rgb from CMS). When set, overrides the default
   * `bg-foreground` shell — use for sections with editor-controlled color.
   */
  surfaceColor?: string | null
  className?: string | null
  /** Inner container className (used for padding / max-width tweaks). */
  innerClassName?: string
}

/**
 * Common shell every section uses. Handles the optional background image,
 * consistent vertical rhythm and a max-width container so each section
 * component can focus purely on its own content.
 */
export function SectionWrapper({
  children,
  backgroundImage,
  surfaceColor,
  className,
  innerClassName,
}: Props) {
  const hasBg = !!backgroundImage
  const hasSurface = !!surfaceColor?.trim()

  return (
    <section
      className={cn(
        "relative w-full py-16 sm:py-24",
        !hasBg && !hasSurface && "bg-foreground",
        hasBg && "text-foreground",
        className,
      )}
      style={
        hasBg
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : hasSurface && surfaceColor
            ? { backgroundColor: surfaceColor }
            : undefined
      }
    >
      {hasBg && (
        <div
          aria-hidden
          className="absolute inset-0 bg-black/60"
        />
      )}
      <div
        className={cn(
          // "container relative mx-auto px-5 lg:px-8",
          "relative px-5 lg:px-16",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
