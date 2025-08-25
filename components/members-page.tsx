"use client"
import { fetchAllData } from "../app/api/api";
import { Member } from "../app/api/type";
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

// مصفوفات القيم العشوائية للألوان والأيقونات
const colorOptions = [
  "bg-primary",
  "bg-secondary", 
  "bg-accent",
  "bg-chart-3",
  "bg-chart-4"
];

const iconOptions = [Crown, Star, Award, Users];

// دوال للحصول على قيم عشوائية
const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];
const getRandomIcon = () => iconOptions[Math.floor(Math.random() * iconOptions.length)];

// دالة لتوليد خصائص عشوائية للعضو
const generateRandomProps = (member: Member) => ({
  ...member,
  randomColor: getRandomColor(),
  randomIcon: getRandomIcon()
});

// نوع محدث للأعضاء مع الخصائص العشوائية
type MemberWithRandomProps = Member & {
  randomColor: string;
  randomIcon: React.ComponentType<{ className?: string }>;
};

export function MembersPage() {
  // حالات البيانات من API
  const [members, setMembers] = useState<MemberWithRandomProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // حالات واجهة المستخدم
  const [selectedMember, setSelectedMember] = useState<MemberWithRandomProps | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  const departments = ["all", "board", "volunteer"]

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
          setMembers(membersWithRandomProps);
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
  
  const boardMembers = filteredMembers.filter((member) => member.type === "admin")
  const volunteers = filteredMembers.filter((member) => member.type === "normal")



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
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">أعضاء جمعية المنار</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          تعرف على الفريق المتميز الذي يقود رحلة التطوير والإبداع في جمعية المنار للشباب
        </p>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
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
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-muted-foreground mt-2" />
            <div className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <Button
                  key={department}
                  variant={selectedDepartment === department ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(department)}
                  className="rounded-full"
                >
                  {department === "all" ? "الكل" : 
                   department === "board" ? "مجلس الإدارة" : "المتطوعون"}
                </Button>
              ))}
            </div>
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

      {/* Board Members */}
      {!isLoading && boardMembers.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Crown className="w-8 h-8 text-primary" />
            مجلس الإدارة
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {boardMembers.map((member, index) => {
              const Icon = member.randomIcon
              return (
                <Card
                  key={member.id}
                  className="overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="relative">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name || "عضو"}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div
                      className={`absolute top-4 right-4 w-12 h-12 ${member.randomColor} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{member.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {member.achievements && member.achievements.slice(0, 2).map((achievement, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-white/20 text-white border-0">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Volunteers */}
      {!isLoading && volunteers.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-secondary" />
            المتطوعون النشطون
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {volunteers.map((member, index) => {
              const Icon = member.randomIcon
              return (
                <Card
                  key={member.id}
                  className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-lg group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="relative">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name || "عضو"}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className={`absolute top-3 right-3 w-8 h-8 ${member.randomColor} rounded-full flex items-center justify-center border-2 border-white shadow-md`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{member.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.achievements && member.achievements.slice(0, 3).map((achievement, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">لا توجد أعضاء متطابقون مع البحث</p>
        </div>
      )}

      {/* Member Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[1200px] max-h-[95vh] overflow-y-auto overflow-x-hidden">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-right">{selectedMember.name}</DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Image and Basic Info */}
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedMember.image || "/placeholder.svg"}
                      alt={selectedMember.name || "عضو"}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div
                      className={`absolute top-4 right-4 w-12 h-12 ${selectedMember.randomColor} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
                    >
                      <selectedMember.randomIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <Card className="p-4">
                    <h4 className="font-semibold text-foreground mb-3">معلومات أساسية</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">النوع: {selectedMember.type === "board" ? "مجلس الإدارة" : "متطوع"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-secondary" />
                        <span className="text-muted-foreground">الدور: {selectedMember.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">اللون: {selectedMember.color}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6">
                  {/* Role and Type */}
                  <div>
                    <Badge className={`${selectedMember.randomColor} text-white border-0 mb-2`}>
                      {selectedMember.type === "board" ? "مجلس الإدارة" : "متطوع"}
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

                  {/* Icon */}
                  {selectedMember.icon && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">الرمز</h4>
                      <p className="text-muted-foreground">{selectedMember.icon}</p>
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
                    <Button className="flex-1">
                      <MessageCircle className="w-4 h-4 ml-2" />
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
      <div className="text-center mt-16">
        <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <Users className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce-gentle" />
          <h3 className="text-2xl font-bold text-foreground mb-4">انضم إلى فريقنا المتميز</h3>
          <p className="text-muted-foreground mb-6">
            هل تريد أن تكون جزءاً من فريق العمل؟ نحن نبحث عن شباب متحمس ومبدع للانضمام إلى عائلة المنار
          </p>
          <Button size="lg" className="rounded-full animate-pulse-glow">
            تطوع معنا الآن
            <Users className="w-5 h-5 mr-2" />
          </Button>
        </Card>
      </div>
    </div>
  )
}