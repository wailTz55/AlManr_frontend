"use server"

import { createServiceRoleClient } from "@/lib/supabase/admin"

/**
 * Simple DB-backed rate limiter using the rate_limits table.
 * Returns true if the rate limit is exceeded.
 *
 * @param key - Unique key for this rate limit (e.g., "admin_login:127.0.0.1")
 * @param maxHits - Maximum number of allowed hits within the window
 * @param windowSeconds - Time window in seconds
 */
export async function checkRateLimit(
    key: string,
    maxHits: number,
    windowSeconds: number
): Promise<boolean> {
    try {
        const db = createServiceRoleClient()
        const now = new Date()
        const windowStart = new Date(now.getTime() - windowSeconds * 1000).toISOString()

        // Upsert: if the key exists and window hasn't expired, increment hits
        // Otherwise, reset
        const { data: existing } = await db
            .from("rate_limits")
            .select("*")
            .eq("key", key)
            .single()

        if (!existing || existing.window_start < windowStart) {
            // Reset / create new window
            await db.from("rate_limits").upsert({
                key,
                hits: 1,
                window_start: now.toISOString(),
            }, { onConflict: "key" })
            return false
        }

        // Increment hits
        const newHits = existing.hits + 1
        await db.from("rate_limits")
            .update({ hits: newHits })
            .eq("key", key)

        return newHits > maxHits
    } catch (err) {
        // On error, don't rate limit (fail open to avoid blocking legit users)
        console.error("[RateLimitService] Error:", err)
        return false
    }
}
