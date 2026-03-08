"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Calendar, Award } from "lucide-react"
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "مرحباً بكم في الرابطة الولائية",
      subtitle: "لانشطة الهواء الطلق والترفيه",
      description: "ومبادلات الشباب لولاية سطيف",
    },
    {
      title: "أنشطة متنوعة وفعاليات مميزة",
      subtitle: "تجارب لا تُنسى وذكريات جميلة",
      description: "اكتشفوا عالماً من الأنشطة الشبابية المثيرة",
    },
    {
      title: "مجتمع شبابي نشط ومتفاعل",
      subtitle: "صداقات حقيقية وشراكات مثمرة",
      description: "كونوا جزءاً من عائلة الرابطة الكبيرة",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 animate-bounce-gentle">
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto flex items-center justify-center animate-pulse-glow rounded-full shadow-2xl ring-4 ring-primary/20 bg-white/10 backdrop-blur-sm p-2 overflow-hidden">
              <img src="/logo.webp" alt="الرابطة الولائية" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>

          {/* Main Content */}
          <div className="transition-all duration-1000 ease-in-out">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
              {slides[currentSlide].title}
            </h1>
            <h2 className="text-2xl md:text-3xl text-primary font-semibold mb-4">{slides[currentSlide].subtitle}</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg"
              className="text-lg px-8 py-4 rounded-full animate-pulse-glow !cursor-pointer"
              onClick={() => router.push("/register")}
            >
              انضم الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full bg-transparent !cursor-pointer">
              اكتشف المزيد
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:scale-105 transition-transform duration-300">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">70+</div>
              <div className="text-muted-foreground">جمعية نشطة</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:scale-105 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">100+</div>
              <div className="text-muted-foreground">فعالية منظمة</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:scale-105 transition-transform duration-300">
              <Award className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">15+</div>
              <div className="text-muted-foreground">جائزة وإنجاز</div>
            </div>
          </div>
          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-primary scale-125" : "bg-muted-foreground/30"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
