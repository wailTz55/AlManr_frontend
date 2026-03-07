import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const ADMIN_LOGIN_PATH = "/admin/login"

const isDev = process.env.NODE_ENV !== "production"

// Next.js requires 'unsafe-inline' + 'unsafe-eval' in dev for HMR/webpack.
// In production these are removed for strict security.
const CSP = isDev
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none';"
    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none';"

// Security headers applied to every response
const SECURITY_HEADERS: Record<string, string> = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Content-Security-Policy": CSP,
}

function applySecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isLoginPage = pathname === ADMIN_LOGIN_PATH
    const isAdminRoute = pathname.startsWith("/admin")

    // Supabase SSR: must propagate refreshed session cookies
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
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Verify the session with Supabase (server-verified, not cached)
    const { data: { user } } = await supabase.auth.getUser()

    if (isAdminRoute) {
        const adminEmail = process.env.ADMIN_EMAIL
        const isAdmin = !!user && !!adminEmail && user.email === adminEmail

        if (isLoginPage) {
            if (isAdmin) {
                // Already logged in as admin → skip the login page, go to dashboard
                // Copy refreshed session cookies onto the redirect so tokens are not lost
                const redirectResponse = NextResponse.redirect(new URL("/admin", request.url))
                supabaseResponse.cookies.getAll().forEach((cookie) => {
                    redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
                })
                return applySecurityHeaders(redirectResponse)
            }
            // Not logged in → show login page (no redirect — this is the key fix)
            return applySecurityHeaders(supabaseResponse)
        }

        // For all other /admin/* routes: must be logged in as admin
        if (!isAdmin) {
            const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
            loginUrl.searchParams.set("redirectTo", pathname)
            // Copy refreshed session cookies onto the redirect so tokens are not lost
            const redirectResponse = NextResponse.redirect(loginUrl)
            supabaseResponse.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
            })
            return applySecurityHeaders(redirectResponse)
        }
    }

    // Authenticated admin or public route — allow through and refresh cookies
    applySecurityHeaders(supabaseResponse)
    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
