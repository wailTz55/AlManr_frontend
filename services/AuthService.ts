"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/admin"
import { LoginAssociationSchema, RegisterAssociationSchema } from "@/types/dto"
import type { AuthResult, AssociationSession } from "@/types/auth"
import { logAuditEvent } from "./AuditService"
import { checkRateLimit } from "./RateLimitService"

// ============================================================
// Association Register (via Supabase Auth)
// ============================================================
export async function associationRegister(
    formData: unknown,
    ipAddress?: string
): Promise<AuthResult<AssociationSession>> {
    const parsed = RegisterAssociationSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message }
    }
    const { email, password, name, phone, address, city, wilaya, registration_number, description } = parsed.data

    // Rate limit: 5 registrations per IP per 10 minutes
    const rateLimited = await checkRateLimit(`assoc_register:${ipAddress ?? "unknown"}`, 5, 600)
    if (rateLimited) {
        return { success: false, error: "محاولات كثيرة. يرجى الانتظار.", code: "RATE_LIMITED" }
    }

    const supabase = await createSupabaseServerClient()
    const adminDb = createServiceRoleClient()

    try {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
            },
        })

        if (authError) {
            if (authError.code === "user_already_exists") {
                return { success: false, error: "هذا البريد مسجل مسبقاً", code: "EMAIL_EXISTS" }
            }
            return { success: false, error: authError.message, code: "AUTH_ERROR" }
        }

        if (!authData.user) {
            return { success: false, error: "فشل إنشاء الحساب", code: "USER_NOT_CREATED" }
        }

        // 2. Create association profile
        const { data: assoc, error: assocError } = await adminDb
            .from("associations")
            .insert({
                user_id: authData.user.id,
                email,
                name,
                phone,
                address,
                city,
                wilaya,
                registration_number,
                description,
                status: "pending",
            })
            .select()
            .single()

        if (assocError || !assoc) {
            // Rollback auth user if association creation fails
            await adminDb.auth.admin.deleteUser(authData.user.id)
            return { success: false, error: "فشل إنشاء ملف الجمعية", code: "PROFILE_ERROR" }
        }

        await logAuditEvent({
            action: "ASSOCIATION_REGISTER",
            entityType: "associations",
            entityId: assoc.id,
            ipAddress,
            metadata: { email, name },
        })

        return {
            success: true,
            data: {
                userId: authData.user.id,
                email: assoc.email,
                associationId: assoc.id,
                associationName: assoc.name,
                status: assoc.status,
            },
        }
    } catch (err) {
        console.error("[AuthService] Register error:", err)
        return { success: false, error: "خطأ في الخادم", code: "SERVER_ERROR" }
    }
}

// ============================================================
// Association Login (via Supabase Auth)
// ============================================================
export async function associationLogin(
    formData: unknown,
    ipAddress?: string
): Promise<AuthResult<AssociationSession>> {
    const parsed = LoginAssociationSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message }
    }
    const { email, password } = parsed.data

    const rateLimited = await checkRateLimit(`assoc_login:${ipAddress ?? "unknown"}`, 10, 60)
    if (rateLimited) {
        return { success: false, error: "محاولات كثيرة. يرجى الانتظار دقيقة.", code: "RATE_LIMITED" }
    }

    const supabase = await createSupabaseServerClient()
    const adminDb = createServiceRoleClient()

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", code: "INVALID_CREDENTIALS" }
        }

        if (!data.user) {
            return { success: false, error: "فشل تسجيل الدخول", code: "AUTH_ERROR" }
        }

        // Get association profile
        const { data: assoc } = await adminDb
            .from("associations")
            .select("id, name, email, status")
            .eq("user_id", data.user.id)
            .single()

        if (!assoc) {
            await supabase.auth.signOut()
            return { success: false, error: "لم يتم العثور على ملف الجمعية", code: "NO_PROFILE" }
        }

        await logAuditEvent({
            action: "ASSOCIATION_LOGIN",
            entityType: "associations",
            entityId: assoc.id,
            ipAddress,
            metadata: { email },
        })

        return {
            success: true,
            data: {
                userId: data.user.id,
                email: assoc.email,
                associationId: assoc.id,
                associationName: assoc.name,
                status: assoc.status,
            },
        }
    } catch (err) {
        console.error("[AuthService] Login error:", err)
        return { success: false, error: "خطأ في الخادم", code: "SERVER_ERROR" }
    }
}

// ============================================================
// Association Logout
// ============================================================
export async function associationLogout(): Promise<void> {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
}

// ============================================================
// Get Association Session (from Supabase cookie session)
// ============================================================
export async function getAssociationSession(): Promise<AssociationSession | null> {
    try {
        const supabase = await createSupabaseServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return null

        const adminDb = createServiceRoleClient()
        const { data: assoc } = await adminDb
            .from("associations")
            .select("id, name, email, status")
            .eq("user_id", user.id)
            .single()

        if (!assoc) return null

        return {
            userId: user.id,
            email: assoc.email,
            associationId: assoc.id,
            associationName: assoc.name,
            status: assoc.status,
        }
    } catch {
        return null
    }
}
