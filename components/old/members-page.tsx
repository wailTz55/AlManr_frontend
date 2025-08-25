"use client"
import { fetchAllData } from "../app/api/api";
import { Activity } from "../app/api/type";
import { useState } from "react"
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

// const members = [
//   {
//     id: 1,
//     name: "أحمد محمد العلي",
//     role: "رئيس الجمعية",
//     department: "مجلس الإدارة",
//     image: "/young-arab-president.png",
//     bio: "قائد شاب متحمس يسعى لتطوير المجتمع الشبابي وتمكين الشباب من تحقيق أحلامهم وطموحاتهم",
//     fullBio: `
//       أحمد محمد العلي، رئيس جمعية المنار للشباب منذ عام 2022. حاصل على درجة الماجستير في إدارة الأعمال من جامعة الملك سعود، ولديه خبرة تزيد عن 8 سنوات في مجال القيادة والتطوير المؤسسي.

//       بدأ أحمد رحلته مع الجمعية كمتطوع في عام 2018، وتدرج في المناصب حتى وصل إلى منصب الرئيس. تحت قيادته، نمت الجمعية من 150 عضو إلى أكثر من 500 عضو نشط، وتم تنظيم أكثر من 100 فعالية ونشاط متنوع.

//       يؤمن أحمد بقوة الشباب في صنع التغيير الإيجابي، ويعمل على توفير منصة تمكن الشباب من تطوير مهاراتهم وتحقيق إمكاناتهم الكاملة.
//     `,
//     achievements: [
//       "جائزة القيادة الشبابية المتميزة 2023",
//       "شهادة في إدارة المشاريع من معهد PMI",
//       "مؤسس مبادرة 'شباب المستقبل'",
//       "متحدث في أكثر من 20 مؤتمر شبابي",
//     ],
//     skills: ["القيادة", "إدارة المشاريع", "التخطيط الاستراتيجي", "التواصل العام"],
//     joinDate: "2018-03-15",
//     email: "ahmed.ali@almanar.org",
//     phone: "+966 50 123 4567",
//     location: "الرياض، المملكة العربية السعودية",
//     education: "ماجستير إدارة أعمال - جامعة الملك سعود",
//     type: "board",
//     color: "bg-primary",
//     icon: Crown,
//     socialLinks: {
//       linkedin: "https://linkedin.com/in/ahmed-ali",
//       twitter: "https://twitter.com/ahmed_ali",
//     },
//   },
//   {
//     id: 2,
//     name: "فاطمة سالم الزهراني",
//     role: "نائب الرئيس",
//     department: "مجلس الإدارة",
//     image: "/young-arab-woman-leader.png",
//     bio: "متخصصة في تنظيم الفعاليات والأنشطة الثقافية، تتمتع بخبرة واسعة في إدارة الفرق والتواصل مع المجتمع",
//     fullBio: `
//       فاطمة سالم الزهراني، نائب رئيس جمعية المنار وأحد أبرز القيادات النسائية في المجال الشبابي. حاصلة على بكالوريوس في العلاقات العامة والإعلام، ودبلوم متقدم في تنظيم الفعاليات.

//       انضمت فاطمة للجمعية في عام 2019 كمنسقة للأنشطة النسائية، وسرعان ما أثبتت كفاءتها في تنظيم الفعاليات الكبرى. تحت إشرافها، تم تنظيم أكثر من 50 فعالية ثقافية واجتماعية ناجحة.

