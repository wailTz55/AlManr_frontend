import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { AllDataResponse, News } from "./type"

/**
 * Limits for homepage sections.
 * Change these values to adjust how many items appear on the homepage.
 */
export const HOMEPAGE_LIMITS = {
    activities: 7,
    news: 10,
    members: 20,
} as const

/**
 * Fetches all public data using browser anon singleton client.
 * Client → Supabase directly (no server hop).
 * Used by non-homepage pages (activities page, news page) where SSR is not applied.
 */
export async function fetchAllData(): Promise<AllDataResponse> {
    const db = getSupabaseBrowserClient()

    const [activitiesResult, newsResult, membersResult] = await Promise.all([
        db
            .from("activities")
            .select("id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants")
            .order("created_at", { ascending: false })
            .limit(HOMEPAGE_LIMITS.activities),
        db
            .from("news")
            .select("id, title, excerpt, author, category, type, icon, color, bg_color, image, views, likes, featured, published_at, created_at")
            .not("published_at", "is", null)
            .order("published_at", { ascending: false })
            .limit(HOMEPAGE_LIMITS.news),
        db
            .from("associations")
            .select("id, name, email, phone, description, logo_url, status")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(HOMEPAGE_LIMITS.members),
    ])

    const activities = (activitiesResult.data ?? []).map((a: any) => ({
        id: a.id,
        title: a.title,
        date: a.date,
        location: a.location ?? "",
        participants: a.max_participants ?? 0,
        duration: a.duration ?? "",
        status: a.status,
        images: a.images ?? [],
        videos: a.videos ?? [],
        description: a.description ?? "",
        achievements: [],
        highlights: [],
        activityTemplate: a.template ?? "announcement",
        allowAssociationRegistration: a.allow_association_registration ?? false,
        allowParticipantRegistration: a.allow_participant_registration ?? false,
        categories: a.categories ?? [],
    }))

    const news = (newsResult.data ?? []).map((n: any) => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt ?? "",
        content: "", // not fetched on homepage — load on detail page only
        date: n.published_at ?? n.created_at,
        time: "",
        author: n.author,
        category: n.category ?? "عام",
        type: n.type ?? "news",
        icon: n.icon ?? "newspaper",
        color: n.color ?? "#3B82F6",
        bgColor: n.bg_color ?? "#EFF6FF",
        image: n.image ?? "",
        views: n.views ?? 0,
        likes: n.likes ?? 0,
        featured: n.featured ?? false,
    }))

    const members = (membersResult.data ?? []).map((m: any) => ({
        id: m.id,
        name: m.name,
        role: "جمعية",
        image: m.logo_url ?? "/placeholder.svg",
        bio: m.description ?? "",
        memberType: "association" as const,
        status: "approved" as const,
    }))

    return { activities, news, members }
}

/**
 * Fetches ONLY the news data for the dedicated News Page.
 * Eliminates redundant payload from the activities and members tables.
 */
export async function fetchNewsData(): Promise<News[]> {
    const db = getSupabaseBrowserClient()

    const { data, error } = await db
        .from("news")
        .select("id, title, excerpt, author, category, type, icon, color, bg_color, image, views, likes, featured, published_at, created_at")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })

    if (error) {
        console.error("Error fetching news list:", error)
        return []
    }

    return (data ?? []).map((n: any) => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt ?? "",
        content: "", // loaded on demand
        date: n.published_at ?? n.created_at,
        time: "",
        author: n.author,
        category: n.category ?? "عام",
        type: n.type ?? "news",
        icon: n.icon ?? "newspaper",
        color: n.color ?? "#3B82F6",
        bgColor: n.bg_color ?? "#EFF6FF",
        image: n.image ?? "",
        views: n.views ?? 0,
        likes: n.likes ?? 0,
        featured: n.featured ?? false,
    }))
}

/**
 * Lazy loads the full content for a single news article.
 * Used when a user clicks on an article to open the modal.
 */
export async function fetchNewsContent(id: number): Promise<string> {
    const db = getSupabaseBrowserClient()
    const { data, error } = await db
        .from("news")
        .select("content")
        .eq("id", id)
        .single()

    if (error) {
        console.error("Error fetching news content:", error)
        return ""
    }
    return (data as any)?.content ?? ""
}
