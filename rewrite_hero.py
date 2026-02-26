with open('components/hero-section.tsx', 'w') as f:
    f.write("""\"use client\"

import { useState, useEffect, useRef } from \"react\"
import { Button } from \"@/components/ui/button\"
import { ArrowLeft, Star, Users, Calendar, Award } from \"lucide-react\"
import { useRouter } from \"next/navigation\"
import gsap from \"gsap\"
import { useGSAP } from \"@gsap/react\"

export function HeroSection() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: \"مرحباً بكم في جمعية المنار للشباب\",
      subtitle: \"نحو مستقبل أفضل للشباب العربي\",
      description: \"انضموا إلينا في رحلة التطوير والإبداع والتميز\",
    },
    {
      title: \"أنشطة متنوعة وفعاليات مميزة\",
      subtitle: \"تجارب لا تُنسى وذكريات جميلة\",
      description: \"اكتشفوا عالماً من الأنشطة الشبابية المثيرة\",
    },
    {
      title: \"مجتمع شبابي نشط ومتفاعل\",
      subtitle: \"صداقات حقيقية وشراكات مثمرة\",
      description: \"كونوا جزءاً من عائلة المنار الكبيرة\",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: \"power3.out\" } })

    // Staggered reveal for main elements
    tl.fromTo(
      \".gsap-reveal\",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, delay: 0.2 }
    )

    // Fade in stats
    tl.fromTo(
      \".gsap-stat\",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15 },
      \"-=0.5\"
    )

    // Slight parallax for background elements
    gsap.to(\".gsap-bg-shape\", {
      y: \"random(-30, 30)\",
      x: \"random(-30, 30)\",
      rotation: \"random(-20, 20)\",
      duration: 10,
      ease: \"sine.inOut\",
      repeat: -1,
      yoyo: true,
      stagger: {
        amount: 2,
        from: \"random\"
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className=\"relative min-h-screen flex items-center justify-center overflow-hidden\">
      {/* Animated Background with GSAP */}
      <div className=\"absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10\">
        <div className=\"gsap-bg-shape absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-xl\" />
        <div className=\"gsap-bg-shape absolute bottom-32 left-16 w-24 h-24 bg-secondary/20 rounded-full blur-xl\" />
        <div className=\"gsap-bg-shape absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-lg\" />
        <div className=\"gsap-bg-shape absolute bottom-20 right-1/3 w-20 h-20 bg-primary/15 rounded-full blur-lg\" />
      </div>

      <div className=\"container mx-auto px-4 text-center relative z-10 pt-20\">
        <div className=\"max-w-4xl mx-auto\">
          {/* Logo/Icon */}
          <div className=\"gsap-reveal mb-8\">
            <div className=\"w-20 h-20 md:w-24 md:h-24 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg\">
              <Star className=\"w-10 h-10 md:w-12 md:h-12 text-primary-foreground\" />
            </div>
          </div>

          {/* Main Content */}
          <div className=\"gsap-reveal transition-all duration-700 ease-in-out min-h-[220px] md:min-h-[260px]\">
            <h1 className=\"text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 drop-shadow-sm\">
              {slides[currentSlide].title}
            </h1>
            <h2 className=\"text-2xl md:text-3xl text-primary font-semibold mb-4\">{slides[currentSlide].subtitle}</h2>
            <p className=\"text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed\">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className=\"gsap-reveal flex flex-col sm:flex-row gap-4 justify-center mb-16\">
            <Button 
              size=\"lg\" 
              className=\"text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 !cursor-pointer\"
              onClick={() => router.push(\"/register\")}
            >
              انضم الآن
              <ArrowLeft className=\"w-5 h-5 mr-2\" />
            </Button>
            <Button 
              variant=\"outline\" 
              size=\"lg\" 
              className=\"text-lg px-8 py-6 rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-background/80 transition-all hover:-translate-y-1 !cursor-pointer\"
              onClick={() => {
                document.getElementById(\"activities\")?.scrollIntoView({ behavior: \"smooth\" })
              }}
            >
              اكتشف المزيد
            </Button>
          </div>

          {/* Stats */}
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12\">
            <div className=\"gsap-stat bg-card/60 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300\">
              <Users className=\"w-8 h-8 text-primary mx-auto mb-4\" />
              <div className=\"text-4xl font-bold text-foreground mb-2\">45+</div>
              <div className=\"text-sm font-medium text-muted-foreground uppercase tracking-wider\">عضو نشط</div>
            </div>
            <div className=\"gsap-stat bg-card/60 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300\">
              <Calendar className=\"w-8 h-8 text-secondary mx-auto mb-4\" />
              <div className=\"text-4xl font-bold text-foreground mb-2\">60+</div>
              <div className=\"text-sm font-medium text-muted-foreground uppercase tracking-wider\">فعالية منظمة</div>
            </div>
            <div className=\"gsap-stat bg-card/60 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300\">
              <Award className=\"w-8 h-8 text-accent mx-auto mb-4\" />
              <div className=\"text-4xl font-bold text-foreground mb-2\">15+</div>
              <div className=\"text-sm font-medium text-muted-foreground uppercase tracking-wider\">جائزة وإنجاز</div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className=\"gsap-reveal flex justify-center gap-3 mt-16 pb-12\">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-12 h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentSlide ? \"bg-primary\" : \"bg-muted-foreground/30 hover:bg-muted-foreground/50\"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
""")