//       تؤمن فاطمة بأهمية دور المرأة في المجتمع وتعمل على تمكين الشابات من خلال البرامج التدريبية والأنشطة التطويرية المتخصصة.
//     `,
//     achievements: [
//       "جائزة التميز في تنظيم الفعاليات 2023",
//       "دبلوم في العلاقات العامة والإعلام",
//       "منظمة مؤتمر 'المرأة والقيادة' السنوي",
//       "عضو في اللجنة الاستشارية للشباب بالمنطقة",
//     ],
//     skills: ["تنظيم الفعاليات", "العلاقات العامة", "إدارة الفرق", "التسويق الرقمي"],
//     joinDate: "2019-06-20",
//     email: "fatima.alzahrani@almanar.org",
//     phone: "+966 55 234 5678",
//     location: "جدة، المملكة العربية السعودية",
//     education: "بكالوريوس علاقات عامة وإعلام - جامعة الملك عبدالعزيز",
//     type: "board",
//     color: "bg-secondary",
//     icon: Star,
//     socialLinks: {
//       linkedin: "https://linkedin.com/in/fatima-alzahrani",
//       instagram: "https://instagram.com/fatima_alzahrani",
//     },
//   },
//   {
//     id: 3,
//     name: "خالد عبدالله الشمري",
//     role: "مسؤول الأنشطة الرياضية",
//     department: "المتطوعون",
//     image: "/young-arab-man-sports.png",
//     bio: "مدرب رياضي معتمد ومنظم البطولات الشبابية، يعمل على تعزيز الروح الرياضية والصحة البدنية بين الشباب",
//     fullBio: `
//       خالد عبدالله الشمري، مسؤول الأنشطة الرياضية في جمعية المنار ومدرب رياضي معتمد. حاصل على بكالوريوس في التربية البدنية وعلوم الرياضة، وشهادات متخصصة في التدريب الرياضي.

//       بدأ خالد ممارسة الرياضة في سن مبكرة وحقق إنجازات متميزة في كرة القدم على مستوى المنطقة. انضم للجمعية في عام 2020 بهدف نقل خبرته الرياضية للشباب وتشجيعهم على ممارسة الرياضة.

//       تحت إشرافه، تم تنظيم أكثر من 15 بطولة رياضية متنوعة، وتأسيس 5 فرق رياضية تمثل الجمعية في المسابقات المحلية والإقليمية.
//     `,
//     achievements: [
//       "شهادة تدريب رياضي معتمدة من الاتحاد السعودي",
//       "جائزة أفضل منظم رياضي 2023",
//       "مؤسس أكاديمية المنار الرياضية",
//       "مدرب منتخب الشباب الإقليمي لكرة القدم",
//     ],
//     skills: ["التدريب الرياضي", "تنظيم البطولات", "اللياقة البدنية", "العمل الجماعي"],
//     joinDate: "2020-01-10",
//     email: "khalid.alshamri@almanar.org",
//     phone: "+966 56 345 6789",
//     location: "الدمام، المملكة العربية السعودية",
//     education: "بكالوريوس تربية بدنية وعلوم رياضة - جامعة الدمام",
//     type: "volunteer",
//     color: "bg-accent",
//     icon: Award,
//     socialLinks: {
//       instagram: "https://instagram.com/khalid_sports",
//       youtube: "https://youtube.com/c/khalid-training",
//     },
//   },
//   {
//     id: 4,
//     name: "نورا أحمد القحطاني",
//     role: "منسقة الورش التعليمية",
//     department: "المتطوعون",
//     image: "/young-arab-teacher.png",
//     bio: "معلمة شابة متخصصة في التطوير المهني وتصميم البرامج التدريبية المبتكرة للشباب",
//     fullBio: `
//       نورا أحمد القحطاني، منسقة الورش التعليمية ومطورة البرامج التدريبية في جمعية المنار. حاصلة على ماجستير في التربية وتكنولوجيا التعليم، ولديها خبرة 6 سنوات في مجال التدريب والتطوير.

//       انضمت نورا للجمعية في عام 2021 بهدف تطوير قدرات الشباب من خلال البرامج التعليمية المتخصصة. صممت وقدمت أكثر من 30 ورشة تدريبية في مختلف المجالات.

