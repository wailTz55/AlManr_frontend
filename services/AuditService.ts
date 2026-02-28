"use server"

import { createServiceRoleClient } from "@/lib/supabase/admin"

interface AuditEventInput {
    adminId?: string
    action: string
    entityType: string
    entityId?: string
    metadata?: Record<string, unknown>
    ipAddress?: string
    userAgent?: string
}

/**
 * Log an admin action to the audit_logs table.
 * Always uses the service role client — called only from server actions.
 */
export async function logAuditEvent(event: AuditEventInput): Promise<void> {
    try {
        const db = createServiceRoleClient()
        await db.from("audit_logs").insert({
            admin_id: event.adminId ?? null,
            action: event.action,
            entity_type: event.entityType,
            entity_id: event.entityId ?? null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: (event.metadata ?? {}) as any,
            ip_address: event.ipAddress as unknown as string,
            user_agent: event.userAgent ?? null,
        })
    } catch (err) {
        // Never throw — audit log failure must not break the main operation
        console.error("[AuditService] Failed to log audit event:", err)
    }
}

/**
 * Retrieve audit logs for admin dashboard.
 */
export async function getAuditLogs(options?: {
    limit?: number
    offset?: number
    adminId?: string
    entityType?: string
    action?: string
}) {
    const db = createServiceRoleClient()

    let query = db
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(options?.limit ?? 50)

    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1)
    }
    if (options?.adminId) {
        query = query.eq("admin_id", options.adminId)
    }
    if (options?.entityType) {
        query = query.eq("entity_type", options.entityType)
    }
    if (options?.action) {
        query = query.eq("action", options.action)
    }

    const { data, error } = await query
    if (error) throw new Error("[AuditService] Failed to fetch audit logs: " + error.message)
    return data ?? []
}
