import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const ADMIN_SESSION_COOKIE = "admin_session"
const ADMIN_LOGIN_PATH = "/admin/login"

// Security headers applied to every response
const SECURITY_HEADERS: Record<string, string> = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
        "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
        "frame-ancestors 'none'",
    ].join("; "),
}

function applySecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // ── Supabase SSR: refresh association session cookies ──────────
    const supabaseResponse = NextResponse.next({ request })
    createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // ── Admin Route Protection ─────────────────────────────────────
    const isAdminRoute = pathname.startsWith("/admin")
    const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH

    if (isAdminRoute && !isAdminLoginPage) {
        const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)

        if (!sessionCookie?.value) {
            const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
            loginUrl.searchParams.set("redirectTo", pathname)
            return applySecurityHeaders(NextResponse.redirect(loginUrl))
        }

        try {
            const session = JSON.parse(sessionCookie.value)

            if (!session.expiresAt || new Date(session.expiresAt) < new Date()) {
                const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
                loginUrl.searchParams.set("reason", "session_expired")
                const res = NextResponse.redirect(loginUrl)
                res.cookies.delete(ADMIN_SESSION_COOKIE)
                return applySecurityHeaders(res)
            }

            if (!["admin", "super_admin"].includes(session.role)) {
                return applySecurityHeaders(NextResponse.redirect(new URL("/", request.url)))
            }
        } catch {
            const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
            const res = NextResponse.redirect(loginUrl)
            res.cookies.delete(ADMIN_SESSION_COOKIE)
            return applySecurityHeaders(res)
        }
    }

    return applySecurityHeaders(supabaseResponse)
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
