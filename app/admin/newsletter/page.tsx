import NewsletterTemplate from "@/components/admin/newsletter/newsletter-template"
import type { NewsletterTemplateProps } from "@/components/admin/newsletter/newsletter-template"
import { getSubscribers, getCampaigns } from "@/lib/actions/newsletter"

export default async function AdminNewsletterPage() {
  const [subscribersResult, campaignsResult] = await Promise.all([
    getSubscribers(),
    getCampaigns(),
  ])

  const props: NewsletterTemplateProps = {
    subscribers: subscribersResult.data ?? [],
    campaigns: campaignsResult.data ?? [],
    subscribersError: subscribersResult.error as string | null | undefined,
    campaignsError: campaignsResult.error as string | null | undefined,
  }

  return <NewsletterTemplate {...props} />
}
