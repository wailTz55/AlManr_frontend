
import type { Metadata } from "next"
import { ContactPage } from "@/components/contact-page"
import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"

export const metadata: Metadata = {
  title: "اتصل بنا - جمعية المنار للشباب",
  description: "تواصل معنا للاستفسارات والمقترحات أو للحصول على مزيد من المعلومات",
}

export default function ContactPageRoute() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <EnhancedFloatingNavbar />
      <div className="pt-24">
        <ContactPage />
      </div>
    </main>
  )
}
