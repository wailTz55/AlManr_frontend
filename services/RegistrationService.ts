"use server"

import { createServiceRoleClient } from "@/lib/supabase/admin"
import { CreateRegistrationSchema, AddParticipantSchema, UpdateRegistrationStatusSchema } from "@/types/dto"
import { logAuditEvent } from "./AuditService"

// ============================================================
// Register for Activity (association)
// ============================================================
export async function registerForActivity(
    activityId: string,
    associationId: string,
    notes?: string
) {
    const parsed = CreateRegistrationSchema.safeParse({ activity_id: activityId, notes })
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = createServiceRoleClient()

    // Check activity allows registration
    const { data: activity } = await db
        .from("activities")
        .select("allow_association_registration, max_associations")
        .eq("id", activityId)
        .single()

    if (!activity?.allow_association_registration) {
        throw new Error("هذا النشاط لا يقبل التسجيل")
    }

    // Check max associations limit
    if (activity.max_associations) {
        const { count } = await db
            .from("activity_registrations")
            .select("id", { count: "exact" })
            .eq("activity_id", activityId)
            .in("status", ["pending", "approved"])

        if ((count ?? 0) >= activity.max_associations) {
            throw new Error("اكتمل عدد الجمعيات المسجلة في هذا النشاط")
        }
    }

    const { data, error } = await db
        .from("activity_registrations")
        .insert({
            activity_id: activityId,
            association_id: associationId,
            notes: parsed.data.notes,
            status: "pending",
        })
        .select()
        .single()

    if (error) {
        if (error.code === "23505") throw new Error("لقد قمت بالتسجيل في هذا النشاط مسبقاً")
        throw new Error("[RegistrationService] Registration failed: " + error.message)
    }

    await logAuditEvent({
        action: "ASSOCIATION_REGISTER_ACTIVITY",
        entityType: "activity_registrations",
        entityId: data.id,
        metadata: { activityId, associationId },
    })

    return data
}

// ============================================================
// Get Registrations for Activity (admin)
// ============================================================
export async function getRegistrationsForActivity(activityId: string) {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activity_registrations")
        .select(`
      *,
      associations (id, name, email, phone, wilaya, city),
      activity_participants (*)
    `)
        .eq("activity_id", activityId)
        .order("created_at", { ascending: false })

    if (error) throw new Error("[RegistrationService] Failed to fetch registrations: " + error.message)
    return data ?? []
}

// ============================================================
// Get All Registrations (admin)
// ============================================================
export async function getAllRegistrations() {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activity_registrations")
        .select(`
      *,
      associations (id, name, email, phone),
      activities (id, title, date),
      activity_participants (*)
    `)
        .order("created_at", { ascending: false })

    if (error) throw new Error("[RegistrationService] Failed to fetch all registrations: " + error.message)
    return data ?? []
}

// ============================================================
// Get My Registrations (association)
// ============================================================
export async function getMyRegistrations(associationId: string) {
    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activity_registrations")
        .select(`
      *,
      activities (id, title, date, location),
      activity_participants (*)
    `)
        .eq("association_id", associationId)
        .order("created_at", { ascending: false })

    if (error) throw new Error("[RegistrationService] Failed to fetch registrations: " + error.message)
    return data ?? []
}

// ============================================================
// Update Registration Status (admin)
// ============================================================
export async function updateRegistrationStatus(
    input: { id: string; status: "pending" | "approved" | "rejected" | "cancelled"; rejection_reason?: string },
    adminId: string
) {
    const parsed = UpdateRegistrationStatusSchema.safeParse(input)
    if (!parsed.success) throw new Error(parsed.error.errors[0].message)

    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activity_registrations")
        .update({
            status: parsed.data.status,
            rejection_reason: parsed.data.rejection_reason,
            reviewed_by: adminId,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", parsed.data.id)
        .select()
        .single()

    if (error) throw new Error("[RegistrationService] Status update failed: " + error.message)

    await logAuditEvent({
        adminId,
        action: "UPDATE_REGISTRATION_STATUS",
        entityType: "activity_registrations",
        entityId: parsed.data.id,
        metadata: { newStatus: parsed.data.status, reason: parsed.data.rejection_reason },
    })

    return data
}

// ============================================================
// Add Participants to Registration (association)
// ============================================================
export async function addParticipants(
    participants: Array<{ registration_id: string; name: string; age?: number; category?: string; notes?: string }>,
    associationId: string
) {
    for (const p of participants) {
        const parsed = AddParticipantSchema.safeParse(p)
        if (!parsed.success) throw new Error(parsed.error.errors[0].message)

        // Verify the registration belongs to this association
        const db = createServiceRoleClient()
        const { data: reg } = await db
            .from("activity_registrations")
            .select("id, status")
            .eq("id", p.registration_id)
            .eq("association_id", associationId)
            .single()

        if (!reg) throw new Error("التسجيل غير موجود أو غير مرتبط بجمعيتك")
        if (reg.status !== "approved") throw new Error("يجب أن تكون حالة التسجيل 'مقبول' لإضافة المشاركين")
    }

    const db = createServiceRoleClient()
    const { data, error } = await db
        .from("activity_participants")
        .insert(participants)
        .select()

    if (error) throw new Error("[RegistrationService] Failed to add participants: " + error.message)

    await logAuditEvent({
        action: "ADD_PARTICIPANTS",
        entityType: "activity_participants",
        metadata: { count: participants.length, associationId },
    })

    return data
}
