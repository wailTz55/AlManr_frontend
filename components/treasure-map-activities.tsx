"use client"

import { fetchAllData } from "../app/api/api";
import { Activity } from "../app/api/type";
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Users, Camera, Video, Award, Clock, Star, ChevronLeft, ChevronRight, Play, UserCheck, CheckCircle, Building2, X, Plus } from "lucide-react"

export function TreasureMapActivities() {
  const { toast } = useToast()
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const searchParams = useSearchParams()
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [visibleActivities, setVisibleActivities] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedActivities, setLikedActivities] = useState<Set<number>>(new Set());
  const [savedActivities, setSavedActivities] = useState<Set<number>>(new Set());
  const card_number = 20;
  // إعدادات التمرير اللامتهي
  const [displayedItems, setDisplayedItems] = useState(card_number);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_LOAD = card_number;

  // isLoggedIn: simulate association login (set to false for mock purposes)
  const [isLoggedIn] = useState(false)
  // Track which activityId the current user's association is registered for
  const [registeredActivityIds, setRegisteredActivityIds] = useState<Set<number>>(new Set())
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [registeringActivity, setRegisteringActivity] = useState<Activity | null>(null)
  const [regFormData, setRegFormData] = useState({ assocName: "", email: "", phone: "" })
  const [regSuccess, setRegSuccess] = useState(false)
  // Participants list for the current registration
  const [participantsList, setParticipantsList] = useState<{ id: string, name: string, age: string, category: string }[]>([])
  const [currentParticipant, setCurrentParticipant] = useState({ name: "", age: "", category: "" })

  // جلب البيانات من API مع معالجة الأخطاء
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllData();

        if (data && data.activities && Array.isArray(data.activities)) {
          setActivities(data.activities);
          // تحديث حالة "يوجد المزيد" بناءً على البيانات المحملة
          setHasMore(data.activities.length > displayedItems);
        } else {
          throw new Error('البيانات المستلمة غير صحيحة');
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError('حدث خطأ في تحميل البيانات');
        setActivities([]);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    loadActivities();
  }, []);

  // التحقق من وجود معرف نشاط في URL وعرضه مباشرة
  useEffect(() => {
    if (!mounted || activities.length === 0) return;

    const activityId = searchParams.get('activityId');
    if (activityId) {
      const activity = activities.find(a => a.id === parseInt(activityId));
      if (activity) {
        setSelectedActivity(activity);
        setCurrentImageIndex(0);
      }
    }
  }, [searchParams, activities, mounted]);

  // مراقبة العناصر المرئية (للرسوم المتحركة)
  useEffect(() => {
    if (!mounted || activities.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activityId = Number.parseInt(entry.target.getAttribute("data-activity-id") || "0");
            setVisibleActivities((prev) => new Set([...prev, activityId]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const activityElements = document.querySelectorAll("[data-activity-id]");
    activityElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted, activities, displayedItems]); // إضافة displayedItems للتبعيات

  // التمرير اللامتهي - مراقبة نقطة التحميل
  useEffect(() => {
    if (!mounted || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // بدء التحميل قبل 100px من الوصول للنهاية
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [mounted, hasMore, isLoadingMore, displayedItems, activities.length]);

  // دالة تحميل المزيد من البطاقات
  const loadMoreItems = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // محاكاة تأخير التحميل لتجربة أفضل
    await new Promise(resolve => setTimeout(resolve, 800));

    const newDisplayedItems = Math.min(displayedItems + ITEMS_PER_LOAD, activities.length);
    setDisplayedItems(newDisplayedItems);

    // تحديث حالة "يوجد المزيد"
    setHasMore(newDisplayedItems < activities.length);
    setIsLoadingMore(false);
  };

  // باقي الدوال كما هي
  const nextImage = () => {
    if (selectedActivity && selectedActivity.images && selectedActivity.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedActivity.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedActivity && selectedActivity.images && selectedActivity.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedActivity.images!.length) % selectedActivity.images!.length);
    }
  };

  const toggleLike = (activityId: number) => {
    setLikedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const toggleSave = (activityId: number) => {
    setSavedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const handleActivityCardClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentImageIndex(0);

    // تحديث URL بدون إعادة تحميل الصفحة
    const url = new URL(window.location.href);
    url.searchParams.set('activityId', activity.id.toString());
    window.history.pushState({}, '', url.toString());
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);

    // إزالة معرف النشاط من URL
    const url = new URL(window.location.href);
    url.searchParams.delete('activityId');
    window.history.pushState({}, '', url.toString());
  };

  // معالجة حالة التحميل
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">جاري التحميل...</h1>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-destructive">خطأ في التحميل</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  // معالجة حالة عدم وجود أنشطة
  if (!activities || activities.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">لا توجد أنشطة متاحة</h1>
        <p className="text-muted-foreground">لم يتم العثور على أي أنشطة لعرضها.</p>
      </div>
    );
  }

  // البطاقات المعروضة حالياً
  const currentActivities = activities.slice(0, displayedItems);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#DC7C4C] via-[#E89F71] to-[#F5C07A] bg-clip-text text-transparent mb-4">
            مجموعة الأنشطة المميزة
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            اكتشف مجموعة رائعة من الأنشطة والتجارب الاستثنائية
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {activities.filter((a) => a.status === "مكتمل").length} أنشطة مكتملة
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {activities.filter((a) => a.status === "قادم").length} أنشطة قادمة
            </Badge>
            <Badge variant="default" className="text-sm px-3 py-1">
              عرض {displayedItems} من {activities.length}
            </Badge>
          </div>
        </div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {currentActivities.map((activity, index) => {
            // تحديد أطوال مختلفة للبطاقات مثل Pinterest
            const heights = [
              'h-64', 'h-80', 'h-96', 'h-72', 'h-60', 'h-88'
            ];
            const randomHeight = heights[index % heights.length];

            return (
              <div
                key={activity.id}
                data-activity-id={activity.id}
                className={`break-inside-avoid mb-4 transition-all duration-1000 ${visibleActivities.has(activity.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  } `}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl group rounded-2xl !pb-0 ${activity.status === "قادم" ? "opacity-80" : ""
                    }`}
                  onClick={() => handleActivityCardClick(activity)}
                >
                  {/* الصورة الرئيسية */}
                  <div className={`relative w-full ${randomHeight} overflow-hidden`}>
                    <img
                      src={activity.images && activity.images[0] ? `${baseURL}${activity.images[0]}` : "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading={index < card_number ? "eager" : "lazy"} // تحسين الأداء
                    />

                    {/* طبقة التمويه عند التمرير */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <Button size="lg" className="animate-bounce-gentle text-lg px-6 py-3 !cursor-pointer">
                        اكتشف الكنز
                      </Button>
                    </div>

                    {/* شارة الحالة */}
                    <Badge
                      className={`absolute top-3 right-3 text-sm px-3 py-1 ${activity.status === "مكتمل"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                        }`}
                    >
                      {activity.status}
                    </Badge>

                    {/* أيقونة الفئة */}
                    <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-full p-3">
                      {/* Activity icon placeholder */}
                      <MapPin className="w-5 h-5 text-chart-4" />
                    </div>

                    {/* عنوان النشاط فوق الصورة عند التمرير */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-bold text-lg text-white line-clamp-2">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{activity.participants}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* مؤشر التحميل للتمرير اللامتهي */}
        {hasMore && (
          <div
            ref={loadMoreRef}
            className="flex justify-center py-12"
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-lg text-muted-foreground">جاري تحميل المزيد من الأنشطة...</span>
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

        {/* رسالة انتهاء القائمة */}
        {!hasMore && activities.length > ITEMS_PER_LOAD && (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">تم عرض جميع الأنشطة</h3>
              <p className="text-muted-foreground">لقد استكشفت جميع الـ {activities.length} نشاطاً المتاحين!</p>
            </div>
          </div>
        )}
      </div>

      {/* Activity Detail Modal - نفس الكود السابق */}
      <Dialog open={!!selectedActivity} onOpenChange={handleCloseDialog}>
        <DialogContent className="w-[98vw] sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[1200px] max-h-[98vh] overflow-y-auto overflow-x-hidden px-2 sm:px-6">
          {selectedActivity && (
            <>
              <DialogHeader className="px-1 sm:px-0">
                <DialogTitle className="text-xl xs:text-2xl sm:text-3xl font-bold text-right break-words">
                  {selectedActivity.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 px-1 sm:px-0">
                {/* Image Gallery */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={
                        selectedActivity.images && selectedActivity.images[currentImageIndex]
                          ? `${baseURL}${selectedActivity.images[currentImageIndex]}`
                          : "/placeholder.svg"
                      }
                      alt={selectedActivity.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />

                    {/* Gallery Navigation */}
                    {selectedActivity.images && selectedActivity.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 p-1 sm:p-2 min-w-0"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 p-1 sm:p-2 min-w-0"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex gap-0.5 sm:gap-1">
                          {selectedActivity.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                                }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Video Section */}
                  {selectedActivity.videos && selectedActivity.videos.length > 0 && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/10">
                      {!isVideoPlaying ? (
                        <div
                          className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-primary/20 to-secondary/20"
                          onClick={() => setIsVideoPlaying(true)}
                        >
                          <div className="bg-primary text-primary-foreground rounded-full p-2 sm:p-4 animate-pulse-glow">
                            <Play className="w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                      ) : (
                        <video
                          src={selectedActivity.videos[0]}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                          onEnded={() => setIsVideoPlaying(false)}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Activity Details */}
                <div className="space-y-4 sm:space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-6">
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg min-w-0">
                      <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <span className="truncate">{selectedActivity.date}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg min-w-0">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-secondary flex-shrink-0" />
                      <span className="truncate">{selectedActivity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg min-w-0">
                      <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-accent flex-shrink-0" />
                      <span className="truncate">{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg min-w-0">
                      <Users className="w-4 h-4 sm:w-6 sm:h-6 text-chart-3 flex-shrink-0" />
                      <span className="truncate">{selectedActivity.participants} مشارك</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-lg sm:text-xl text-foreground mb-2 sm:mb-4">وصف النشاط</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-lg break-words">
                      {selectedActivity.description}
                    </p>
                  </div>

                  {/* Achievements */}
                  {selectedActivity.achievements && selectedActivity.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg sm:text-xl text-foreground mb-2 sm:mb-3">الإنجازات المحققة</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedActivity.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-2 min-w-0">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-muted-foreground break-words">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  {selectedActivity.highlights && selectedActivity.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg sm:text-xl text-foreground mb-2 sm:mb-3">أبرز اللحظات</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {selectedActivity.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1 break-all">
                            <Star className="w-2 h-2 sm:w-3 sm:h-3 ml-1 flex-shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{highlight}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity Template Badge */}
                  {selectedActivity.activityTemplate && selectedActivity.activityTemplate !== "announcement" && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium w-fit ${selectedActivity.activityTemplate === "announcement_reg" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      selectedActivity.activityTemplate === "announcement_reg_participants" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                        "bg-orange-50 text-orange-700 border border-orange-200"
                      }`}>
                      <Users className="w-4 h-4" />
                      {selectedActivity.activityTemplate === "announcement_reg" && "التسجيل متاح للجمعيات"}
                      {selectedActivity.activityTemplate === "announcement_reg_participants" && "التسجيل + إضافة مشاركين"}
                      {selectedActivity.activityTemplate === "special" && "نشاط خاص — تسجيل بفئات"}
                    </div>
                  )}

                  {/* Categories Display for special activities */}
                  {selectedActivity.activityTemplate === "special" && selectedActivity.categories && selectedActivity.categories.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-base text-foreground mb-2">الفئات المتاحة</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedActivity.categories.map((cat, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">{cat}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration Button — show if activity allows association registration */}
                  {(selectedActivity.activityTemplate === "announcement_reg" ||
                    selectedActivity.activityTemplate === "announcement_reg_participants" ||
                    selectedActivity.activityTemplate === "special") && (
                      <div className="pt-3 border-t">
                        {!isLoggedIn ? (
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center text-sm text-amber-700">
                            يجب تسجيل الدخول كجمعية للتسجيل في هذا النشاط
                          </div>
                        ) : registeredActivityIds.has(selectedActivity.id) ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                              <CheckCircle className="w-5 h-5 flex-shrink-0" />
                              <span className="text-sm font-medium">تم تسجيل جمعيتك في هذا النشاط — بانتظار المراجعة</span>
                            </div>
                            {/* We no longer use a separate dialog for adding participants later for mock purposes */}
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => {
                              if (!isLoggedIn) {
                                toast({
                                  title: "تسجيل الدخول مطلوب",
                                  description: "الرجاء تسجيل الدخول كجمعية أولاً للتمكن من التسجيل في هذه الأنشطة.",
                                  variant: "destructive",
                                })
                                return;
                              }
                              setRegisteringActivity(selectedActivity);
                              setRegFormData({ assocName: "", email: "", phone: "" });
                              setParticipantsList([]);
                              setCurrentParticipant({ name: "", age: "", category: "" });
                              setRegSuccess(false);
                              setShowRegisterDialog(true);
                            }}
                          >
                            <Building2 className="w-4 h-4 ml-2" />
                            تسجيل جمعيتك في النشاط
                          </Button>
                        )}
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 pt-2">
                    <Button size="sm" className="w-full text-sm sm:text-lg py-2 sm:py-4 min-h-0 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                      <span className="truncate">عرض الصور</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Association Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={(open) => { if (!open) setShowRegisterDialog(false) }}>
        <DialogContent className="max-w-lg w-[95vw] p-6" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-600" />
              تسجيل الجمعية في النشاط
            </DialogTitle>
            <DialogDescription>
              تسجيل جمعيتك في نشاط: {registeringActivity?.title}
            </DialogDescription>
          </DialogHeader>
          {regSuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">تم إرسال طلب التسجيل!</h3>
              <p className="text-sm text-gray-500">سيتم مراجعة طلبكم والرد عليه في أقرب وقت.</p>
              <Button className="mt-4" onClick={() => setShowRegisterDialog(false)}>إغلاق</Button>
            </div>
          ) : (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label>اسم الجمعية</Label>
                <input className="w-full border rounded-md px-3 py-2 text-sm" placeholder="اسم جمعيتك" value={regFormData.assocName} onChange={(e) => setRegFormData({ ...regFormData, assocName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <input className="w-full border rounded-md px-3 py-2 text-sm" placeholder="email@example.com" type="email" value={regFormData.email} onChange={(e) => setRegFormData({ ...regFormData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <input className="w-full border rounded-md px-3 py-2 text-sm" placeholder="0550000000" value={regFormData.phone} onChange={(e) => setRegFormData({ ...regFormData, phone: e.target.value })} />
              </div>

              {registeringActivity && (registeringActivity.activityTemplate === "announcement_reg_participants" || registeringActivity.activityTemplate === "special") && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-amber-600" />
                    قائمة المشاركين
                  </h4>

                  {/* List of added participants */}
                  {participantsList.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {participantsList.map((p) => (
                        <div key={p.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border text-sm">
                          <div className="flex gap-3">
                            <span className="font-medium">{p.name}</span>
                            <span className="text-gray-500">العمر: {p.age}</span>
                            {p.category && <span className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full text-xs">{p.category}</span>}
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => setParticipantsList(participantsList.filter(item => item.id !== p.id))}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new participant form */}
                  <div className="bg-white p-3 border rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">الاسم</Label>
                        <input className="w-full border rounded-md px-2 py-1.5 text-sm" placeholder="الاسم الكامل" value={currentParticipant.name} onChange={(e) => setCurrentParticipant({ ...currentParticipant, name: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">العمر</Label>
                        <input className="w-full border rounded-md px-2 py-1.5 text-sm" placeholder="العمر" type="number" value={currentParticipant.age} onChange={(e) => setCurrentParticipant({ ...currentParticipant, age: e.target.value })} />
                      </div>
                    </div>
                    {registeringActivity.activityTemplate === "special" && registeringActivity.categories && registeringActivity.categories.length > 0 && (
                      <div className="space-y-1">
                        <Label className="text-xs">الفئة</Label>
                        <select className="w-full border rounded-md px-2 py-1.5 text-sm bg-white" value={currentParticipant.category} onChange={(e) => setCurrentParticipant({ ...currentParticipant, category: e.target.value })}>
                          <option value="">اختر الفئة...</option>
                          {registeringActivity.categories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        if (currentParticipant.name && currentParticipant.age) {
                          if (registeringActivity.activityTemplate === "special" && !currentParticipant.category) {
                            toast({
                              title: "خطأ",
                              description: "يرجى اختيار فئة المشارك",
                              variant: "destructive",
                            })
                            return;
                          }
                          setParticipantsList([...participantsList, { ...currentParticipant, id: Date.now().toString() }]);
                          setCurrentParticipant({ name: "", age: "", category: "" });
                        } else {
                          toast({
                            title: "معلومات ناقصة",
                            description: "يرجى إدخال الاسم والعمر",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة مشارك للقائمة
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowRegisterDialog(false)}>إلغاء</Button>
                <Button
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    if (regFormData.assocName && regFormData.email && registeringActivity) {
                      if ((registeringActivity.activityTemplate === "announcement_reg_participants" || registeringActivity.activityTemplate === "special") && participantsList.length === 0) {
                        toast({
                          title: "لا يوجد مشاركين",
                          description: "يرجى إضافة مشارك واحد على الأقل",
                          variant: "destructive",
                        })
                        return;
                      }
                      console.log("Registered Association:", regFormData);
                      console.log("Participants:", participantsList);
                      setRegisteredActivityIds(prev => new Set([...prev, registeringActivity.id]))
                      setRegSuccess(true)
                    } else {
                      toast({
                        title: "معلومات ناقصة",
                        description: "يرجى تعبئة جميع معلومات الجمعية",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  إرسال طلب التسجيل
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Old Add Participants Dialog Removed */}
    </div>
  );
}