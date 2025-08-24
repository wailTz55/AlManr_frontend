
import type { Metadata } from "next"
import { RegistrationPage } from "@/components/registration-page"
import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"

export const metadata: Metadata = {
  title: "التسجيل - جمعية المنار للشباب",
  description: "انضم إلى جمعية المنار للشباب واكتشف عالماً من الفرص والأنشطة المثيرة",
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <EnhancedFloatingNavbar/>
      <div className="pt-24">
        <RegistrationPage/>
      </div>
    </main>
  )
}
