"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Eye, Heart, Users, Award, Lightbulb, Play } from "lucide-react"
import { useRouter } from "next/navigation";

export function RegistrationSection() {
  const router = useRouter();

  const features = [
    {
      icon: Target,
      title: "أهدافنا",
      description: "تمكين الشباب وتطوير قدراتهم في جميع المجالات الحياتية والمهنية",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: "مجتمعنا",
      description: "بناء جيل واعي ومتفاعل يساهم في التنمية المجتمعية المستدامة",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Award,
      title: "إنجازاتنا",
      description: "أكثر من 500 عضو نشط و 100+ فعالية ناجحة على مدار السنوات الماضية",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Lightbulb,
      title: "برامجنا",
      description: "ورش تطوير الذات، دورات تدريبية، مشاريع تطوعية، وفعاليات ثقافية متنوعة",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">تعرف على جمعية المنار</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          منارة الشباب للتنمية والتطوير - جمعية شبابية تهدف إلى بناء جيل واعي ومبدع يساهم في نهضة المجتمع
        </p>
        <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* الرؤية والرسالة والأهداف */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* الرؤية */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">رؤيتنا</h3>
            <p className="text-muted-foreground leading-relaxed">
              أن نكون الجمعية الرائدة في تمكين الشباب وإعدادهم ليكونوا قادة المستقبل في جميع المجالات
            </p>
          </Card>

          {/* الرسالة */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">رسالتنا</h3>
            <p className="text-muted-foreground leading-relaxed">
              نسعى لتطوير قدرات الشباب من خلال برامج تدريبية متنوعة وأنشطة تطوعية هادفة تخدم المجتمع
            </p>
          </Card>

          {/* الأهداف */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">أهدافنا</h3>
            <p className="text-muted-foreground leading-relaxed">
              بناء شخصية الشاب المسلم، تطوير المهارات القيادية، وتعزيز روح العمل الجماعي والتطوعي
            </p>
          </Card>
        </div>

        {/* قسم الفيديو التعريفي والمحتوى */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* الفيديو التعريفي */}
          <div className="relative">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-4 mx-auto w-fit">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-white text-xl font-semibold mb-2">فيديو تعريفي بالجمعية</h4>
                  <p className="text-white/80">شاهد رحلتنا وإنجازاتنا</p>
                </div>
                <Button 
                  className="absolute inset-0 bg-transparent hover:bg-black/20 transition-colors duration-300"
                  onClick={() => {
                    // يمكن إضافة رابط الفيديو هنا
                    console.log("تشغيل الفيديو التعريفي")
                  }}
                >
                  <span className="sr-only">تشغيل الفيديو</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* نبذة مختصرة */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-foreground">نبذة عن جمعية المنار</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                تأسست جمعية المنار للشباب في عام 2023 بهدف خلق بيئة محفزة للشباب لتطوير قدراتهم 
                وإمكانياتهم في شتى المجالات. نؤمن بأن الشباب هم عماد المستقبل وقادة التغيير.
              </p>
              <p>
                نقدم برامج متنوعة تشمل التدريب المهني، ورش تطوير الذات، الأنشطة الثقافية والرياضية، 
                بالإضافة إلى المشاريع التطوعية التي تخدم المجتمع المحلي.
              </p>
              <p>
                انضم إلى عائلتنا الكبيرة واكتشف إمكانياتك الحقيقية مع مجتمع من الشباب المتحمس والطموح.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-primary hover:bg-primary/90 !cursor-pointer"
              onClick={() => router.push("/register")}
              >
                انضم إلينا الآن
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white !cursor-pointer">
                تعرف أكثر
              </Button>
            </div>
          </div>
        </div>

        {/* الميزات والخدمات */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl hover:bg-muted/30 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${feature.bgColor} p-3 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* إحصائيات سريعة */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h4 className="text-3xl font-bold text-primary mb-2">500+</h4>
              <p className="text-muted-foreground">عضو نشط</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-secondary mb-2">100+</h4>
              <p className="text-muted-foreground">فعالية منجزة</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-accent mb-2">50+</h4>
              <p className="text-muted-foreground">برنامج تدريبي</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-primary mb-2">9</h4>
              <p className="text-muted-foreground">سنوات من العطاء</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}