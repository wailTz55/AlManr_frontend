"use client"

import { fetchAllData } from "../app/api/api";
import { Activity } from "../app/api/type";
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, Users, Camera, Video, Award, Clock, Star, ChevronLeft, ChevronRight, Play, Heart, Bookmark, Share } from "lucide-react"

export function TreasureMapActivities() {
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
  const [displayedItems, setDisplayedItems] = useState(card_number); // البطاقات المعروضة حالياً
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null); // مرجع لنقطة التحميل
  const ITEMS_PER_LOAD = card_number; // عدد البطاقات التي تُحمل في كل مرة

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
      setCurrentImageIndex((prev) => (prev + 1) % selectedActivity.images.length);
    }
  };

  const prevImage = () => {
    if (selectedActivity && selectedActivity.images && selectedActivity.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedActivity.images.length) % selectedActivity.images.length);
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
                className={`break-inside-avoid mb-4 transition-all duration-1000 ${
                  visibleActivities.has(activity.id)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                } `}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl group rounded-2xl !pb-0 ${
                    activity.status === "قادم" ? "opacity-80" : ""
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
                      className={`absolute top-3 right-3 text-sm px-3 py-1 ${
                        activity.status === "مكتمل"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {activity.status}
                    </Badge>
                    
                    {/* أيقونة الفئة */}
                    <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-full p-3">
                      {activity.category === "مخيم" && <Calendar className="w-5 h-5 text-primary" />}
                      {activity.category === "ورشة" && <Star className="w-5 h-5 text-secondary" />}
                      {activity.category === "رياضة" && <Award className="w-5 h-5 text-accent" />}
                      {activity.category === "فنون" && <Camera className="w-5 h-5 text-chart-3" />}
                      {activity.category === "استكشاف" && <MapPin className="w-5 h-5 text-chart-4" />}
                      {activity.category === "مؤتمر" && <Users className="w-5 h-5 text-chart-5" />}
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
        <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[1200px] max-h-[95vh] overflow-y-auto overflow-x-hidden">
          {selectedActivity && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-right">
                  {selectedActivity.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-6">
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
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
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {selectedActivity.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? "bg-white" : "bg-white/50"
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
                          <div className="bg-primary text-primary-foreground rounded-full p-4 animate-pulse-glow">
                            <Play className="w-8 h-8" />
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
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 text-lg">
                      <Calendar className="w-6 h-6 text-primary" />
                      <span>{selectedActivity.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <Clock className="w-6 h-6 text-secondary" />
                      <span>{selectedActivity.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <MapPin className="w-6 h-6 text-accent" />
                      <span>{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg">
                      <Users className="w-6 h-6 text-chart-3" />
                      <span>{selectedActivity.participants} مشارك</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-xl text-foreground mb-4">وصف النشاط</h4>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {selectedActivity.description}
                    </p>
                  </div>
                  
                  {/* Achievements */}
                  {selectedActivity.achievements && selectedActivity.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-xl text-foreground mb-3">الإنجازات المحققة</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedActivity.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Highlights */}
                  {selectedActivity.highlights && selectedActivity.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-xl text-foreground mb-3">أبرز اللحظات</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedActivity.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Star className="w-3 h-3 ml-1" />
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button size="lg" className="flex-1 text-lg py-4">
                      <Camera className="w-5 h-5 ml-2" />
                      عرض الصور
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1 bg-transparent text-lg py-4">
                      <Video className="w-5 h-5 ml-2" />
                      مشاهدة الفيديو
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}