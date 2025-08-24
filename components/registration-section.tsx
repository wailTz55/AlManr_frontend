"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Mail, Phone, User, FileText, Upload, CheckCircle } from "lucide-react"

export function RegistrationSection() {
  const [formData, setFormData] = useState({
    applicationId: "",
    name: "",
    age: "",
    phone: "",
    email: "",
    reason: "",
    interests: "",
    personalPhoto: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, personalPhoto: file }))
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-bounce-gentle mb-8">
            <CheckCircle className="w-24 h-24 text-secondary mx-auto" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-6">تم التسجيل بنجاح!</h2>
          <p className="text-xl text-muted-foreground mb-8">شكراً لانضمامك إلى عائلة المنار. سنتواصل معك قريباً</p>
          <Button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                applicationId: "",
                name: "",
                age: "",
                phone: "",
                email: "",
                reason: "",
                interests: "",
                personalPhoto: null,
              })
            }}
            className="animate-pulse-glow"
          >
            تسجيل عضو جديد
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">انضم إلى عائلة المنار</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          كن جزءاً من مجتمع شبابي نشط ومتفاعل واستمتع بتجارب لا تُنسى
        </p>
        <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Registration Benefits */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">لماذا تنضم إلينا؟</h3>

            <div className="space-y-6">
              {[
                {
                  icon: UserPlus,
                  title: "مجتمع شبابي متنوع",
                  description: "انضم إلى مجتمع من الشباب المتحمس والطموح",
                  color: "text-primary",
                  bgColor: "bg-primary/10",
                },
                {
                  icon: FileText,
                  title: "أنشطة متنوعة ومفيدة",
                  description: "شارك في ورش عمل وفعاليات تطور مهاراتك",
                  color: "text-secondary",
                  bgColor: "bg-secondary/10",
                },
                {
                  icon: Mail,
                  title: "شبكة علاقات قوية",
                  description: "اكتسب صداقات جديدة وعلاقات مهنية مثمرة",
                  color: "text-accent",
                  bgColor: "bg-accent/10",
                },
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`${benefit.bgColor} p-3 rounded-full`}>
                      <Icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Registration Form */}
          <Card className="p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <UserPlus className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-foreground">نموذج التسجيل</h3>
              </div>

              {/* Application ID field */}
              <div className="space-y-2">
                <Label htmlFor="applicationId" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  رقم الطلب (اختياري)
                </Label>
                <Input
                  id="applicationId"
                  value={formData.applicationId}
                  onChange={(e) => handleInputChange("applicationId", e.target.value)}
                  placeholder="سيتم إنشاؤه تلقائياً إذا ترك فارغاً"
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الاسم الكامل
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">العمر</Label>
                  <Select onValueChange={(value) => handleInputChange("age", value)}>
                    <SelectTrigger className="transition-all duration-300 focus:scale-105">
                      <SelectValue placeholder="اختر عمرك" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16-20">16-20 سنة</SelectItem>
                      <SelectItem value="21-25">21-25 سنة</SelectItem>
                      <SelectItem value="26-30">26-30 سنة</SelectItem>
                      <SelectItem value="30+">أكثر من 30 سنة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@email.com"
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">اهتماماتك</Label>
                <Select onValueChange={(value) => handleInputChange("interests", value)}>
                  <SelectTrigger className="transition-all duration-300 focus:scale-105">
                    <SelectValue placeholder="اختر مجال اهتمامك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">الرياضة</SelectItem>
                    <SelectItem value="arts">الفنون</SelectItem>
                    <SelectItem value="technology">التكنولوجيا</SelectItem>
                    <SelectItem value="volunteering">العمل التطوعي</SelectItem>
                    <SelectItem value="education">التعليم</SelectItem>
                    <SelectItem value="culture">الثقافة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">لماذا تريد الانضمام؟</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  placeholder="أخبرنا عن دوافعك للانضمام إلى الجمعية..."
                  rows={4}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>

              {/* Personal Photo field with preview */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  الصورة الشخصية (مطلوبة)
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="transition-all duration-300 focus:scale-105"
                />
                {formData.personalPhoto && (
                  <div className="mt-2 p-2 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">تم اختيار: {formData.personalPhoto.name}</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6 rounded-full transition-all duration-300 hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري التسجيل...
                  </div>
                ) : (
                  <>
                    انضم الآن
                    <UserPlus className="w-5 h-5 mr-2" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