//       تؤمن نورا بأن التعليم المستمر هو مفتاح النجاح، وتعمل على تطوير برامج تدريبية مبتكرة تواكب احتياجات سوق العمل الحديث.
//     `,
//     achievements: [
//       "ماجستير في التربية وتكنولوجيا التعليم",
//       "جائزة المعلم المبدع 2022",
//       "مطورة برنامج 'مهارات المستقبل' التدريبي",
//       "مدربة معتمدة في التنمية البشرية",
//     ],
//     skills: ["تصميم البرامج التدريبية", "تكنولوجيا التعليم", "التنمية البشرية", "إدارة التدريب"],
//     joinDate: "2021-09-05",
//     email: "nora.alqahtani@almanar.org",
//     phone: "+966 54 456 7890",
//     location: "الرياض، المملكة العربية السعودية",
//     education: "ماجستير تربية وتكنولوجيا تعليم - جامعة الإمام محمد بن سعود",
//     type: "volunteer",
//     color: "bg-chart-3",
//     icon: Users,
//     socialLinks: {
//       linkedin: "https://linkedin.com/in/nora-alqahtani",
//       twitter: "https://twitter.com/nora_educator",
//     },
//   },
//   {
//     id: 5,
//     name: "محمد سعد الغامدي",
//     role: "مصمم جرافيك ومطور مواقع",
//     department: "المتطوعون",
//     image: "/young-arab-designer.png",
//     bio: "مصمم مبدع ومطور مواقع يساهم في الهوية البصرية للجمعية وتطوير منصاتها الرقمية",
//     fullBio: `
//       محمد سعد الغامدي، مصمم جرافيك ومطور مواقع في جمعية المنار. حاصل على بكالوريوس في تقنية المعلومات وشهادات متخصصة في التصميم الرقمي وتطوير المواقع.

//       انضم محمد للجمعية في عام 2020 كمتطوع في قسم الإعلام الرقمي، وسرعان ما أصبح المسؤول عن جميع التصاميم والمنصات الرقمية للجمعية. صمم الهوية البصرية الحالية للجمعية وطور موقعها الإلكتروني.

//       يؤمن محمد بقوة التكنولوجيا في خدمة المجتمع، ويعمل على تطوير حلول رقمية مبتكرة تساعد الجمعية في تحقيق أهدافها.
//     `,
//     achievements: [
//       "جائزة التصميم الإبداعي 2023",
//       "شهادة في التصميم الرقمي من Adobe",
//       "مطور الموقع الإلكتروني الحائز على جائزة أفضل موقع شبابي",
//       "مصمم الهوية البصرية الحالية للجمعية",
//     ],
//     skills: ["تصميم الجرافيك", "تطوير المواقع", "التصوير الفوتوغرافي", "إدارة وسائل التواصل"],
//     joinDate: "2020-11-12",
//     email: "mohammed.alghamdi@almanar.org",
//     phone: "+966 53 567 8901",
//     location: "أبها، المملكة العربية السعودية",
//     education: "بكالوريوس تقنية معلومات - جامعة الملك خالد",
//     type: "volunteer",
//     color: "bg-chart-4",
//     icon: Star,
//     socialLinks: {
//       behance: "https://behance.net/mohammed-alghamdi",
//       instagram: "https://instagram.com/mohammed_designs",
//     },
//   },
//   {
//     id: 6,
//     name: "ريم عبدالرحمن الدوسري",
//     role: "مسؤولة التواصل الاجتماعي",
//     department: "المتطوعون",
//     image: "/young-arab-woman-social-media.png",
//     bio: "خبيرة في التسويق الرقمي وإدارة المحتوى، تدير منصات التواصل الاجتماعي للجمعية بإبداع واحترافية",
//     fullBio: `
//       ريم عبدالرحمن الدوسري، مسؤولة التواصل الاجتماعي والتسويق الرقمي في جمعية المنار. حاصلة على بكالوريوس في الإعلام والاتصال، وشهادات متخصصة في التسويق الرقمي وإدارة وسائل التواصل الاجتماعي.

