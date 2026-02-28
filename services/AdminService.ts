"use server"

import { createServiceRoleClient } from "@/lib/supabase/admin"
import { logAuditEvent } from "./AuditService"
import { getAuditLogs } from "./AuditService"
import { revokeAllAdminSessions } from "./AdminAuthService"

// ============================================================
// Get All Associations (admin)
// ============================================================
export async function getAllAssociations() {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw new Error("[AdminService] Failed to fetch associations: " + error.message)
    return data ?? []
}

// ============================================================
// Approve Association
// ============================================================
export async function approveAssociation(associationId: string, adminId: string) {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .update({
            status: "approved",
            approved_by: adminId,
            approved_at: new Date().toISOString(),
            rejection_reason: null,
        })
        .eq("id", associationId)
        .select()
        .single()

    if (error) throw new Error("[AdminService] Failed to approve association: " + error.message)

    await logAuditEvent({
        adminId,
        action: "APPROVE_ASSOCIATION",
        entityType: "associations",
        entityId: associationId,
        metadata: { name: data.name },
    })

    return data
}

// ============================================================
// Reject Association
// ============================================================
export async function rejectAssociation(
    associationId: string,
    adminId: string,
    reason?: string
) {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .update({
            status: "rejected",
            rejection_reason: reason ?? null,
        })
        .eq("id", associationId)
        .select()
        .single()

    if (error) throw new Error("[AdminService] Failed to reject association: " + error.message)

    await logAuditEvent({
        adminId,
        action: "REJECT_ASSOCIATION",
        entityType: "associations",
        entityId: associationId,
        metadata: { name: data.name, reason },
    })

    return data
}

// ============================================================
// Undo Reject Association (set back to pending)
// ============================================================
export async function undoRejectAssociation(associationId: string, adminId: string) {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .update({
            status: "pending",
            rejection_reason: null,
            approved_by: null,
            approved_at: null,
        })
        .eq("id", associationId)
        .select()
        .single()

    if (error) throw new Error("[AdminService] Failed to undo rejection: " + error.message)

    await logAuditEvent({
        adminId,
        action: "UNDO_REJECT_ASSOCIATION",
        entityType: "associations",
        entityId: associationId,
        metadata: { name: data.name },
    })

    return data
}

// ============================================================
// Suspend Association
// ============================================================
export async function suspendAssociation(associationId: string, adminId: string) {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("associations")
        .update({ status: "suspended" })
        .eq("id", associationId)
        .select()
        .single()

    if (error) throw new Error("[AdminService] Failed to suspend association: " + error.message)

    await logAuditEvent({
        adminId,
        action: "SUSPEND_ASSOCIATION",
        entityType: "associations",
        entityId: associationId,
        metadata: { name: data.name },
    })

    return data
}

// ============================================================
// Delete Association (and associated auth user)
// ============================================================
export async function deleteAssociation(associationId: string, adminId: string) {
    const db = createServiceRoleClient()

    // Get user_id for auth deletion
    const { data: assoc } = await db
        .from("associations")
        .select("user_id, name")
        .eq("id", associationId)
        .single()

    // Delete association record (cascades to registrations)
    const { error } = await db.from("associations").delete().eq("id", associationId)
    if (error) throw new Error("[AdminService] Failed to delete association: " + error.message)

    // Delete auth user if exists
    if (assoc?.user_id) {
        await db.auth.admin.deleteUser(assoc.user_id)
    }

    await logAuditEvent({
        adminId,
        action: "DELETE_ASSOCIATION",
        entityType: "associations",
        entityId: associationId,
        metadata: { name: assoc?.name },
    })
}

// ============================================================
// Get Dashboard Stats
// ============================================================
export async function getDashboardStats() {
    const db = createServiceRoleClient()

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

// ============================================================
// Admin Management
// ============================================================
export async function getAllAdmins(requestingAdminRole: "super_admin" | "admin") {
    if (requestingAdminRole !== "super_admin") {
        throw new Error("Insufficient permissions")
    }
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("admins")
        .select("id, email, name, role, is_active, last_login_at, created_at")
        .order("created_at")

    if (error) throw new Error("[AdminService] Failed to fetch admins: " + error.message)
    return data ?? []
}

export async function deactivateAdmin(adminId: string, requestingAdminId: string, requestingRole: "super_admin" | "admin") {
    if (requestingRole !== "super_admin") throw new Error("Insufficient permissions")

    const db = createServiceRoleClient()
    await db.from("admins").update({ is_active: false }).eq("id", adminId)
    await revokeAllAdminSessions(adminId)

    await logAuditEvent({
        adminId: requestingAdminId,
        action: "DEACTIVATE_ADMIN",
        entityType: "admins",
        entityId: adminId,
        metadata: {},
    })
}

export { getAuditLogs }
