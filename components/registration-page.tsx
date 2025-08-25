"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Upload, Star, Users, Calendar, Award, ArrowRight, CheckCircle, AlertTriangle, Check, X } from "lucide-react"

export function RegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    interests: "",
    experience: "",
    motivation: "",
    photo: null as File | null,
    id_card: null as File | null,
  })

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    interests: "",
    experience: "",
    motivation: "",
    photo: "",
    id_card: "",
  })

  const [generalError, setGeneralError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    const phoneValid = formData.phone.trim() !== "" && /^\d{10}$/.test(formData.phone.trim())
    const emailValid = formData.email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())

    return (
      formData.fullName.trim() !== "" &&
      emailValid &&
      phoneValid &&
      formData.age.trim() !== "" &&
      formData.interests.trim() !== "" &&
      formData.motivation.trim() !== "" &&
      formData.photo !== null &&
      formData.id_card !== null
    )
  }, [formData])

  const clearMessages = () => {
    setErrors({
      fullName: "",
      email: "",
      phone: "",
      age: "",
      interests: "",
      experience: "",
      motivation: "",
      photo: "",
      id_card: "",
    })
    setGeneralError("")
    setSuccessMessage("")
    setShowValidationErrors(false)
  }

  const validateRequiredFields = () => {
    const newErrors = { ...errors }
    let hasErrors = false

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب"
      hasErrors = true
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
      hasErrors = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة"
      hasErrors = true
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب"
      hasErrors = true
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "رقم الهاتف يجب أن يتكون من 10 أرقام بالضبط"
      hasErrors = true
    }

    if (!formData.age.trim()) {
      newErrors.age = "العمر مطلوب"
      hasErrors = true
    }

    if (!formData.interests.trim()) {
      newErrors.interests = "الاهتمامات مطلوبة"
      hasErrors = true
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = "سبب الانضمام مطلوب"
      hasErrors = true
    }

    if (!formData.photo) {
      newErrors.photo = "الصورة الشخصية مطلوبة"
      hasErrors = true
    }

    if (!formData.id_card) {
      newErrors.id_card = "صورة بطاقة الهوية مطلوبة"
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // For phone field, only allow digits and limit to 10 characters
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: digitsOnly,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // هنا بالضبط أضف الكود الجديد ⬇️⬇️⬇️
    
    // التحقق من البريد الإلكتروني
    if (name === 'email' && value.trim()) {
      setTimeout(() => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            email: "صيغة البريد الإلكتروني غير صحيحة",
          }))
        }
      }, 500)
    }
    
    // التحقق من رقم الهاتف
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length > 0) {
        setTimeout(() => {
          const currentPhone = formData.phone
          if (currentPhone.length > 0 && currentPhone.length < 10) {
            setErrors((prev) => ({
              ...prev,
              phone: "رقم الهاتف يجب أن يتكون من 10 أرقام بالضبط",
            }))
          }
        }, 1000)
      }
    }

    // Clear general validation error state when user starts filling fields
    if (showValidationErrors) {
      setShowValidationErrors(false)
    }
  }
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))
      if (errors.photo) {
        setErrors((prev) => ({
          ...prev,
          photo: "",
        }))
      }
    }
    if (showValidationErrors) {
      setShowValidationErrors(false)
    }
  }

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        id_card: file,
      }))
      if (errors.id_card) {
        setErrors((prev) => ({
          ...prev,
          id_card: "",
        }))
      }
    }
    if (showValidationErrors) {
      setShowValidationErrors(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }

    // If form is not valid, show validation errors
    if (!isFormValid) {
      setShowValidationErrors(true)
      validateRequiredFields()
      setGeneralError("يرجى ملء جميع الحقول المطلوبة قبل الإرسال")
      return
    }

    setIsSubmitting(true)
    clearMessages()

    const formDataToSend = new FormData()
    formDataToSend.append("fullName", formData.fullName)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("phone", formData.phone)
    formDataToSend.append("age", formData.age)
    formDataToSend.append("interests", formData.interests)
    formDataToSend.append("experience", formData.experience)
    formDataToSend.append("motivation", formData.motivation)

    if (formData.photo) {
      formDataToSend.append("photo", formData.photo)
    }
    if (formData.id_card) {
      formDataToSend.append("id_card", formData.id_card)
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/registration/", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        setSuccessMessage("تم إرسال التسجيل بنجاح! سنتواصل معك قريباً.")
        console.log("Server response:", data)
        
        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          age: "",
          interests: "",
          experience: "",
          motivation: "",
          photo: null,
          id_card: null,
        })
      } else {
        const errorData = await response.json()
        console.error("خطأ في الإرسال:", errorData)

        // Handle validation errors for specific fields
        if (errorData.errors) {
          const newErrors = { ...errors }
          
          Object.keys(errorData.errors).forEach((field) => {
            const fieldErrors = errorData.errors[field]
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              const errorMessage = fieldErrors[0]
              
              // Check for duplicate/existing data errors
              if (errorMessage.includes("already exists") || 
                  errorMessage.includes("موجود") || 
                  errorMessage.includes("مستخدم") ||
                  errorMessage.includes("email") ||
                  errorMessage.includes("phone")) {
                
                if (field === "email") {
                  newErrors.email = "هذا البريد الإلكتروني مستخدم مسبقاً"
                } else if (field === "phone") {
                  newErrors.phone = "رقم الهاتف هذا مستخدم مسبقاً"
                } else if (field === "fullName") {
                  newErrors.fullName = "هذا الاسم مسجل مسبقاً"
                } else {
                  newErrors[field as keyof typeof errors] = "هذه البيانات مستخدمة مسبقاً"
                }
              } else {
                // Other validation errors
                newErrors[field as keyof typeof errors] = errorMessage
              }
            }
          })
          
          setErrors(newErrors)
        } else if (errorData.message) {
          // Handle general server messages
          if (errorData.message.includes("duplicate") || 
              errorData.message.includes("exists") ||
              errorData.message.includes("موجود")) {
            setGeneralError("بعض البيانات المدخلة مستخدمة مسبقاً. يرجى التحقق من البيانات.")
          } else {
            setGeneralError(errorData.message)
          }
        } else {
          setGeneralError("حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.")
        }
      }
    } catch (error) {
      console.error("خطأ في الشبكة:", error)
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            انضم إلى عائلة المنار
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ابدأ رحلتك معنا واكتشف إمكانياتك اللامحدودة في بيئة داعمة ومحفزة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-right">نموذج التسجيل</CardTitle>
              <CardDescription className="text-right">
                املأ البيانات التالية للانضمام إلى جمعية المنار للشباب
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6 ">
                {/* Personal Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-right block">
                    الصورة الشخصية <span className="text-red-500">*</span>
                  </Label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${
                    (errors.photo || (showValidationErrors && !formData.photo)) ? 'border-red-300 bg-red-50' : 'border-border'
                  }`}>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Label htmlFor="photo" className="cursor-pointer">
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${(errors.photo || (showValidationErrors && !formData.photo)) ? 'text-red-400' : 'text-muted-foreground'}`} />
                      <p className={`text-sm ${(errors.photo || (showValidationErrors && !formData.photo)) ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {formData.photo ? formData.photo.name : "اضغط لرفع صورتك الشخصية"}
                      </p>
                    </Label>
                  </div>
                  {(errors.photo || (showValidationErrors && !formData.photo)) && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.photo || "الصورة الشخصية مطلوبة"}
                    </p>
                  )}
                </div>

                {/* ID Card Upload */}
                <div className="space-y-2">
                  <Label htmlFor="id_card" className="text-right block">
                    صورة بطاقة الهوية <span className="text-red-500">*</span>
                  </Label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${
                    (errors.id_card || (showValidationErrors && !formData.id_card)) ? 'border-red-300 bg-red-50' : 'border-border'
                  }`}>
                    <input
                      id="id_card"
                      type="file"
                      accept="image/*"
                      onChange={handleIdCardUpload}
                      className="hidden"
                    />
                    <Label htmlFor="id_card" className="cursor-pointer">
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${(errors.id_card || (showValidationErrors && !formData.id_card)) ? 'text-red-400' : 'text-muted-foreground'}`} />
                      <p className={`text-sm ${(errors.id_card || (showValidationErrors && !formData.id_card)) ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {formData.id_card ? formData.id_card.name : "اضغط لرفع صورة بطاقة الهوية"}
                      </p>
                    </Label>
                  </div>
                  {(errors.id_card || (showValidationErrors && !formData.id_card)) && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.id_card || "صورة بطاقة الهوية مطلوبة"}
                    </p>
                  )}
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-right block">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    className={`text-right ${(errors.fullName || (showValidationErrors && !formData.fullName.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {(errors.fullName || (showValidationErrors && !formData.fullName.trim())) && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.fullName || "الاسم الكامل مطلوب"}
                    </p>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className={`text-right ${(errors.email || (showValidationErrors && !formData.email.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                    {(errors.email || (showValidationErrors && !formData.email.trim())) && (
                      <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {errors.email || "البريد الإلكتروني مطلوب"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-right block">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0501234567"
                      className={`text-right ${(errors.phone || (showValidationErrors && (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())))) ? 'border-red-300 focus:border-red-500' : ''}`}
                      maxLength={10}
                      inputMode="numeric"
                    />
                    {(errors.phone || (showValidationErrors && !formData.phone.trim())) && (
                      <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {errors.phone || "رقم الهاتف مطلوب"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-right block">
                    العمر <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="أدخل عمرك"
                    className={`text-right ${(errors.age || (showValidationErrors && !formData.age.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                    min="16"
                    max="35"
                  />
                  {(errors.age || (showValidationErrors && !formData.age.trim())) && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.age || "العمر مطلوب"}
                    </p>
                  )}
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-right block">
                    الاهتمامات <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="اذكر اهتماماتك وهواياتك..."
                    className={`text-right min-h-20 ${(errors.interests || (showValidationErrors && !formData.interests.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {(errors.interests || (showValidationErrors && !formData.interests.trim())) && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.interests || "الاهتمامات مطلوبة"}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-right block">
                    الخبرات السابقة
                  </Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="اذكر خبراتك في العمل التطوعي أو الأنشطة الشبابية..."
                    className={`text-right min-h-20 ${errors.experience ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.experience}
                    </p>
                  )}
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <Label htmlFor="motivation" className="text-right block">
                    لماذا تريد الانضمام؟ <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="اذكر دوافعك للانضمام إلى جمعية المنار..."
                    className={`text-right min-h-24 ${(errors.motivation || (showValidationErrors && !formData.motivation.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {(errors.motivation || (showValidationErrors && !formData.motivation.trim())) && (
                    <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {errors.motivation || "سبب الانضمام مطلوب"}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
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
                      <ArrowRight className="w-4 h-4 ml-2" />
                      إرسال طلب التسجيل
                    </>
                  )}
                </Button>

                {/* Form completion indicator */}
                {!isFormValid && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      يرجى ملء جميع الحقول المطلوبة (المميزة بـ <span className="text-red-500">*</span>) لتمكين زر الإرسال
                    </p>
                  </div>
                )}
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="m-6 p-4 border border-green-200 bg-green-50 text-green-800 rounded-lg flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-right flex-1">
                    <p className="text-sm font-medium">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* General Error Message */}
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

          {/* Benefits Section */}
          <div className="space-y-6 ">
            <Card className="hover:shadow-lg transition-shadow p-6">
              <CardHeader>
                <CardTitle className="text-2xl text-right">مميزات العضوية</CardTitle>
                <CardDescription className="text-right">اكتشف ما ستحصل عليه كعضو في جمعية المنار</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="text-right">
                          <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                          <p className="text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Success Stories */}
            <Card className="hover:shadow-lg transition-shadow ">
              <CardHeader>
                <CardTitle className="text-2xl text-right">قصص نجاح</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">عضو متميز</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-right text-sm text-muted-foreground">
                      "انضمامي لجمعية المنار غير حياتي تماماً. تعلمت مهارات جديدة وكونت صداقات رائعة."
                    </p>
                    <p className="text-right font-medium mt-2">- أحمد محمد</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">قائد فريق</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-right text-sm text-muted-foreground">
                      "الأنشطة والورش التدريبية ساعدتني في تطوير مهاراتي القيادية بشكل كبير."
                    </p>
                    <p className="text-right font-medium mt-2">- فاطمة علي</p>
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