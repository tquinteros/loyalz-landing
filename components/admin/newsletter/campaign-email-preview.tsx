"use client"

type CampaignEmailPreviewProps = {
  title?: string
  description?: string
  imageUrl?: string
  ctaLabel?: string
  ctaHref?: string
}

export function CampaignEmailPreview({
  title,
  description,
  imageUrl,
  ctaLabel,
  ctaHref,
}: CampaignEmailPreviewProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        maxWidth: "500px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#0a0a0a",
          padding: "20px 32px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#f8f5ef",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
          }}
        >
          LoyalZ
        </span>
      </div>

      {/* Hero image */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          style={{
            display: "block",
            objectFit: "cover",
            width: "100%",
            maxHeight: "200px",
          }}
        />
      ) : (
        <div
          style={{
            backgroundColor: "#f4f4f5",
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#a1a1aa", fontSize: "12px" }}>Imagen del email</span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "32px" }}>
        {title ? (
          <h2
            style={{
              color: "#09090b",
              fontSize: "22px",
              fontWeight: "700",
              lineHeight: "1.3",
              margin: "0 0 16px 0",
            }}
          >
            {title}
          </h2>
        ) : null}

        {description ? (
          <p
            style={{
              color: "#3f3f46",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: "0 0 24px 0",
            }}
          >
            {description}
          </p>
        ) : null}

        {ctaLabel ? (
          <div style={{ marginTop: "8px" }}>
            <a
              href={ctaHref || "#"}
              style={{
                backgroundColor: "#09090b",
                borderRadius: "6px",
                color: "#ffffff",
                display: "inline-block",
                fontSize: "13px",
                fontWeight: "600",
                padding: "10px 22px",
                textDecoration: "none",
              }}
            >
              {ctaLabel}
            </a>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #e4e4e7",
          padding: "20px 32px",
        }}
      >
        <p
          style={{
            color: "#a1a1aa",
            fontSize: "11px",
            lineHeight: "1.5",
            margin: 0,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} LoyalZ. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
