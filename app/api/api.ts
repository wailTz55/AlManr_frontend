import { createClient } from "@supabase/supabase-js"
import type { AllDataResponse } from "./type"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getSupabaseClient() {
    return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Fetches all public data (activities, news, members/associations) from Supabase.
 * Uses the anon key — only returns data allowed by RLS (public SELECT policies).
 */
export async function fetchAllData(): Promise<AllDataResponse> {
    const db = getSupabaseClient()

    const [activitiesResult, newsResult, membersResult] = await Promise.all([
        db
            .from("activities")
            .select("id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants")
            .order("date", { ascending: false }),
        db
            .from("news")
            .select("id, title, excerpt, content, author, category, type, icon, color, bg_color, image, views, likes, featured, published_at, created_at")
            .not("published_at", "is", null)
            .order("published_at", { ascending: false }),
        db
            .from("associations")
            .select("id, name, email, phone, description, logo_url, status")
            .eq("status", "approved")
            .order("created_at", { ascending: false }),
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
        content: n.content,
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
