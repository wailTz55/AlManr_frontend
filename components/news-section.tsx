"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Bell, Megaphone, Trophy } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "إطلاق برنامج المنح الدراسية للشباب المتميز",
    excerpt: "نعلن عن إطلاق برنامج جديد لدعم الشباب الموهوب في مجال التعليم العالي",
    date: "2024-08-01",
    time: "10:00 ص",
    type: "إعلان",
    icon: Megaphone,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    title: "فوز فريق الجمعية في مسابقة الإبداع الشبابي",
    excerpt: "حقق فريقنا المركز الأول في المسابقة الوطنية للإبداع والابتكار",
    date: "2024-07-28",
    time: "2:30 م",
    type: "إنجاز",
    icon: Trophy,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: 3,
    title: "تذكير: اجتماع الجمعية العمومية القادم",
    excerpt: "ندعو جميع الأعضاء لحضور الاجتماع الشهري المقرر الأسبوع القادم",
    date: "2024-08-05",
    time: "6:00 م",
    type: "تذكير",
    icon: Bell,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

export function NewsSection() {
  const [expandedNews, setExpandedNews] = useState<number | null>(null)

  return (
    <div className="container mx-auto px-4">
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
          {newsItems.map((item, index) => {
            const Icon = item.icon
            const isExpanded = expandedNews === item.id

            return (
              <div
                key={item.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Timeline Node */}
                

                {/* News Card */}
                <Card
                  className={`w-80 transition-all duration-500 cursor-pointer hover:shadow-xl ${
                    index % 2 === 0 ? "ml-8" : "mr-8"
                  } ${isExpanded ? "scale-105" : "hover:scale-102"}`}
                  onClick={() => setExpandedNews(isExpanded ? null : item.id)}
                >
                  <div className="p-6">
                    <div
                      className={`inline-block px-3 py-1 ${item.bgColor} ${item.color} rounded-full text-sm font-medium mb-3`}
                    >
                      {item.type}
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    <p
                      className={`text-muted-foreground mb-4 transition-all duration-300 ${
                        isExpanded ? "line-clamp-none" : "line-clamp-2"
                      }`}
                    >
                      {item.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(item.date).toLocaleDateString("ar-SA")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.time}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        {isExpanded ? "أقل" : "المزيد"}
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
        <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-full bg-transparent">
          عرض جميع الأخبار
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    </div>
  )
}
