import type { Enums, Tables } from "./database"

// ---- User Roles ----
export type UserRole = Enums<"user_role">

// ---- Admin Session (stored in HttpOnly cookie) ----
export interface AdminSession {
    adminId: string
    email: string
    name: string | null
    role: UserRole
    sessionToken: string
    expiresAt: string
}

// ---- Association Session (Supabase Auth) ----
export interface AssociationSession {
    userId: string
    email: string
    associationId: string
    associationName: string
    status: Enums<"association_status">
}

// ---- Auth Result ----
export type AuthResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string }

// ---- Admin Row (safe — no password_hash) ----
export type SafeAdmin = Omit<Tables<"admins">, "password_hash" | "login_attempts" | "locked_until">

// ---- Association Row (safe) ----
export type SafeAssociation = Omit<Tables<"associations">, "approved_by">
