"use server"

import { createServiceRoleClient } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { AdminLoginSchema } from "@/types/dto"
import type { AdminSession, AuthResult } from "@/types/auth"
import { logAuditEvent } from "./AuditService"
import { checkRateLimit } from "./RateLimitService"

const SESSION_COOKIE = "admin_session"
const SESSION_MAX_AGE = 8 * 60 * 60 // 8 hours in seconds

// ============================================================
// Admin Login
// ============================================================
export async function adminLogin(
    formData: { email: string; password: string },
    ipAddress?: string
): Promise<AuthResult<AdminSession>> {
    // 1. Validate input
    const parsed = AdminLoginSchema.safeParse(formData)
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message }
    }
    const { email, password } = parsed.data

    // 2. Rate limit check (5 attempts per IP per minute)
    const rateLimitKey = `admin_login:${ipAddress ?? "unknown"}`
    const rateLimited = await checkRateLimit(rateLimitKey, 5, 60)
    if (rateLimited) {
        return { success: false, error: "محاولات كثيرة. يرجى الانتظار دقيقة.", code: "RATE_LIMITED" }
    }

    const db = createServiceRoleClient()

    try {
        // 3. Find admin by email
        const { data: admin, error } = await db
            .from("admins")
            .select("*")
            .eq("email", email)
            .eq("is_active", true)
            .single()

        if (error || !admin) {
            return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", code: "INVALID_CREDENTIALS" }
        }

        // 4. Check if account is locked
        if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
            return { success: false, error: "الحساب مؤقتاً مقفل. يرجى المحاولة لاحقاً.", code: "ACCOUNT_LOCKED" }
        }

        // 5. Verify password
        const passwordMatch = await bcrypt.compare(password, admin.password_hash)
        if (!passwordMatch) {
            // Increment login attempts
            const attempts = admin.login_attempts + 1
            const updateData: Record<string, unknown> = { login_attempts: attempts }
            if (attempts >= 5) {
                // Lock for 30 minutes
                updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString()
            }
            await db.from("admins").update(updateData).eq("id", admin.id)
            return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", code: "INVALID_CREDENTIALS" }
        }

        // 6. Create session record in DB
        const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString()
        const { data: session, error: sessionError } = await db
            .from("admin_sessions")
            .insert({
                admin_id: admin.id,
                expires_at: expiresAt,
                ip_address: ipAddress as unknown as string,
            })
            .select()
            .single()

        if (sessionError || !session) {
            return { success: false, error: "فشل إنشاء الجلسة", code: "SESSION_ERROR" }
        }

        // 7. Reset login attempts on success
        await db.from("admins").update({
            login_attempts: 0,
            locked_until: null,
            last_login_at: new Date().toISOString(),
        }).eq("id", admin.id)

        // 8. Set HttpOnly cookie
        const cookieStore = await cookies()
        const sessionPayload: AdminSession = {
            adminId: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            sessionToken: session.session_token,
            expiresAt,
        }

        cookieStore.set(SESSION_COOKIE, JSON.stringify(sessionPayload), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: SESSION_MAX_AGE,
            path: "/",
        })

        // 9. Audit log
        await logAuditEvent({
            adminId: admin.id,
            action: "ADMIN_LOGIN",
            entityType: "admins",
            entityId: admin.id,
            ipAddress,
            metadata: { email: admin.email, role: admin.role },
        })

        return { success: true, data: sessionPayload }
    } catch (err) {
        console.error("[AdminService] Login error:", err)
        return { success: false, error: "خطأ في الخادم", code: "SERVER_ERROR" }
    }
}

// ============================================================
// Admin Logout
// ============================================================
export async function adminLogout(): Promise<void> {
    const cookieStore = await cookies()
    const sessionRaw = cookieStore.get(SESSION_COOKIE)?.value

    if (sessionRaw) {
        try {
            const session: AdminSession = JSON.parse(sessionRaw)
            const db = createServiceRoleClient()
            // Revoke session in DB
            await db
                .from("admin_sessions")
                .update({ revoked_at: new Date().toISOString() })
                .eq("session_token", session.sessionToken)

            await logAuditEvent({
                adminId: session.adminId,
                action: "ADMIN_LOGOUT",
                entityType: "admins",
                entityId: session.adminId,
                metadata: {},
            })
        } catch {
            // Silently ignore parse errors
        }
    }

    cookieStore.delete(SESSION_COOKIE)
}

// ============================================================
// Get Admin Session (from cookie)
// ============================================================
export async function getAdminSession(): Promise<AdminSession | null> {
    try {
        const cookieStore = await cookies()
        const raw = cookieStore.get(SESSION_COOKIE)?.value
        if (!raw) return null

        const session: AdminSession = JSON.parse(raw)

        // Check expiry
        if (new Date(session.expiresAt) < new Date()) {
            await adminLogout()
            return null
        }

        // Verify session token exists in DB and is not revoked
        const db = createServiceRoleClient()
        const { data } = await db
            .from("admin_sessions")
            .select("id, revoked_at")
            .eq("session_token", session.sessionToken)
            .single()

        if (!data || data.revoked_at) {
            await adminLogout()
            return null
        }

        return session
    } catch {
        return null
    }
}

// ============================================================
// Revoke All Sessions for Admin (force logout everywhere)
// ============================================================
export async function revokeAllAdminSessions(adminId: string): Promise<void> {
    const db = createServiceRoleClient()
    await db
        .from("admin_sessions")
        .update({ revoked_at: new Date().toISOString() })
        .eq("admin_id", adminId)
        .is("revoked_at", null)
}
