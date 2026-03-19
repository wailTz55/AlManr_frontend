import { createSupabaseServerClient } from "@/lib/supabase/server"
import { HOMEPAGE_LIMITS } from "@/app/api/api"
import type { Activity, News } from "@/app/api/type"

/**
 * Server-side homepage data fetcher.
 * Called from app/page.tsx (React Server Component).
 * Runs on the server — data arrives in the initial HTML, zero client fetch waterfall.
 * Cached by Next.js ISR (revalidate = 60 in page.tsx).
 *
 * To change how many items appear on the homepage, edit HOMEPAGE_LIMITS in app/api/api.ts.
 */
export async function fetchHomepageData(): Promise<{
    activities: Activity[]
    news: News[]
}> {
    const db = await createSupabaseServerClient()

    const [activitiesResult, newsResult] = await Promise.all([
        db
            .from("activities")
            .select(
                "id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants"
            )
            .order("created_at", { ascending: false })
            .limit(HOMEPAGE_LIMITS.activities),

        db
            .from("news")
            .select(
                "id, title, excerpt, author, category, type, icon, color, bg_color, image, views, likes, featured, published_at, created_at"
            )
            .not("published_at", "is", null)
            .order("published_at", { ascending: false })
            .limit(HOMEPAGE_LIMITS.news),
    ])

    const activities: Activity[] = (activitiesResult.data ?? []).map((a: any) => ({
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

    const news: News[] = (newsResult.data ?? []).map((n: any) => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt ?? "",
        content: "", // not fetched on homepage — loaded on detail page only
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

    return { activities, news }
}

/**
 * Server-side dedicated news fetcher.
 * Used by app/news/page.tsx to provide SSR caching for the news page.
 */
export async function fetchServerNewsData(): Promise<News[]> {
    const db = await createSupabaseServerClient()

    const { data, error } = await db
        .from("news")
        .select(
            "id, title, excerpt, author, category, type, icon, color, bg_color, image, views, likes, featured, published_at, created_at"
        )
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })

    if (error) {
        console.error("Error fetching server news list:", error)
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
