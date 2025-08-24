"use client"
import { fetchAllData } from "../app/api/api";
import { Activity } from "../app/api/type";
import { useState, useEffect, useLayoutEffect } from "react"
import { useState } from "react"
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

const newsArticles = [
  {
    id: 1,
    title: "إطلاق برنامج المنح الدراسية للشباب المتميز 2024",
    excerpt: "نعلن عن إطلاق برنامج جديد لدعم الشباب الموهوب في مجال التعليم العالي والتخصصات المتقدمة",
    content: `
      يسعدنا في جمعية المنار للشباب أن نعلن عن إطلاق برنامج المنح الدراسية للعام 2024، والذي يهدف إلى دعم الشباب المتميز أكاديمياً ومساعدتهم في تحقيق أحلامهم التعليمية.

      يشمل البرنامج:
      • منح دراسية كاملة للجامعات المحلية والدولية
      • دعم مالي للكتب والمواد الدراسية
      • برامج تدريبية وورش عمل متخصصة
      • إرشاد أكاديمي ومهني من خبراء في المجال

      شروط التقديم:
      - أن يكون المتقدم عضواً في الجمعية لمدة لا تقل عن 6 أشهر
      - معدل أكاديمي لا يقل عن 3.5 من 4.0
      - تقديم خطة دراسية واضحة ومشروع تخرج مبتكر
      - اجتياز المقابلة الشخصية واختبار الكفاءة

      آخر موعد للتقديم: 30 أغسطس 2024
    `,
    date: "2024-08-01",
    time: "10:00 ص",
    author: "إدارة الجمعية",
    category: "إعلان",
    type: "announcement",
    icon: Megaphone,
    color: "text-primary",
    bgColor: "bg-primary/10",
    image: "/scholarship-announcement.png",
    views: 245,
    likes: 89,
    featured: true,
  },
  {
    id: 2,
    title: "فوز فريق الجمعية في مسابقة الإبداع الشبابي الوطنية",
    excerpt: "حقق فريقنا المركز الأول في المسابقة الوطنية للإبداع والابتكار بمشروع تطبيق ذكي لخدمة المجتمع",
    content: `
      في إنجاز مميز يضاف إلى سجل نجاحات جمعية المنار، حقق فريق من أعضائنا المركز الأول في المسابقة الوطنية للإبداع والابتكار الشبابي.

      تفاصيل الإنجاز:
      • المشروع الفائز: تطبيق "مساعد المجتمع" الذكي
      • قيمة الجائزة: 50,000 ريال سعودي
      • عدد الفرق المشاركة: 150 فريق من جميع أنحاء المملكة
      • مدة العمل على المشروع: 6 أشهر

      أعضاء الفريق الفائز:
      - أحمد محمد العلي (قائد الفريق)
      - فاطمة سالم الزهراني (مطورة التطبيق)
      - خالد عبدالله الشمري (مصمم واجهات المستخدم)
      - نورا أحمد القحطاني (محللة البيانات)

      يهدف التطبيق إلى ربط المتطوعين بالمحتاجين في المجتمع من خلال منصة ذكية تستخدم الذكاء الاصطناعي لتحليل الاحتياجات وتوجيه المساعدة بشكل فعال.
    `,
    date: "2024-07-28",
    time: "2:30 م",
    author: "فريق الإعلام",
    category: "إنجاز",
    type: "achievement",
    icon: Trophy,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    image: "/innovation-award-ceremony.png",
    views: 189,
    likes: 156,
    featured: true,
  },
  {
    id: 3,
    title: "تذكير: اجتماع الجمعية العمومية الشهري",
    excerpt: "ندعو جميع الأعضاء لحضور الاجتماع الشهري المقرر يوم السبت القادم لمناقشة الخطط المستقبلية",
    content: `
      يسعدنا دعوتكم لحضور الاجتماع الشهري للجمعية العمومية والذي سيعقد يوم السبت الموافق 10 أغسطس 2024.

      جدول الأعمال:
      • مراجعة إنجازات الشهر الماضي
      • مناقشة الخطط والمشاريع القادمة
      • تقرير مالي شهري
      • اقتراحات ومبادرات الأعضاء الجديدة
      • انتخاب لجنة تنظيم الفعالية السنوية

      تفاصيل الاجتماع:
      - التاريخ: السبت 10 أغسطس 2024
      - الوقت: 6:00 مساءً - 8:00 مساءً
      - المكان: قاعة المؤتمرات - مركز الشباب الثقافي
      - الحضور: جميع الأعضاء المسجلين

      ملاحظات مهمة:
      • يرجى تأكيد الحضور قبل يوم من الاجتماع
      • سيتم تقديم وجبة عشاء خفيفة
      • سيتم توثيق الاجتماع بالصور والفيديو
    `,
    date: "2024-08-05",
    time: "6:00 م",
    author: "سكرتير الجمعية",
    category: "تذكير",
    type: "reminder",
    icon: Bell,
    color: "text-accent",
    bgColor: "bg-accent/10",
    image: "/general-assembly-meeting.png",
    views: 98,
    likes: 34,
    featured: false,
  },
  {
    id: 4,
    title: "ورشة تطوير المهارات القيادية - التسجيل مفتوح",
    excerpt: "انضموا إلينا في ورشة شاملة لتطوير المهارات القيادية مع خبراء في مجال التنمية البشرية",
    content: `
      تنظم جمعية المنار ورشة متخصصة في تطوير المهارات القيادية للشباب، بالتعاون مع معهد التنمية البشرية المتقدمة.

      محاور الورشة:
      • أساسيات القيادة الفعالة
      • مهارات التواصل والإقناع
      • إدارة الفرق والمشاريع
      • حل المشكلات واتخاذ القرارات
      • القيادة في العصر الرقمي

      المدربون:
      - د. سارة أحمد - خبيرة التنمية البشرية
      - أ. محمد الخالدي - مستشار إداري
      - أ. ليلى الزهراني - مدربة مهارات التواصل

      تفاصيل الورشة:
      - المدة: 3 أيام (الجمعة - الأحد)
      - التاريخ: 16-18 أغسطس 2024
      - الوقت: 9:00 ص - 4:00 م يومياً
      - المكان: مركز التدريب المتقدم
      - عدد المقاعد: 25 مقعد فقط
      - رسوم التسجيل: 200 ريال (تشمل المواد التدريبية والوجبات)
    `,
    date: "2024-08-03",
    time: "11:30 ص",
    author: "قسم التدريب",
    category: "ورشة",
    type: "workshop",
    icon: Star,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    image: "/leadership-skills-workshop.png",
    views: 167,
    likes: 78,
    featured: false,
  },
  {
    id: 5,
    title: "إطلاق مبادرة 'شباب من أجل البيئة'",
    excerpt: "مبادرة جديدة تهدف إلى زيادة الوعي البيئي وتنظيم حملات تطوعية للمحافظة على البيئة",
    content: `
      تفخر جمعية المنار بإطلاق مبادرة "شباب من أجل البيئة" كجزء من التزامنا بالمسؤولية الاجتماعية والبيئية.

      أهداف المبادرة:
      • نشر الوعي البيئي بين الشباب
      • تنظيم حملات تنظيف دورية
      • زراعة الأشجار في المناطق العامة
      • تقليل استخدام البلاستيك
      • تعزيز ثقافة إعادة التدوير

      الأنشطة المخططة:
      - حملة تنظيف الشواطئ الشهرية
      - ورش توعية في المدارس والجامعات
      - مسابقة أفضل مشروع بيئي
      - معرض للمنتجات الصديقة للبيئة
      - رحلات استكشافية للمحميات الطبيعية

      كيفية المشاركة:
      يمكن لجميع الأعضاء والمهتمين التسجيل في المبادرة من خلال موقعنا الإلكتروني أو زيارة مقر الجمعية.
    `,
    date: "2024-07-30",
    time: "3:15 م",
    author: "لجنة البيئة",
    category: "مبادرة",
    type: "initiative",
    icon: Users,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    image: "/environmental-initiative.png",
    views: 134,
    likes: 92,
    featured: false,
  },
]

