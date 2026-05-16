import { Suspense } from "react"
import { unsubscribeByToken } from "@/lib/actions/newsletter"
import type { Metadata } from "next"
import { UnsubscribeView, UnsubscribeSkeleton } from "./unsubscribe-view"

export const metadata: Metadata = {
  title: "Unsubscribe — LoyalZ",
  robots: { index: false },
}

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default function UnsubscribePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<UnsubscribeSkeleton />}>
      <UnsubscribeServer searchParams={searchParams} />
    </Suspense>
  )
}

async function UnsubscribeServer({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return <UnsubscribeView state="invalid" />
  }

  const result = await unsubscribeByToken(token)

  return <UnsubscribeView state={result.error ? "error" : "success"} />
}
