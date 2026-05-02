import type { ReactNode } from "react"
import Header from "@/components/header"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-landing min-h-screen text-background">
      <Header />
      {children}
    </div>
  )
}
