"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Handshake, Award, Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation";

const partners = [
  {
    id: 1,
    name: "زياد وائل طارق",
    type: "ذهبي",
    logo: "/aramco-logo.png",
    description: "برمجة الموقع و تصميم كامل الهوية البصرية للجمعية",
    partnership_since: "2025",
    projects: ["تصميم الهوية البصرية", "برمجة الموقع"],
    category: "corporate",
    website: "#",
    color: "from-green-600 to-teal-600"
  },
  {
    id: 2,
    name: "وزارة الشباب و الرياضة",
    type: "استراتيجي",
    logo: "/وزرة الشباب.jpg",
    description: "شراكة استراتيجية في برامج تطوير الشباب والقيادة",
    partnership_since: "2023",
    projects: ["البرامج الشبابية", "رخصة الجمعية و التمويل"],
    category: "government",
    website: "https://www.facebook.com/ministryofyouthalgeria",
    color: "from-purple-600 to-blue-600"
  },
  {
    id: 3,
    name: "مركز التكوين المهني سعو زروق عين الكبيرة",
    type: "أكاديمي",
    logo: "/مركز التكوين.jpg",
    description: "تعاون في التدريب المهني والبرامج الأكاديمية",
    partnership_since: "2024",
    projects: [ "مبادرة التدريب المهني"],
    category: "academic",
    website: "https://www.facebook.com/CFPAAinElkebiraSETIF",
    color: "from-blue-600 to-indigo-600"
  },
]

const categories = [
  { id: "all", name: "جميع الشركاء", icon: Handshake },
  { id: "government", name: "حكومي", icon: Building2 },
  { id: "corporate", name: "شركات", icon: Award },
  { id: "academic", name: "أكاديمي", icon: Star },
]

export function PartnersSection() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const filteredPartners = partners.filter(
    partner => selectedCategory === "all" || partner.category === selectedCategory
  )

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filteredPartners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [filteredPartners.length, isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredPartners.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + filteredPartners.length) % filteredPartners.length)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
          <Handshake className="w-5 h-5" />
          <span className="font-semibold">شركاؤنا في النجاح</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          شراكات استراتيجية
          <span className="text-primary"> متميزة</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          نفتخر بشراكاتنا مع المؤسسات الرائدة التي تساهم في تحقيق رؤيتنا وأهدافنا
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full" />
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(category.id)
                setCurrentSlide(0)
              }}
              className="rounded-full transition-all duration-300 hover:scale-105 !cursor-pointer"
            >
              <Icon className="w-4 h-4 ml-2" />
              {category.name}
            </Button>
          )
        })}
      </div>

      {/* Partners Showcase */}
      <div className="relative max-w-6xl mx-auto">
        {/* Main Featured Partner */}
        <div 
          className="relative overflow-hidden rounded-3xl mb-8"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {filteredPartners.map((partner, index) => (
            <div
              key={partner.id}
              className={`transition-all duration-700 ${
                index === currentSlide 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 translate-x-full absolute inset-0"
              }`}
            >
              <div className={`bg-gradient-to-br ${partner.color} p-1 rounded-3xl`}>
                <div className="bg-background rounded-3xl p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Partner Logo & Info */}
                    <div className="text-center md:text-right">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 mx-auto md:mx-0 bg-white rounded-2xl p-4 shadow-lg">
                          <img
                            src={partner.logo || "/placeholder.svg"}
                            alt={partner.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Badge 
                          className={`absolute -top-2 -right-2 bg-gradient-to-r ${partner.color} text-white border-0`}
                        >
                          {partner.type}
                        </Badge>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {partner.name}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {partner.description}
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold">شراكة منذ:</span> {partner.partnership_since}
                        </div>
                        <Button variant="outline" 
                        size="sm"
                        className="rounded-full !cursor-pointer"
                        onClick={() => window.open(`${partner.website}`, "_blank")}
                        >
                          زيارة الموقع
                          <ExternalLink className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-4 flex items-center">
                        <Award className="w-5 h-5 ml-2 text-primary" />
                        المشاريع المشتركة
                      </h4>
                      <div className="space-y-3">
                        {partner.projects.map((project, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                          >
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${partner.color}`} />
                            <span className="text-foreground">{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/90 hover:bg-background p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 !cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/90 hover:bg-background p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 !cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {filteredPartners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Partner Logos Grid */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h4 className="text-xl font-bold text-foreground text-center mb-6">جميع شركائنا</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className="group relative bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  const partnerIndex = filteredPartners.findIndex(p => p.id === partner.id)
                  if (partnerIndex !== -1) setCurrentSlide(partnerIndex)
                }}
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/10 group-hover:to-transparent rounded-xl transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Partnership CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl">
            <Handshake className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">كن شريكاً لنا</h3>
            <p className="text-muted-foreground mb-6">
              انضم إلى شبكة شركائنا المتميزين وساهم في بناء مستقبل أفضل للشباب
            </p>
            <Button size="lg" 
            className="rounded-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform !cursor-pointer"
            onClick={() => router.push("/contact")}
            >
              تواصل للشراكة
              <Handshake className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}