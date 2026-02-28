import { AdminDashboard } from "@/components/admin-dashboard"
import { getActivities } from "@/services/ActivityService"
import { getNews } from "@/services/NewsService"
import { getAllAssociations } from "@/services/AdminService"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const rawActivities = await getActivities().catch(() => [])
  const rawNews = await getNews().catch(() => [])
  const rawAssociations = await getAllAssociations().catch(() => [])

  const activities = rawActivities.map((a: any) => ({
    ...a,
    type: a.categories?.[0] || "عام",
    capacity: a.max_participants || 0,
    image: (a.images && a.images.length > 0) ? a.images[0] : "/placeholder.svg",
    activityTemplate: a.template || "announcement",
    registered: 0
  }))

  const news = rawNews.map((n: any) => ({
    ...n,
    status: n.published_at ? "published" : "draft",
    publishDate: n.published_at || n.created_at,
    tags: [],
    views: n.views || 0,
  }))

  const associations = rawAssociations.map((a: any) => ({
    id: a.id,
    associationName: a.name,
    institutionName: a.city || "غير محدد",
    presidentName: "غير محدد",
    presidentPhone: a.phone || "غير محدد",
    treasurerName: "غير محدد",
    treasurerPhone: "غير محدد",
    secretaryName: "غير محدد",
    secretaryPhone: "غير محدد",
    email: a.email,
    phone: a.phone || "غير محدد",
    submissionDate: a.created_at,
    status: a.status,
    rejectedAt: a.status === 'rejected' ? a.updated_at : undefined,
    reviewedBy: a.approved_by || "المدير العام",
    reviewDate: a.approved_at,
    notes: a.rejection_reason || undefined
  }))

  return (
    <AdminDashboard
      initialActivities={activities as any}
      initialNews={news as any}
      initialAssociations={associations as any}
    />
  )
}
