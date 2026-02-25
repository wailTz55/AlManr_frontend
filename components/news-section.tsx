"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchAllData } from "../app/api/api"
import { News } from "../app/api/type"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Bell, Megaphone, Trophy, Users, Star } from "lucide-react"
import Image from "next/image"

// مصفوفات القيم العشوائية للأيقونات والألوان
const colorOptions = [
  "text-primary",
  "text-secondary",
  "text-accent",
  "text-chart-3",
  "text-chart-4"
];

const bgColorOptions = [
  "bg-primary/10",
  "bg-secondary/10",
  "bg-accent/10",
  "bg-chart-3/10",
  "bg-chart-4/10"
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
  randomImage: newsItem.image ? newsItem.image : "/placeholder.svg"
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

  // دالة للانتقال إلى صفحة الأخبار مع تمرير معرف الخبر
  const navigateToNewsPage = (newsId?: number) => {
    if (newsId) {
      router.push(`/news?articleId=${newsId}`)
    } else {
      router.push('/news')
    }
  }

  // دالة للتعامل مع النقر على البطاقة
  const handleCardClick = (item: NewsWithRandomProps) => {
    const isCurrentlyExpanded = expandedNews === item.id

    if (isCurrentlyExpanded) {
      // إذا كان الخبر موسعاً، انتقل إلى صفحة الأخبار مع تفاصيل الخبر
      navigateToNewsPage(item.id)
    } else {
      // وسع الخبر أولاً
      setExpandedNews(item.id)
    }
  }

  // دالة للتعامل مع النقر على زر "المزيد"
  const handleMoreClick = (e: React.MouseEvent, item: NewsWithRandomProps) => {
    e.stopPropagation() // منع تفعيل النقر على البطاقة
    navigateToNewsPage(item.id)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">الأخبار والإعلانات</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ابق على اطلاع بآخر أخبار الجمعية وفعالياتها القادمة
          </p>
          <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full" />
        </div>

        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الأخبار...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">الأخبار والإعلانات</h2>
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

  if (latestNews.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">الأخبار والإعلانات</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ابق على اطلاع بآخر أخبار الجمعية وفعالياتها القادمة
          </p>
          <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full" />
        </div>

        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">لا توجد أخبار متاحة حالياً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">الأخبار والإعلانات</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ابق على اطلاع بآخر أخبار الجمعية وفعالياتها القادمة
        </p>
        <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full" />
      </div>

      {/* Timeline Layout */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Timeline Line */}
        <div className="absolute right-1/2 transform translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent rounded-full" />

        <div className="space-y-12">
          {latestNews.map((item, index) => {
            const Icon = item.randomIcon
            const isExpanded = expandedNews === item.id

            return (
              <div
                key={item.id}
                className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"
                  } animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Timeline Node */}
                <div className="hidden sm:flex absolute right-1/2 transform translate-x-1/2 w-8 h-8 bg-background border-4 border-primary rounded-full items-center justify-center z-10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>

                {/* News Card */}
                <Card
                  className={`w-96 transition-all duration-500 cursor-pointer hover:shadow-xl ${index % 2 === 0 ? "ml-8" : "mr-8"
                    } ${isExpanded ? "scale-105" : "hover:scale-102"} overflow-hidden`}
                  onClick={() => handleCardClick(item)}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.randomImage.startsWith("/") && item.randomImage === "/placeholder.svg" ? item.randomImage : `${baseURL}${item.randomImage}`}
                      alt={item.title}
                      width={320}
                      height={192}
                      className="w-full h-full object-cover"
                    />

                    {/* Category Badge */}
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 ${item.randomBgColor} ${item.randomColor} rounded-full text-sm font-medium backdrop-blur-sm`}
                    >
                      {item.category}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-3 hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    <p
                      className={`text-muted-foreground mb-4 transition-all duration-300 ${isExpanded ? "line-clamp-none" : "line-clamp-2"
                        }`}
                    >
                      {isExpanded ? item.content : item.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.date ? new Date(item.date).toLocaleDateString("en-US") : ""}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.time || ""}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/10 !cursor-pointer"
                        onClick={(e) => handleMoreClick(e, item)}
                      >
                        {isExpanded ? "التفاصيل الكاملة" : "المزيد"}
                        <ArrowLeft className="w-4 h-4 mr-1" />
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
      <div className="text-center mt-16">
        <Button
          size="lg"
          variant="outline"
          className="text-lg px-8 py-4 rounded-full bg-transparent !cursor-pointer"
          onClick={() => navigateToNewsPage()}
        >
          عرض جميع الأخبار
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    </div>
  )
}