"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, Star, Award, Filter } from "lucide-react"

const members = [
  {
    id: 1,
    name: "أحمد محمد العلي",
    role: "رئيس الجمعية",
    image: "/young-arab-president.png",
    bio: "قائد شاب متحمس يسعى لتطوير المجتمع الشبابي",
    achievements: ["جائزة القيادة الشبابية", "شهادة في إدارة المشاريع"],
    type: "board",
    color: "bg-primary",
    icon: Crown,
  },
  {
    id: 2,
    name: "فاطمة سالم الزهراني",
    role: "نائب الرئيس",
    image: "/young-arab-woman-leader.png",
    bio: "متخصصة في تنظيم الفعاليات والأنشطة الثقافية",
    achievements: ["جائزة التميز في التنظيم", "دبلوم في العلاقات العامة"],
    type: "board",
    color: "bg-secondary",
    icon: Star,
  },
  {
    id: 3,
    name: "خالد عبدالله الشمري",
    role: "مسؤول الأنشطة الرياضية",
    image: "/young-arab-man-sports.png",
    bio: "مدرب رياضي معتمد ومنظم البطولات الشبابية",
    achievements: ["شهادة تدريب رياضي", "جائزة أفضل منظم رياضي"],
    type: "volunteer",
    color: "bg-accent",
    icon: Award,
  },
  {
    id: 4,
    name: "نورا أحمد القحطاني",
    role: "منسقة الورش التعليمية",
    image: "/young-arab-teacher.png",
    bio: "معلمة شابة متخصصة في التطوير المهني",
    achievements: ["ماجستير في التربية", "جائزة المعلم المبدع"],
    type: "volunteer",
    color: "bg-chart-3",
    icon: Users,
  },
  {
    id: 5,
    name: "محمد سعد الغامدي",
    role: "مصمم جرافيك",
    image: "/young-arab-designer.png",
    bio: "مصمم مبدع يساهم في الهوية البصرية للجمعية",
    achievements: ["جائزة التصميم الإبداعي", "شهادة في التصميم الرقمي"],
    type: "volunteer",
    color: "bg-chart-4",
    icon: Star,
  },
  {
    id: 6,
    name: "ريم عبدالرحمن الدوسري",
    role: "مسؤولة التواصل الاجتماعي",
    image: "/young-arab-woman-social-media.png",
    bio: "خبيرة في التسويق الرقمي وإدارة المحتوى",
    achievements: ["شهادة في التسويق الرقمي", "جائزة أفضل محتوى"],
    type: "volunteer",
    color: "bg-chart-5",
    icon: Users,
  },
]

export function MembersSection() {
  const [filter, setFilter] = useState<"all" | "board" | "volunteer">("all")
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  const filteredMembers = members.filter((member) => filter === "all" || member.type === filter)

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">أعضاء الجمعية</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          تعرف على الفريق المتميز الذي يقود رحلة التطوير والإبداع
        </p>
        <div className="w-24 h-1 bg-chart-1 mx-auto mt-6 rounded-full" />
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-12">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="rounded-full"
        >
          <Filter className="w-4 h-4 ml-2" />
          جميع الأعضاء
        </Button>
        <Button
          variant={filter === "board" ? "default" : "outline"}
          onClick={() => setFilter("board")}
          className="rounded-full"
        >
          <Crown className="w-4 h-4 ml-2" />
          مجلس الإدارة
        </Button>
        <Button
          variant={filter === "volunteer" ? "default" : "outline"}
          onClick={() => setFilter("volunteer")}
          className="rounded-full"
        >
          <Users className="w-4 h-4 ml-2" />
          المتطوعون
        </Button>
      </div>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredMembers.map((member, index) => {
          const Icon = member.icon
          const isHovered = hoveredMember === member.id

          return (
            <Card
              key={member.id}
              className={`relative overflow-hidden transition-all duration-500 cursor-pointer group ${
                isHovered ? "scale-105 shadow-2xl" : "hover:scale-102 hover:shadow-xl"
              } animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
              </div>

              <div className="relative p-6 text-center">
                {/* Member Image */}
                <div className="relative mb-6">
                  <div
                    className={`w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background shadow-lg transition-transform duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Role Icon */}
                  <div
                    className={`absolute -bottom-2 right-1/2 transform translate-x-1/2 w-10 h-10 ${member.color} rounded-full flex items-center justify-center border-4 border-background shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Member Info */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
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

                {/* Achievements */}
                {isHovered && (
                  <div className="space-y-2 animate-fade-in">
                    <h4 className="font-semibold text-foreground text-sm">الإنجازات:</h4>
                    {member.achievements.map((achievement, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />
            </Card>
          )
        })}
      </div>

      {/* Join Team CTA */}
      <div className="text-center mt-16">
        <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <Users className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce-gentle" />
          <h3 className="text-2xl font-bold text-foreground mb-4">انضم إلى فريقنا</h3>
          <p className="text-muted-foreground mb-6">هل تريد أن تكون جزءاً من فريق العمل؟ نحن نبحث عن شباب متحمس ومبدع</p>
          <Button size="lg" className="rounded-full animate-pulse-glow">
            تطوع معنا
            <Users className="w-5 h-5 mr-2" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
