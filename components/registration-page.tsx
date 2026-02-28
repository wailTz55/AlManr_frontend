"use client"
import type React from "react"
import { useState, useMemo, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Star, Users, Calendar, Award, ArrowRight, CheckCircle, AlertTriangle, Check, X, FileText, LogIn, LogOut, Loader2, Eye, EyeOff } from "lucide-react"
import { registerAssociationAction, loginAssociationAction, logoutAssociationAction } from "@/app/register/actions"
import { useToast } from "@/hooks/use-toast"

export function RegistrationPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("register")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInName, setLoggedInName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [isPendingReg, startRegTransition] = useTransition()
  const [isPendingLogin, startLoginTransition] = useTransition()

  // --- Registration State ---
  const [formData, setFormData] = useState({
    associationName: "",
    organizationName: "",
    presidentName: "",
    presidentPhone: "",
    secretaryName: "",
    secretaryPhone: "",
    clerkName: "",
    clerkPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
    associationPhone: "",
    wilaya: "",
    city: "",
    registrationNumber: "",
    motivation: "",
    officeApproval: null as File | null,
  })

  const [regErrors, setRegErrors] = useState<Record<string, string>>({})
  const [regSuccess, setRegSuccess] = useState("")
  const [regGeneralError, setRegGeneralError] = useState("")
  const [showRegValidation, setShowRegValidation] = useState(false)

  // --- Login State ---
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState("")

  // Check if a Supabase session exists (stored by SSR cookies) via localStorage fallback
  useEffect(() => {
    const session = localStorage.getItem("almanar_assoc_session")
    if (session) {
      try {
        const parsed = JSON.parse(session)
        setIsLoggedIn(true)
        setLoggedInName(parsed.name || "")
      } catch { }
    }
  }, [])

  const isFormValid = useMemo(() => {
    const emailOk = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    const phoneOk = /^\d{10}$/.test(formData.associationPhone.trim())
    const passOk = formData.password.length >= 8
    const passMatchOk = formData.password === formData.confirmPassword
    return (
      formData.associationName.trim() !== "" &&
      formData.organizationName.trim() !== "" &&
      formData.presidentName.trim() !== "" &&
      formData.secretaryName.trim() !== "" &&
      formData.clerkName.trim() !== "" &&
      emailOk && phoneOk && passOk && passMatchOk
    )
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const phoneFields = ["presidentPhone", "secretaryPhone", "clerkPhone", "associationPhone"]
    if (phoneFields.includes(name)) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: digitsOnly }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    setRegErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, officeApproval: file }))
      setRegErrors(prev => ({ ...prev, officeApproval: "" }))
    }
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))
    if (loginError) setLoginError("")
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.associationName.trim()) newErrors.associationName = "اسم الجمعية مطلوب"
    if (!formData.organizationName.trim()) newErrors.organizationName = "اسم الهيئة مطلوب"
    if (!formData.presidentName.trim()) newErrors.presidentName = "اسم رئيس الجمعية مطلوب"
    if (!formData.secretaryName.trim()) newErrors.secretaryName = "اسم الأمين العام مطلوب"
    if (!formData.clerkName.trim()) newErrors.clerkName = "اسم الكاتب العام مطلوب"
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة"
    }
    if (!formData.associationPhone.trim()) {
      newErrors.associationPhone = "رقم هاتف الجمعية مطلوب"
    } else if (!/^\d{10}$/.test(formData.associationPhone.trim())) {
      newErrors.associationPhone = "رقم الهاتف يجب أن يتكون من 10 أرقام"
    }
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة"
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين"
    }
    setRegErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()

    if (!validateForm()) {
      setShowRegValidation(true)
      setRegGeneralError("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setRegGeneralError("")
    setRegSuccess("")

    // Build description from extra fields
    const descriptionParts = [
      `الهيئة: ${formData.organizationName}`,
      `رئيس الجمعية: ${formData.presidentName}${formData.presidentPhone ? ` (${formData.presidentPhone})` : ""}`,
      `الأمين العام: ${formData.secretaryName}${formData.secretaryPhone ? ` (${formData.secretaryPhone})` : ""}`,
      `الكاتب العام: ${formData.clerkName}${formData.clerkPhone ? ` (${formData.clerkPhone})` : ""}`,
      formData.motivation ? `الدوافع: ${formData.motivation}` : "",
    ].filter(Boolean).join("\n")

    startRegTransition(async () => {
      try {
        const result = await registerAssociationAction({
          name: formData.associationName,
          email: formData.email,
          password: formData.password,
          phone: formData.associationPhone,
          city: formData.city || undefined,
          wilaya: formData.wilaya || undefined,
          registration_number: formData.registrationNumber || undefined,
          description: descriptionParts,
        })

        if (!result.success) {
          setRegGeneralError(result.error || "حدث خطأ غير متوقع")
          return
        }

        // Success
        setRegSuccess("تم إرسال طلب التسجيل بنجاح! سيتم مراجعته من قِبل الإدارة وسيتم التواصل معكم.")
        toast({
          title: "تم الإرسال بنجاح",
          description: "طلب تسجيل جمعيتك قيد المراجعة الآن",
        })
        setFormData({
          associationName: "", organizationName: "", presidentName: "", presidentPhone: "",
          secretaryName: "", secretaryPhone: "", clerkName: "", clerkPhone: "",
          email: "", password: "", confirmPassword: "", associationPhone: "",
          wilaya: "", city: "", registrationNumber: "", motivation: "", officeApproval: null,
        })
        setShowRegValidation(false)
      } catch (err: any) {
        setRegGeneralError(err.message || "خطأ في الخادم. يرجى المحاولة لاحقاً.")
      }
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginData.email || !loginData.password) {
      setLoginError("يرجى إدخال البريد الإلكتروني وكلمة المرور")
      return
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(loginData.email)) {
      setLoginError("صيغة البريد الإلكتروني غير صحيحة")
      return
    }

    startLoginTransition(async () => {
      try {
        const result = await loginAssociationAction({ email: loginData.email, password: loginData.password })

        if (!result.success) {
          setLoginError(result.error || "فشل تسجيل الدخول. تأكد من بياناتك.")
          return
        }

        // Store session info in localStorage for UI state
        localStorage.setItem("almanar_assoc_session", JSON.stringify({
          name: result.data?.associationName ?? "",
          email: result.data?.email ?? "",
          status: result.data?.status ?? "",
        }))
        window.dispatchEvent(new Event("storage"))
        setIsLoggedIn(true)
        setLoggedInName(result.data?.associationName ?? "")
        setLoginData({ email: "", password: "" })
        toast({
          title: "مرحباً بك!",
          description: `تم تسجيل دخول ${result.data?.associationName ?? "الجمعية"} بنجاح`,
        })
      } catch (err: any) {
        setLoginError(err.message || "خطأ في الخادم. يرجى المحاولة لاحقاً.")
      }
    })
  }

  const handleLogout = async () => {
    localStorage.removeItem("almanar_assoc_session")
    window.dispatchEvent(new Event("storage"))
    setIsLoggedIn(false)
    setLoggedInName("")
    await logoutAssociationAction()
  }

  const benefits = [
    { icon: Users, title: "شبكة واسعة", description: "تواصل مع شباب طموح من جميع أنحاء المنطقة" },
    { icon: Calendar, title: "أنشطة متنوعة", description: "مشاركة في فعاليات وورش عمل مثيرة" },
    { icon: Award, title: "شهادات معتمدة", description: "احصل على شهادات تقدير وإنجاز" },
    { icon: Star, title: "تطوير المهارات", description: "برامج تدريبية لتطوير قدراتك الشخصية والمهنية" },
  ]

  if (isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-primary/5 py-20 px-4">
        <Card className="max-w-md w-full text-center shadow-lg border-primary/20 animate-fade-in">
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">مرحباً{loggedInName ? `، ${loggedInName}` : ""}!</CardTitle>
            <CardDescription>أنت مسجل الدخول حالياً في بوابة الجمعيات</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              يمكنك إدارة بيانات جمعيتك والوصول إلى الخدمات الحصرية لأعضاء المنار.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleLogout} variant="outline" className="gap-2 !cursor-pointer">
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const fieldError = (name: string) =>
    regErrors[name] || (showRegValidation && !formData[name as keyof typeof formData] ? "هذا الحقل مطلوب" : "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            بوابة الجمعيات المنار
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            انضم إلى شبكة الجمعيات المنار أو قم بتسجيل الدخول لإدارة حسابك
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="register" value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-lg py-3 !cursor-pointer">
                  إنشاء حساب
                </TabsTrigger>
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-lg py-3 !cursor-pointer">
                  تسجيل الدخول
                </TabsTrigger>
              </TabsList>

              {/* ==================== LOGIN TAB ==================== */}
              <TabsContent value="login" className="mt-0 animate-fade-in">
                <Card className="hover:shadow-lg transition-shadow pt-6 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-right">تسجيل الدخول للجمعيات</CardTitle>
                    <CardDescription className="text-right">مرحباً بعودتك! أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail" className="text-right block">البريد الإلكتروني</Label>
                        <Input
                          id="loginEmail" name="email" type="email"
                          placeholder="example@association.com"
                          className="text-right" value={loginData.email}
                          onChange={handleLoginInputChange} dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loginPassword" className="text-right block">كلمة المرور</Label>
                        <div className="relative">
                          <Input
                            id="loginPassword" name="password" type={showPassword ? "text" : "password"}
                            placeholder="••••••••" className="text-right pr-10"
                            value={loginData.password} onChange={handleLoginInputChange} dir="ltr"
                          />
                          <button
                            type="button"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {loginError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-right flex items-center gap-2 justify-end">
                          <span>{loginError}</span>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}

                      <Button type="submit" className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-all !cursor-pointer" disabled={isPendingLogin}>
                        {isPendingLogin ? (
                          <><Loader2 className="w-5 h-5 ml-2 animate-spin" />جاري تسجيل الدخول...</>
                        ) : (
                          <><LogIn className="w-5 h-5 ml-2" />تسجيل الدخول</>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ==================== REGISTER TAB ==================== */}
              <TabsContent value="register" className="mt-0 animate-fade-in">
                <Card className="hover:shadow-lg transition-shadow pt-6">
                  <CardHeader>
                    <CardTitle className="text-2xl text-right">نموذج التسجيل</CardTitle>
                    <CardDescription className="text-right">
                      املأ البيانات التالية لتسجيل الجمعية — سيتم مراجعة طلبك من قِبل الإدارة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">

                      {/* Association & Organization Names */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="associationName" className="text-right block">اسم الجمعية <span className="text-red-500">*</span></Label>
                          <Input id="associationName" name="associationName" value={formData.associationName} onChange={handleInputChange} placeholder="أدخل اسم الجمعية" className={`text-right ${fieldError("associationName") ? "border-red-300" : ""}`} />
                          {fieldError("associationName") && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{fieldError("associationName")}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organizationName" className="text-right block">اسم الهيئة الوصية <span className="text-red-500">*</span></Label>
                          <Input id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleInputChange} placeholder="أدخل اسم الهيئة" className={`text-right ${fieldError("organizationName") ? "border-red-300" : ""}`} />
                          {fieldError("organizationName") && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{fieldError("organizationName")}</p>}
                        </div>
                      </div>

                      {/* President */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="presidentName" className="text-right block">اسم رئيس الجمعية <span className="text-red-500">*</span></Label>
                          <Input id="presidentName" name="presidentName" value={formData.presidentName} onChange={handleInputChange} placeholder="اسم الرئيس" className={`text-right ${fieldError("presidentName") ? "border-red-300" : ""}`} />
                          {fieldError("presidentName") && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{fieldError("presidentName")}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="presidentPhone" className="text-right block">رقم هاتف رئيس الجمعية</Label>
                          <Input id="presidentPhone" name="presidentPhone" value={formData.presidentPhone} onChange={handleInputChange} placeholder="0501234567" className="text-right" maxLength={10} inputMode="numeric" />
                        </div>
                      </div>

                      {/* Secretary */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="secretaryName" className="text-right block">اسم الأمين العام <span className="text-red-500">*</span></Label>
                          <Input id="secretaryName" name="secretaryName" value={formData.secretaryName} onChange={handleInputChange} placeholder="اسم الأمين العام" className={`text-right ${fieldError("secretaryName") ? "border-red-300" : ""}`} />
                          {fieldError("secretaryName") && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{fieldError("secretaryName")}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secretaryPhone" className="text-right block">رقم هاتف الأمين العام</Label>
                          <Input id="secretaryPhone" name="secretaryPhone" value={formData.secretaryPhone} onChange={handleInputChange} placeholder="0501234567" className="text-right" maxLength={10} inputMode="numeric" />
                        </div>
                      </div>

                      {/* Clerk */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clerkName" className="text-right block">اسم الكاتب العام <span className="text-red-500">*</span></Label>
                          <Input id="clerkName" name="clerkName" value={formData.clerkName} onChange={handleInputChange} placeholder="اسم الكاتب العام" className={`text-right ${fieldError("clerkName") ? "border-red-300" : ""}`} />
                          {fieldError("clerkName") && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{fieldError("clerkName")}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clerkPhone" className="text-right block">رقم هاتف الكاتب العام</Label>
                          <Input id="clerkPhone" name="clerkPhone" value={formData.clerkPhone} onChange={handleInputChange} placeholder="0501234567" className="text-right" maxLength={10} inputMode="numeric" />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-right block">البريد الإلكتروني للجمعية <span className="text-red-500">*</span></Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" className={`text-right ${regErrors.email ? "border-red-300" : ""}`} dir="ltr" />
                          {regErrors.email && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{regErrors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="associationPhone" className="text-right block">رقم هاتف الجمعية <span className="text-red-500">*</span></Label>
                          <Input id="associationPhone" name="associationPhone" value={formData.associationPhone} onChange={handleInputChange} placeholder="0501234567" className={`text-right ${regErrors.associationPhone ? "border-red-300" : ""}`} maxLength={10} inputMode="numeric" />
                          {regErrors.associationPhone && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{regErrors.associationPhone}</p>}
                        </div>
                      </div>

                      {/* Wilaya & City */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="wilaya" className="text-right block">الولاية</Label>
                          <Input id="wilaya" name="wilaya" value={formData.wilaya} onChange={handleInputChange} placeholder="ولاية سطيف مثلاً" className="text-right" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-right block">البلدية</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="البلدية" className="text-right" />
                        </div>
                      </div>

                      {/* Registration Number */}
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber" className="text-right block">رقم تسجيل الجمعية</Label>
                        <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="رقم الإعتماد الرسمي" className="text-right" />
                      </div>

                      {/* Password */}
                      <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-right block">كلمة المرور <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <Input
                              id="password" name="password" type={showRegPassword ? "text" : "password"}
                              value={formData.password} onChange={handleInputChange}
                              placeholder="8 أحرف على الأقل" className={`text-right pr-10 ${regErrors.password ? "border-red-300" : ""}`} dir="ltr"
                            />
                            <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowRegPassword(!showRegPassword)}>
                              {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {regErrors.password && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{regErrors.password}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور <span className="text-red-500">*</span></Label>
                          <Input
                            id="confirmPassword" name="confirmPassword" type="password"
                            value={formData.confirmPassword} onChange={handleInputChange}
                            placeholder="••••••••" className={`text-right ${regErrors.confirmPassword ? "border-red-300" : ""}`} dir="ltr"
                          />
                          {regErrors.confirmPassword && <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{regErrors.confirmPassword}</p>}
                        </div>
                      </div>

                      {/* Office Approval Upload */}
                      <div dir="rtl" className="space-y-2">
                        <Label htmlFor="officeApproval" className="text-right block">
                          اعتماد المكتب (PDF أو صورة)
                        </Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${regErrors.officeApproval ? "border-red-300 bg-red-50" : "border-border"}`}>
                          <input id="officeApproval" type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                          <Label htmlFor="officeApproval" className="cursor-pointer">
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${regErrors.officeApproval ? "text-red-400" : "text-muted-foreground"}`} />
                            <p className={`text-sm ${regErrors.officeApproval ? "text-red-600" : "text-muted-foreground"}`}>
                              {formData.officeApproval ? formData.officeApproval.name : "اضغط لرفع اعتماد المكتب"}
                            </p>
                          </Label>
                        </div>
                      </div>

                      {/* Motivation */}
                      <div className="space-y-2">
                        <Label htmlFor="motivation" className="text-right block">لماذا تريدون الانضمام؟</Label>
                        <Textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleInputChange} placeholder="اذكر دوافع الجمعية للانضمام إلى شبكة المنار..." className="text-right min-h-24" />
                      </div>

                      <Button
                        onClick={handleSubmit}
                        className={`w-full transition-all text-lg py-6 duration-300 hover:shadow-lg !cursor-pointer ${!isFormValid && !isPendingReg ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
                        disabled={!isFormValid || isPendingReg}
                      >
                        {isPendingReg ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            جارٍ الإرسال...
                          </div>
                        ) : (
                          <><ArrowRight className="w-5 h-5 mr-2" />إرسال طلب التسجيل</>
                        )}
                      </Button>

                      {!isFormValid && (
                        <p className="text-sm text-muted-foreground text-center">
                          يرجى ملء جميع الحقول المطلوبة (المميزة بـ <span className="text-red-500">*</span>) لتمكين زر الإرسال
                        </p>
                      )}
                    </div>

                    {regSuccess && (
                      <div className="m-6 p-4 border border-green-200 bg-green-50 text-green-800 rounded-lg flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-right flex-1">{regSuccess}</p>
                      </div>
                    )}

                    {regGeneralError && (
                      <div className="m-6 p-4 border border-red-200 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-right flex-1">{regGeneralError}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="hover:shadow-lg transition-shadow p-6">
              <CardHeader>
                <CardTitle className="text-2xl text-right">مميزات الانضمام</CardTitle>
                <CardDescription className="text-right">اكتشف ما ستحصل عليه الجمعية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon
                    return (
                      <div key={index} className="flex flex-row-reverse items-start gap-4 p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors text-right">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                          <p className="text-muted-foreground text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
