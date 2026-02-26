with open('components/members-section.tsx', 'w') as f:
    f.write("""\"use client\"

import { useState, useEffect, useRef } from \"react\"
import { Button } from \"@/components/ui/button\"
import { Badge } from \"@/components/ui/badge\"
import { Building2, Handshake, Award, Star, ChevronLeft, ChevronRight, ExternalLink } from \"lucide-react\"
import { useRouter } from \"next/navigation\"
import gsap from \"gsap\"
import { useGSAP } from \"@gsap/react\"
import { ScrollTrigger } from \"gsap/dist/ScrollTrigger\"

if (typeof window !== \"undefined\") {
  gsap.registerPlugin(ScrollTrigger)
}

const partners = [
  {
    id: 1,
    name: \"زياد وائل طارق\",
    type: \"ذهبي\",
    logo: \"/aramco-logo.png\",
    description: \"برمجة الموقع و تصميم كامل الهوية البصرية للجمعية\",
    partnership_since: \"2025\",
    projects: [\"تصميم الهوية البصرية\", \"برمجة الموقع\"],
    category: \"corporate\",
    website: \"#\",
    color: \"from-green-600 to-teal-600\"
  },
  {
    id: 2,
    name: \"وزارة الشباب و الرياضة\",
    type: \"استراتيجي\",
    logo: \"/وزرة الشباب.jpg\",
    description: \"شراكة استراتيجية في برامج تطوير الشباب والقيادة\",
    partnership_since: \"2023\",
    projects: [\"البرامج الشبابية\", \"رخصة الجمعية و التمويل\"],
    category: \"government\",
    website: \"https://www.facebook.com/ministryofyouthalgeria\",
    color: \"from-purple-600 to-blue-600\"
  },
  {
    id: 3,
    name: \"مركز التكوين المهني سعو زروق عين الكبيرة\",
    type: \"أكاديمي\",
    logo: \"/مركز التكوين.jpg\",
    description: \"تعاون في التدريب المهني والبرامج الأكاديمية\",
    partnership_since: \"2024\",
    projects: [ \"مبادرة التدريب المهني\"],
    category: \"academic\",
    website: \"https://www.facebook.com/CFPAAinElkebiraSETIF\",
    color: \"from-blue-600 to-indigo-600\"
  },
]

const categories = [
  { id: \"all\", name: \"جميع الشركاء\", icon: Handshake },
  { id: \"government\", name: \"حكومي\", icon: Building2 },
  { id: \"corporate\", name: \"شركات\", icon: Award },
  { id: \"academic\", name: \"أكاديمي\", icon: Star },
]

export function PartnersSection() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedCategory, setSelectedCategory] = useState(\"all\")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const filteredPartners = partners.filter(
    partner => selectedCategory === \"all\" || partner.category === selectedCategory
  )

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filteredPartners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [filteredPartners.length, isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % filteredPartners.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + filteredPartners.length) % filteredPartners.length)
  }

  useGSAP(() => {
    // Header reveal
    gsap.from(\".partners-header\", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: \"top 85%\",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: \"power2.out\"
    })

    // Categories filter buttons stagger
    gsap.from(\".partner-category-btn\", {
      scrollTrigger: {
        trigger: \".partners-categories\",
        start: \"top 85%\",
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: \"power2.out\"
    })

    // Main Partner Card reveal
    gsap.from(\".partner-main-card\", {
      scrollTrigger: {
        trigger: \".partner-main-card\",
        start: \"top 80%\",
      },
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: \"power3.inOut\"
    })

    // Bottom logos stagger
    gsap.from(\".partner-logo-item\", {
      scrollTrigger: {
        trigger: \".partner-logos-grid\",
        start: \"top 90%\",
      },
      y: 20,
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: \"back.out(1.5)\"
    })

    // CTA
    gsap.from(\".partner-cta-box\", {
      scrollTrigger: {
        trigger: \".partners-cta\",
        start: \"top 90%\",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: \"power3.out\"
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className=\"container mx-auto px-4 py-24 overflow-hidden\">
      {/* Header */}
      <div className=\"partners-header text-center mb-16\">
        <div className=\"inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full mb-6 font-medium tracking-wide shadow-sm\">
          <Handshake className=\"w-5 h-5\" />
          <span>شركاؤنا في النجاح</span>
        </div>
        <h2 className=\"text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6\">
          شراكات استراتيجية
          <span className=\"text-primary block md:inline md:ml-2\"> متميزة</span>
        </h2>
        <p className=\"text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed\">
          نفتخر بشراكاتنا مع المؤسسات الرائدة التي تساهم في تحقيق رؤيتنا وأهدافنا
        </p>
        <div className=\"w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full opacity-80\" />
      </div>

      {/* Category Filter */}
      <div className=\"partners-categories flex justify-center gap-3 mb-16 flex-wrap\">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? \"default\" : \"outline\"}
              onClick={() => {
                setSelectedCategory(category.id)
                setCurrentSlide(0)
              }}
              className={`partner-category-btn rounded-full transition-all duration-300 px-6 py-5 text-sm font-medium !cursor-pointer ${
                isSelected 
                  ? \"shadow-md scale-105\" 
                  : \"hover:bg-primary/5 hover:border-primary/30 hover:text-primary\"
              }`}
            >
              <Icon className={`w-4 h-4 ml-2 ${isSelected ? \"text-white\" : \"text-muted-foreground\"}`} />
              {category.name}
            </Button>
          )
        })}
      </div>

      {/* Partners Showcase */}
      <div className=\"relative max-w-6xl mx-auto\">
        {/* Main Featured Partner */}
        <div 
          className=\"partner-main-card relative overflow-hidden rounded-[2.5rem] mb-12 shadow-2xl hover:shadow-3xl transition-shadow duration-500\"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {filteredPartners.map((partner, index) => (
            <div
              key={partner.id}
              className={`transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                index === currentSlide 
                  ? \"opacity-100 translate-x-0 scale-100 z-10\" 
                  : index < currentSlide
                    ? \"opacity-0 -translate-x-full scale-95 absolute inset-0 z-0\"
                    : \"opacity-0 translate-x-full scale-95 absolute inset-0 z-0\"
              }`}
            >
              <div className={`bg-gradient-to-br ${partner.color} p-[2px]`}>
                <div className=\"bg-card/95 backdrop-blur-xl rounded-[calc(2.5rem-2px)] p-8 md:p-14 border border-white/10\">
                  <div className=\"grid md:grid-cols-2 gap-12 items-center\">
                    {/* Partner Logo & Info */}
                    <div className=\"text-center md:text-right\">
                      <div className=\"relative mb-8 inline-block\">
                        <div className=\"w-36 h-36 md:w-40 md:h-40 mx-auto md:mx-0 bg-white rounded-3xl p-5 shadow-xl border border-border/50 transition-transform duration-500 hover:scale-105 hover:rotate-3\">
                          <img
                            src={partner.logo || \"/placeholder.svg\"}
                            alt={partner.name}
                            className=\"w-full h-full object-contain\"
                          />
                        </div>
                        <Badge 
                          className={`absolute -top-3 right-0 md:-right-3 bg-gradient-to-r ${partner.color} text-white border-0 px-4 py-1.5 text-sm font-medium shadow-lg`}
                        >
                          {partner.type}
                        </Badge>
                      </div>
                      
                      <h3 className=\"text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight\">
                        {partner.name}
                      </h3>
                      
                      <p className=\"text-muted-foreground mb-8 text-lg md:text-xl leading-relaxed font-medium\">
                        {partner.description}
                      </p>
                      
                      <div className=\"flex flex-wrap gap-4 justify-center md:justify-start items-center\">
                        <div className=\"text-sm text-foreground bg-muted hover:bg-muted/80 transition-colors px-4 py-2 rounded-full font-medium\">
                          <span className=\"text-muted-foreground ml-1\">شراكة منذ:</span> 
                          {partner.partnership_since}
                        </div>
                        <Button 
                          variant=\"outline\" 
                          className=\"rounded-full border-2 hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 !cursor-pointer\"
                          onClick={() => window.open(`${partner.website}`, \"_blank\")}
                        >
                          زيارة الموقع
                          <ExternalLink className=\"w-4 h-4 mr-2\" />
                        </Button>
                      </div>
                    </div>

                    {/* Projects */}
                    <div className=\"bg-background/40 p-8 rounded-3xl border border-white/5\">
                      <h4 className=\"text-2xl font-bold text-foreground mb-6 flex items-center gap-3\">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${partner.color} bg-opacity-10 text-white`}>
                          <Award className=\"w-6 h-6\" />
                        </div>
                        المشاريع المشتركة
                      </h4>
                      <div className=\"space-y-4\">
                        {partner.projects.map((project, idx) => (
                          <div 
                            key={idx}
                            className=\"flex items-center gap-4 p-4 bg-card/60 rounded-2xl border border-white/5 hover:bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-1 group\"
                          >
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${partner.color} group-hover:scale-125 transition-transform`} />
                            <span className=\"text-foreground font-medium text-lg\">{project}</span>
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
          <div className=\"absolute inset-0 pointer-events-none flex items-center justify-between px-2 md:-mx-6 z-20\">
            <button
              onClick={prevSlide}
              className=\"pointer-events-auto bg-background/80 backdrop-blur-md hover:bg-background p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-white/10 !cursor-pointer hidden md:flex hover:text-primary\"
            >
              <ChevronLeft className=\"w-6 h-6 text-foreground\" />
            </button>
            <button
              onClick={nextSlide}
              className=\"pointer-events-auto bg-background/80 backdrop-blur-md hover:bg-background p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-white/10 !cursor-pointer hidden md:flex hover:text-primary\"
            >
              <ChevronRight className=\"w-6 h-6 text-foreground\" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Controls and Indicators */}
        <div className=\"flex flex-col items-center gap-6 mb-16\">
          {/* Dots Indicator */}
          <div className=\"flex justify-center gap-3\">
            {filteredPartners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentSlide 
                    ? \"w-10 bg-primary shadow-sm\" 
                    : \"w-3 bg-muted-foreground/30 hover:bg-muted-foreground/60\"
                }`}
              />
            ))}
          </div>

          {/* Mobile Arrows */}
          <div className=\"flex gap-4 md:hidden\">
            <button onClick={prevSlide} className=\"p-3 bg-card rounded-full shadow-sm hover:shadow-md !cursor-pointer\">
               <ChevronLeft className=\"w-6 h-6\" />
            </button>
            <button onClick={nextSlide} className=\"p-3 bg-card rounded-full shadow-sm hover:shadow-md !cursor-pointer\">
               <ChevronRight className=\"w-6 h-6\" />
            </button>
          </div>
        </div>

        {/* Partner Logos Grid */}
        <div className=\"partner-logos-grid bg-gradient-to-br from-card to-muted/20 rounded-3xl p-10 md:p-12 border border-border/50 shadow-sm\">
          <h4 className=\"text-2xl font-bold text-foreground text-center mb-10\">جميع شركائنا في النجاح</h4>
          <div className=\"flex flex-wrap justify-center gap-6 md:gap-10\">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className=\"partner-logo-item group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer w-[140px] h-[100px] flex items-center justify-center hover:-translate-y-2 border border-border/40\"
                onClick={() => {
                  const partnerIndex = filteredPartners.findIndex(p => p.id === partner.id)
                  if (partnerIndex !== -1) {
                    setSelectedCategory(partner.category === selectedCategory ? selectedCategory : \"all\")
                    setCurrentSlide(partnerIndex)
                    
                    // Small scroll up to see the selected partner
                    window.scrollTo({
                      top: document.getElementById(\"members\")?.offsetTop ? document.getElementById(\"members\")!.offsetTop - 100 : 0,
                      behavior: \"smooth\"
                    })
                  }
                }}
              >
                <img
                  src={partner.logo || \"/placeholder.svg\"}
                  alt={partner.name}
                  className=\"w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 scale-95 group-hover:scale-110\"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Partnership CTA */}
        <div className=\"partners-cta text-center mt-24\">
          <div className=\"partner-cta-box max-w-3xl mx-auto p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/5 rounded-[2.5rem] border border-white/20 shadow-lg relative overflow-hidden\">
            <div className=\"absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl\" />
            <div className=\"absolute -left-12 -bottom-12 w-40 h-40 bg-secondary/10 rounded-full blur-3xl\" />
            
            <div className=\"relative z-10\">
              <div className=\"bg-white w-20 h-20 mx-auto rounded-3xl shadow-sm flex items-center justify-center mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300\">
                <Handshake className=\"w-10 h-10 text-primary\" />
              </div>
              <h3 className=\"text-3xl md:text-4xl font-black text-foreground mb-6\">دعنا نبني المستقبل معاً</h3>
              <p className=\"text-muted-foreground mb-10 text-lg md:text-xl font-medium\">
                انضم إلى شبكة شركائنا المتميزين وساهم في بناء مستقبل أفضل للشباب والمجتمع
              </p>
              <Button 
                size=\"lg\" 
                className=\"rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/30 px-10 py-7 text-xl font-bold !cursor-pointer group\"
                onClick={() => router.push(\"/contact\")}
              >
                تواصل لحجز شراكة
                <Handshake className=\"w-6 h-6 mr-3 group-hover:rotate-12 transition-transform\" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
""")
