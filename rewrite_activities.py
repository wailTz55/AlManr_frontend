with open('components/activities-preview.tsx', 'w') as f:
    f.write("""\"use client\"

import { useState, useEffect, useRef } from \"react\"
import { useRouter } from \"next/navigation\"
import { fetchAllData } from \"../app/api/api\"
import { Activity } from \"../app/api/type\"
import { Button } from \"@/components/ui/button\"
import { Card } from \"@/components/ui/card\"
import { Calendar, MapPin, Users, ArrowLeft, Camera, Video, ChevronLeft, ChevronRight } from \"lucide-react\"
import gsap from \"gsap\"
import { useGSAP } from \"@gsap/react\"
import { ScrollTrigger } from \"gsap/dist/ScrollTrigger\"

if (typeof window !== \"undefined\") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ActivitiesPreview() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchAllData()

        if (data && data.activities && Array.isArray(data.activities)) {
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
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlaying, activities.length])

  useGSAP(() => {
    if (isLoading || activities.length === 0) return;

    // Scroll reveal animation for the header
    gsap.from(\".activities-header\", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: \"top 80%\",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: \"power2.out\"
    })

    // Scroll reveal animation for the slider container
    gsap.from(\".activities-slider-container\", {
      scrollTrigger: {
        trigger: \".activities-slider-container\",
        start: \"top 85%\",
      },
      scale: 0.95,
      y: 40,
      opacity: 0,
      duration: 1,
      ease: \"power3.out\"
    })

    // Scroll reveal animation for the bottom CTA
    gsap.from(\".activities-cta\", {
      scrollTrigger: {
        trigger: \".activities-cta\",
        start: \"top 90%\",
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: \"power2.out\"
    })
  }, { scope: containerRef, dependencies: [isLoading, activities.length] })

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

  if (isLoading) {
    return (
      <div className=\"container mx-auto px-4 py-12 min-h-[600px] flex flex-col justify-center items-center\">
        <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4\"></div>
        <p className=\"text-muted-foreground\">جاري تحميل الأنشطة...</p>
      </div>
    )
  }

  if (error || activities.length === 0) {
    return (
      <div className=\"container mx-auto px-4 py-12 min-h-[400px] flex flex-col justify-center items-center text-center\">
        <h2 className=\"text-3xl md:text-4xl font-bold text-foreground mb-4\">أنشطتنا المميزة</h2>
        <div className=\"w-20 h-1 bg-primary rounded-full mb-8\" />
        <p className=\"text-lg text-muted-foreground mb-6\">{error || \"لا توجد أنشطة متاحة حالياً\"}</p>
        {error && (
          <Button onClick={() => window.location.reload()} variant=\"outline\">
            إعادة المحاولة
          </Button>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className=\"container mx-auto px-4 overflow-hidden\">
      <div className=\"activities-header text-center mb-16\">
        <h2 className=\"text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6 inline-block\">أنشطتنا المميزة</h2>
        <p className=\"text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed\">
          اكتشف عالماً من الأنشطة الشبابية المثيرة والتجارب التي لا تُنسى
        </p>
        <div className=\"w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full opacity-80\" />
      </div>

      {/* Auto-Slider Design */}
      <div
        className=\"activities-slider-container relative max-w-6xl mx-auto\"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Slider Container */}
        <div className=\"relative w-full h-[30rem] md:h-[36rem] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-primary/20\">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                index === currentSlide 
                  ? 'opacity-100 translate-x-0 scale-100 z-10' 
                  : index < currentSlide 
                    ? 'opacity-0 -translate-x-full scale-95 z-0' 
                    : 'opacity-0 translate-x-full scale-95 z-0'
              }`}
            >
              <Card
                className=\"relative w-full h-full border-0 rounded-none cursor-pointer overflow-hidden group\"
                onClick={() => handleCardClick(activity)}
              >
                <div className=\"absolute inset-0 bg-black\">
                  <img
                    src={activity.images && activity.images[0] ? `${baseURL}${activity.images[0]}` : \"/placeholder.svg\"}
                    alt={activity.title}
                    className=\"w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1 opacity-90\"
                  />
                  <div className=\"absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/95\" />
                </div>

                <div className=\"relative z-20 h-full flex flex-col justify-end p-6 md:p-12 pb-16\">
                  <div className=\"transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0\">
                    <h3 className=\"text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md group-hover:text-primary transition-colors duration-300\">
                      {activity.title}
                    </h3>

                    <p className=\"hidden sm:block text-white/90 mb-8 text-lg md:text-xl line-clamp-2 md:line-clamp-3 max-w-3xl drop-shadow-sm font-medium\">
                      {activity.description}
                    </p>

                    <div className=\"flex flex-wrap items-center gap-4 md:gap-8 text-white/90 mb-8 backdrop-blur-sm bg-black/20 p-4 rounded-2xl w-fit border border-white/10\">
                      <div className=\"flex items-center gap-2 font-medium\">
                        <div className=\"bg-primary/20 p-2 rounded-full\"><Calendar className=\"w-5 h-5 text-primary-foreground\" /></div>
                        {activity.date}
                      </div>
                      <div className=\"w-1 h-1 rounded-full bg-white/50 hidden md:block\" />
                      <div className=\"flex items-center gap-2 font-medium\">
                        <div className=\"bg-secondary/20 p-2 rounded-full\"><MapPin className=\"w-5 h-5 text-secondary-foreground\" /></div>
                        {activity.location}
                      </div>
                      <div className=\"w-1 h-1 rounded-full bg-white/50 hidden md:block\" />
                      <div className=\"flex items-center gap-2 font-medium\">
                        <div className=\"bg-accent/20 p-2 rounded-full\"><Users className=\"w-5 h-5 text-accent-foreground\" /></div>
                        {activity.participants}
                      </div>
                    </div>

                    <Button
                      size=\"lg\"
                      className=\"w-fit shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl bg-primary text-primary-foreground text-lg px-8 py-6 rounded-full !cursor-pointer group/btn\"
                      onClick={(e) => handleMoreClick(e, activity)}
                    >
                      <span>اعرف التفاصيل</span>
                      <ArrowLeft className=\"w-5 h-5 mr-3 transition-transform group-hover/btn:-translate-x-1\" />
                    </Button>
                  </div>
                </div>

                {/* Floating Icons */}
                <div className=\"absolute top-6 left-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0 z-20\">
                  <div className=\"bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-colors border border-white/20 shadow-lg\">
                    <Camera className=\"w-5 h-5 text-white\" />
                  </div>
                  <div className=\"bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-colors border border-white/20 shadow-lg\">
                    <Video className=\"w-5 h-5 text-white\" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div
          className={`absolute inset-y-0 right-4 flex items-center transition-all duration-300 z-30 ${showControls ? \"opacity-100 translate-x-0\" : \"opacity-0 translate-x-4 md:opacity-100 md:translate-x-0\"}`}
        >
          <Button
            variant=\"ghost\"
            size=\"icon\"
            onClick={nextSlide}
            className=\"w-12 h-12 bg-black/40 backdrop-blur-md text-white hover:bg-primary/80 hover:text-white rounded-full shadow-lg border border-white/10 !cursor-pointer transition-colors\"
          >
            <ChevronRight className=\"w-8 h-8 opacity-80\" />
          </Button>
        </div>
        
        <div
          className={`absolute inset-y-0 left-4 flex items-center transition-all duration-300 z-30 ${showControls ? \"opacity-100 translate-x-0\" : \"opacity-0 -translate-x-4 md:opacity-100 md:translate-x-0\"}`}
        >
          <Button
            variant=\"ghost\"
            size=\"icon\"
            onClick={prevSlide}
            className=\"w-12 h-12 bg-black/40 backdrop-blur-md text-white hover:bg-primary/80 hover:text-white rounded-full shadow-lg border border-white/10 !cursor-pointer transition-colors\"
          >
            <ChevronLeft className=\"w-8 h-8 opacity-80\" />
          </Button>
        </div>

        {/* Slide Indicators inside slider instead of below */}
        <div className=\"absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-3 z-30 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10\">
          {activities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? \"w-8 bg-primary\" : \"w-2 bg-white/50 hover:bg-white/80\"
                }`}
            />
          ))}
          <div className=\"w-[1px] h-3 bg-white/30 mx-1 self-center\" />
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className=\"text-xs font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1 cursor-pointer\"
          >
            {isAutoPlaying ? \"إيقاف\" : \"تشغيل\"}
          </button>
        </div>
      </div>

      {/* Call to Action */}
      <div className=\"activities-cta text-center mt-20\">
        <Button
          variant=\"outline\"
          size=\"lg\"
          className=\"text-lg px-10 py-6 rounded-full border-2 hover:bg-secondary/10 hover:text-secondary-foreground transition-all hover:-translate-y-1 !cursor-pointer shadow-sm group\"
          onClick={() => navigateToActivityPage()}
        >
          شاهد الأرشيف الكامل
          <ArrowLeft className=\"w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1\" />
        </Button>
      </div>
    </div>
  )
}
""")
