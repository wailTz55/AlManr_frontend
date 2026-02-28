"use server"

import { createServiceRoleClient } from "@/lib/supabase/admin"
import type { CreateActivityDTO, UpdateActivityDTO } from "@/types/dto"
import { CreateActivitySchema, UpdateActivitySchema } from "@/types/dto"
import { logAuditEvent } from "./AuditService"

// ============================================================
// Get All Activities (public — also callable from client)
// ============================================================
export async function getActivities() {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activities")
        .select("*")
        .order("date", { ascending: false })

    if (error) throw new Error("[ActivityService] Failed to fetch activities: " + error.message)
    return data ?? []
}

// ============================================================
// Get Single Activity
// ============================================================
export async function getActivity(id: string) {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activities")
        .select("*")
        .eq("id", id)
        .single()

    if (error) throw new Error("[ActivityService] Activity not found: " + error.message)
    return data
}

// ============================================================
// Create Activity (admin only)
// ============================================================
export async function createActivity(
    input: CreateActivityDTO,
    adminId: string
) {
    const parsed = CreateActivitySchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activities")
        .insert({ ...parsed.data, created_by: adminId })
        .select()
        .single()

    if (error) throw new Error("[ActivityService] Failed to create activity: " + error.message)

    await logAuditEvent({
        adminId,
        action: "CREATE_ACTIVITY",
        entityType: "activities",
        entityId: data.id,
        metadata: { title: data.title },
    })

    return data
}

// ============================================================
// Update Activity (admin only)
// ============================================================
export async function updateActivity(
    id: string,
    input: UpdateActivityDTO,
    adminId: string
) {
    const parsed = UpdateActivitySchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activities")
        .update(parsed.data)
        .eq("id", id)
        .select()
        .single()

    if (error) throw new Error("[ActivityService] Failed to update activity: " + error.message)

    await logAuditEvent({
        adminId,
        action: "UPDATE_ACTIVITY",
        entityType: "activities",
        entityId: id,
        metadata: { updatedFields: Object.keys(parsed.data) },
    })

    return data
}

// ============================================================
// Delete Activity (admin only)
// ============================================================
export async function deleteActivity(id: string, adminId: string) {
    const db = createServiceRoleClient()
    const { error } = await db.from("activities").delete().eq("id", id)

    if (error) throw new Error("[ActivityService] Failed to delete activity: " + error.message)

    await logAuditEvent({
        adminId,
        action: "DELETE_ACTIVITY",
        entityType: "activities",
        entityId: id,
        metadata: {},
    })
}