export function NewsPage() {

  const [selectedArticle, setSelectedArticle] = useState<(typeof newsArticles)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [likedArticles, setLikedArticles] = useState<number[]>([])

  const categories = ["all", "إعلان", "إنجاز", "تذكير", "ورشة", "مبادرة"]

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredArticles = filteredArticles.filter((article) => article.featured)
  const regularArticles = filteredArticles.filter((article) => !article.featured)

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllData();

        if (data && data.news && Array.isArray(data.news)) {
          setActivities(data.news);
        } else {
          throw new Error('البيانات المستلمة غير صحيحة');
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError('حدث خطأ في تحميل البيانات');
        // يمكنك إضافة بيانات افتراضية هنا إذا لزم الأمر
        setActivities([]);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    loadActivities();
  }, []);

  const toggleLike = (articleId: number) => {
    setLikedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId],
    )
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
      {featuredArticles.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">الأخبار المميزة</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredArticles.map((article, index) => {
              const Icon = article.icon
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
                    <Badge className={`absolute top-4 right-4 ${article.bgColor} ${article.color} border-0`}>
                      <Icon className="w-4 h-4 ml-1" />
                      {article.category}
                    </Badge>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.date).toLocaleDateString("ar-SA")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.time}
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
        <div className="space-y-6">
          {regularArticles.map((article, index) => {
            const Icon = article.icon
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
                      <Badge className={`${article.bgColor} ${article.color} border-0`}>
                        <Icon className="w-4 h-4 ml-1" />
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.date).toLocaleDateString("ar-SA")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.time}
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
                          {article.views}
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
                          {article.likes + (isLiked ? 1 : 0)}
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
      </div>

      {/* Article Detail Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="w-[90vw] max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[50vw] lg:max-w-[50vw] max-h-[95vh] overflow-y-auto overflow-x-hidden">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={`${selectedArticle.bgColor} ${selectedArticle.color} border-0`}>
                    <selectedArticle.icon className="w-4 h-4 ml-1" />
                    {selectedArticle.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedArticle.date).toLocaleDateString("ar-SA")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedArticle.time}
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
                  {selectedArticle.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground">بواسطة: {selectedArticle.author}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {selectedArticle.views} مشاهدة
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
                      {selectedArticle.likes + (likedArticles.includes(selectedArticle.id) ? 1 : 0)} إعجاب
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
