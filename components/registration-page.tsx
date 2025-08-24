"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Star, Users, Calendar, Award, ArrowRight, CheckCircle } from "lucide-react"

export function RegistrationPage() {
  const [formData, setFormData] = useState({
    // applicationId: "",
    fullName: "",
    email: "",
    phone: "",
    age: "",
    interests: "",
    experience: "",
    motivation: "",
    photo: null as File | null,
    id_card: null as File | null, // ✅ أضفت الحقل هنا
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))
    }
  }
  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        id_card: file,
      }))
    }
  }
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const formDataToSend = new FormData()
  // formDataToSend.append("applicationId", formData.applicationId)
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
      body: formDataToSend, // لازم FormData لإرسال الملفات
    })

    if (response.ok) {
      const data = await response.json()
      alert("تم إرسال التسجيل بنجاح ✅")
      console.log("Server response:", data)
    } else {
      console.error("خطأ في الإرسال:", await response.text())
      alert("حدث خطأ أثناء الإرسال ❌")
    }
  } catch (error) {
    console.error("خطأ في الشبكة:", error)
    alert("تعذر الاتصال بالسيرفر ❌")
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
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            انضم إلى عائلة المنار
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ابدأ رحلتك معنا واكتشف إمكانياتك اللامحدودة في بيئة داعمة ومحفزة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card className="animate-slide-up hover-lift">
            <CardHeader>
              <CardTitle className="text-2xl text-right">نموذج التسجيل</CardTitle>
              <CardDescription className="text-right">
                املأ البيانات التالية للانضمام إلى جمعية المنار للشباب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Application ID */}
                {/* <div className="space-y-2">
                  <Label htmlFor="applicationId" className="text-right block">
                    رقم الطلب
                  </Label>
                  <Input
                    id="applicationId"
                    name="applicationId"
                    value={formData.applicationId}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الطلب"
                    className="text-right"
                    required
                  />
                </div> */}

                {/* Personal Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-right block">
                    الصورة الشخصية
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      required
                    />
                    <Label htmlFor="photo" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formData.photo ? formData.photo.name : "اضغط لرفع صورتك الشخصية"}
                      </p>
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_card" className="text-right block">
                    صورة بطاقة الهوية
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      id="id_card"
                      type="file"
                      accept="image/*"
                      onChange={handleIdCardUpload}
                      className="hidden"
                      required
                    />
                    <Label htmlFor="id_card" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formData.id_card ? formData.id_card.name : "اضغط لرفع صورة بطاقة الهوية"}
                      </p>
                    </Label>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-right block">
                    الاسم الكامل
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    className="text-right"
                    required
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="text-right"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-right block">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+966 50 123 4567"
                      className="text-right"
                      required
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-right block">
                    العمر
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="أدخل عمرك"
                    className="text-right"
                    min="16"
                    max="35"
                    required
                  />
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-right block">
                    الاهتمامات
                  </Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="اذكر اهتماماتك وهواياتك..."
                    className="text-right min-h-20"
                    required
                  />
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
                    className="text-right min-h-20"
                  />
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <Label htmlFor="motivation" className="text-right block">
                    لماذا تريد الانضمام؟
                  </Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="اذكر دوافعك للانضمام إلى جمعية المنار..."
                    className="text-right min-h-24"
                    required
                  />
                </div>

                <Button type="submit" className="w-full animate-pulse-glow">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  إرسال طلب التسجيل
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-6">
            <Card className="animate-slide-up hover-lift" style={{ animationDelay: "0.2s" }}>
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
                        className="flex items-start gap-4 p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.3 + index * 0.1}s` }}
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
            <Card className="animate-slide-up hover-lift" style={{ animationDelay: "0.4s" }}>
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
