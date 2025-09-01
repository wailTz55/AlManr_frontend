"use client";
import { TreasureMapActivities } from "@/components/treasure-map-activities"
import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"

export default function ActivitiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <EnhancedFloatingNavbar />
      <div className="pt-24">
        <TreasureMapActivities />
      </div>
    </main>
  )
}
