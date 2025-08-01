import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PageTransitionProvider from "./PageTransitionProvider"
import { FloatingNavbar } from "@/components/ui/floating-navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ESWF",
  description: "Amateur weather forecasting and threat assessment",
  generator: 'v0.dev',
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FloatingNavbar />
          <PageTransitionProvider><main className="pt-14">{children}</main></PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
