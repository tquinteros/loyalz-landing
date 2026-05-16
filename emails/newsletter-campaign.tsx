import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "react-email"
import * as React from "react"

type NewsletterCampaignEmailProps = {
  subject?: string
  previewText?: string
  title?: string
  description?: string
  imageUrl?: string
  ctaLabel?: string
  ctaHref?: string
  recipientName?: string
}

export default function NewsletterCampaignEmail({
  previewText = "",
  title = "Novedades de LoyalZ",
  description = "",
  imageUrl,
  ctaLabel,
  ctaHref,
  recipientName,
}: NewsletterCampaignEmailProps) {
  return (
    <Html lang="es">
      <Head />
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>LoyalZ</Text>
          </Section>

          {/* Hero image */}
          {imageUrl ? (
            <Section style={{ padding: "0" }}>
              <Img
                src={imageUrl}
                alt={title}
                width="600"
                style={heroImage}
              />
            </Section>
          ) : null}

          {/* Content */}
          <Section style={content}>
            {recipientName ? (
              <Text style={greeting}>Hola {recipientName},</Text>
            ) : null}

            <Heading style={heading}>{title}</Heading>

            {description ? (
              <Text style={paragraph}>{description}</Text>
            ) : null}

            {ctaLabel && ctaHref ? (
              <Section style={btnContainer}>
                <Button href={ctaHref} style={button}>
                  {ctaLabel}
                </Button>
              </Section>
            ) : null}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} LoyalZ. Todos los derechos reservados.
            </Text>
            <Text style={footerText}>
              Recibiste este email porque te suscribiste al boletín de LoyalZ.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: "40px 0",
}

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
}

const header: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  padding: "24px 40px",
  textAlign: "center",
}

const logoText: React.CSSProperties = {
  color: "#f8f5ef",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "-0.5px",
  margin: 0,
}

const heroImage: React.CSSProperties = {
  display: "block",
  objectFit: "cover",
  width: "100%",
}

const content: React.CSSProperties = {
  padding: "40px",
}

const greeting: React.CSSProperties = {
  color: "#71717a",
  fontSize: "14px",
  marginBottom: "8px",
}

const heading: React.CSSProperties = {
  color: "#09090b",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 20px 0",
}

const paragraph: React.CSSProperties = {
  color: "#3f3f46",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
}

const btnContainer: React.CSSProperties = {
  marginTop: "8px",
}

const button: React.CSSProperties = {
  backgroundColor: "#09090b",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 28px",
  textDecoration: "none",
}

const hr: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "0 40px",
}

const footer: React.CSSProperties = {
  padding: "24px 40px",
}

const footerText: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 4px 0",
  textAlign: "center",
}