//       انضمت ريم للجمعية في عام 2021 وتمكنت من زيادة متابعي الجمعية على وسائل التواصل الاجتماعي بنسبة 300% خلال عامين. تدير حملات تسويقية مبتكرة وتنتج محتوى إبداعي يعكس روح الجمعية وأنشطتها.

//       تؤمن ريم بقوة وسائل التواصل الاجتماعي في بناء المجتمعات وتعزيز التفاعل الإيجابي بين الشباب.
//     `,
//     achievements: [
//       "شهادة في التسويق الرقمي من Google",
//       "جائزة أفضل محتوى رقمي 2023",
//       "زيادة متابعي الجمعية بنسبة 300%",
//       "منشئة حملة '#شباب_المنار' الفيروسية",
//     ],
//     skills: ["التسويق الرقمي", "إدارة وسائل التواصل", "إنتاج المحتوى", "التصوير والمونتاج"],
//     joinDate: "2021-04-18",
//     email: "reem.aldosari@almanar.org",
//     phone: "+966 52 678 9012",
//     location: "الخبر، المملكة العربية السعودية",
//     education: "بكالوريوس إعلام واتصال - جامعة الإمام عبدالرحمن بن فيصل",
//     type: "volunteer",
//     color: "bg-chart-5",
//     icon: Users,
//     socialLinks: {
//       twitter: "https://twitter.com/reem_aldosari",
//       instagram: "https://instagram.com/reem_social",
//       tiktok: "https://tiktok.com/@reem_content",
//     },
//   },
// ]

export function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<(typeof members)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  const departments = ["all", "مجلس الإدارة", "المتطوعون"]

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const boardMembers = filteredMembers.filter((member) => member.type === "board")
  const volunteers = filteredMembers.filter((member) => member.type === "volunteer")

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
              placeholder="ابحث عن عضو أو مهارة..."
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
                  {department === "all" ? "الكل" : department}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Board Members */}
      {boardMembers.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Crown className="w-8 h-8 text-primary" />
            مجلس الإدارة
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {boardMembers.map((member, index) => {
              const Icon = member.icon
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
                      alt={member.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div
                      className={`absolute top-4 right-4 w-12 h-12 ${member.color} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{member.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 2).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-white/20 text-white border-0">
                            {skill}
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
      {volunteers.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-secondary" />
            المتطوعون النشطون
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {volunteers.map((member, index) => {
              const Icon = member.icon
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
                      alt={member.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className={`absolute top-3 right-3 w-8 h-8 ${member.color} rounded-full flex items-center justify-center border-2 border-white shadow-md`}
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
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
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
                      alt={selectedMember.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div
                      className={`absolute top-4 right-4 w-12 h-12 ${selectedMember.color} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
                    >
                      <selectedMember.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <Card className="p-4">
                    <h4 className="font-semibold text-foreground mb-3">معلومات الاتصال</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{selectedMember.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-secondary" />
                        <span className="text-muted-foreground">{selectedMember.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">{selectedMember.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-chart-3" />
                        <span className="text-muted-foreground">
                          انضم في {new Date(selectedMember.joinDate).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6">
                  {/* Role and Department */}
                  <div>
                    <Badge className={`${selectedMember.color} text-white border-0 mb-2`}>
                      {selectedMember.department}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground">{selectedMember.role}</h3>
                  </div>

                  {/* Bio */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">نبذة شخصية</h4>
                    <div className="prose prose-sm max-w-none text-right" dir="rtl">
                      {selectedMember.fullBio.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-3 leading-relaxed text-muted-foreground">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      التعليم
                    </h4>
                    <p className="text-muted-foreground">{selectedMember.education}</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">المهارات والخبرات</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">الإنجازات والجوائز</h4>
                    <div className="space-y-2">
                      {selectedMember.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

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
