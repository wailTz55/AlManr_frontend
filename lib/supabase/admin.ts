import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Service Role Client — ONLY use in Server Actions and API Route Handlers.
 * NEVER expose to the browser or client components.
 * This client bypasses RLS entirely.
 */
export function createServiceRoleClient() {
    if (!serviceRoleKey) {
        throw new Error("[CRITICAL] SUPABASE_SERVICE_ROLE_KEY is not set. Server-only operation failed.")
    }
    return createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
