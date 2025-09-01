"use client"
import { fetchAllData } from "../app/api/api";
import { Member } from "../app/api/type";
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Crown,
  Star,
  Award,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Heart,
  MessageCircle,
  User,
} from "lucide-react"
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// مصفوفات القيم العشوائية للألوان والأيقونات
const colorOptions = [
  "bg-primary",
  "bg-secondary", 
  "bg-accent",
  "bg-chart-3",
  "bg-chart-4",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-red-500"
];

// ألوان الإطارات (بدون الذهبي للأعضاء العاديين والإداريين)
const frameColors = [
  "ring-primary/50",
  "ring-secondary/50", 
  "ring-blue-500/50",
  "ring-green-500/50",
  "ring-purple-500/50",
  "ring-pink-500/50",
  "ring-indigo-500/50",
  "ring-teal-500/50",
  "ring-orange-500/50",
  "ring-red-500/50"
];

const iconOptionsAdmin = [Crown, Star, Award];
const iconOptionsNormal = [User];

// دوال للحصول على قيم عشوائية
const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];
const getRandomFrameColor = () => frameColors[Math.floor(Math.random() * frameColors.length)];
const getRandomIconAdmin = () => iconOptionsAdmin[Math.floor(Math.random() * iconOptionsAdmin.length)];
const getRandomIconNormal = () => iconOptionsNormal[Math.floor(Math.random() * iconOptionsNormal.length)];

// دالة لتوليد خصائص عشوائية للعضو
const generateRandomProps = (member: Member) => ({
  ...member,
  randomColor: getRandomColor(),
  randomFrameColor: getRandomFrameColor(),
  randomIcon: member.type === 'admin' ? getRandomIconAdmin() : getRandomIconNormal()
});

// نوع محدث للأعضاء مع الخصائص العشوائية
type MemberWithRandomProps = Member & {
  randomColor: string;
  randomFrameColor: string;
  randomIcon: React.ComponentType<{ className?: string }>;
};

// دالة لتحديد إذا كان العضو رئيس
const isPresident = (member: MemberWithRandomProps) => {
  const role = member.role?.toLowerCase() || '';
  return role.includes('رئيس') || role.includes('president');
};

// دالة ترتيب الأعضاء
const sortMembers = (members: MemberWithRandomProps[]) => {
  return members.sort((a, b) => {
    // الرئيس يأتي أولاً
    const aIsPresident = isPresident(a);
    const bIsPresident = isPresident(b);
    
    if (aIsPresident && !bIsPresident) return -1;
    if (!aIsPresident && bIsPresident) return 1;
    
    // ثم الإداريين
    if (a.type === 'admin' && b.type !== 'admin') return -1;
    if (a.type !== 'admin' && b.type === 'admin') return 1;
    
    // ترتيب أبجدي للأعضاء من نفس الفئة
    return (a.name || '').localeCompare(b.name || '', 'ar');
  });
};

