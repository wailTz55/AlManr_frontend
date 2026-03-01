"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getServiceRoleClient } from "@/lib/supabase/admin"
import { AdminLoginSchema } from "@/types/dto"
import type { AuthResult } from "@/types/auth"

export interface AdminSession {
    adminId: string   // Supabase Auth user.id
    email: string
    name: string | null
}

// ============================================================
// Admin Login — Supabase Auth signInWithPassword
// ============================================================
export async function adminLogin(
    formData: { email: string; password: string }
): Promise<AuthResult<AdminSession>> {
    const parsed = AdminLoginSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message }
    }
    const { email, password } = parsed.data

    // 1. Check against ADMIN_EMAIL before even touching the DB
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || email !== adminEmail) {
        return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", code: "INVALID_CREDENTIALS" }
    }

    const supabase = await createSupabaseServerClient()

    try {
        // 2. Sign in via Supabase Auth (handles sessions, cookies, refresh tokens automatically)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            // Supabase returns a generic error for invalid credentials — map to Arabic message
            return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", code: "INVALID_CREDENTIALS" }
        }

        if (!data.user) {
            return { success: false, error: "فشل تسجيل الدخول", code: "AUTH_ERROR" }
        }

        const session: AdminSession = {
            adminId: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name ?? null,
        }

        return { success: true, data: session }
    } catch (err) {
        console.error("[AdminAuthService] Login error:", err)
        return { success: false, error: "خطأ في الخادم", code: "SERVER_ERROR" }
    }
}

// ============================================================
// Admin Logout — signs out from Supabase Auth
// ============================================================
export async function adminLogout(): Promise<void> {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
}

// ============================================================
// Get Admin Session — reads Supabase Auth session from cookie,
// verifies user email matches ADMIN_EMAIL
// ============================================================
export async function getAdminSession(): Promise<AdminSession | null> {
    try {
        const supabase = await createSupabaseServerClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) return null

        // Ensure only the designated admin email has admin access
        const adminEmail = process.env.ADMIN_EMAIL
        if (!adminEmail || user.email !== adminEmail) return null

        return {
            adminId: user.id,
            email: user.email!,
            name: user.user_metadata?.name ?? null,
        }
    } catch {
        return null
    }
}

// ============================================================
// Verify Admin Action — Throws error if unauthorized.
// Call at the top of every Server Action.
// ============================================================
export async function verifyAdminAction(): Promise<AdminSession> {
    const session = await getAdminSession()
    if (!session) {
        throw new Error("Unauthorized: Admin session required")
    }
    return session
}

// ============================================================
// Revoke All Admin Sessions — Emergency use only.
// Invalidates every active session for the admin user in Supabase.
// Use this if the admin account is suspected to be compromised.
// ============================================================
export async function revokeAdminSessions(): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getAdminSession()
        if (!session) {
            return { success: false, error: "No active admin session found" }
        }

        const db = getServiceRoleClient()
        // This signs out all devices/sessions for the admin user
        const { error } = await db.auth.admin.signOut(session.adminId, "global")

        if (error) {
            return { success: false, error: error.message }
        }

        // Also clear the current server-side session
        const supabase = await createSupabaseServerClient()
        await supabase.auth.signOut()

        return { success: true }
    } catch (err) {
        console.error("[AdminAuthService] Revoke sessions error:", err)
        return { success: false, error: "Server error during session revocation" }
    }
}
