import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton for client components
let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
    if (!browserClient) {
        browserClient = createClient()
    }
    return browserClient
}
