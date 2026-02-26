import re

with open('components/registration-page.tsx', 'r') as f:
    content = f.read()

# We need to rewrite the registration form completely.
# Let's generate a full new file to make it cleaner.
new_content = """"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Star, Users, Calendar, Award, ArrowRight, CheckCircle, AlertTriangle, Check, X, FileText } from "lucide-react"

export function RegistrationPage() {
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

  const isFormValid = useMemo(() => {
    const emailValid = formData.email.trim() !== "" && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    const assocPhoneValid = formData.associationPhone.trim() !== "" && /^\\d{10}$/.test(formData.associationPhone.trim())

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
    } else if (!/^\\d{10}$/.test(formData.associationPhone.trim())) {
      newErrors.associationPhone = "رقم الهاتف يجب أن يتكون من 10 أرقام بالضبط"
      hasErrors = true
    }

    if (!formData.officeApproval) {
      newErrors.officeApproval = "موافقة المكتب مطلوبة (صورة أو PDF)"
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // For phone fields, only allow digits and limit to 10 characters
    if (name.includes('Phone') || name === 'phone') {
      const digitsOnly = value.replace(/\\D/g, '')
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
      const digitsOnly = value.replace(/\\D/g, '')
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
      const response = await fetch(`${baseURL}api/registration/`, {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
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
      } else {
        const errorData = await response.json()
        if (errorData.errors) {
          const newErrors = { ...errors }
          Object.keys(errorData.errors).forEach((field) => {
            const fieldErrors = errorData.errors[field]
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              const errorMessage = fieldErrors[0]
              if (errorMessage.includes("already exists") || errorMessage.includes("موجود") || errorMessage.includes("مستخدم")) {
                if (field === "email") newErrors.email = "هذا البريد الإلكتروني مستخدم مسبقاً"
                else if (field === "associationPhone") newErrors.associationPhone = "رقم الهاتف هذا مستخدم مسبقاً"
                else if (field === "associationName") newErrors.associationName = "هذا الاسم مسجل مسبقاً"
                else newErrors[field as keyof typeof errors] = "هذه البيانات مستخدمة مسبقاً"
              } else {
                newErrors[field as keyof typeof errors] = errorMessage
              }
            }
          })
          setErrors(newErrors as any)
        } else if (errorData.message) {
          if (errorData.message.includes("duplicate") || errorData.message.includes("exists") || errorData.message.includes("موجود")) {
            setGeneralError("بعض البيانات المدخلة مستخدمة مسبقاً. يرجى التحقق من البيانات.")
          } else {
            setGeneralError(errorData.message)
          }
        } else {
          setGeneralError("حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.")
        }
      }
    } catch (error) {
      setGeneralError("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    { icon: Users, title: "شبكة واسعة", description: "تواصل مع شباب طموح من جميع أنحاء المنطقة" },
    { icon: Calendar, title: "أنشطة متنوعة", description: "مشاركة في فعاليات وورش عمل مثيرة" },
    { icon: Award, title: "شهادات معتمدة", description: "احصل على شهادات تقدير وإنجاز" },
    { icon: Star, title: "تطوير المهارات", description: "برامج تدريبية لتطوير قدراتك الشخصية والمهنية" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            تسجيل جمعية جديدة
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            انضم إلى شبكة الجمعيات المنار وكن جزءاً من التغيير الإيجابي
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 ">
          <Card className="hover:shadow-lg transition-shadow pt-6 lg:col-span-2">
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

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
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

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
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

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
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

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block">
                      البريد الإلكتروني للجمعية <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" className={`text-right ${(errors.email || (showValidationErrors && !formData.email.trim())) ? 'border-red-300 focus:border-red-500' : ''}`} />
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
                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor="officeApproval" className="text-right block">
                    موافقة المكتب (PDF أو صورة) <span className="text-red-500">*</span>
                  </Label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${
                    (errors.officeApproval || (showValidationErrors && !formData.officeApproval)) ? 'border-red-300 bg-red-50' : 'border-border'
                  }`}>
                    <input id="officeApproval" type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                    <Label htmlFor="officeApproval" className="cursor-pointer">
                      <FileText className={`w-8 h-8 mx-auto mb-2 ${(errors.officeApproval || (showValidationErrors && !formData.officeApproval)) ? 'text-red-400' : 'text-muted-foreground'}`} />
                      <p className={`text-sm ${(errors.officeApproval || (showValidationErrors && !formData.officeApproval)) ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {formData.officeApproval ? formData.officeApproval.name : "اضغط لرفع موافقة المكتب"}
                      </p>
                    </Label>
                  </div>
                  {(errors.officeApproval || (showValidationErrors && !formData.officeApproval)) && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1 justify-end"><X className="w-4 h-4" />{errors.officeApproval || "موافقة المكتب مطلوبة"}</p>
                  )}
                </div>

                {/* Motivation */}
                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor="motivation" className="text-right block">
                    لماذا تريدون الانضمام؟
                  </Label>
                  <Textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleInputChange} placeholder="اذكر دوافع الجمعية للانضمام إلى شبكة المنار..." className="text-right min-h-24" />
                </div>

                <Button 
                  onClick={handleSubmit}
                  className={`w-full transition-all duration-300 ${
                    !isFormValid && !isSubmitting 
                      ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' 
                      : 'opacity-100 cursor-pointer'
                  }`}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      جارٍ الإرسال...
                    </div>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
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

            <Card className="hover:shadow-lg transition-shadow pt-6">
              <CardHeader>
                <CardTitle className="text-2xl text-right">قصص نجاح</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                    <div className="flex flex-row-reverse items-center gap-2 mb-2 justify-start">
                      <Badge variant="secondary">شريك استراتيجي</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-right text-sm text-muted-foreground">
                      "أتاح لنا الانضمام فرصة لتنفيذ مشاريع أكبر وخدمة المجتمع بفعالية."
                    </p>
                    <p className="text-right font-medium mt-2">- جمعية الأمل</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"""

with open('components/registration-page.tsx', 'w') as f:
    f.write(new_content)

print("Updated registration-page.tsx successfully!")
