"use server"

import { getServiceRoleClient } from "@/lib/supabase/admin"

// ============================================================
// Get All Associations (admin)
// ============================================================
export async function getAllAssociations() {
    const db = getServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .select("id, name, email, phone, city, wilaya, status, description, logo_url, rejection_reason, approved_by, approved_at, created_at, updated_at")
        .order("created_at", { ascending: false })

    if (error) throw new Error("[AdminService] Failed to fetch associations: " + error.message)
    return data ?? []
}

// ============================================================
// Approve Association
// ============================================================
export async function approveAssociation(associationId: string) {
    const db = getServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .update({
            status: "approved",
            approved_at: new Date().toISOString(),
            rejection_reason: null,
        })
        .eq("id", associationId)
        .select("id, name, status, approved_at")
        .single()

    if (error) throw new Error("[AdminService] Failed to approve association: " + error.message)
    return data
}

// ============================================================
// Reject Association
// ============================================================
export async function rejectAssociation(associationId: string, reason?: string) {
    const db = getServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .update({
            status: "rejected",
            rejection_reason: reason ?? null,
        })
        .eq("id", associationId)
        .select("id, name, status, rejection_reason")
        .single()

    if (error) throw new Error("[AdminService] Failed to reject association: " + error.message)
    return data
}

// ============================================================
// Undo Reject Association (set back to pending)
// ============================================================
export async function undoRejectAssociation(associationId: string) {
    const db = getServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .update({
            status: "pending",
            rejection_reason: null,
            approved_by: null,
            approved_at: null,
        })
        .eq("id", associationId)
        .select("id, name, status")
        .single()

    if (error) throw new Error("[AdminService] Failed to undo rejection: " + error.message)
    return data
}

// ============================================================
// Delete Association (and associated auth user)
// ============================================================
export async function deleteAssociation(associationId: string) {
    const db = getServiceRoleClient()

    // Get user_id for auth deletion
    const { data: assoc } = await db
        .from("associations")
        .select("user_id")
        .eq("id", associationId)
        .single()

    // Delete association record (cascades to registrations)
    const { error } = await db.from("associations").delete().eq("id", associationId)
    if (error) throw new Error("[AdminService] Failed to delete association: " + error.message)

    // Delete auth user if exists
    if (assoc?.user_id) {
        await db.auth.admin.deleteUser(assoc.user_id)
    }
}

// ============================================================
// Get Dashboard Stats
// ============================================================
export async function getDashboardStats() {
    const db = getServiceRoleClient()

    const [
        { count: totalActivities },
        { count: totalNews },
        { count: totalAssociations },
        { count: pendingAssociations },
        { count: totalRegistrations },
        { count: pendingRegistrations },
    ] = await Promise.all([
        db.from("activities").select("*", { count: "exact", head: true }),
        db.from("news").select("*", { count: "exact", head: true }),
        db.from("associations").select("*", { count: "exact", head: true }),
        db.from("associations").select("*", { count: "exact", head: true }).eq("status", "pending"),
        db.from("activity_registrations").select("*", { count: "exact", head: true }),
        db.from("activity_registrations").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ])

    return {
        totalActivities: totalActivities ?? 0,
        totalNews: totalNews ?? 0,
        totalAssociations: totalAssociations ?? 0,
        pendingAssociations: pendingAssociations ?? 0,
        totalRegistrations: totalRegistrations ?? 0,
        pendingRegistrations: pendingRegistrations ?? 0,
    }
}
