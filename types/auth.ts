// ---- Admin Session (stored in HttpOnly cookie) ----
export interface AdminSession {
    adminId: string
    email: string
    name: string | null
    expiresAt: string
}

// ---- Association Session (Supabase Auth) ----
export interface AssociationSession {
    userId: string
    email: string
    associationId: string
    associationName: string
    status: "pending" | "approved" | "rejected" | "suspended"
}

// ---- Auth Result ----
export type AuthResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string }
