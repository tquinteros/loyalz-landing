"use client"

import type { AudienceTabItem } from "@/lib/types/Pages"
import { normalizeAudienceTab } from "@/lib/audiences/tab-blocks"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "../section-wrapper"
import { AudienceTabCarousel } from "./tab-carousel"
import { AudienceTabSeparator } from "./tab-separator"
import { AudienceBrandMarquee } from "./brand-marquee"
import { AudienceProblemBlock } from "./problem-block"
import { AudienceStepsBlock } from "./steps-block"
import { AudienceMobileBlock } from "./mobile-block"
import { AudienceEcosystemBlock } from "./ecosystem-block"

type Props = {
  tab: AudienceTabItem
}

export function AudienceTabBody({ tab: rawTab }: Props) {
  const t = useT()
  const tab = normalizeAudienceTab(rawTab)
  const validImages = tab.images.filter(Boolean)
  const separatorText = t(tab.separatorText)
  const labelText = t(tab.label)
  const titleText = t(tab.title)

  return (
    <>
      <AudienceTabCarousel images={validImages} alt={titleText} />

      <SectionWrapper className="pt-16">
        <div className="space-y-16">
          <AudienceTabSeparator label={labelText} separatorText={separatorText} />

          <AudienceBrandMarquee
            brands={tab.brands}
            title={t(tab.brandMarqueeTitle)}
          />

          <AudienceProblemBlock data={tab.audienceProblem} />

          <AudienceStepsBlock data={tab.audienceSteps} />

          <AudienceMobileBlock tabKey={tab.key} data={tab.audienceMobile} />
        </div>
      </SectionWrapper>

      <AudienceEcosystemBlock data={tab.audienceEcosystem} />
    </>
  )
}
