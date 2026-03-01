"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { adminLogin } from "@/services/AdminAuthService"
import { Eye, EyeOff, Shield, Loader2, AlertCircle } from "lucide-react"

// ─── Inner form uses useSearchParams → must be wrapped in Suspense ────────────
function AdminLoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirectTo") ?? "/admin"
    const reason = searchParams.get("reason")

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(
        reason === "session_expired" ? "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً." : null
    )

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (loading) return
        setLoading(true)
        setError(null)

        try {
            const result = await adminLogin({ email: email.trim(), password })
            if (result.success) {
                router.push(redirectTo)
                router.refresh()
            } else {
                setError(result.error)
            }
        } catch {
            setError("حدث خطأ غير متوقع. يرجى المحاولة مجدداً.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                {/* Ambient glow */}
                <div
                    aria-hidden="true"
                    className="absolute -inset-1 rounded-2xl blur-xl opacity-20"
                    style={{ background: "linear-gradient(to right, #2563eb, #06b6d4)" }}
                />

                <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                            style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">لوحة التحكم</h1>
                        <p className="text-slate-400 text-sm">دخول مخصص للمشرف فقط</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-300 text-sm" dir="rtl">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="example@domain.com"
                                className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    id="toggle-password"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: "linear-gradient(to right, #2563eb, #06b6d4)" }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>جارٍ التحقق...</span>
                                </>
                            ) : (
                                <span>تسجيل الدخول</span>
                            )}
                        </button>
                    </form>

                    {/* Footer note */}
                    <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
                        <p className="text-slate-500 text-xs">
                            هذه الصفحة محمية ومخصصة للمشرف المعتمد فقط
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Page root — wraps with Suspense for useSearchParams ─────────────────────
export default function AdminLoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            }
        >
            <AdminLoginForm />
        </Suspense>
    )
}
