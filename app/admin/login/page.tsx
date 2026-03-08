"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { adminLogin } from "@/services/AdminAuthService"
import { Eye, EyeOff, Shield, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="relative bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 mb-4 shadow-sm">
                            <Shield className="w-8 h-8 text-amber-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">لوحة التحكم</h1>
                        <p className="text-gray-500 text-sm">دخول مخصص للمشرف فقط</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-red-800 text-sm font-medium" dir="rtl">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                />
                                <button
                                    type="button"
                                    id="toggle-password"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            id="login-submit"
                            type="submit"
                            isLoading={loading}
                            disabled={loading}
                            className="w-full text-white font-semibold flex items-center justify-center gap-2 h-12 shadow-md bg-amber-600 hover:bg-amber-700 rounded-xl"
                        >
                            تسجيل الدخول
                        </Button>
                    </form>

                    {/* Footer note */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-500 text-xs">
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
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                </div>
            }
        >
            <AdminLoginForm />
        </Suspense>
    )
}
