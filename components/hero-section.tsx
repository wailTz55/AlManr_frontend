"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Users, Calendar, Award } from "lucide-react"
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "مرحباً بكم في جمعية المنار للشباب",
      subtitle: "نحو مستقبل أفضل للشباب العربي",
      description: "انضموا إلينا في رحلة التطوير والإبداع والتميز",
    },
    {
      title: "أنشطة متنوعة وفعاليات مميزة",
      subtitle: "تجارب لا تُنسى وذكريات جميلة",
      description: "اكتشفوا عالماً من الأنشطة الشبابية المثيرة",
    },
    {
      title: "مجتمع شبابي نشط ومتفاعل",
      subtitle: "صداقات حقيقية وشراكات مثمرة",
      description: "كونوا جزءاً من عائلة المنار الكبيرة",
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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full animate-float" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-secondary/20 rounded-full animate-bounce-gentle" />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-20 h-20 bg-primary/15 rounded-full animate-bounce-gentle"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 animate-bounce-gentle">
            <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
              <Star className="w-12 h-12 text-primary-foreground" />
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
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">عضو نشط</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:scale-105 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">150+</div>
              <div className="text-muted-foreground">فعالية منظمة</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:scale-105 transition-transform duration-300">
              <Award className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-2">25+</div>
              <div className="text-muted-foreground">جائزة وإنجاز</div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-primary scale-125" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
