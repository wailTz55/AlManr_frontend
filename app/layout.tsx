import type React from "react"
import type { Metadata } from "next"
import { Amiri, Cairo } from "next/font/google"
import "./globals.css"

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
})

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "Al-Manar Youth Association",
  description: "Al-Manar Youth Association Website",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable}`}>
      <body className={`${cairo.className} antialiased`}>{children}</body>
    </html>
  )
}
