/**
 * getHomePageData — single function for homepage data needs.
 * Uses browser anon client with Promise.all — no server hop, no cold start.
 */
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export interface HomeActivity {
    id: string
    title: string
    date: string
    location: string | null
    description: string | null
    images: string[] | null
    videos: string[] | null
    duration: string | null
    status: string
    categories: string[] | null
    template: string
    allow_association_registration: boolean
    allow_participant_registration: boolean
    max_participants: number | null
}

export interface HomeNews {
    id: string
    title: string
    excerpt: string | null
    content: string
    author: string
    category: string | null
    type: string | null
    icon: string | null
    color: string | null
    bg_color: string | null
    image: string | null
    views: number
    likes: number
    featured: boolean
    published_at: string | null
    created_at: string
}

export interface HomePartner {
    id: string
    name: string
    email: string
    phone: string | null
    description: string | null
    logo_url: string | null
    status: string
}

export interface HomePageData {
    activities: HomeActivity[]
    news: HomeNews[]
    partners: HomePartner[]
}

export async function getHomePageData(): Promise<HomePageData> {
    const db = getSupabaseBrowserClient()

    const [activitiesRes, newsRes, partnersRes] = await Promise.all([
        db
            .from("activities")
            .select("id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants")
            .order("date", { ascending: false })
            .limit(10),
        db
            .from("news")
            .select("id, title, excerpt, content, author, category, type, icon, color, bg_color, image, views, likes, featured, published_at, created_at")
            .not("published_at", "is", null)
            .order("published_at", { ascending: false })
            .limit(10),
        db
            .from("associations")
            .select("id, name, email, phone, description, logo_url, status")
            .eq("status", "approved")
            .order("created_at", { ascending: false }),
    ])

    return {
        activities: (activitiesRes.data ?? []) as HomeActivity[],
        news: (newsRes.data ?? []) as HomeNews[],
        partners: (partnersRes.data ?? []) as HomePartner[],
    }
}
