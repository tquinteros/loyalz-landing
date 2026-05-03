/**
 * Page / Section types for the DB-driven page renderer.
 *
 * A `Page` is identified by a unique `slug` and stores its layout as an
 * ordered array of `Section` objects in the `sections` JSONB column.
 *
 * Each section is a discriminated union on `type`, so rendering code can
 * narrow the shape of `props` based on which component it maps to.
 */

export type CTA = {
  label: string
  href: string
}

/** Fields that every section shares. */
type BaseSection<TType extends string, TProps> = {
  /** Stable id (used as React key and for admin editing). */
  id: string
  /** Discriminator — maps to a component in the componentMap. */
  type: TType
  /** When false, the renderer skips this section. */
  enabled: boolean
  /** Optional background image for the whole section. */
  backgroundImage?: string | null
  /** Optional raw CSS class overrides (advanced / admin). */
  className?: string | null
  /** Type-specific content. */
  props: TProps
}

export type HeroSectionProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  primaryCta?: CTA
  secondaryCta?: CTA
}

export type HeroClubSectionProps = {
  title: string
  subtitle: string
  image: string
  primaryCta: CTA
}

export type FeatureLinksSectionProps = {
  title?: string
  subtitle?: string
  items: Array<{
    icon?: string
    title: string
    description?: string
    href?: string
  }>
}

export type StatsSectionProps = {
  title?: string
  subtitle?: string
  items: Array<{
    value: string
    label: string
  }>
}

export type TestimonialsSectionProps = {
  title?: string
  subtitle?: string
  items: Array<{
    summary: string
    author: string
    place?: string
    avatar?: string
    logo?: string
    badges?: string[]
    /** Legacy fields kept so previously saved page JSON keeps rendering. */
    quote?: string
    role?: string
  }>
}

export type FAQSectionProps = {
  title?: string
  subtitle?: string
  items: Array<{
    question: string
    answer: string
  }>
}

export type ContactFormSectionProps = {
  title?: string
  subtitle?: string
  submitLabel?: string
}

export type CTASectionProps = {
  title?: string
  label?: string
}

export type PricingSectionProps = {
  label?: string
  title?: string
  description?: string
  bottomMessage?: string
  cards: Array<{
    title: string
    price: string
    shops: string
    savings: string
    features: string[]
  }>
}

export type ClubCardsSectionProps = {
  label?: string
  title?: string
  subtitle?: string
  cards: Array<{
    title: string
    description?: string
  }>
}

/** Product (Club) page — titled steps with image + copy per step. */
export type StepsClubSectionProps = {
  title: string
  steps: Array<{
    title: string
    description: string
    image: string
  }>
}

/** Shared CTA band — solid background color + copy + two CTAs + image. */
export type CommonCTASectionProps = {
  /** CSS color string, e.g. `#754390` or `rgb(117 67 144)`. */
  backgroundColor: string
  title: string
  description: string
  firstCta: CTA
  secondCta: CTA
  image: string
}

export type HeroSection = BaseSection<"hero", HeroSectionProps>
export type HeroClubSection = BaseSection<"hero_club", HeroClubSectionProps>
export type FeatureLinksSection = BaseSection<"feature_links", FeatureLinksSectionProps>
export type StatsSection = BaseSection<"stats", StatsSectionProps>
export type TestimonialsSection = BaseSection<"testimonials", TestimonialsSectionProps>
export type FAQSection = BaseSection<"faq", FAQSectionProps>
export type ContactFormSection = BaseSection<"contact_form", ContactFormSectionProps>
export type CTASection = BaseSection<"cta", CTASectionProps>
export type PricingSection = BaseSection<"pricing", PricingSectionProps>
export type ClubCardsSection = BaseSection<"club_cards", ClubCardsSectionProps>
export type StepsClubSection = BaseSection<"steps_club", StepsClubSectionProps>
export type CommonCTASection = BaseSection<"common_cta", CommonCTASectionProps>

/** Union of every supported section type. Extend this to add new section kinds. */
export type PageSection =
  | HeroSection
  | HeroClubSection
  | FeatureLinksSection
  | StatsSection
  | TestimonialsSection
  | FAQSection
  | ContactFormSection
  | CTASection
  | PricingSection
  | ClubCardsSection
  | StepsClubSection
  | CommonCTASection

/**
 * Fallback type for sections that come from the DB but whose `type` is not
 * (yet) known to the client bundle. The renderer will skip these gracefully.
 */
export type UnknownSection = BaseSection<string, Record<string, unknown>>

export type AnyPageSection = PageSection | UnknownSection

export type Page = {
  id: string
  slug: string
  type: string | null
  title: string
  sections: AnyPageSection[]
  status: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string | null
  updated_at: string | null
}

export type PageVersion = {
  id: string
  page_id: string
  title: string
  slug: string
  sections: AnyPageSection[]
  status: string | null
  seo_title: string | null
  seo_description: string | null
  page_created_at: string | null
  page_updated_at: string | null
  snapshot_at: string
  created_by: string | null
}

/**
 * Shape used by the admin "create / edit page" dialog. Sections are managed
 * by their own dedicated editor, so this form only covers page metadata.
 */
export type PageFormValues = {
  title: string
  slug: string
  status: "draft" | "published"
  seo_title: string
  seo_description: string
}
