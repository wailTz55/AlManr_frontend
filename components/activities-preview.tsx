"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, ArrowLeft, Camera, Video, ChevronLeft, ChevronRight } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "مخيم الصيف الشبابي",
    date: "15-20 يوليو 2024",
    location: "جبال الأطلس",
    participants: 45,
    image: "/summer-camp-mountains.png",
    description: "مخيم صيفي مليء بالأنشطة الترفيهية والتعليمية",
    type: "مخيم",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "ورشة الإبداع والابتكار",
    date: "5 أغسطس 2024",
    location: "مركز الشباب",
    participants: 30,
    image: "/creative-workshop-innovation.png",
    description: "ورشة تفاعلية لتنمية مهارات الإبداع",
    type: "ورشة",
    color: "bg-secondary",
  },
  {
    id: 3,
    title: "بطولة كرة القدم",
    date: "12 أغسطس 2024",
    location: "الملعب الرياضي",
    participants: 60,
    image: "/youth-football-tournament.png",
    description: "بطولة رياضية ممتعة بين فرق الشباب",
    type: "رياضة",
    color: "bg-accent",
  },
  {
    id: 4,
    title: "معرض الفنون الشبابية",
    date: "20 أغسطس 2024",
    location: "قاعة المعارض",
    participants: 25,
    image: "/art-exhibition-youth.png",
    description: "معرض فني يعرض إبداعات الشباب",
    type: "فنون",
    color: "bg-chart-3",
  },
  {
    id: 5,
    title: "رحلة استكشافية بحرية",
    date: "1 سبتمبر 2024",
    location: "الساحل الشرقي",
    participants: 35,
    image: "/marine-exploration.png",
    description: "رحلة استكشافية بحرية مثيرة",
    type: "استكشاف",
    color: "bg-chart-4",
  },
]

export function ActivitiesPreview() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showControls, setShowControls] = useState(false)
  // // * start api**************************
  // const [activities, setActivities] = useState([
  //   {
  //     id: 0,
  //     title: "جاري التحميل...",
  //     date: "",
  //     location: "",
  //     participants: 0,
  //     image: "/placeholder.svg",
  //     description: "انتظر تحميل البيانات من السيرفر",
  //     type: "",
  //     color: "bg-gray-200",
  //   },
  // ])

  //   // 🔹 جلب البيانات من API عند تحميل الكومبوننت
  //   useEffect(() => {
  //     fetch(" http://127.0.0.1:8000/api/activities/") // رابط Django API
  //       .then((response) => response.json())
  //       .then((data) => setActivities(data)) // نخزن البيانات
  //       .catch((error) => console.error("خطأ في جلب البيانات:", error))
  //   }, [])
  // // * End api**************************


  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activities.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

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
                <Card className="relative overflow-hidden h-96 group">
                  <div className="absolute inset-0">
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-end p-8">
                    <div
                      className={`${activity.color} text-white px-4 py-2 rounded-full text-sm font-medium w-fit mb-4`}
                    >
                      {activity.type}
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>

                    <p className="text-white/90 mb-6 text-lg">{activity.description}</p>

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

                    <Button size="lg" className="w-fit animate-pulse-glow">
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
        <Button size="lg" className="text-lg px-8 py-4 rounded-full animate-bounce-gentle">
          شاهد جميع الأنشطة
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    </div>
  )
}
