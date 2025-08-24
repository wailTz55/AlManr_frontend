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
  title: "جمعية المنار للشباب | Al-Manar Youth Association",
  description: "موقع جمعية المنار للشباب - نحو مستقبل أفضل للشباب العربي",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${cairo.style.fontFamily};
  --font-sans: ${cairo.variable};
  --font-serif: ${amiri.variable};
}
        `}</style>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
