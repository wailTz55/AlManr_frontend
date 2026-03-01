import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Service Role Client — singleton.
 * ONLY use in Server Actions and API Route Handlers.
 * NEVER expose to the browser or client components.
 * This client bypasses RLS entirely.
 */
let _adminClient: ReturnType<typeof createClient<Database>> | null = null

export function getServiceRoleClient(): ReturnType<typeof createClient<Database>> {
    if (!_adminClient) {
        if (!serviceRoleKey) {
            throw new Error("[CRITICAL] SUPABASE_SERVICE_ROLE_KEY is not set.")
        }
        _adminClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
    }
    return _adminClient
}

// Keep backward-compatible alias for any remaining imports
export const createServiceRoleClient = getServiceRoleClient
