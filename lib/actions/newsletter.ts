"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { Resend } from "resend"
import { render } from "react-email"
import NewsletterCampaignEmail from "@/emails/newsletter-campaign"

// ─── Types ───────────────────────────────────────────────────────────────────

export type Subscriber = {
  id: string
  email: string
  name: string | null
  locale: string
  status: string
  subscribed_at: string | null
  unsubscribed_at: string | null
}

export type Campaign = {
  id: string
  subject: string
  preview_text: string | null
  title: string | null
  description: string | null
  image_url: string | null
  cta_label: string | null
  cta_href: string | null
  locale: string
  audience: string
  status: string
  scheduled_at: string | null
  sent_at: string | null
  sent_count: number
  created_at: string | null
  updated_at: string | null
}

export type CampaignFormValues = {
  subject: string
  preview_text?: string
  title?: string
  description?: string
  image_url?: string
  cta_label?: string
  cta_href?: string
  locale?: string
  audience?: string
}

// ─── Public subscribe action (called from footer) ─────────────────────────────

export async function subscribeToNewsletter(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Por favor ingresá un email válido." }
  }

  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle()

  if (existing) {
    if (existing.status === "active") {
      return { error: "Este email ya está suscrito." }
    }
    // Re-subscribe if unsubscribed
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ status: "active", unsubscribed_at: null })
      .eq("id", existing.id)

    if (error) return { error: "No se pudo procesar tu solicitud. Intenta de nuevo." }
    return { success: true }
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    locale: "es",
    status: "active",
  })

  if (error) {
    if (error.code === "23505") return { error: "Este email ya está suscrito." }
    return { error: "No se pudo procesar tu solicitud. Intenta de nuevo." }
  }

  return { success: true }
}

// ─── Admin: Subscribers ───────────────────────────────────────────────────────

export async function getSubscribers() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, locale, status, subscribed_at, unsubscribed_at")
    .order("subscribed_at", { ascending: false })

  if (error) return { error: error.message }
  return { data: data as Subscriber[] }
}

export async function unsubscribeUser(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/newsletter")
  return { success: true }
}

export async function deleteSubscriber(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/newsletter")
  return { success: true }
}

// ─── Admin: Campaigns ─────────────────────────────────────────────────────────

export async function getCampaigns() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data: data as Campaign[] }
}

export async function getCampaign(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return { error: error.message }
  return { data: data as Campaign }
}

export async function createCampaign(values: CampaignFormValues) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .insert({
      subject: values.subject,
      preview_text: values.preview_text || null,
      title: values.title || null,
      description: values.description || null,
      image_url: values.image_url || null,
      cta_label: values.cta_label || null,
      cta_href: values.cta_href || null,
      locale: values.locale || "es",
      audience: values.audience || "all",
      status: "draft",
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  revalidatePath("/admin/newsletter")
  return { data }
}

export async function updateCampaign(id: string, values: CampaignFormValues) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .update({
      subject: values.subject,
      preview_text: values.preview_text || null,
      title: values.title || null,
      description: values.description || null,
      image_url: values.image_url || null,
      cta_label: values.cta_label || null,
      cta_href: values.cta_href || null,
      locale: values.locale || "es",
      audience: values.audience || "all",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single()

  if (error) return { error: error.message }

  revalidatePath("/admin/newsletter")
  return { data }
}

export async function deleteCampaign(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("newsletter_campaigns")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/newsletter")
  return { success: true }
}

// ─── Admin: Send Campaign ─────────────────────────────────────────────────────

export async function sendCampaign(id: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { error: "RESEND_API_KEY no está configurado." }

  const supabase = createAdminClient()

  // Fetch campaign
  const { data: campaign, error: campaignError } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", id)
    .single()

  if (campaignError || !campaign) return { error: "Campaña no encontrada." }
  if (campaign.status === "sent") return { error: "Esta campaña ya fue enviada." }
  if (campaign.status === "sending") return { error: "Esta campaña ya está siendo enviada." }

  // Fetch active subscribers filtered by audience
  let query = supabase
    .from("newsletter_subscribers")
    .select("id, email, name, locale")
    .eq("status", "active")

  if (campaign.audience !== "all") {
    query = query.eq("locale", campaign.audience)
  }

  const { data: subscribers, error: subscribersError } = await query

  if (subscribersError) return { error: subscribersError.message }
  if (!subscribers || subscribers.length === 0) {
    return { error: "No hay suscriptores activos para este público." }
  }

  // Mark as sending
  await supabase
    .from("newsletter_campaigns")
    .update({ status: "sending" })
    .eq("id", id)

  const resend = new Resend(apiKey)

  let sentCount = 0
  const errors: string[] = []

  for (const subscriber of subscribers) {
    try {
      const html = await render(
        NewsletterCampaignEmail({
          subject: campaign.subject,
          previewText: campaign.preview_text ?? undefined,
          title: campaign.title ?? campaign.subject,
          description: campaign.description ?? undefined,
          imageUrl: campaign.image_url ?? undefined,
          ctaLabel: campaign.cta_label ?? undefined,
          ctaHref: campaign.cta_href ?? undefined,
          recipientName: subscriber.name ?? undefined,
        }),
      )

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "LoyalZ <onboarding@resend.dev>",
        to: subscriber.email,
        subject: campaign.subject,
        html,
      })

      sentCount++
    } catch (err) {
      errors.push(`${subscriber.email}: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const finalStatus = errors.length === subscribers.length ? "failed" : "sent"

  await supabase
    .from("newsletter_campaigns")
    .update({
      status: finalStatus,
      sent_at: new Date().toISOString(),
      sent_count: sentCount,
    })
    .eq("id", id)

  revalidatePath("/admin/newsletter")

  if (errors.length > 0) {
    return {
      success: true,
      sentCount,
      errors,
      warning: `${sentCount}/${subscribers.length} emails enviados. ${errors.length} fallaron.`,
    }
  }

  return { success: true, sentCount }
}
