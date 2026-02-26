with open('components/news-section.tsx', 'w') as f:
    f.write("""\"use client\"

import { useState, useEffect, useRef } from \"react\"
import { useRouter, useSearchParams } from \"next/navigation\"
import { fetchAllData } from \"../app/api/api\"
import { News } from \"../app/api/type\"
import { Card } from \"@/components/ui/card\"
import { Button } from \"@/components/ui/button\"
import { Calendar, Clock, ArrowLeft, Bell, Megaphone, Trophy, Users, Star } from \"lucide-react\"
import Image from \"next/image\"
import gsap from \"gsap\"
import { useGSAP } from \"@gsap/react\"
import { ScrollTrigger } from \"gsap/dist/ScrollTrigger\"

if (typeof window !== \"undefined\") {
  gsap.registerPlugin(ScrollTrigger)
}

// مصفوفات القيم العشوائية للأيقونات والألوان
const colorOptions = [
  \"text-primary\",
  \"text-secondary\",
  \"text-accent\",
  \"text-chart-3\",
  \"text-chart-4\"
];

const bgColorOptions = [
  \"bg-primary/10\",
  \"bg-secondary/10\",
  \"bg-accent/10\",
  \"bg-chart-3/10\",
  \"bg-chart-4/10\"
];

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const iconOptions = [Megaphone, Users, Star, Bell, Trophy];

// دوال للحصول على قيم عشوائية
const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];
const getRandomBgColor = () => bgColorOptions[Math.floor(Math.random() * bgColorOptions.length)];
const getRandomIcon = () => iconOptions[Math.floor(Math.random() * iconOptions.length)];

// دالة لتوليد خصائص عشوائية للخبر
const generateRandomProps = (newsItem: News, index: number) => ({
  ...newsItem,
  randomColor: getRandomColor(),
  randomBgColor: getRandomBgColor(),
  randomIcon: getRandomIcon(),
  randomImage: newsItem.image ? newsItem.image : \"/placeholder.svg\"
});

// نوع محدث للأخبار مع الخصائص العشوائية
type NewsWithRandomProps = News & {
  randomColor: string;
  randomBgColor: string;
  randomIcon: React.ComponentType<{ className?: string }>;
  randomImage: string;
};

export function NewsSection() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [expandedNews, setExpandedNews] = useState<number | null>(null)
  const [latestNews, setLatestNews] = useState<NewsWithRandomProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // جلب أحدث 3 أخبار من API
  useEffect(() => {
    const loadLatestNews = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchAllData()

        if (data && data.news && Array.isArray(data.news)) {
          // أخذ أول 3 أخبار (الأحدث) مع إضافة الخصائص العشوائية
          const latest3News = data.news
            .slice(0, 3)
            .map((newsItem, index) => generateRandomProps(newsItem, index))

          setLatestNews(latest3News)
        } else {
          throw new Error('البيانات المستلمة غير صحيحة')
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err)
        setError('حدث خطأ في تحميل الأخبار')
        setLatestNews([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLatestNews()
  }, [])

  useGSAP(() => {
    if (isLoading || latestNews.length === 0) return;

    // Header animation
    gsap.from(\".news-header\", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: \"top 80%\",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: \"power2.out\"
    })

    // Timeline line growing animation
    gsap.from(\".news-timeline-line\", {
      scrollTrigger: {
        trigger: \".news-timeline-container\",
        start: \"top 75%\",
      },
      scaleY: 0,
      transformOrigin: \"top center\",
      duration: 1.5,
      ease: \"power3.inOut\"
    })

    // News items staggered animation
    const newsItems = gsap.utils.toArray(\".news-item\")
    newsItems.forEach((item: any, i) => {
      const isEven = i % 2 === 0
      
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: \"top 85%\",
        },
        x: isEven ? -50 : 50,
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: \"power3.out\"
      })

      // Animate the timeline node dot
      const node = item.querySelector(\".news-node\")
      if (node) {
        gsap.from(node, {
          scrollTrigger: {
            trigger: item,
            start: \"top 85%\",
          },
          scale: 0,
          rotation: -180,
          duration: 0.6,
          delay: 0.2,
          ease: \"back.out(1.5)\"
        })
      }
    })

    // Bottom CTA button reveal
    gsap.from(\".news-cta\", {
      scrollTrigger: {
        trigger: \".news-cta\",
        start: \"top 90%\",
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: \"power2.out\"
    })
  }, { scope: containerRef, dependencies: [isLoading, latestNews.length] })

  const navigateToNewsPage = (newsId?: number) => {
    if (newsId) {
      router.push(`/news?articleId=${newsId}`)
    } else {
      router.push('/news')
    }
  }

  const handleCardClick = (item: NewsWithRandomProps) => {
    const isCurrentlyExpanded = expandedNews === item.id

    if (isCurrentlyExpanded) {
      navigateToNewsPage(item.id)
    } else {
      setExpandedNews(item.id)
    }
  }

  const handleMoreClick = (e: React.MouseEvent, item: NewsWithRandomProps) => {
    e.stopPropagation() 
    navigateToNewsPage(item.id)
  }

  if (isLoading) {
    return (
      <div className=\"container mx-auto px-4 py-20 min-h-[600px] flex flex-col justify-center items-center\">
        <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4\"></div>
        <p className=\"text-muted-foreground\">جاري تحميل الأخبار...</p>
      </div>
    )
  }

  if (error || latestNews.length === 0) {
    return (
      <div className=\"container mx-auto px-4 py-20 min-h-[400px] flex flex-col justify-center items-center text-center\">
        <h2 className=\"text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4\">الأخبار والإعلانات</h2>
        <div className=\"w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-8\" />
        <p className=\"text-lg text-muted-foreground mb-6\">{error || \"لا توجد أخبار متاحة حالياً\"}</p>
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
      <div className=\"news-header text-center mb-20\">
        <h2 className=\"text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6 inline-block\">الأخبار والإعلانات</h2>
        <p className=\"text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed\">
          ابق على اطلاع بآخر أخبار الجمعية وفعالياتها القادمة
        </p>
        <div className=\"w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full opacity-80\" />
      </div>

      {/* Timeline Layout */}
      <div className=\"news-timeline-container relative max-w-5xl mx-auto\">
        {/* Vertical Timeline Line */}
        <div className=\"news-timeline-line absolute left-1/2 md:left-1/2 transform -translate-x-1/2 w-1.5 h-full bg-gradient-to-b from-primary/80 via-secondary/60 to-accent/40 rounded-full z-0 hidden md:block\" />
        
        {/* Mobile Timeline Line */}
        <div className=\"news-timeline-line absolute right-4 md:hidden transform translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/80 via-secondary/60 to-accent/40 rounded-full z-0\" />

        <div className=\"space-y-16 pt-4\">
          {latestNews.map((item, index) => {
            const Icon = item.randomIcon
            const isExpanded = expandedNews === item.id
            const isEven = index % 2 === 0

            return (
              <div
                key={item.id}
                className={`news-item relative flex flex-col md:flex-row items-center justify-between group ${
                  isEven ? \"md:flex-row\" : \"md:flex-row-reverse\"
                }`}
              >
                {/* Timeline Node */}
                <div className={`news-node absolute md:left-1/2 right-4 md:right-auto transform translate-x-1/2 md:-translate-x-1/2 w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:border-secondary transition-all duration-300`}>
                  <Icon className=\"w-5 h-5 text-primary group-hover:text-secondary transition-colors\" />
                </div>

                {/* Empty Space for Desktop Alternate Layout */}
                <div className=\"hidden md:block w-5/12\"></div>

                {/* News Card */}
                <Card
                  className={`w-[calc(100%-3rem)] md:w-5/12 md:mr-0 z-10 transition-all duration-500 cursor-pointer bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden ${
                    isExpanded 
                      ? \"scale-[1.02] shadow-xl ring-1 ring-primary/20\" 
                      : \"hover:-translate-y-2\"
                  }`}
                  onClick={() => handleCardClick(item)}
                >
                  {/* Image Section */}
                  <div className=\"relative h-56 overflow-hidden\">
                    <Image
                      src={item.randomImage.startsWith(\"/\") && item.randomImage === \"/placeholder.svg\" ? item.randomImage : `${baseURL}${item.randomImage}`}
                      alt={item.title}
                      fill
                      className=\"w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1\"
                    />
                    
                    <div className=\"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300\" />

                    {/* Category Badge */}
                    <div
                      className={`absolute top-4 right-4 px-4 py-1.5 ${item.randomBgColor} ${item.randomColor} rounded-full text-sm font-semibold backdrop-blur-md border border-white/20 shadow-sm`}
                    >
                      {item.category}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className=\"p-8\">
                    <h3 className=\"text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-snug\">
                      {item.title}
                    </h3>

                    <p
                      className={`text-muted-foreground mb-6 transition-all duration-500 text-[15px] leading-relaxed ${
                        isExpanded ? \"line-clamp-none\" : \"line-clamp-2\"
                      }`}
                    >
                      {isExpanded ? item.content : item.excerpt}
                    </p>

                    <div className=\"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50\">
                      <div className=\"flex items-center gap-4 text-sm font-medium text-muted-foreground\">
                        <div className=\"flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-md\">
                          <Calendar className=\"w-4 h-4 text-secondary\" />
                          <span dir=\"ltr\">{item.date ? new Date(item.date).toLocaleDateString(\"en-US\") : \"\"}</span>
                        </div>
                        {item.time && (
                          <div className=\"flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-md\">
                            <Clock className=\"w-4 h-4 text-accent\" />
                            <span dir=\"ltr\">{item.time}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        variant=\"ghost\"
                        className=\"text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 !cursor-pointer rounded-full px-6\"
                        onClick={(e) => handleMoreClick(e, item)}
                      >
                        {isExpanded ? \"التفاصيل الكاملة\" : \"اقرأ المزيد\"}
                        <ArrowLeft className=\"w-4 h-4 mr-2\" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className=\"news-cta text-center mt-20\">
        <Button
          size=\"lg\"
          variant=\"outline\"
          className=\"text-lg px-10 py-6 rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-secondary/10 hover:text-secondary-foreground transition-all duration-300 hover:-translate-y-1 !cursor-pointer shadow-sm group\"
          onClick={() => navigateToNewsPage()}
        >
          عرض جميع الأخبار
          <ArrowLeft className=\"w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1\" />
        </Button>
      </div>
    </div>
  )
}
""")
