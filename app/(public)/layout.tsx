import type { ReactNode } from "react"
import Header from "@/components/header"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
