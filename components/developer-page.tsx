"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimation } from "@/components/scroll-animations"
import { Code, Palette, Zap, Heart, Github, Linkedin, Mail, Globe, Coffee, Star, Award, Lightbulb } from "lucide-react"

export function DeveloperPage() {
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)

  const skills = [
    { name: "React & Next.js", level: 95, color: "bg-blue-500" },
    { name: "TypeScript", level: 90, color: "bg-blue-600" },
    { name: "UI/UX Design", level: 85, color: "bg-purple-500" },
    { name: "Tailwind CSS", level: 92, color: "bg-cyan-500" },
    { name: "Arabic RTL Design", level: 88, color: "bg-green-500" },
    { name: "Animation & Interactions", level: 87, color: "bg-orange-500" },
  ]

  const projects = [
    {
      name: "موقع جمعية المنار للشباب",
      description: "موقع تفاعلي بتصميم RTL مع خريطة كنوز الأنشطة",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      status: "مكتمل",
    },
    {
      name: "منصة التعلم الذكية",
      description: "منصة تعليمية تفاعلية مع الذكاء الاصطناعي",
      tech: ["React", "Node.js", "AI Integration", "WebRTC"],
      status: "قيد التطوير",
    },
    {
      name: "تطبيق إدارة المشاريع",
      description: "تطبيق شامل لإدارة المشاريع والفرق",
      tech: ["Vue.js", "Express", "MongoDB", "Socket.io"],
      status: "مكتمل",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <ScrollAnimation animation="fade-in">
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary shadow-2xl hover-lift">
              <img
                src="/277912365_645761856522174_7895635452227310020_n (2).jpg"
                alt="المطور"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-bounce-gentle">
              <Code className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-typewriter">مرحباً، أنا المطور</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            مطور واجهات أمامية متخصص في تصميم وتطوير المواقع التفاعلية باللغة العربية
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2 animate-slide-in-left">
              <Zap className="w-4 h-4 ml-2" />
              مطور Full-Stack
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 animate-slide-in-right">
              <Palette className="w-4 h-4 ml-2" />
              مصمم UI/UX
            </Badge>
          </div>

          <Button
            size="lg"
            className="animate-pulse-glow"
            onClick={() => {
              setIsHeartAnimating(true)
              setTimeout(() => setIsHeartAnimating(false), 1000)
            }}
          >
            <Heart className={`w-5 h-5 ml-2 ${isHeartAnimating ? "animate-heartbeat text-red-500" : ""}`} />
            صُنع بحب وشغف
          </Button>
        </div>
      </ScrollAnimation>

      {/* About Section */}
      <ScrollAnimation animation="slide-in-right" delay={200}>
        <Card className="mb-16 p-8 hover-lift">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-primary animate-wiggle" />
                عن المطور
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                مطور واجهات أمامية شغوف بإنشاء تجارب رقمية استثنائية. أتخصص في تطوير المواقع التفاعلية باللغة العربية مع
                التركيز على تصميم RTL والرسوم المتحركة الجذابة. أؤمن بأن التكنولوجيا يجب أن تخدم المجتمع وتجعل الحياة
                أسهل وأجمل.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                عملت على العديد من المشاريع المتنوعة من المواقع الشخصية إلى المنصات التعليمية الكبيرة. أحب التحديات
                التقنية وأسعى دائماً لتعلم التقنيات الجديدة ومشاركة المعرفة مع المجتمع التقني.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Coffee className="w-6 h-6 text-primary" />
                  <span className="font-semibold">إحصائيات سريعة</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">مشروع مكتمل</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">3+</div>
                    <div className="text-sm text-muted-foreground">سنوات خبرة</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">∞</div>
                    <div className="text-sm text-muted-foreground">أكواب قهوة</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-chart-3">100%</div>
                    <div className="text-sm text-muted-foreground">شغف وحب</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </ScrollAnimation>

      {/* Skills Section */}
      <ScrollAnimation animation="fade-in" delay={400}>
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-primary animate-float" />
            المهارات والتقنيات
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className="p-6 hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out animate-shimmer`}
                    style={{
                      width: `${skill.level}%`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollAnimation>

      {/* Projects Section */}
      <ScrollAnimation animation="slide-in-left" delay={600}>
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Award className="w-8 h-8 text-secondary animate-bounce-gentle" />
            مشاريع مميزة
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card
                key={project.name}
                className="p-6 hover-lift hover-glow animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <h3 className="text-xl font-bold text-foreground mb-3">{project.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Badge variant={project.status === "مكتمل" ? "default" : "secondary"} className="text-xs animate-pulse">
                  {project.status}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </ScrollAnimation>

      {/* Contact Section */}
      <ScrollAnimation animation="fade-in" delay={800}>
        <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-secondary/5">
          <h2 className="text-3xl font-bold text-foreground mb-6">تواصل معي</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            هل لديك مشروع مثير أو فكرة إبداعية؟ أحب العمل على المشاريع التي تحدث فرقاً حقيقياً في المجتمع
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" className="hover-lift bg-transparent">
              <Github className="w-4 h-4 ml-2" />
              GitHub
            </Button>
            <Button variant="outline" className="hover-lift bg-transparent">
              <Linkedin className="w-4 h-4 ml-2" />
              LinkedIn
            </Button>
            <Button variant="outline" className="hover-lift bg-transparent">
              <Mail className="w-4 h-4 ml-2" />
              البريد الإلكتروني
            </Button>
            <Button variant="outline" className="hover-lift bg-transparent">
              <Globe className="w-4 h-4 ml-2" />
              الموقع الشخصي
            </Button>
          </div>
        </Card>
      </ScrollAnimation>

      {/* Thank You Note */}
      <ScrollAnimation animation="scale-in" delay={1000}>
        <div className="text-center mt-16 p-8">
          <div className="inline-block animate-float">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4 animate-heartbeat" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">شكراً لك</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            شكراً لزيارتك موقع جمعية المنار للشباب. آمل أن تكون قد استمتعت بالتجربة التفاعلية والتصميم المبتكر. هذا
            الموقع صُنع بحب وشغف لخدمة المجتمع الشبابي.
          </p>
        </div>
      </ScrollAnimation>
    </div>
  )
}
