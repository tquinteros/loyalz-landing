import type { Metadata } from "next";
import { Funnel_Display, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "LoyalZ Landing",
  description: "LoyalZ Landing",
};

export const funnel = Funnel_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${funnel.className} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <Header /> */}
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
