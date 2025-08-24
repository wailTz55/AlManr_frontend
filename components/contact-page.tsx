"use client"

import type React from "react"

import { useState } from "react"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    // Handle form submission
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "الهاتف",
      details: ["+966 11 123 4567", "+966 50 987 6543"],
      color: "text-green-500",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      details: ["info@almanar-youth.org", "contact@almanar-youth.org"],
      color: "text-blue-500",
    },
    {
      icon: MapPin,
      title: "العنوان",
      details: ["شارع الملك فهد، الرياض", "المملكة العربية السعودية"],
      color: "text-red-500",
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      details: ["الأحد - الخميس: 9:00 ص - 6:00 م", "الجمعة - السبت: مغلق"],
      color: "text-amber-500",
    },
  ]

  const departments = [
    { name: "الإدارة العامة", email: "admin@almanar-youth.org", icon: Users },
    { name: "الأنشطة والفعاليات", email: "activities@almanar-youth.org", icon: Calendar },
    { name: "العضوية والتسجيل", email: "membership@almanar-youth.org", icon: MessageCircle },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#", color: "text-blue-600" },
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
            <Card className="animate-slide-up hover-lift">
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
                        الاسم الكامل
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        className="text-right"
                        required
                      />
                    </div>
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
                  </div>

                  {/* Phone and Subject */}
                  <div className="grid md:grid-cols-2 gap-4">
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-right block">
                        الموضوع
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="موضوع الرسالة"
                        className="text-right"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="contactReason" className="text-right block">
                      سبب التواصل
                    </Label>
                    <select
                      id="contactReason"
                      name="contactReason"
                      value={formData.contactReason}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-border rounded-md text-right bg-background"
                      required
                    >
                      <option value="">اختر سبب التواصل</option>
                      <option value="membership">استفسار عن العضوية</option>
                      <option value="activities">الأنشطة والفعاليات</option>
                      <option value="partnership">شراكة أو تعاون</option>
                      <option value="complaint">شكوى أو اقتراح</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-right block">
                      الرسالة
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="اكتب رسالتك هنا..."
                      className="text-right min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full animate-pulse-glow">
                    <Send className="w-4 h-4 ml-2" />
                    إرسال الرسالة
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="animate-slide-up hover-lift" style={{ animationDelay: "0.2s" }}>
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
            <Card className="animate-slide-up hover-lift" style={{ animationDelay: "0.4s" }}>
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
            </Card>

            {/* Social Media */}
            <Card className="animate-slide-up hover-lift" style={{ animationDelay: "0.6s" }}>
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
                        className="justify-start hover-lift animate-fade-in bg-transparent"
                        style={{ animationDelay: `${0.7 + index * 0.1}s` }}
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
  )
}
