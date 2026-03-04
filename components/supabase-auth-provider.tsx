"use client"

import { useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
                router.refresh()
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    return <>{children}</>
}
