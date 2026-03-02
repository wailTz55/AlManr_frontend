import { TreasureMapActivities } from "@/components/treasure-map-activities";
import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar";
import { Suspense } from "react";
import { getAssociationSession } from "@/services/AuthService";

export default async function ActivitiesPage() {
  const session = await getAssociationSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <EnhancedFloatingNavbar />
      <div className="pt-24">
        <Suspense fallback={<div className="text-center py-12">...جاري التحميل</div>}>
          <TreasureMapActivities session={session} />
        </Suspense>
      </div>
    </main>
  );
}
