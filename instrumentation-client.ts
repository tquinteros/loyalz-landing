import posthog from "posthog-js"

const isDev = process.env.NODE_ENV === "development"
const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (isDev) {
  console.log("[PostHog] Initializing...", {
    api_host: host,
    hasToken: Boolean(token),
  })
}

if (!token || !host) {
  if (isDev) {
    console.warn(
      "[PostHog] Skipped init — set NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NEXT_PUBLIC_POSTHOG_HOST in .env.local",
    )
  }
} else {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-01-30",
    debug: isDev,
    loaded: () => {
      if (isDev) {
        console.log("[PostHog] Client loaded — ready to capture events")
      }
    },
  })
}
