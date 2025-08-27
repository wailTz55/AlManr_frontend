"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchAllData } from "../app/api/api"
import { Activity } from "../app/api/type"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, ArrowLeft, Camera, Video, ChevronLeft, ChevronRight } from "lucide-react"

export function ActivitiesPreview() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // جلب البيانات من API عند تحميل الكومبوننت
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchAllData()
        
        if (data && data.activities && Array.isArray(data.activities)) {
          // أخذ أول 5 أنشطة
          const firstFiveActivities = data.activities.slice(0, 5)
          setActivities(firstFiveActivities)
        } else {
          throw new Error('البيانات المستلمة غير صحيحة')
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err)
        setError('حدث خطأ في تحميل الأنشطة')
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || activities.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activities.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlaying, activities.length])

  // دالة للانتقال إلى صفحة الأنشطة مع تمرير معرف النشاط
  const navigateToActivityPage = (activityId?: number) => {
    if (activityId) {
      router.push(`/activities?activityId=${activityId}`)
    } else {
      router.push('/activities')
    }
  }

  // دالة للتعامل مع النقر على البطاقة
  const handleCardClick = (activity: Activity) => {
    navigateToActivityPage(activity.id)
  }

  // دالة للتعامل مع النقر على زر "اعرف المزيد"
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

  // معالجة حالة التحميل
  if (isLoading) {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الأنشطة...</p>
        </div>
      </div>
    )
  }

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">أنشطتنا المميزة</h2>
        </div>
        
        <div className="text-center py-12">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    )
  }

  // معالجة حالة عدم وجود أنشطة
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

      {/* Auto-Slider Design */}
      <div
        className="relative max-w-6xl mx-auto"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Slider Container */}
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(${currentSlide * -100}%)` }}
          >
            {activities.map((activity, index) => (
              <div key={activity.id} className="w-full flex-shrink-0">
                <Card 
                  className="relative overflow-hidden h-96 group cursor-pointer"
                  onClick={() => handleCardClick(activity)}
                >
                  <div className="absolute inset-0">
                    <img
                      src={activity.images && activity.images[0] ? `${baseURL}${activity.images[0]}` : "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-end p-8">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium w-fit mb-4">
                      {activity.category}
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>

                    <p className="text-white/90 mb-6 text-lg line-clamp-3">{activity.description}</p>

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
                      className="w-fit animate-pulse-glow"
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
        </div>

        {/* Navigation Controls */}
        <div
          className={`absolute inset-y-0 left-4 flex items-center transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={prevSlide}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full p-3"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div
          className={`absolute inset-y-0 right-4 flex items-center transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={nextSlide}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full p-3"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {activities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`transition-all duration-300 ${isAutoPlaying ? "bg-primary text-primary-foreground" : ""}`}
          >
            {isAutoPlaying ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"}
          </Button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-20">
        <Button 
          size="lg" 
          className="text-lg px-8 py-4 rounded-full animate-bounce-gentle"
          onClick={() => navigateToActivityPage()}
        >
          شاهد جميع الأنشطة
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    </div>
  )
}