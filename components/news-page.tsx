"use client"
import { fetchAllData } from "../app/api/api";
import { News } from "../app/api/type"; // استخدام الملف الموجود
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Eye,
  Heart,
  Share2,
} from "lucide-react"

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
  // حالات البيانات من API
  const [news, setNews] = useState<NewsWithRandomProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // حالات واجهة المستخدم
  const [selectedArticle, setSelectedArticle] = useState<NewsWithRandomProps | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [likedArticles, setLikedArticles] = useState<number[]>([])

  const categories = ["all", "إعلان", "إنجاز", "تذكير", "ورشة", "مبادرة"]

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

  // تصفية الأخبار
  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredNews = filteredNews.filter((article) => article.featured)
  const regularNews = filteredNews.filter((article) => !article.featured)

  const toggleLike = (articleId: number) => {
    setLikedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId],
    )
  }

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
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category === "all" ? "الكل" : category}
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
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className={`absolute top-4 right-4 ${article.randomBgColor} ${article.randomColor} border-0`}>
                      <Icon className="w-4 h-4 ml-1" />
                      {article.category}
                    </Badge>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {article.date ? new Date(article.date).toLocaleDateString("ar-SA") : ""}
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

      {/* Regular Articles */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">جميع الأخبار</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل الأخبار...</p>
          </div>
        ) : regularNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">لا توجد أخبار متاحة حالياً</p>
          </div>
        ) : (
          <div className="space-y-6">
            {regularNews.map((article, index) => {
              const Icon = article.randomIcon
              const isLiked = likedArticles.includes(article.id)

              return (
                <Card
                  key={article.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex flex-col md:flex-row">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full md:w-48 h-32 md:h-auto object-cover"
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${article.randomBgColor} ${article.randomColor} border-0`}>
                          <Icon className="w-4 h-4 ml-1" />
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {article.date ? new Date(article.date).toLocaleDateString("ar-SA") : ""}
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
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views || 0}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLike(article.id)
                            }}
                            className={`flex items-center gap-1 transition-colors ${
                              isLiked ? "text-red-500" : "hover:text-red-500"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                            {(article.likes || 0) + (isLiked ? 1 : 0)}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Share2 className="w-4 h-4" />
                            مشاركة
                          </button>
                        </div>

                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
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
                    {selectedArticle.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedArticle.date ? new Date(selectedArticle.date).toLocaleDateString("ar-SA") : ""}
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
                  src={selectedArticle.image || "/placeholder.svg"}
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
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {selectedArticle.views || 0} مشاهدة
                    </div>
                    <button
                      onClick={() => toggleLike(selectedArticle.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        likedArticles.includes(selectedArticle.id) ? "text-red-500" : "hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${likedArticles.includes(selectedArticle.id) ? "fill-current" : ""}`}
                      />
                      {(selectedArticle.likes || 0) + (likedArticles.includes(selectedArticle.id) ? 1 : 0)} إعجاب
                    </button>
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