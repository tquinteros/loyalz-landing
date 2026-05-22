"use client"

import type { AudienceTabItem } from "@/lib/types/Pages"
import { normalizeAudienceTab, type AudienceTabPanelId } from "@/lib/audiences/tab-blocks"
import { AudienceTabGeneralEditor } from "./editors/general-editor"
import { AudienceTabCarouselEditor } from "./editors/carousel-editor"
import { AudienceTabSeparatorEditor } from "./editors/separator-editor"
import { AudienceTabMarqueeEditor } from "./editors/marquee-editor"
import { AudienceTabProblemEditor } from "./editors/problem-editor"
import { AudienceTabStepsEditor } from "./editors/steps-editor"
import { AudienceTabMobileEditor } from "./editors/mobile-editor"
import { AudienceTabEcosystemEditor } from "./editors/ecosystem-editor"
import { AudienceTabDemoEditor } from "./editors/demo-editor"
import { AudienceTabInformationEditor } from "./editors/information-editor"

type Props = {
  panel: AudienceTabPanelId
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabPanelContent({ panel, tab: rawTab, onChange }: Props) {
  const tab = normalizeAudienceTab(rawTab)

  switch (panel) {
    case "general":
      return <AudienceTabGeneralEditor tab={tab} onChange={onChange} />
    case "carousel":
      return <AudienceTabCarouselEditor tab={tab} onChange={onChange} />
    case "separator":
      return <AudienceTabSeparatorEditor tab={tab} onChange={onChange} />
    case "marquee":
      return <AudienceTabMarqueeEditor tab={tab} onChange={onChange} />
    case "problem":
      return <AudienceTabProblemEditor tab={tab} onChange={onChange} />
    case "steps":
      return <AudienceTabStepsEditor tab={tab} onChange={onChange} />
    case "mobile":
      return <AudienceTabMobileEditor tab={tab} onChange={onChange} />
    case "ecosystem":
      return <AudienceTabEcosystemEditor tab={tab} onChange={onChange} />
    case "demo":
      return <AudienceTabDemoEditor tab={tab} onChange={onChange} />
    case "information":
      return <AudienceTabInformationEditor tab={tab} onChange={onChange} />
    default:
      return null
  }
}
