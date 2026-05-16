"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { createPublicClient } from "@/lib/supabase/public"
import { requireAdmin } from "@/lib/actions/admin-guard"
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
  unsubscribe_token: string
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

// ─── Public subscribe ─────────────────────────────────────────────────────────

export type NewsletterSubscribeLocale = "es" | "en"

const SUBSCRIBE_MESSAGES: Record<
  NewsletterSubscribeLocale,
  { invalidEmail: string; alreadySubscribed: string; genericError: string; success: string }
> = {
  es: {
    invalidEmail: "Por favor ingresá un email válido.",
    alreadySubscribed: "Este email ya está suscrito.",
    genericError: "No se pudo procesar tu solicitud. Intenta de nuevo.",
    success: "¡Gracias por suscribirte!",
  },
  en: {
    invalidEmail: "Please enter a valid email address.",
    alreadySubscribed: "This email is already subscribed.",
    genericError: "We couldn't process your request. Please try again.",
    success: "Thanks for subscribing!",
  },
}

function resolveSubscribeLocale(value: unknown): NewsletterSubscribeLocale {
  return value === "en" ? "en" : "es"
}

export async function subscribeToNewsletter(formData: FormData) {
  const locale = resolveSubscribeLocale(formData.get("locale"))
  const messages = SUBSCRIBE_MESSAGES[locale]
  const email = (formData.get("email") as string | null)?.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: messages.invalidEmail }
  }

  // Uses anon client + RLS INSERT policy (see SQL commands below).
  // The admin client is intentionally NOT used here so this public endpoint
  // is constrained by RLS even if the action is called directly.
  const supabase = createPublicClient()

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    locale,
    status: "active",
  })

  if (error) {
    // Unique violation → already subscribed
    if (error.code === "23505") return { error: messages.alreadySubscribed }
    return { error: messages.genericError }
  }

  return { success: true, message: messages.success }
}

// ─── Public unsubscribe (token-based, linked from every email) ────────────────

export async function unsubscribeByToken(token: string) {
  if (!token) return { error: "Token inválido." }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .eq("status", "active")

  if (error) return { error: error.message }
  return { success: true }
}

// ─── Admin: Subscribers ───────────────────────────────────────────────────────

export async function getSubscribers() {
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, locale, status, subscribed_at, unsubscribed_at, unsubscribe_token")
    .order("subscribed_at", { ascending: false })

  if (error) return { error: error.message }
  return { data: data as Subscriber[] }
}

export async function unsubscribeUser(id: string) {
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

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
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

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
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data: data as Campaign[] }
}

export async function getCampaign(id: string) {
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

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
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

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
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

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
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

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
  const guard = await requireAdmin()
  if (guard.error) return { error: guard.error }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { error: "RESEND_API_KEY no está configurado." }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? "https://loyalz.ar" : "http://localhost:3000")

  const supabase = createAdminClient()

  const { data: campaign, error: campaignError } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", id)
    .single()

  if (campaignError || !campaign) return { error: "Campaña no encontrada." }
  if (campaign.status === "sent") return { error: "Esta campaña ya fue enviada." }
  if (campaign.status === "sending") return { error: "Esta campaña ya está siendo enviada." }

  let query = supabase
    .from("newsletter_subscribers")
    .select("id, email, name, locale, unsubscribe_token")
    .eq("status", "active")

  if (campaign.audience !== "all") {
    query = query.eq("locale", campaign.audience)
  }

  const { data: subscribers, error: subscribersError } = await query

  if (subscribersError) return { error: subscribersError.message }
  if (!subscribers || subscribers.length === 0) {
    return { error: "No hay suscriptores activos para este público." }
  }

  await supabase
    .from("newsletter_campaigns")
    .update({ status: "sending" })
    .eq("id", id)

  const resend = new Resend(apiKey)
  let sentCount = 0
  const errors: string[] = []

  for (const subscriber of subscribers) {
    try {
      const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`

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
          unsubscribeUrl,
          locale: (subscriber.locale === "en" ? "en" : "es") as "es" | "en",
        }),
      )

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "LoyalZ <onboarding@resend.dev>",
        to: subscriber.email,
        subject: campaign.subject,
        html,
        headers: {
          // RFC 8058 one-click unsubscribe header (recognized by Gmail, Apple Mail)
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      })

      sentCount++
    } catch (err) {
      errors.push(
        `${subscriber.email}: ${err instanceof Error ? err.message : "Error desconocido"}`,
      )
    }
  }

  const finalStatus = errors.length === subscribers.length ? "failed" : "sent"

  await supabase
    .from("newsletter_campaigns")
    .update({ status: finalStatus, sent_at: new Date().toISOString(), sent_count: sentCount })
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