// مكون بطاقة العضو
const MemberCard = ({ 
  member, 
  index, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick,
  isPresident: memberIsPresident,
  isClickable = true
}: {
  member: MemberWithRandomProps;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  isPresident: boolean;
  isClickable?: boolean;
}) => {
  const Icon = member.randomIcon;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-500 ${
        isClickable ? "cursor-pointer" : "cursor-default"
      } group ${
        isHovered ? "scale-105 shadow-2xl" : "hover:scale-102 hover:shadow-xl"
      } animate-fade-in ${
        memberIsPresident 
          ? "ring-4 ring-yellow-400/50 shadow-yellow-200/20" 
          : `ring-4 ${member.randomFrameColor} shadow-lg`
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={isClickable ? onClick : undefined}
    >
      {/* شارة الرئيس */}
      {memberIsPresident && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs animate-pulse">
            <Crown className="w-3 h-3 ml-1" />
            الرئيس
          </Badge>
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${
          memberIsPresident ? "from-yellow-400 to-orange-500" : "from-primary to-secondary"
        }`} />
      </div>

      <div className="relative p-6 text-center">
        {/* Member Image */}
        <div className="relative mb-6">
          <div
            className={`w-32 h-32 mx-auto rounded-full overflow-hidden border-4 ${
              memberIsPresident ? "border-yellow-400 shadow-yellow-200/50" : "border-background"
            } shadow-lg transition-transform duration-300 ${
              isHovered ? "scale-110" : ""
            }`}
          >
            <img
              src={member.image ? `${baseURL}${member.image}` : "/placeholder.svg"}
              alt={member.name || "عضو"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Role Icon */}
          <div
            className={`absolute -bottom-2 right-1/2 transform translate-x-1/2 w-10 h-10 ${
              memberIsPresident ? "bg-gradient-to-r from-yellow-400 to-orange-500" : member.randomColor
            } rounded-full flex items-center justify-center border-4 border-background shadow-lg`}
          >
            {memberIsPresident ? (
              <Crown className="w-5 h-5 text-white" />
            ) : member.type === 'admin' ? (
              <Crown className="w-5 h-5 text-white" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Member Info */}
        <h3 className={`text-xl font-bold mb-2 group-hover:text-primary transition-colors ${
          memberIsPresident ? "text-yellow-600" : "text-foreground"
        }`}>
          {member.name}
        </h3>

        <Badge variant="secondary" className="mb-4">
          {member.role}
        </Badge>

        <p
          className={`text-muted-foreground mb-4 transition-all duration-300 ${
            isHovered ? "line-clamp-none" : "line-clamp-2"
          }`}
        >
          {member.bio}
        </p>

        {/* Type Badge */}
        <div className="mb-4">
          <Badge 
            className={`${
              memberIsPresident 
                ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
                : member.type === "admin" 
                ? "bg-primary" 
                : "bg-secondary"
            } text-white border-0`}
          >
            {memberIsPresident ? "الرئيس" : member.type === "admin" ? "مجلس الإدارة" : "متطوع"}
          </Badge>
        </div>

        {/* Achievements */}
        {isHovered && member.achievements && member.achievements.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            <h4 className="font-semibold text-foreground text-sm">الإنجازات:</h4>
            {member.achievements.slice(0, 2).map((achievement, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {achievement}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          memberIsPresident ? "from-yellow-400/10" : "from-primary/10"
        } to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </Card>
  );
};

export function MembersPage() {
  const router = useRouter();

  // حالات البيانات من API
  const [members, setMembers] = useState<MemberWithRandomProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // حالات واجهة المستخدم
  const [selectedMember, setSelectedMember] = useState<MemberWithRandomProps | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const number_normal_members = 9;
  // إعدادات التمرير اللامتناهي للأعضاء العاديين
  const [displayedNormalMembers, setDisplayedNormalMembers] = useState(number_normal_members); // البطاقات المعروضة للأعضاء العاديين
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreNormal, setHasMoreNormal] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const NORMAL_MEMBERS_PER_LOAD = number_normal_members; // عدد الأعضاء العاديين في كل تحميل

  const departments = ["all", "admin", "normal"]

  // جلب البيانات من API
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllData();

        if (data && data.members && Array.isArray(data.members)) {
          // إضافة الخصائص العشوائية لكل عضو
          const membersWithRandomProps = data.members.map(member => generateRandomProps(member));
          // ترتيب الأعضاء
          const sortedMembers = sortMembers(membersWithRandomProps);
          setMembers(sortedMembers);
        } else {
          throw new Error('بيانات الأعضاء المستلمة غير صحيحة');
        }
      } catch (err) {
        console.error('خطأ في جلب بيانات الأعضاء:', err);
        setError('حدث خطأ في تحميل بيانات الأعضاء');
        setMembers([]);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    loadMembers();
  }, []);
  
  // تصفية الأعضاء
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || member.type === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  // تقسيم الأعضاء حسب النوع
  const president = filteredMembers.find(member => isPresident(member));
  const adminMembers = filteredMembers.filter(member => !isPresident(member) && member.type === 'admin');
  const normalMembers = filteredMembers.filter(member => !isPresident(member) && member.type === 'normal');

  // تحديث حالة "يوجد المزيد" للأعضاء العاديين
  useEffect(() => {
    setHasMoreNormal(displayedNormalMembers < normalMembers.length);
  }, [displayedNormalMembers, normalMembers.length]);

  // التمرير اللامتناهي للأعضاء العاديين
  useEffect(() => {
    if (!mounted || !hasMoreNormal || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreNormalMembers();
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
  }, [mounted, hasMoreNormal, isLoadingMore, displayedNormalMembers]);

  // دالة تحميل المزيد من الأعضاء العاديين
  const loadMoreNormalMembers = async () => {
    if (isLoadingMore || !hasMoreNormal) return;
    
    setIsLoadingMore(true);
    
    // محاكاة تأخير التحميل
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newDisplayedCount = Math.min(displayedNormalMembers + NORMAL_MEMBERS_PER_LOAD, normalMembers.length);
    setDisplayedNormalMembers(newDisplayedCount);
    setIsLoadingMore(false);
  };

  // إعادة تعيين عدد الأعضاء المعروضة عند تغيير الفلتر
  useEffect(() => {
    setDisplayedNormalMembers(NORMAL_MEMBERS_PER_LOAD);
  }, [searchTerm, selectedDepartment]);

  // دالة للتعامل مع النقر على العضو
  const handleMemberClick = (member: MemberWithRandomProps) => {
    // فقط الرئيس والأعضاء الإداريين يمكن النقر عليهم
    if (isPresident(member) || member.type === 'admin') {
      setSelectedMember(member);
    }
    // الأعضاء العاديين لا يحدث شيء عند النقر عليهم
  };

  // الأعضاء العاديين المعروضين حالياً
  const currentNormalMembers = normalMembers.slice(0, displayedNormalMembers);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">جاري تحميل بيانات الأعضاء...</p>
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
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">أعضاء الجمعية</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          تعرف على الفريق المتميز الذي يقود رحلة التطوير والإبداع
        </p>
        <div className="w-24 h-1 bg-chart-1 mx-auto mt-6 rounded-full" />
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="ابحث عن عضو أو دور..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button
              variant={selectedDepartment === "all" ? "default" : "outline"}
              onClick={() => setSelectedDepartment("all")}
              className="rounded-full !cursor-pointer"
            >
              <Filter className="w-4 h-4 ml-2" />
              جميع الأعضاء
            </Button>
            <Button
              variant={selectedDepartment === "admin" ? "default" : "outline"}
              onClick={() => setSelectedDepartment("admin")}
              className="rounded-full !cursor-pointer"
            >
              <Crown className="w-4 h-4 ml-2" />
              مجلس الإدارة
            </Button>
            <Button
              variant={selectedDepartment === "normal" ? "default" : "outline"}
              onClick={() => setSelectedDepartment("normal")}
              className="rounded-full !cursor-pointer"
            >
              <Users className="w-4 h-4 ml-2" />
              المتطوعون
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الأعضاء...</p>
        </div>
      )}

      {/* President Section */}
      {president && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Crown className="w-8 h-8 text-yellow-500" />
              رئيس الجمعية
              <Crown className="w-8 h-8 text-yellow-500" />
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full" />
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <MemberCard
                member={president}
                index={0}
                isHovered={hoveredMember === president.id}
                onMouseEnter={() => setHoveredMember(president.id)}
                onMouseLeave={() => setHoveredMember(null)}
                onClick={() => handleMemberClick(president)}
                isPresident={true}
                isClickable={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Members Section */}
      {adminMembers.length > 0 && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              مجلس الإدارة
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {adminMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                isHovered={hoveredMember === member.id}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
                onClick={() => handleMemberClick(member)}
                isPresident={false}
                isClickable={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Normal Members Section مع التحميل الذكي */}
      {normalMembers.length > 0 && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <User className="w-6 h-6 text-secondary" />
                المتطوعون
              </h2>
              {/* <Badge variant="secondary" className="text-sm px-3 py-1">
                عرض {currentNormalMembers.length} من {normalMembers.length}
              </Badge> */}
            </div>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentNormalMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index + adminMembers.length + (president ? 1 : 0)}
                isHovered={hoveredMember === member.id}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
                onClick={() => handleMemberClick(member)}
                isPresident={false}
                isClickable={false}
              />
            ))}
          </div>

          {/* مؤشر التحميل للأعضاء العاديين */}
          {hasMoreNormal && normalMembers.length > 0 && (
            <div 
              ref={loadMoreRef} 
              className="flex justify-center py-12"
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                  <span className="text-lg text-muted-foreground">جاري تحميل المزيد من المتطوعين...</span>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="animate-pulse">
                    <div className="w-2 h-2 bg-secondary rounded-full inline-block mx-1"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full inline-block mx-1 animation-delay-200"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full inline-block mx-1 animation-delay-400"></div>
                  </div>
                  <p className="mt-2">مرر لأسفل لرؤية المزيد من المتطوعين</p>
                </div>
              )}
            </div>
          )}

          {/* رسالة انتهاء قائمة الأعضاء العاديين */}
          {!hasMoreNormal && normalMembers.length > NORMAL_MEMBERS_PER_LOAD && (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">تم عرض جميع المتطوعين</h3>
                <p className="text-muted-foreground">لقد اطلعت على جميع الـ {normalMembers.length} متطوع!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">لا توجد أعضاء متطابقون مع البحث</p>
        </div>
      )}

      {/* Member Detail Modal - فقط للرئيس والأعضاء الإداريين */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[1200px] max-h-[95vh] overflow-y-auto overflow-x-hidden">
          {selectedMember && (isPresident(selectedMember) || selectedMember.type === 'admin') && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-right flex items-center gap-2">
                  {isPresident(selectedMember) && <Crown className="w-6 h-6 text-yellow-500" />}
                  {selectedMember.type === 'admin' && !isPresident(selectedMember) && <Crown className="w-6 h-6 text-primary" />}
                  {selectedMember.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Image and Basic Info */}
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedMember.image ? `${baseURL}${selectedMember.image}` : "/placeholder.svg"}
                      alt={selectedMember.name || "عضو"}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div
                      className={`absolute top-4 right-4 w-12 h-12 ${
                        isPresident(selectedMember) 
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
                          : selectedMember.randomColor
                      } rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
                    >
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <Card className="p-4">
                    <h4 className="font-semibold text-foreground mb-3">معلومات أساسية</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          النوع: {
                            isPresident(selectedMember) 
                              ? "الرئيس" 
                              : selectedMember.type === "admin" 
                              ? "مجلس الإدارة" 
                              : "متطوع"
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-secondary" />
                        <span className="text-muted-foreground">الدور: {selectedMember.role}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6">
                  {/* Role and Type */}
                  <div>
                    <Badge className={`${
                      isPresident(selectedMember)
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                        : selectedMember.type === "admin" 
                        ? "bg-primary" 
                        : "bg-secondary"
                    } text-white border-0 mb-2`}>
                      {
                        isPresident(selectedMember) 
                          ? "الرئيس" 
                          : selectedMember.type === "admin" 
                          ? "مجلس الإدارة" 
                          : "متطوع"
                      }
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground">{selectedMember.role}</h3>
                  </div>

                  {/* Bio */}
                  {selectedMember.bio && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">نبذة شخصية</h4>
                      <p className="text-muted-foreground leading-relaxed">{selectedMember.bio}</p>
                    </div>
                  )}

                  {/* Achievements */}
                  {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">الإنجازات</h4>
                      <div className="space-y-2">
                        {selectedMember.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1" onClick={() => router.push("/contact")}>
                      <MessageCircle className="w-4 h-4 ml-2" 
                      
                      />
                      إرسال رسالة
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Heart className="w-4 h-4 ml-2" />
                      متابعة
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Join Team CTA */}
      {/* <div className="text-center mt-16">
        <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <Users className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce-gentle" />
          <h3 className="text-2xl font-bold text-foreground mb-4">انضم إلى فريقنا</h3>
          <p className="text-muted-foreground mb-6">هل تريد أن تكون جزءاً من فريق العمل؟ نحن نبحث عن شباب متحمس ومبدع</p>
          <Button size="lg" className="rounded-full animate-pulse-glow">
            تطوع معنا
            <Users className="w-5 h-5 mr-2" />
          </Button>
        </Card>
      </div> */}
    </div>
  )
}