import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const ADMIN_LOGIN_PATH = "/admin/login"

// Security headers applied to every response
const SECURITY_HEADERS: Record<string, string> = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Content-Security-Policy":
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: blob: https:; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
        "frame-ancestors 'none';",
}

function applySecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Must use the Supabase SSR middleware pattern so the session cookie
    // gets refreshed on every request (access token rotation).
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Propagate refreshed cookies to both the request and response
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // getUser() verifies the JWT with Supabase servers — never trust a cached user
    const { data: { user } } = await supabase.auth.getUser()

    // Not logged in — redirect to login page
    if (!user) {
        const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
        loginUrl.searchParams.set("redirectTo", pathname)
        return applySecurityHeaders(NextResponse.redirect(loginUrl))
    }

    // Extra authorization check: only the designated ADMIN_EMAIL may access /admin/*
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || user.email !== adminEmail) {
        // A non-admin Supabase user tried to access the admin panel — sign them out
        await supabase.auth.signOut()
        return applySecurityHeaders(
            NextResponse.redirect(new URL("/", request.url))
        )
    }

    // All checks passed — apply security headers and forward
    applySecurityHeaders(supabaseResponse)
    return supabaseResponse
}

export const config = {
    // Only intercept /admin/* routes
    matcher: ["/admin/:path*"],
}
