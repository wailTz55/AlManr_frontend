"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Check,
  X,
  AlertTriangle,
} from "lucide-react"

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactReason: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactReason: "",
  })

  const [generalError, setGeneralError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  // Check if all required fields are filled (email is optional)
  const isFormValid = useMemo(() => {
    const phoneValid = formData.phone.trim() !== "" && /^\d{10}$/.test(formData.phone.trim())
    // Email validation only if provided (optional)
    const emailValid = formData.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())

    return (
      formData.name.trim() !== "" &&
      emailValid &&
      phoneValid &&
      formData.subject.trim() !== "" &&
      formData.message.trim() !== "" &&
      formData.contactReason.trim() !== ""
    )
  }, [formData])

  const clearMessages = () => {
    setErrors({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      contactReason: "",
    })
    setGeneralError("")
    setSuccessMessage("")
    setShowValidationErrors(false)
  }

  const validateRequiredFields = () => {
    const newErrors = { ...errors }
    let hasErrors = false

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب"
      hasErrors = true
    }

    // Email validation only if provided (since it's optional)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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

    if (!formData.subject.trim()) {
      newErrors.subject = "الموضوع مطلوب"
      hasErrors = true
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة"
      hasErrors = true
    }

    if (!formData.contactReason.trim()) {
      newErrors.contactReason = "سبب التواصل مطلوب"
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    // Real-time validation for email (only if provided since it's optional)
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
    
    // Real-time validation for phone
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
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("phone", formData.phone)
    formDataToSend.append("subject", formData.subject)
    formDataToSend.append("message", formData.message)
    formDataToSend.append("contactReason", formData.contactReason)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        setSuccessMessage("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.")
        console.log("Server response:", data)
        
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          contactReason: "",
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
                } else if (field === "name") {
                  newErrors.name = "هذا الاسم مسجل مسبقاً"
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

  const contactInfo = [
    {
      icon: Phone,
      title: "الهاتف",
      details: ["+213 676 99 23 13"],
      color: "text-green-500",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      details: ["asso.almanar2024@gmail.com"],
      color: "text-blue-500",
    },
    {
      icon: MapPin,
      title: "العنوان",
      details: ["حي 300 مسكن عين الكبيرة", "سطيف - عين الكبيرة"],
      color: "text-red-500",
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      details: ["-"],
      color: "text-amber-500",
    },
  ]

  const departments = [
    { name: "الإدارة العامة", email: "admin@almanar-youth.org", icon: Users },
    { name: "الأنشطة والفعاليات", email: "activities@almanar-youth.org", icon: Calendar },
    { name: "العضوية والتسجيل", email: "membership@almanar-youth.org", icon: MessageCircle },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61554488265556", color: "text-blue-600" },
    { name: "Twitter", icon: Twitter, url: "#", color: "text-sky-500" },
    { name: "Instagram", icon: Instagram, url: "#", color: "text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, url: "#", color: "text-blue-700" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            تواصل معنا
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتك ومساعدتك في رحلتك مع جمعية المنار
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="animate-slide-up hover-lift pt-6">
              <CardHeader>
                <CardTitle className="text-2xl text-right">أرسل لنا رسالة</CardTitle>
                <CardDescription className="text-right">
                  املأ النموذج التالي وسنتواصل معك في أقرب وقت ممكن
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-right block">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        className={`text-right ${(errors.name || (showValidationErrors && !formData.name.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {(errors.name || (showValidationErrors && !formData.name.trim())) && (
                        <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                          <X className="w-4 h-4" />
                          {errors.name || "الاسم الكامل مطلوب"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-right block">
                        البريد الإلكتروني (اختياري)
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        className={`text-right ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                          <X className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone and Subject */}
                  <div className="grid md:grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-right block">
                        الموضوع <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="موضوع الرسالة"
                        className={`text-right ${(errors.subject || (showValidationErrors && !formData.subject.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {(errors.subject || (showValidationErrors && !formData.subject.trim())) && (
                        <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                          <X className="w-4 h-4" />
                          {errors.subject || "الموضوع مطلوب"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="contactReason" className="text-right block">
                      سبب التواصل <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="contactReason"
                      name="contactReason"
                      value={formData.contactReason}
                      onChange={handleInputChange}
                      className={`w-full p-3 border border-border rounded-md text-right bg-background ${(errors.contactReason || (showValidationErrors && !formData.contactReason.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                    >
                      <option value="">اختر سبب التواصل</option>
                      <option value="membership">استفسار عن العضوية</option>
                      <option value="activities">الأنشطة والفعاليات</option>
                      <option value="partnership">شراكة أو تعاون</option>
                      <option value="complaint">شكوى أو اقتراح</option>
                      <option value="other">أخرى</option>
                    </select>
                    {(errors.contactReason || (showValidationErrors && !formData.contactReason.trim())) && (
                      <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {errors.contactReason || "سبب التواصل مطلوب"}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-right block">
                      الرسالة <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="اكتب رسالتك هنا..."
                      className={`text-right min-h-32 ${(errors.message || (showValidationErrors && !formData.message.trim())) ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                    {(errors.message || (showValidationErrors && !formData.message.trim())) && (
                      <p className="text-sm text-red-600 text-right mt-1 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {errors.message || "الرسالة مطلوبة"}
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
                        <Send className="w-4 h-4 ml-2" />
                        إرسال الرسالة
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

                  {/* Success Message */}
                  {successMessage && (
                    <div className="p-4 border border-green-200 bg-green-50 text-green-800 rounded-lg flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-right flex-1">
                        <p className="text-sm font-medium">{successMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* General Error Message */}
                  {generalError && (
                    <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-right flex-1">
                        <p className="text-sm font-medium">{generalError}</p>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="animate-slide-up hover-lift pt-6" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-xl text-right">معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                      >
                        <div className={`flex-shrink-0 ${info.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <h4 className="font-medium mb-1">{info.title}</h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            {/* <Card className="animate-slide-up hover-lift pt-6" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle className="text-xl text-right">الأقسام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map((dept, index) => {
                    const Icon = dept.icon
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                      >
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="text-right">
                          <h4 className="font-medium text-sm">{dept.name}</h4>
                          <p className="text-xs text-muted-foreground">{dept.email}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card> */}

            {/* Social Media */}
            <Card className="animate-slide-up hover-lift pt-6" style={{ animationDelay: "0.6s" }}>
              <CardHeader>
                <CardTitle className="text-xl text-right">تابعنا على</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start hover-lift animate-fade-in bg-transparent !cursor-pointer"
                        style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                        onClick={() => window.open(social.url, "_blank")}
                      >
                        <Icon className={`w-4 h-4 ml-2 ${social.color}`} />
                        <span className="text-sm">{social.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )}