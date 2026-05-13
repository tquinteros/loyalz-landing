import type { ReactNode } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-landing bg-foreground min-h-screen text-background">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
