"use client"
import { fetchAllData } from "../app/api/api";
import { News } from "../app/api/type";
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Bell,
  Megaphone,
  Trophy,
  Star,
  Users,
  ArrowLeft,
  Share2,
} from "lucide-react"

// خريطة ترجمة أنواع الأخبار
const categoryTranslation = {
  "announcement": "إعلان",
  "achievement": "إنجاز",
  "reminder": "تذكير",
  "workshop": "ورشة",
  "initiative": "مبادرة"
};

// دالة للحصول على النص العربي للفئة
const getCategoryDisplayText = (category: string) => {
  return categoryTranslation[category as keyof typeof categoryTranslation] || category;
};

// مصفوفات القيم العشوائية
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

const iconOptions = [Megaphone, Users, Star, Bell, Trophy];

// دوال للحصول على قيم عشوائية
const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];
const getRandomBgColor = () => bgColorOptions[Math.floor(Math.random() * bgColorOptions.length)];
const getRandomIcon = () => iconOptions[Math.floor(Math.random() * iconOptions.length)];

// دالة لتوليد خصائص عشوائية للخبر
const generateRandomProps = (newsItem: News) => ({
  ...newsItem,
  randomColor: getRandomColor(),
  randomBgColor: getRandomBgColor(),
  randomIcon: getRandomIcon()
});

// نوع محدث للأخبار مع الخصائص العشوائية
type NewsWithRandomProps = News & {
  randomColor: string;
  randomBgColor: string;
  randomIcon: React.ComponentType<{ className?: string }>;
};

