"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { adminLogin } from "@/services/AdminAuthService"
import { Eye, EyeOff, Shield, Loader2, AlertCircle, LogIn, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
        setLoading(true)
        setError(null)

        try {
            const result = await adminLogin({ email, password })
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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-amber-200/50">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-amber-600">لوحة التحكم الإدارية</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">يرجى تسجيل الدخول للوصول إلى النظام الإداري</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 p-6 pt-4">
                    {/* Error banner */}
                    {error && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm font-medium" dir="rtl">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 mr-1">البريد الإلكتروني</label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="admin@almanar.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pr-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500/20"
                                    required
                                    dir="ltr"
                                />
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 mr-1">كلمة المرور</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500/20"
                                    required
                                    dir="ltr"
                                />
                                <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 h-11 text-base mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    جارٍ التحقق...
                                </>
                            ) : (
                                <>
                                    <LogIn className="ml-2 h-5 w-5" />
                                    تسجيل الدخول
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center p-4">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
        }>
            <AdminLoginForm />
        </Suspense>
    )
}
