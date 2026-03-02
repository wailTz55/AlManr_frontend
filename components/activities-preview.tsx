"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Activity } from "../app/api/type"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, ArrowLeft, Camera, Video, ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  /** Pre-fetched activities from the server (RSC). No loading state needed on first render. */
  initialActivities?: Activity[]
}

export function ActivitiesPreview({ initialActivities = [] }: Props) {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showControls, setShowControls] = useState(false)
  // Start immediately with server data — no loading spinner on first render
  const [activities] = useState<Activity[]>(initialActivities)

  useEffect(() => {
    if (!isAutoPlaying || activities.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activities.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlaying, activities.length])

  const navigateToActivityPage = (activityId?: number) => {
    if (activityId) {
      router.push(`/activities?activityId=${activityId}`)
    } else {
      router.push('/activities')
    }
  }

  const handleCardClick = (activity: Activity) => {
    navigateToActivityPage(activity.id)
  }

  const handleMoreClick = (e: React.MouseEvent, activity: Activity) => {
    e.stopPropagation()
    navigateToActivityPage(activity.id)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activities.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activities.length) % activities.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  if (activities.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">أنشطتنا المميزة</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف عالماً من الأنشطة الشبابية المثيرة والتجارب التي لا تُنسى
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">لا توجد أنشطة متاحة حالياً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">أنشطتنا المميزة</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          اكتشف عالماً من الأنشطة الشبابية المثيرة والتجارب التي لا تُنسى
        </p>
        <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
      </div>

      {/* Auto-Slider */}
      <div
        className="relative max-w-6xl mx-auto"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="relative w-full h-96 overflow-hidden rounded-2xl">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out ${index === currentSlide ? 'translate-x-0' :
                  index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                }`}
            >
              <Card
                className="relative overflow-hidden h-full group cursor-pointer w-full"
                onClick={() => handleCardClick(activity)}
              >
                <div className="absolute inset-0">
                  {/* Next.js Image for automatic WebP, resizing, and lazy loading */}
                  <Image
                    src={activity.images?.[0] ?? "/placeholder.svg"}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index === 0}   // preload first (visible) slide only
                    sizes="(max-width: 768px) 100vw, 1152px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                    {activity.title}
                  </h3>

                  <p className="hidden sm:block text-white/90 mb-6 text-lg line-clamp-3">{activity.description}</p>

                  <div className="flex items-center gap-6 text-white/80 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {activity.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {activity.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {activity.participants}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-fit animate-pulse-glow !cursor-pointer"
                    onClick={(e) => handleMoreClick(e, activity)}
                  >
                    اعرف المزيد
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </div>

                {/* Floating Icons */}
                <div className="absolute top-6 left-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className={`absolute inset-y-0 left-4 flex items-center transition-opacity duration-300 z-20 ${showControls ? "opacity-100" : "opacity-0"}`}>
          <Button
            variant="ghost"
            size="lg"
            onClick={prevSlide}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full p-3 !cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        <div className={`absolute inset-y-0 right-4 flex items-center transition-opacity duration-300 z-20 ${showControls ? "opacity-100" : "opacity-0"}`}>
          <Button
            variant="ghost"
            size="lg"
            onClick={nextSlide}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full p-3 !cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {activities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`transition-all duration-300 ${isAutoPlaying ? "bg-primary text-primary-foreground !cursor-pointer" : ""}`}
          >
            {isAutoPlaying ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"}
          </Button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-20">
        <Button
          size="lg"
          className="text-lg px-8 py-4 rounded-full animate-bounce-gentle !cursor-pointer"
          onClick={() => navigateToActivityPage()}
        >
          شاهد جميع الأنشطة
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    </div>
  )
}