with open('components/registration-section.tsx', 'w') as f:
    f.write("""\"use client\"

import type React from \"react\"
import { useRef } from \"react\"
import { Card } from \"@/components/ui/card\"
import { Button } from \"@/components/ui/button\"
import { Target, Eye, Heart, Users, Award, Lightbulb, Play, ArrowLeft } from \"lucide-react\"
import { useRouter } from \"next/navigation\"
import gsap from \"gsap\"
import { useGSAP } from \"@gsap/react\"
import { ScrollTrigger } from \"gsap/dist/ScrollTrigger\"

if (typeof window !== \"undefined\") {
  gsap.registerPlugin(ScrollTrigger)
}

export function RegistrationSection() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: Target,
      title: \"أهدافنا\",
      description: \"تمكين الشباب وتطوير قدراتهم في جميع المجالات الحياتية والمهنية\",
      color: \"text-primary\",
      bgColor: \"bg-primary/10\",
    },
    {
      icon: Users,
      title: \"مجتمعنا\",
      description: \"بناء جيل واعي ومتفاعل يساهم في التنمية المجتمعية المستدامة\",
      color: \"text-secondary\",
      bgColor: \"bg-secondary/10\",
    },
    {
      icon: Award,
      title: \"إنجازاتنا\",
      description: \"أكثر من 500 عضو نشط و 100+ فعالية ناجحة على مدار السنوات الماضية\",
      color: \"text-accent\",
      bgColor: \"bg-accent/10\",
    },
    {
      icon: Lightbulb,
      title: \"برامجنا\",
      description: \"ورش تطوير الذات، دورات تدريبية، مشاريع تطوعية، وفعاليات ثقافية متنوعة\",
      color: \"text-primary\",
      bgColor: \"bg-primary/10\",
    },
  ]

  useGSAP(() => {
    // Header reveal
    gsap.from(\".about-header\", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: \"top 80%\",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: \"power2.out\"
    })

    // Vision, Mission, Goals Cards Stagger
    gsap.from(\".about-vision-card\", {
      scrollTrigger: {
        trigger: \".about-vision-container\",
        start: \"top 80%\",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: \"back.out(1.2)\"
    })

    // Content section (Video & Text)
    gsap.from(\".about-content-left\", {
      scrollTrigger: {
        trigger: \".about-content-container\",
        start: \"top 75%\",
      },
      x: 50,
      opacity: 0,
      duration: 1,
      ease: \"power3.out\"
    })

    gsap.from(\".about-content-right\", {
      scrollTrigger: {
        trigger: \".about-content-container\",
        start: \"top 75%\",
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: \"power3.out\"
    })

    // Features List
    gsap.from(\".about-feature-item\", {
      scrollTrigger: {
        trigger: \".about-features-container\",
        start: \"top 85%\",
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: \"power2.out\"
    })

    // Stats Bar
    gsap.from(\".about-stats-container\", {
      scrollTrigger: {
        trigger: \".about-stats-container\",
        start: \"top 90%\",
      },
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
      ease: \"power2.out\"
    })
    
    // Animate numbers
    gsap.from(\".stat-num\", {
      scrollTrigger: {
        trigger: \".about-stats-container\",
        start: \"top 90%\",
      },
      textContent: 0,
      duration: 2,
      ease: \"power1.out\",
      snap: { textContent: 1 },
      stagger: 0.1
    })

  }, { scope: containerRef })

  return (
    <div ref={containerRef} className=\"container mx-auto px-4 overflow-hidden\">
      <div className=\"about-header text-center mb-20\">
        <h2 className=\"text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6 inline-block\">تعرف على جمعية المنار</h2>
        <p className=\"text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed\">
          منارة الشباب للتنمية والتطوير - جمعية شبابية تهدف إلى بناء جيل واعي ومبدع يساهم في نهضة المجتمع
        </p>
        <div className=\"w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full opacity-80\" />
      </div>

      <div className=\"max-w-6xl mx-auto\">
        {/* الرؤية والرسالة والأهداف */}
        <div className=\"about-vision-container grid md:grid-cols-3 gap-8 mb-24\">
          {/* الرؤية */}
          <Card className=\"about-vision-card p-10 text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm group\">
            <div className=\"bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300 transform group-hover:rotate-6\">
              <Eye className=\"w-10 h-10 text-primary\" />
            </div>
            <h3 className=\"text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors\">رؤيتنا</h3>
            <p className=\"text-muted-foreground leading-relaxed text-[15px]\">
              أن نكون الجمعية الرائدة في تمكين الشباب وإعدادهم ليكونوا قادة المستقبل في جميع المجالات
            </p>
          </Card>

          {/* الرسالة */}
          <Card className=\"about-vision-card p-10 text-center hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm group\">
            <div className=\"bg-secondary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors duration-300 transform group-hover:-rotate-6\">
              <Heart className=\"w-10 h-10 text-secondary\" />
            </div>
            <h3 className=\"text-2xl font-bold text-foreground mb-4 group-hover:text-secondary transition-colors\">رسالتنا</h3>
            <p className=\"text-muted-foreground leading-relaxed text-[15px]\">
              نسعى لتطوير قدرات الشباب من خلال برامج تدريبية متنوعة وأنشطة تطوعية هادفة تخدم المجتمع
            </p>
          </Card>

          {/* الأهداف */}
          <Card className=\"about-vision-card p-10 text-center hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm group\">
            <div className=\"bg-accent/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors duration-300 transform group-hover:rotate-6\">
              <Target className=\"w-10 h-10 text-accent\" />
            </div>
            <h3 className=\"text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors\">أهدافنا</h3>
            <p className=\"text-muted-foreground leading-relaxed text-[15px]\">
              بناء شخصية الشاب المسلم، تطوير المهارات القيادية، وتعزيز روح العمل الجماعي والتطوعي
            </p>
          </Card>
        </div>

        {/* قسم الفيديو التعريفي والمحتوى */}
        <div className=\"about-content-container flex flex-col lg:flex-row gap-16 items-center mb-24\">
          {/* الفيديو التعريفي */}
          <div className=\"about-content-right relative w-full lg:w-1/2\">
            <Card className=\"overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group border-0 rounded-3xl\">
              <div className=\"relative bg-gradient-to-br from-primary/30 to-secondary/30 aspect-video flex items-center justify-center overflow-hidden\">
                <div className=\"absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500\" />
                <div className=\"text-center z-10 transform transition-transform duration-500 group-hover:scale-105\">
                  <div className=\"bg-white/90 backdrop-blur-md p-5 rounded-full mb-5 mx-auto w-fit shadow-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300\">
                    <Play className=\"w-10 h-10 ml-1\" />
                  </div>
                  <h4 className=\"text-foreground font-bold text-xl mb-2 drop-shadow-md bg-white/70 px-4 py-1 rounded-full inline-block\">فيديو تعريفي بالجمعية</h4>
                </div>
                <Button 
                  className=\"absolute inset-0 w-full h-full opacity-0 !cursor-pointer z-20\"
                  onClick={() => {
                    console.log(\"تشغيل الفيديو التعريفي\")
                  }}
                  aria-label=\"تشغيل الفيديو التعريفي\"
                >
                  <span className=\"sr-only\">تشغيل الفيديو</span>
                </Button>
              </div>
            </Card>
            
            {/* Decorative elements */}
            <div className=\"absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10\" />
            <div className=\"absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10\" />
          </div>

          {/* نبذة مختصرة */}
          <div className=\"about-content-left space-y-8 w-full lg:w-1/2\">
            <div>
              <h3 className=\"text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight\">صناع الأثر.. قادة الغد</h3>
              <div className=\"space-y-5 text-muted-foreground leading-relaxed text-lg\">
                <p>
                  تأسست جمعية المنار للشباب في عام 2023 بهدف خلق بيئة محفزة للشباب لتطوير قدراتهم 
                  وإمكانياتهم في شتى المجالات. نؤمن بأن الشباب هم عماد المستقبل وقادة التغيير.
                </p>
                <p>
                  نقدم برامج متنوعة تشمل التدريب المهني، ورش تطوير الذات، الأنشطة الثقافية والرياضية، 
                  بالإضافة إلى المشاريع التطوعية التي تخدم المجتمع المحلي.
                </p>
              </div>
            </div>
            
            <div className=\"pt-4 flex flex-col sm:flex-row gap-4\">
              <Button 
                size=\"lg\"
                className=\"bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 !cursor-pointer text-lg px-8 py-6 rounded-full group\"
                onClick={() => router.push(\"/register\")}
              >
                انضم إلينا الآن
                <ArrowLeft className=\"w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1\" />
              </Button>
            </div>
          </div>
        </div>

        {/* الميزات والخدمات */}
        <div className=\"about-features-container grid md:grid-cols-2 gap-8 mb-24\">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className=\"about-feature-item flex items-start gap-5 p-6 rounded-2xl bg-card/40 border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 group\"
              >
                <div className={`${feature.bgColor} p-4 rounded-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <div className=\"flex-1 pt-1\">
                  <h4 className=\"font-bold text-foreground mb-3 text-xl\">{feature.title}</h4>
                  <p className=\"text-muted-foreground leading-relaxed text-[15px]\">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* إحصائيات سريعة */}
        <div className=\"about-stats-container bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-10 md:p-12 border border-white/20 shadow-lg relative overflow-hidden\">
          <div className=\"absolute top-0 right-0 w-full h-full bg-[url('/noise.png')] opacity-20 mix-blend-overlay\"></div>
          <div className=\"grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center relative z-10\">
            <div className=\"flex flex-col items-center justify-center\">
              <div className=\"flex items-baseline gap-1 text-primary mb-2\">
                <span className=\"text-4xl md:text-5xl font-extrabold\">+</span>
                <span className=\"stat-num text-5xl md:text-6xl font-black tracking-tight\">45</span>
              </div>
              <p className=\"text-muted-foreground font-medium text-lg\">عضو نشط</p>
            </div>
            <div className=\"flex flex-col items-center justify-center\">
              <div className=\"flex items-baseline gap-1 text-secondary mb-2\">
                <span className=\"text-4xl md:text-5xl font-extrabold\">+</span>
                <span className=\"stat-num text-5xl md:text-6xl font-black tracking-tight\">60</span>
              </div>
              <p className=\"text-muted-foreground font-medium text-lg\">فعالية منجزة</p>
            </div>
            <div className=\"flex flex-col items-center justify-center\">
              <div className=\"flex items-baseline gap-1 text-accent mb-2\">
                <span className=\"text-4xl md:text-5xl font-extrabold\">+</span>
                <span className=\"stat-num text-5xl md:text-6xl font-black tracking-tight\">11</span>
              </div>
              <p className=\"text-muted-foreground font-medium text-lg\">برنامج تدريبي</p>
            </div>
            <div className=\"flex flex-col items-center justify-center\">
               <div className=\"flex items-baseline gap-1 text-primary mb-2\">
                 <span className=\"stat-num text-5xl md:text-6xl font-black tracking-tight\">2</span>
               </div>
              <p className=\"text-muted-foreground font-medium text-lg\">سنوات من العطاء</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
""")
