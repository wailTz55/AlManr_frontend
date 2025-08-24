import { MembersPage } from "@/components/members-page"
import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"

export default function Members() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <EnhancedFloatingNavbar />
      <div className="pt-24">
        <MembersPage />
      </div>
    </main>
  )
}
