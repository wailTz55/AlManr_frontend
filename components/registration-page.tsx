"use client"
import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, Star, Users, Calendar, Award, ArrowRight, CheckCircle, AlertTriangle, Check, X, FileText, LogIn, LogOut, Loader2 } from "lucide-react"

export function RegistrationPage() {
  const [activeTab, setActiveTab] = useState("register")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Registration State
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
    associationPhone: "",
    motivation: "",
    officeApproval: null as File | null,
  })

  // Login State
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [loginError, setLoginError] = useState("")
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false)

  const [errors, setErrors] = useState({
    associationName: "",
    organizationName: "",
    presidentName: "",
    presidentPhone: "",
    secretaryName: "",
    secretaryPhone: "",
    clerkName: "",
    clerkPhone: "",
    email: "",
    associationPhone: "",
    motivation: "",
    officeApproval: "",
  })

  const [generalError, setGeneralError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/";

  // Check login state on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem("almanar_session")
    if (sessionToken) {
      setIsLoggedIn(true)
    }
  }, [])

  const isFormValid = useMemo(() => {
    const emailValid = formData.email.trim() !== "" && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    const assocPhoneValid = formData.associationPhone.trim() !== "" && /^\d{10}$/.test(formData.associationPhone.trim())

    return (
      formData.associationName.trim() !== "" &&
      formData.organizationName.trim() !== "" &&
      formData.presidentName.trim() !== "" &&
      formData.secretaryName.trim() !== "" &&
      formData.clerkName.trim() !== "" &&
      emailValid &&
      assocPhoneValid &&
      formData.officeApproval !== null
    )
  }, [formData])

  const clearMessages = () => {
    setErrors({
      associationName: "",
      organizationName: "",
      presidentName: "",
      presidentPhone: "",
      secretaryName: "",
      secretaryPhone: "",
      clerkName: "",
      clerkPhone: "",
      email: "",
      associationPhone: "",
      motivation: "",
      officeApproval: "",
    })
    setGeneralError("")
    setSuccessMessage("")
    setShowValidationErrors(false)
  }

  const validateRequiredFields = () => {
    const newErrors = { ...errors }
    let hasErrors = false

    if (!formData.associationName.trim()) {
      newErrors.associationName = "اسم الجمعية مطلوب"
      hasErrors = true
    }

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "اسم الهيئة مطلوب"
      hasErrors = true
    }

    if (!formData.presidentName.trim()) {
      newErrors.presidentName = "اسم رئيس الجمعية مطلوب"
      hasErrors = true
    }

    if (!formData.secretaryName.trim()) {
      newErrors.secretaryName = "اسم الأمين العام مطلوب"
      hasErrors = true
    }

    if (!formData.clerkName.trim()) {
      newErrors.clerkName = "اسم الكاتب العام مطلوب"
      hasErrors = true
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
      hasErrors = true
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة"
      hasErrors = true
    }

    if (!formData.associationPhone.trim()) {
      newErrors.associationPhone = "رقم هاتف الجمعية مطلوب"
      hasErrors = true
    } else if (!/^\d{10}$/.test(formData.associationPhone.trim())) {
      newErrors.associationPhone = "رقم الهاتف يجب أن يتكون من 10 أرقام بالضبط"
      hasErrors = true
    }

    if (!formData.officeApproval) {
      newErrors.officeApproval = "اعتماد المكتب(صورة أو PDF)"
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // For phone fields, only allow digits and limit to 10 characters
    if (name.includes('Phone') || name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Validation
    if (name === 'email' && value.trim()) {
      setTimeout(() => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          setErrors((prev) => ({ ...prev, email: "صيغة البريد الإلكتروني غير صحيحة" }))
        }
      }, 500)
    }

    if ((name.includes('Phone') || name === 'phone') && value.trim()) {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length > 0) {
        setTimeout(() => {
          if (formData[name as keyof typeof formData] && String(formData[name as keyof typeof formData]).length > 0 && String(formData[name as keyof typeof formData]).length < 10) {
            setErrors((prev) => ({
              ...prev,
              [name]: "رقم الهاتف يجب أن يتكون من 10 أرقام بالضبط",
            }))
          }
        }, 1000)
      }
    }

    if (showValidationErrors) {
      setShowValidationErrors(false)
    }
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    if (loginError) setLoginError("")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, officeApproval: file }))
      if (errors.officeApproval) {
        setErrors((prev) => ({ ...prev, officeApproval: "" }))
      }
    }
    if (showValidationErrors) {
      setShowValidationErrors(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()

    if (!isFormValid) {
      setShowValidationErrors(true)
      validateRequiredFields()
      setGeneralError("يرجى ملء جميع الحقول المطلوبة قبل الإرسال")
      return
    }

    setIsSubmitting(true)
    clearMessages()

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formDataToSend.append(key, value as string | Blob)
      }
    })

    try {
      /* API Disconnected for testing - simulate a success response */
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccessMessage("تم إرسال التسجيل بنجاح! سنتواصل معك قريباً.")

      setFormData({
        associationName: "",
        organizationName: "",
        presidentName: "",
        presidentPhone: "",
        secretaryName: "",
        secretaryPhone: "",
        clerkName: "",
        clerkPhone: "",
        email: "",
        associationPhone: "",
        motivation: "",
        officeApproval: null,
      })

    } catch (error) {
      setGeneralError("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
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

    setIsLoginSubmitting(true)

    try {
      // Simulate API call to Supabase or custom backend
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // For demo purposes, we accept any valid email format as "successful login"
          // In a real app, you would check credentials here
          if (loginData.password.length < 6) {
            reject(new Error("كلمة المرور خاطئة"))
          } else {
            resolve({ token: "simulated_token_123", email: loginData.email })
          }
        }, 1000)
      })

      // On Success
      localStorage.setItem("almanar_session", "simulated_token_123")
      // Dispatch storage event to notify other components (like Navbar)
      window.dispatchEvent(new Event("storage"))
      setIsLoggedIn(true)
      setLoginData({ email: "", password: "" })

    } catch (error: any) {
      setLoginError(error.message || "فشل تسجيل الدخول. تأكد من بياناتك.")
    } finally {
      setIsLoginSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("almanar_session")
    window.dispatchEvent(new Event("storage"))
    setIsLoggedIn(false)
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
            <CardTitle className="text-2xl font-bold">مرحباً بك!</CardTitle>
            <CardDescription>
              أنت مسجل الدخول حالياً في بوابة الجمعيات
            </CardDescription>
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

              <TabsContent value="login" className="mt-0 animate-fade-in">
                <Card className="hover:shadow-lg transition-shadow pt-6 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-right">تسجيل الدخول للجمعيات</CardTitle>
                    <CardDescription className="text-right">
                      مرحباً بعودتك! أدخل بياناتك للوصول إلى لوحة التحكم
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail" className="text-right block">البريد الإلكتروني</Label>
                        <Input
                          id="loginEmail"
                          name="email"
                          type="email"
                          placeholder="example@association.com"
                          className="text-right"
                          value={loginData.email}
                          onChange={handleLoginInputChange}
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loginPassword" className="text-right block">كلمة المرور</Label>
                        <Input
                          id="loginPassword"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className="text-right"
                          value={loginData.password}
                          onChange={handleLoginInputChange}
                          dir="ltr"
                        />
                      </div>

                      {loginError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-right flex items-center gap-2 justify-end">
                          <span>{loginError}</span>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-all !cursor-pointer"
                        disabled={isLoginSubmitting}
                      >
                        {isLoginSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                            جاري تسجيل الدخول...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-5 h-5 ml-2" />
                            تسجيل الدخول
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register" className="mt-0 animate-fade-in">
                <Card className="hover:shadow-lg transition-shadow pt-6">
                  <CardHeader>
                    <CardTitle className="text-2xl text-right">نموذج التسجيل</CardTitle>
                    <CardDescription className="text-right">
                      املأ البيانات التالية لتسجيل الجمعية
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="associationName" className="text-right block">
                            اسم الجمعية <span className="text-red-500">*</span>
                          </Label>
                          <Input id="associationName" name="associationName" value={formData.associationName} onChange={handleInputChange} placeholder="أدخل اسم الجمعية" className={`text-right ${(errors.associationName || (showValidationErrors && !formData.associationName.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} />
                          {(errors.associationName || (showValidationErrors && !formData.associationName.trim())) && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.associationName || "اسم الجمعية مطلوب"}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organizationName" className="text-right block">
                            اسم الهيئة <span className="text-red-500">*</span>
                          </Label>
                          <Input id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleInputChange} placeholder="أدخل اسم الهيئة" className={`text-right ${(errors.organizationName || (showValidationErrors && !formData.organizationName.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} />
                          {(errors.organizationName || (showValidationErrors && !formData.organizationName.trim())) && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.organizationName || "اسم الهيئة مطلوب"}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="presidentName" className="text-right block">
                            اسم رئيس الجمعية <span className="text-red-500">*</span>
                          </Label>
                          <Input id="presidentName" name="presidentName" value={formData.presidentName} onChange={handleInputChange} placeholder="اسم الرئيس" className={`text-right ${(errors.presidentName || (showValidationErrors && !formData.presidentName.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} />
                          {(errors.presidentName || (showValidationErrors && !formData.presidentName.trim())) && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.presidentName || "اسم رئيس الجمعية مطلوب"}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="presidentPhone" className="text-right block">
                            رقم هاتف رئيس الجمعية
                          </Label>
                          <Input id="presidentPhone" name="presidentPhone" value={formData.presidentPhone} onChange={handleInputChange} placeholder="0501234567" className={`text-right ${errors.presidentPhone ? 'border-red-300 focus:border-red-500' : ''}`} maxLength={10} inputMode="numeric" />
                          {errors.presidentPhone && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.presidentPhone}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="secretaryName" className="text-right block">
                            اسم الأمين العام <span className="text-red-500">*</span>
                          </Label>
                          <Input id="secretaryName" name="secretaryName" value={formData.secretaryName} onChange={handleInputChange} placeholder="اسم الأمين العام" className={`text-right ${(errors.secretaryName || (showValidationErrors && !formData.secretaryName.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} />
                          {(errors.secretaryName || (showValidationErrors && !formData.secretaryName.trim())) && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.secretaryName || "اسم الأمين العام مطلوب"}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secretaryPhone" className="text-right block">
                            رقم هاتف الأمين العام
                          </Label>
                          <Input id="secretaryPhone" name="secretaryPhone" value={formData.secretaryPhone} onChange={handleInputChange} placeholder="0501234567" className={`text-right ${errors.secretaryPhone ? 'border-red-300 focus:border-red-500' : ''}`} maxLength={10} inputMode="numeric" />
                          {errors.secretaryPhone && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.secretaryPhone}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="clerkName" className="text-right block">
                            اسم الكاتب العام <span className="text-red-500">*</span>
                          </Label>
                          <Input id="clerkName" name="clerkName" value={formData.clerkName} onChange={handleInputChange} placeholder="اسم الكاتب العام" className={`text-right ${(errors.clerkName || (showValidationErrors && !formData.clerkName.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} />
                          {(errors.clerkName || (showValidationErrors && !formData.clerkName.trim())) && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.clerkName || "اسم الكاتب العام مطلوب"}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clerkPhone" className="text-right block">
                            رقم هاتف الكاتب العام
                          </Label>
                          <Input id="clerkPhone" name="clerkPhone" value={formData.clerkPhone} onChange={handleInputChange} placeholder="0501234567" className={`text-right ${errors.clerkPhone ? 'border-red-300 focus:border-red-500' : ''}`} maxLength={10} inputMode="numeric" />
                          {errors.clerkPhone && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.clerkPhone}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-right block">
                            البريد الإلكتروني للجمعية <span className="text-red-500">*</span>
                          </Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" className={`text-right ${(errors.email || (showValidationErrors && !formData.email.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} dir="ltr" />
                          {(errors.email || (showValidationErrors && !formData.email.trim())) && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.email || "البريد الإلكتروني مطلوب"}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="associationPhone" className="text-right block">
                            رقم هاتف الجمعية <span className="text-red-500">*</span>
                          </Label>
                          <Input id="associationPhone" name="associationPhone" value={formData.associationPhone} onChange={handleInputChange} placeholder="0501234567" className={`text-right ${(errors.associationPhone || (showValidationErrors && !formData.associationPhone.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} maxLength={10} inputMode="numeric" />
                          {(errors.associationPhone || (showValidationErrors && !formData.associationPhone.trim())) && (
                            <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.associationPhone || "رقم الهاتف مطلوب"}</p>
                          )}
                        </div>
                      </div>

                      {/* Office Approval Upload */}
                      <div dir="rtl" className="space-y-2 pt-4">
                        <Label htmlFor="officeApproval" className="text-right block">
                          اعتماد المكتب(PDF أو صورة) <span className="text-red-500">*</span>
                        </Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${(errors.officeApproval || (showValidationErrors && !formData.officeApproval)) ? 'border-red-300 bg-red-50' : 'border-border'
                          }`}>
                          <input id="officeApproval" type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                          <Label htmlFor="officeApproval" className="cursor-pointer">
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${(errors.officeApproval || (showValidationErrors && !formData.officeApproval)) ? 'text-red-400' : 'text-muted-foreground'}`} />
                            <p className={`text-sm ${(errors.officeApproval || (showValidationErrors && !formData.officeApproval)) ? 'text-red-600' : 'text-muted-foreground'}`}>
                              {formData.officeApproval ? formData.officeApproval.name : "اضغط لرفع اعتماد المكتب"}
                            </p>
                          </Label>
                        </div>
                        {(errors.officeApproval || (showValidationErrors && !formData.officeApproval)) && (
                          <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.officeApproval || " اعتماد المكتب مطلوبة"}</p>
                        )}
                      </div>

                      {/* Motivation */}
                      <div className="space-y-2 pt-4">
                        <Label htmlFor="motivation" className="text-right block">
                          لماذا تريدون الانضمام؟
                        </Label>
                        <Textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleInputChange} placeholder="اذكر دوافع الجمعية للانضمام إلى شبكة المنار..." className="text-right min-h-24" />
                      </div>

                      <Button
                        onClick={handleSubmit}
                        className={`w-full transition-all text-lg py-6 duration-300 hover:shadow-lg !cursor-pointer ${!isFormValid && !isSubmitting
                          ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400'
                          : 'opacity-100'
                          }`}
                        disabled={!isFormValid || isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current-transparent rounded-full animate-spin" />
                            جارٍ الإرسال...
                          </div>
                        ) : (
                          <>
                            <ArrowRight className="w-5 h-5 mr-2" />
                            إرسال طلب التسجيل
                          </>
                        )}
                      </Button>

                      {!isFormValid && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            يرجى ملء جميع الحقول المطلوبة (المميزة بـ <span className="text-red-500">*</span>) لتمكين زر الإرسال
                          </p>
                        </div>
                      )}
                    </div>

                    {successMessage && (
                      <div className="m-6 p-4 border border-green-200 bg-green-50 text-green-800 rounded-lg flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-right flex-1">
                          <p className="text-sm font-medium">{successMessage}</p>
                        </div>
                      </div>
                    )}

                    {generalError && (
                      <div className="m-6 p-4 border border-red-200 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-right flex-1">
                          <p className="text-sm font-medium">{generalError}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

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
