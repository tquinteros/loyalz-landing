"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

export function HomePageView() {
  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development"

    if (isDev) {
      console.log("[PostHog] Capturing home_page_view")
    }

    posthog.capture("home_page_view")

    if (isDev) {
      console.log("[PostHog] home_page_view sent (check Network tab for requests to your PostHog host)")
    }
  }, [])

  return null
}
