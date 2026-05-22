"use client"

import { motion } from "framer-motion"
import type { AudiencesTabsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "../section-wrapper"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { AudienceTabBody } from "./tab-body"

type Props = AudiencesTabsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function AudiencesTabsSection({
  title,
  tabs,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const validTabs = (tabs ?? []).filter((tab) => tab.key)
  const defaultTab = validTabs[0]?.key ?? ""

  if (validTabs.length === 0) {
    return (
      <SectionWrapper backgroundImage={backgroundImage} className={className}>
        {titleText ? (
          <motion.div className="mb-8 text-center sm:mb-12">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
              {titleText}
            </h1>
          </motion.div>
        ) : null}
      </SectionWrapper>
    )
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <SectionWrapper backgroundImage={backgroundImage} className={className}>
        {titleText ? (
          <motion.div className="mb-8 text-center sm:mb-12">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
              {titleText}
            </h1>
          </motion.div>
        ) : null}

        <TabsList
          className="mb-0 grid! h-auto! w-full gap-0 rounded-none bg-transparent p-0"
          style={{
            gridTemplateColumns: `repeat(${validTabs.length}, minmax(0, 1fr))`,
          }}
        >
          {validTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className={cn(
                "flex-none! h-auto! max-h-none! w-full min-w-0 cursor-pointer flex-col items-center justify-between gap-2 rounded-none border-0 bg-transparent px-1 py-3 sm:justify-start sm:gap-4 sm:px-3 sm:py-0 lg:gap-8 lg:px-4",
                "text-center text-sm font-medium leading-tight text-background shadow-none! transition-none sm:text-lg lg:text-[32px] lg:leading-none",
                "after:hidden hover:text-background",
                "data-[state=active]:bg-transparent data-[state=active]:text-background data-[state=active]:shadow-none",
                "data-[state=active]:**:data-tab-indicator:bg-chart-5",
              )}
            >
              <span className="w-full min-w-0 text-balance break-words">
                {t(tab.tabLabel)}
              </span>
              <span
                data-tab-indicator
                aria-hidden
                className="mt-auto h-1 w-full shrink-0 bg-transparent sm:mt-0"
              />
            </TabsTrigger>
          ))}
        </TabsList>
      </SectionWrapper>
      {validTabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="mt-0 outline-none">
          <AudienceTabBody tab={tab} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
