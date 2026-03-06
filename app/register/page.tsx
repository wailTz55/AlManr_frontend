
import type { Metadata } from "next"
import { RegistrationPage } from "@/components/registration-page"
import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"

import { getAssociationSession } from "@/services/AuthService"

export const metadata: Metadata = {
  title: "التسجيل - الرابطة الولائية",
  description: "انضم إلى الرابطة الولائية واكتشف عالماً من الفرص والأنشطة المثيرة",
}

export default async function RegisterPage() {
  const session = await getAssociationSession()

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <EnhancedFloatingNavbar />
      <div className="pt-24">
        <RegistrationPage initialSession={session} />
      </div>
    </main>
  )
}
