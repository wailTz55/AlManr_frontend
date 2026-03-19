"use server"

import { getServiceRoleClient } from "@/lib/supabase/admin"
import type { CreateActivityDTO, UpdateActivityDTO } from "@/types/dto"
import { CreateActivitySchema, UpdateActivitySchema } from "@/types/dto"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// ============================================================
// Get All Activities (public — browser client, no server hop)
// ============================================================
export async function getActivities() {
    const db = getSupabaseBrowserClient()
    const { data, error } = await db
        .from("activities")
        .select("id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants, wilaya, created_at")
        .order("created_at", { ascending: false })

    if (error) throw new Error("[ActivityService] Failed to fetch activities: " + error.message)
    return data ?? []
}

// ============================================================
// Get Single Activity (public)
// ============================================================
export async function getActivity(id: string) {
    const db = getSupabaseBrowserClient()
    const { data, error } = await db
        .from("activities")
        .select("id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants, wilaya, achievements, highlights, end_date")
        .eq("id", id)
        .single()

    if (error) throw new Error("[ActivityService] Activity not found: " + error.message)
    return data
}

// ============================================================
// Create Activity (admin only — service role, bypasses RLS)
// ============================================================
export async function createActivity(input: CreateActivityDTO) {
    const parsed = CreateActivitySchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = getServiceRoleClient()
    const { data, error } = await db
        .from("activities")
        .insert({ ...parsed.data })
        .select("id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants, wilaya")
        .single()

    if (error) throw new Error("[ActivityService] Failed to create activity: " + error.message)
    return data
}

// ============================================================
// Update Activity (admin only)
// ============================================================
export async function updateActivity(id: string, input: UpdateActivityDTO) {
    const parsed = UpdateActivitySchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = getServiceRoleClient()
    const { data, error } = await db
        .from("activities")
        .update(parsed.data)
        .eq("id", id)
        .select("id, title, date, location, description, images, videos, duration, status, categories, template, allow_association_registration, allow_participant_registration, max_participants, wilaya")
        .single()

    if (error) throw new Error("[ActivityService] Failed to update activity: " + error.message)
    return data
}

// ============================================================
// Delete Activity (admin only)
// ============================================================
export async function deleteActivity(id: string) {
    const db = getServiceRoleClient()
    const { error } = await db.from("activities").delete().eq("id", id)
    if (error) throw new Error("[ActivityService] Failed to delete activity: " + error.message)
}
