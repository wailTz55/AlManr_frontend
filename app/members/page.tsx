// import { MembersPage } from "@/components/members-page"
// import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"
import { redirect } from "next/navigation"

export default function Members() {
  redirect("/")

  /*
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <EnhancedFloatingNavbar />
      <div className="pt-24">
        <MembersPage />
      </div>
    </main>
  )
  */
}