export function NewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // حالات البيانات من API
  const [news, setNews] = useState<NewsWithRandomProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // حالات واجهة المستخدم
  const [selectedArticle, setSelectedArticle] = useState<NewsWithRandomProps | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const news_number_show = 6;
  // إعدادات التمرير اللامتناهي للأخبار العادية
  const [displayedRegularNews, setDisplayedRegularNews] = useState(news_number_show);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreRegular, setHasMoreRegular] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const REGULAR_NEWS_PER_LOAD = news_number_show;

  // فئات الفلتر - استخدام القيم الإنجليزية التي يرسلها الـ API
  const categories = [
    { value: "all", label: "الكل" },
    { value: "announcement", label: "إعلان" },
    { value: "achievement", label: "إنجاز" },
    { value: "reminder", label: "تذكير" },
    { value: "workshop", label: "ورشة" },
    { value: "initiative", label: "مبادرة" }
  ];

  // جلب البيانات من API
  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllData();

        if (data && data.news && Array.isArray(data.news)) {
          // إضافة الخصائص العشوائية لكل خبر
          const newsWithRandomProps = data.news.map(newsItem => generateRandomProps(newsItem));
          setNews(newsWithRandomProps);
        } else {
          throw new Error('البيانات المستلمة غير صحيحة');
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError('حدث خطأ في تحميل البيانات');
        setNews([]);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    loadNews();
  }, []);

  useEffect(() => {
    if (mounted && news.length > 0) {
      const articleId = searchParams.get('articleId');
      if (articleId) {
        const article = news.find(item => item.id === parseInt(articleId));
        if (article) {
          setSelectedArticle(article);
          // تنظيف الرابط
          const url = new URL(window.location.href);
          url.searchParams.delete('articleId');
          window.history.replaceState({}, '', url.toString());
        }
      }
    }
  }, [mounted, news, searchParams]);

  // تصفية الأخبار - تحديث المنطق ليتطابق مع قيم الـ API
  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())

    // مقارنة القيم الإنجليزية مباشرة
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredNews = filteredNews.filter((article) => article.featured)
  const regularNews = filteredNews.filter((article) => !article.featured)

  // تحديث حالة "يوجد المزيد" للأخبار العادية
  useEffect(() => {
    setHasMoreRegular(displayedRegularNews < regularNews.length);
  }, [displayedRegularNews, regularNews.length]);

  // التمرير اللامتناهي للأخبار العادية
  useEffect(() => {
    if (!mounted || !hasMoreRegular || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRegularNews();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [mounted, hasMoreRegular, isLoadingMore, displayedRegularNews]);

  // دالة تحميل المزيد من الأخبار العادية
  const loadMoreRegularNews = async () => {
    if (isLoadingMore || !hasMoreRegular) return;

    setIsLoadingMore(true);

    // محاكاة تأخير التحميل
    await new Promise(resolve => setTimeout(resolve, 800));

    const newDisplayedCount = Math.min(displayedRegularNews + REGULAR_NEWS_PER_LOAD, regularNews.length);
    setDisplayedRegularNews(newDisplayedCount);
    setIsLoadingMore(false);
  };


  // إعادة تعيين عدد الأخبار المعروضة عند تغيير الفلتر
  useEffect(() => {
    setDisplayedRegularNews(REGULAR_NEWS_PER_LOAD);
  }, [searchTerm, selectedCategory]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">جاري تحميل الأخبار...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-red-500">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  // الأخبار العادية المعروضة حالياً
  const currentRegularNews = regularNews.slice(0, displayedRegularNews);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">أخبار وإعلانات الجمعية</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          ابق على اطلاع بآخر أخبار الجمعية، الإنجازات، والفعاليات القادمة
        </p>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="ابحث في الأخبار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-muted-foreground mt-2" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="rounded-full !cursor-pointer"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredNews.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">الأخبار المميزة</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredNews.map((article, index) => {
              const Icon = article.randomIcon
              return (
                <Card
                  key={article.id}
                  className="overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative">
                    <img
                      src={`${baseURL}${article.image || "/placeholder.svg"}`}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className={`absolute top-4 right-4 ${article.randomBgColor} ${article.randomColor} border-0`}>
                      <Icon className="w-4 h-4 ml-1" />
                      {getCategoryDisplayText(article.category)}
                    </Badge>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {article.date ? new Date(article.date).toLocaleDateString("en-US") : ""}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.time || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Regular Articles مع التمرير اللامتناهي */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">جميع الأخبار</h2>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            عرض {currentRegularNews.length} من {regularNews.length}
          </Badge>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل الأخبار...</p>
          </div>
        ) : currentRegularNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">لا توجد أخبار متاحة حالياً</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentRegularNews.map((article, index) => {
              const Icon = article.randomIcon
              const isLiked = false // likes removed

              return (
                <Card
                  key={article.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex flex-col md:flex-row">
                    <img
                      src={`${baseURL}${article.image || "/placeholder.svg"}`}
                      alt={article.title}
                      className="w-full md:w-48 h-32 md:h-auto object-cover"
                      loading={index < news_number_show ? "eager" : "lazy"}
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${article.randomBgColor} ${article.randomColor} border-0`}>
                          <Icon className="w-4 h-4 ml-1" />
                          {getCategoryDisplayText(article.category)}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {article.date ? new Date(article.date).toLocaleDateString("en-US") : ""}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.time || ""}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Share2 className="w-4 h-4" />
                            مشاركة
                          </button>
                        </div>

                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 !cursor-pointer">
                          اقرأ المزيد
                          <ArrowLeft className="w-4 h-4 mr-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* مؤشر التحميل للأخبار العادية */}
        {hasMoreRegular && regularNews.length > 0 && (
          <div
            ref={loadMoreRef}
            className="flex justify-center py-12"
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-lg text-muted-foreground">جاري تحميل المزيد من الأخبار...</span>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="animate-pulse">
                  <div className="w-2 h-2 bg-primary rounded-full inline-block mx-1"></div>
                  <div className="w-2 h-2 bg-primary rounded-full inline-block mx-1 animation-delay-200"></div>
                  <div className="w-2 h-2 bg-primary rounded-full inline-block mx-1 animation-delay-400"></div>
                </div>
                <p className="mt-2">مرر لأسفل لرؤية المزيد</p>
              </div>
            )}
          </div>
        )}

        {/* رسالة انتهاء قائمة الأخبار العادية */}
        {!hasMoreRegular && regularNews.length > REGULAR_NEWS_PER_LOAD && (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Megaphone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">تم عرض جميع الأخبار</h3>
              <p className="text-muted-foreground">لقد اطلعت على جميع الـ {regularNews.length} خبراً المتاحين!</p>
            </div>
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="w-[90vw] max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[50vw] lg:max-w-[50vw] max-h-[95vh] overflow-y-auto overflow-x-hidden">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={`${selectedArticle.randomBgColor} ${selectedArticle.randomColor} border-0`}>
                    <selectedArticle.randomIcon className="w-4 h-4 ml-1" />
                    {getCategoryDisplayText(selectedArticle.category)}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedArticle.date ? new Date(selectedArticle.date).toLocaleDateString("en-US") : ""}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedArticle.time || ""}
                    </div>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold text-right leading-relaxed">
                  {selectedArticle.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <img
                  src={`${baseURL}${selectedArticle.image || "/placeholder.svg"}`}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="prose prose-lg max-w-none text-right" dir="rtl">
                  {selectedArticle.content?.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  )) || <p>لا يوجد محتوى متاح</p>}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground">بواسطة: {selectedArticle.author || "غير محدد"}</div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Share2 className="w-4 h-4 ml-1" />
                      مشاركة
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}