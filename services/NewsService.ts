"use server"

import { createServiceRoleClient } from "@/lib/supabase/admin"
import type { CreateNewsDTO, UpdateNewsDTO } from "@/types/dto"
import { CreateNewsSchema, UpdateNewsSchema } from "@/types/dto"
import { logAuditEvent } from "./AuditService"

// ============================================================
// Get All News
// ============================================================
export async function getNews() {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("news")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw new Error("[NewsService] Failed to fetch news: " + error.message)
    return data ?? []
}

// ============================================================
// Get Single News Item
// ============================================================
export async function getNewsItem(id: string) {
    const db = createServiceRoleClient()
    const { data, error } = await db.from("news").select("*").eq("id", id).single()
    if (error) throw new Error("[NewsService] News item not found: " + error.message)
    return data
}

// ============================================================
// Create News (admin only)
// ============================================================
export async function createNews(input: CreateNewsDTO, adminId: string) {
    const parsed = CreateNewsSchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("news")
        .insert({
            ...parsed.data,
            created_by: adminId,
            published_at: parsed.data.published_at ?? new Date().toISOString(),
        })
        .select()
        .single()

    if (error) throw new Error("[NewsService] Failed to create news: " + error.message)

    await logAuditEvent({
        adminId,
        action: "CREATE_NEWS",
        entityType: "news",
        entityId: data.id,
        metadata: { title: data.title },
    })

    return data
}

// ============================================================
// Update News (admin only)
// ============================================================
export async function updateNews(id: string, input: UpdateNewsDTO, adminId: string) {
    const parsed = UpdateNewsSchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("news")
        .update(parsed.data)
        .eq("id", id)
        .select()
        .single()

    if (error) throw new Error("[NewsService] Failed to update news: " + error.message)

    await logAuditEvent({
        adminId,
        action: "UPDATE_NEWS",
        entityType: "news",
        entityId: id,
        metadata: { updatedFields: Object.keys(parsed.data) },
    })

    return data
}

// ============================================================
// Delete News (admin only)
// ============================================================
export async function deleteNews(id: string, adminId: string) {
    const db = createServiceRoleClient()
    const { error } = await db.from("news").delete().eq("id", id)
    if (error) throw new Error("[NewsService] Failed to delete news: " + error.message)

    await logAuditEvent({
        adminId,
        action: "DELETE_NEWS",
        entityType: "news",
        entityId: id,
        metadata: {},
    })
}

// ============================================================
// Increment Views
// ============================================================
export async function incrementNewsViews(id: string) {
    const db = createServiceRoleClient()
    const { data } = await db.from("news").select("views").eq("id", id).single()
    if (data) {
        await db.from("news").update({ views: data.views + 1 }).eq("id", id)
    }
}
