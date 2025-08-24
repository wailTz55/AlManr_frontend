"use client"

import { fetchAllData } from "../app/api/api";
import { Activity } from "../app/api/type";
import { useState, useEffect, useLayoutEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, Users, Camera, Video, Award, Clock, Star, ChevronLeft, ChevronRight, Play } from "lucide-react"

export function TreasureMapActivities() {
  // إصلاح المشكلة: استخدام نوع Activity بدلاً من typeof
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [visibleActivities, setVisibleActivities] = useState<Set<number>>(new Set());
  const [cardPositions, setCardPositions] = useState<{ x: number; y: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = [
    "from-yellow-400 to-orange-500", 
    "from-cyan-400 to-blue-500", 
    "from-indigo-400 to-purple-500", 
    "from-purple-400 to-pink-500",
    "from-green-400 to-blue-500",
    "from-orange-400 to-red-500"
  ];

  // دالة لاختيار لون عشوائي
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // جلب البيانات من API مع معالجة الأخطاء
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllData();
        
        if (data && data.activities && Array.isArray(data.activities)) {
          setActivities(data.activities);
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

  // باقي الكود يبقى كما هو...
  useLayoutEffect(() => {
    if (!mounted || activities.length === 0) return;
    
    const cards = document.querySelectorAll(".activity-card");
    const positions: { x: number; y: number }[] = [];
    
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      positions.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    });
    
    setCardPositions(positions);
  }, [visibleActivities, selectedActivity, mounted, activities]);

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
      { threshold: 0.3 }
    );

    const activityElements = document.querySelectorAll("[data-activity-id]");
    activityElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted, activities]);

  const GRID_COLS = 3;

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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
          خريطة كنوز الأنشطة
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          اكتشف رحلة مليئة بالمغامرات والتجارب الاستثنائية. كل نشاط هو كنز ينتظر أن تستكشفه!
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {activities.filter((a) => a.status === "مكتمل").length} أنشطة مكتملة
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {activities.filter((a) => a.status === "قادم").length} أنشطة قادمة
          </Badge>
        </div>
      </div>

      {/* Treasure Map Grid */}
      <div className="relative max-w-6xl mx-auto">
        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 relative z-10">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              data-activity-id={activity.id}
              className={`activity-card transition-all duration-1000 ${
                visibleActivities.has(activity.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Card
                className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-125 hover:shadow-2xl group ${
                  activity.status === "قادم" ? "opacity-80" : ""
                }`}
                onClick={() => {
                  setSelectedActivity(activity);
                  setCurrentImageIndex(0);
                }}
              >
                {/* Treasure Chest Design */}
                <div className="relative w-full h-56">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRandomColor()} rounded-lg`} />
                  <div className="absolute inset-2 bg-card/90 backdrop-blur-sm rounded-lg border-2 border-white/20" />
                  
                  {/* Activity Image */}
                  <img
                    src={activity.images && activity.images[0] ? activity.images[0] : "/placeholder.svg"}
                    alt={activity.title}
                    className="absolute inset-1 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                    style={{ objectFit: "cover" }}
                  />
                  
                  {/* Status Badge */}
                  <Badge
                    className={`absolute top-3 right-3 text-sm px-3 py-1 ${
                      activity.status === "مكتمل"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {activity.status}
                  </Badge>
                  
                  {/* Category Icon */}
                  <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-full p-3">
                    {activity.category === "مخيم" && <Calendar className="w-5 h-5 text-primary" />}
                    {activity.category === "ورشة" && <Star className="w-5 h-5 text-secondary" />}
                    {activity.category === "رياضة" && <Award className="w-5 h-5 text-accent" />}
                    {activity.category === "فنون" && <Camera className="w-5 h-5 text-chart-3" />}
                    {activity.category === "استكشاف" && <MapPin className="w-5 h-5 text-chart-4" />}
                    {activity.category === "مؤتمر" && <Users className="w-5 h-5 text-chart-5" />}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="lg" className="animate-bounce-gentle text-lg px-6 py-3">
                      اكتشف الكنز
                    </Button>
                  </div>
                </div>
                
                {/* Activity Title */}
                <div className="px-4 pb-4 text-center">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{activity.date}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* SVG Tubes Connecting Cards */}
        {mounted && cardPositions.length > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
            style={{ zIndex: 0 }}
          >
            {cardPositions.map((pos, idx) => {
              const tubes = [];
              // Connect to right neighbor
              if ((idx + 1) % GRID_COLS !== 0 && idx + 1 < cardPositions.length) {
                const right = cardPositions[idx + 1];
                tubes.push(
                  <line
                    key={`right-${idx}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={right.x}
                    y2={right.y}
                    stroke="url(#tube-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                );
              }
              // Connect to below neighbor
              if (idx + GRID_COLS < cardPositions.length) {
                const below = cardPositions[idx + GRID_COLS];
                tubes.push(
                  <line
                    key={`below-${idx}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={below.x}
                    y2={below.y}
                    stroke="url(#tube-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                );
              }
              return tubes;
            })}
            <defs>
              <linearGradient id="tube-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e42" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Activity Detail Modal */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
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
                          ? selectedActivity.images[currentImageIndex]
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