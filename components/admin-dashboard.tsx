"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Calendar,
  MessageSquare,
  UserCheck,
  Newspaper,
  Settings,
  BarChart3,
  Shield,
  Eye,
  EyeOff,
  LogIn,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Mail,
  Reply,
  Search,
  Filter,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Globe,
  EyeIcon,
  Check,
  X,
  Crown,
  Undo2,
  Building2,
  FileDown,
  AlertTriangle,
  Timer,
} from "lucide-react"

interface Activity {
  id: string
  title: string
  description: string
  type: string
  date: string
  location: string
  duration: string
  price: string
  capacity: number
  registered: number
  status: "active" | "completed" | "cancelled"
  image: string
}

interface Message {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  department: string
  date: string
  status: "unread" | "read" | "replied"
  priority: "low" | "medium" | "high"
}

interface AssociationApplication {
  id: string
  applicationId: string
  associationName: string
  institutionName: string
  presidentName: string
  presidentPhone: string
  treasurerName: string
  treasurerPhone: string
  secretaryGeneralName: string
  secretaryGeneralPhone: string
  email: string
  phone: string
  submissionDate: string
  status: "pending" | "approved" | "rejected"
  rejectedAt?: string
  reviewedBy?: string
  reviewDate?: string
  notes?: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  publishDate: string
  status: "draft" | "published" | "archived"
  image: string
  tags: string[]
  views: number
  featured: boolean
}

interface Member {
  id: number
  name: string
  email: string
  phone: string
  address: string
  joinDate: string
  lastActive: string
  status: "active" | "inactive" | "pending"
  avatar: string
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "المخيم الصيفي الشبابي",
      description: "مخيم صيفي مليء بالأنشطة الترفيهية والتعليمية للشباب",
      type: "مخيم",
      date: "2024-07-15",
      location: "جبال الشوف",
      duration: "5 أيام",
      price: "150",
      capacity: 50,
      registered: 35,
      status: "active",
      image: "/summer-camp-mountains.png",
    },
    {
      id: "2",
      title: "ورشة الإبداع والابتكار",
      description: "ورشة تدريبية لتطوير مهارات الإبداع والتفكير النقدي",
      type: "ورشة",
      date: "2024-06-20",
      location: "مركز الجمعية",
      duration: "يوم واحد",
      price: "مجاني",
      capacity: 30,
      registered: 28,
      status: "completed",
      image: "/creative-workshop-innovation.png",
    },
    {
      id: "3",
      title: "بطولة كرة القدم الشبابية",
      description: "بطولة كرة قدم للشباب من مختلف الأعمار",
      type: "رياضة",
      date: "2024-08-10",
      location: "الملعب البلدي",
      duration: "3 أيام",
      price: "50",
      capacity: 100,
      registered: 67,
      status: "active",
      image: "/youth-football-tournament.png",
    },
  ])

  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    title: "",
    description: "",
    type: "",
    date: "",
    location: "",
    duration: "",
    price: "",
    capacity: 0,
    status: "active",
    image: "",
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      name: "أحمد محمد علي",
      email: "ahmed.mohamed@email.com",
      phone: "+961 70 123 456",
      subject: "استفسار عن المخيم الصيفي",
      message: "السلام عليكم، أريد معرفة المزيد من التفاصيل حول المخيم الصيفي المقبل وشروط التسجيل.",
      department: "الأنشطة",
      date: "2024-01-15T10:30:00",
      status: "unread",
      priority: "medium",
    },
    {
      id: "2",
      name: "فاطمة حسن",
      email: "fatima.hassan@email.com",
      phone: "+961 71 987 654",
      subject: "طلب انضمام للجمعية",
      message: "مرحباً، أود الانضمام إلى الجمعية والمشاركة في الأنشطة التطوعية. كيف يمكنني التقديم؟",
      department: "العضوية",
      date: "2024-01-14T14:20:00",
      status: "read",
      priority: "high",
    },
    {
      id: "3",
      name: "محمد خالد",
      email: "mohamed.khaled@email.com",
      phone: "+961 76 555 123",
      subject: "اقتراح نشاط جديد",
      message: "لدي اقتراح لنشاط رياضي جديد يمكن أن يفيد الشباب في المنطقة. هل يمكننا مناقشة الأمر؟",
      department: "الإدارة العامة",
      date: "2024-01-13T09:15:00",
      status: "replied",
      priority: "low",
    },
    {
      id: "4",
      name: "سارة أحمد",
      email: "sara.ahmed@email.com",
      phone: "+961 78 444 789",
      subject: "شكوى حول خدمة",
      message: "أواجه مشكلة في التسجيل في الموقع الإلكتروني. الرجاء المساعدة في حل هذه المشكلة.",
      department: "الدعم التقني",
      date: "2024-01-12T16:45:00",
      status: "unread",
      priority: "high",
    },
  ])

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")
  const [messageFilter, setMessageFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [associationApplications, setAssociationApplications] = useState<AssociationApplication[]>([
    {
      id: "1",
      applicationId: "ASC-2024-001",
      associationName: "جمعية النور الخيرية",
      institutionName: "مؤسسة النور للتنمية الاجتماعية",
      presidentName: "أحمد محمد علي",
      presidentPhone: "+961 70 123 456",
      treasurerName: "سمير حسن خالد",
      treasurerPhone: "+961 71 222 333",
      secretaryGeneralName: "ريما سعد الدين",
      secretaryGeneralPhone: "+961 76 444 555",
      email: "info@alnoor-charity.org",
      phone: "+961 1 234 567",
      submissionDate: "2024-01-15T10:30:00",
      status: "pending",
    },
    {
      id: "2",
      applicationId: "ASC-2024-002",
      associationName: "جمعية الأمل للتنمية",
      institutionName: "مؤسسة الأمل للخدمات المجتمعية",
      presidentName: "فاطمة حسن أحمد",
      presidentPhone: "+961 71 987 654",
      treasurerName: "نادين عبد الله",
      treasurerPhone: "+961 78 111 222",
      secretaryGeneralName: "كريم مصطفى",
      secretaryGeneralPhone: "+961 70 333 444",
      email: "contact@alamal-dev.org",
      phone: "+961 1 345 678",
      submissionDate: "2024-01-14T14:20:00",
      status: "approved",
      reviewedBy: "المدير العام",
      reviewDate: "2024-01-16T09:00:00",
      notes: "جمعية فاعلة وتستوفي جميع الشروط المطلوبة",
    },
    {
      id: "3",
      applicationId: "ASC-2024-003",
      associationName: "جمعية الشباب الرياضي",
      institutionName: "مؤسسة الشباب والرياضة",
      presidentName: "محمد خالد سعد",
      presidentPhone: "+961 76 555 123",
      treasurerName: "حسام الدين نور",
      treasurerPhone: "+961 79 666 777",
      secretaryGeneralName: "لينا أحمد",
      secretaryGeneralPhone: "+961 71 888 999",
      email: "info@youth-sports.org",
      phone: "+961 1 456 789",
      submissionDate: "2024-01-13T09:15:00",
      status: "rejected",
      rejectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedBy: "مدير الموارد البشرية",
      reviewDate: "2024-01-15T11:30:00",
      notes: "لم تستوف الجمعية الشروط المطلوبة للانتساب",
    },
  ])

  const [selectedApplication, setSelectedApplication] = useState<AssociationApplication | null>(null)
  const [applicationFilter, setApplicationFilter] = useState("all")
  const [applicationSearchTerm, setApplicationSearchTerm] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([
    {
      id: "1",
      title: "إطلاق برنامج المنح الدراسية الجديد",
      content:
        "يسعدنا أن نعلن عن إطلاق برنامج المنح الدراسية الجديد الذي يهدف إلى دعم الطلاب المتفوقين من أبناء المجتمع. يشمل البرنامج منح كاملة وجزئية للدراسة الجامعية في مختلف التخصصات. نحن نؤمن بأن التعليم هو الأساس لبناء مستقبل أفضل، ولذلك نسعى لتوفير الفرص التعليمية للجميع بغض النظر عن ظروفهم المالية.",
      excerpt: "إطلاق برنامج جديد لدعم الطلاب المتفوقين بمنح دراسية كاملة وجزئية",
      category: "تعليم",
      author: "إدارة الجمعية",
      publishDate: "2024-01-15T10:00:00",
      status: "published",
      image: "/scholarship-announcement.png",
      tags: ["منح", "تعليم", "طلاب"],
      views: 245,
      featured: true,
    },
    {
      id: "2",
      title: "حفل تكريم المتطوعين المتميزين",
      content:
        "أقامت جمعية المنار للشباب حفل تكريم للمتطوعين المتميزين الذين ساهموا بجهودهم الرائعة في إنجاح أنشطة الجمعية خلال العام الماضي. الحفل شهد حضور كبير من أعضاء الجمعية والمجتمع المحلي، وتم تكريم 25 متطوع ومتطوعة قدموا خدمات استثنائية في مختلف المجالات.",
      excerpt: "تكريم 25 متطوع ومتطوعة لجهودهم المتميزة في خدمة المجتمع",
      category: "فعاليات",
      author: "فريق الإعلام",
      publishDate: "2024-01-12T15:30:00",
      status: "published",
      image: "/innovation-award-ceremony.png",
      tags: ["تكريم", "متطوعين", "فعاليات"],
      views: 189,
      featured: false,
    },
    {
      id: "3",
      title: "الجمعية العمومية السنوية 2024",
      content:
        "تدعو جمعية المنار للشباب جميع أعضائها لحضور الجمعية العمومية السنوية التي ستعقد يوم السبت الموافق 20 يناير 2024 في مقر الجمعية. سيتم خلال الاجتماع مناقشة التقرير السنوي، الميزانية، والخطط المستقبلية للجمعية. حضوركم مهم لاتخاذ القرارات المصيرية للجمعية.",
      excerpt: "دعوة لحضور الجمعية العمومية السنوية لمناقشة التقرير والخطط المستقبلية",
      category: "إعلانات",
      author: "مجلس الإدارة",
      publishDate: "2024-01-10T09:00:00",
      status: "published",
      image: "/general-assembly-meeting.png",
      tags: ["جمعية عمومية", "اجتماع", "أعضاء"],
      views: 156,
      featured: false,
    },
    {
      id: "4",
      title: "ورشة تطوير المهارات القيادية",
      content:
        "تنظم الجمعية ورشة تدريبية متخصصة في تطوير المهارات القيادية للشباب، تهدف إلى إعداد جيل من القادة الشباب القادرين على قيادة التغيير الإيجابي في المجتمع. الورشة ستغطي مواضيع متنوعة مثل القيادة الفعالة، إدارة الفرق، والتواصل الإيجابي.",
      excerpt: "ورشة تدريبية لتطوير المهارات القيادية وإعداد جيل من القادة الشباب",
      category: "تدريب",
      author: "قسم التدريب",
      publishDate: "2024-01-08T14:00:00",
      status: "draft",
      image: "/leadership-skills-workshop.png",
      tags: ["قيادة", "تدريب", "شباب"],
      views: 0,
      featured: false,
    },
  ])

  const [isAddingNews, setIsAddingNews] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const [newNews, setNewNews] = useState<Partial<NewsArticle>>({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author: "",
    status: "draft",
    image: "",
    tags: [],
    featured: false,
  })
  const [newsFilter, setNewsFilter] = useState("all")
  const [newsSearchTerm, setNewsSearchTerm] = useState("")
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null)

  const [adminTeam, setAdminTeam] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@almanar.org",
      role: "Super Admin",
      permissions: ["all"],
      avatar: "/young-arab-president.png",
      joinDate: "2024-01-15",
      lastActive: "منذ 5 دقائق",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@almanar.org",
      role: "Content Manager",
      permissions: ["activities", "news"],
      avatar: "/young-arab-woman-leader.png",
      joinDate: "2024-02-20",
      lastActive: "منذ ساعة",
    },
    {
      id: 3,
      name: "محمد حسن",
      email: "mohammed@almanar.org",
      role: "Moderator",
      permissions: ["messages", "memberships"],
      avatar: "/young-arab-man-sports.png",
      joinDate: "2024-03-10",
      lastActive: "منذ يومين",
    },
  ])

  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [showEditPermissionsModal, setShowEditPermissionsModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [newAdminData, setNewAdminData] = useState({
    memberId: "",
    role: "Viewer",
    permissions: [] as string[],
  })

  const rolePermissions = {
    "Super Admin": ["all"],
    "Content Manager": ["activities", "news", "members"],
    Moderator: ["messages", "memberships"],
    Viewer: ["dashboard"],
  }

  const availablePermissions = [
    { id: "activities", label: "إدارة الأنشطة", description: "إضافة وتعديل وحذف الأنشطة" },
    { id: "news", label: "إدارة الأخبار", description: "إضافة وتعديل ونشر الأخبار" },
    { id: "messages", label: "إدارة الرسائل", description: "قراءة والرد على الرسائل" },
    { id: "memberships", label: "إدارة الانتسابات", description: "قبول ورفض طلبات الانتساب" },
    { id: "members", label: "إدارة الأعضاء", description: "عرض وإدارة بيانات الأعضاء" },
    { id: "permissions", label: "إدارة الصلاحيات", description: "منح وإلغاء صلاحيات المديرين" },
  ]

  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+961 70 123 456",
      address: "بيروت، لبنان",
      joinDate: "2024-01-15",
      lastActive: "منذ 5 دقائق",
      status: "active",
      avatar: "/young-arab-president.png",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "+961 71 987 654",
      address: "طرابلس، لبنان",
      joinDate: "2024-02-20",
      lastActive: "منذ ساعة",
      status: "active",
      avatar: "/young-arab-woman-leader.png",
    },
    {
      id: 3,
      name: "محمد حسن",
      email: "mohammed@example.com",
      phone: "+961 76 555 123",
      address: "صيدا، لبنان",
      joinDate: "2024-03-10",
      lastActive: "منذ يومين",
      status: "inactive",
      avatar: "/young-arab-man-sports.png",
    },
  ])

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("كلمة مرور خاطئة")
    }
  }

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.description) {
      const activity: Activity = {
        id: Date.now().toString(),
        title: newActivity.title,
        description: newActivity.description,
        type: newActivity.type || "عام",
        date: newActivity.date || "",
        location: newActivity.location || "",
        duration: newActivity.duration || "",
        price: newActivity.price || "مجاني",
        capacity: newActivity.capacity || 0,
        registered: 0,
        status: (newActivity.status as "active" | "completed" | "cancelled") || "active",
        image: newActivity.image || "/diverse-group-activity.png",
      }
      setActivities([...activities, activity])
      setNewActivity({
        title: "",
        description: "",
        type: "",
        date: "",
        location: "",
        duration: "",
        price: "",
        capacity: 0,
        status: "active",
        image: "",
      })
      setIsAddingActivity(false)
    }
  }

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity)
    setNewActivity(activity)
  }

  const handleUpdateActivity = () => {
    if (editingActivity && newActivity.title && newActivity.description) {
      setActivities(
        activities.map((activity) =>
          activity.id === editingActivity.id ? ({ ...activity, ...newActivity } as Activity) : activity,
        ),
      )
      setEditingActivity(null)
      setNewActivity({
        title: "",
        description: "",
        type: "",
        date: "",
        location: "",
        duration: "",
        price: "",
        capacity: 0,
        status: "active",
        image: "",
      })
    }
  }

  const handleDeleteActivity = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا النشاط؟")) {
      setActivities(activities.filter((activity) => activity.id !== id))
    }
  }

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg)))
  }

  const handleDeleteMessage = (messageId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      setMessages(messages.filter((msg) => msg.id !== messageId))
    }
  }

  const handleReplyMessage = (messageId: string) => {
    if (replyText.trim()) {
      setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, status: "replied" } : msg)))
      setReplyText("")
      setSelectedMessage(null)
      // In a real app, this would send an email
      alert("تم إرسال الرد بنجاح")
    }
  }

  const handleApproveApplication = (applicationId: string) => {
    setAssociationApplications((applications) =>
      applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: "approved" as const,
              rejectedAt: undefined,
              reviewedBy: "المدير العام",
              reviewDate: new Date().toISOString(),
              notes: reviewNotes || "تم قبول طلب الانتساب",
            }
          : app,
      ),
    )
    setReviewNotes("")
    setSelectedApplication(null)
  }

  const handleRejectApplication = (applicationId: string) => {
    setAssociationApplications((applications) =>
      applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: "rejected" as const,
              rejectedAt: new Date().toISOString(),
              reviewedBy: "المدير العام",
              reviewDate: new Date().toISOString(),
              notes: reviewNotes || "تم رفض طلب الانتساب",
            }
          : app,
      ),
    )
    setReviewNotes("")
    setSelectedApplication(null)
  }

  const handleUndoRejection = (applicationId: string) => {
    setAssociationApplications((applications) =>
      applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: "pending" as const,
              rejectedAt: undefined,
              reviewedBy: undefined,
              reviewDate: undefined,
              notes: undefined,
            }
          : app,
      ),
    )
  }

  const handleDeleteApplication = (applicationId: string) => {
    setDeleteConfirmId(applicationId)
  }

  const confirmDeleteApplication = () => {
    if (deleteConfirmId) {
      setAssociationApplications((applications) => applications.filter((app) => app.id !== deleteConfirmId))
      setDeleteConfirmId(null)
      if (selectedApplication?.id === deleteConfirmId) {
        setSelectedApplication(null)
      }
    }
  }

  const getRejectionDaysRemaining = (rejectedAt: string): number => {
    const rejectedDate = new Date(rejectedAt)
    const now = new Date()
    const diffMs = 5 * 24 * 60 * 60 * 1000 - (now.getTime() - rejectedDate.getTime())
    return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)))
  }

  // Auto-delete rejected applications after 5 days
  useEffect(() => {
    const interval = setInterval(() => {
      setAssociationApplications((applications) =>
        applications.filter((app) => {
          if (app.status === "rejected" && app.rejectedAt) {
            return getRejectionDaysRemaining(app.rejectedAt) > 0
          }
          return true
        }),
      )
    }, 60 * 1000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const handleExportPDF = useCallback(async () => {
    const { default: jsPDF } = await import("jspdf")
    await import("jspdf-autotable")

    const approvedApps = associationApplications.filter((app) => app.status === "approved")
    const doc = new jsPDF({ orientation: "landscape", putOnlyUsedFonts: true })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("Approved Association Applications", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" })
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US")}`, doc.internal.pageSize.getWidth() / 2, 28, { align: "center" })

    let startY = 38

    approvedApps.forEach((app, index) => {
      if (index > 0) {
        doc.addPage()
        startY = 20
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text(`${index + 1}. ${app.associationName}`, doc.internal.pageSize.getWidth() / 2, startY, { align: "center" })

      const tableData = [
        ["Application ID", app.applicationId],
        ["Association Name", app.associationName],
        ["Institution Name", app.institutionName],
        ["President", `${app.presidentName} - ${app.presidentPhone}`],
        ["Treasurer", `${app.treasurerName} - ${app.treasurerPhone}`],
        ["Secretary General", `${app.secretaryGeneralName} - ${app.secretaryGeneralPhone}`],
        ["Email", app.email],
        ["Phone", app.phone],
        ["Submission Date", new Date(app.submissionDate).toLocaleDateString("en-US")],
        ["Status", "Approved"],
        ["Reviewed By", app.reviewedBy || "-"],
        ["Review Date", app.reviewDate ? new Date(app.reviewDate).toLocaleDateString("en-US") : "-"],
        ["Notes", app.notes || "-"],
      ]

      ;(doc as unknown as { autoTable: (options: Record<string, unknown>) => void }).autoTable({
        startY: startY + 6,
        head: [["Field", "Value"]],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4, halign: "left" },
        headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [255, 251, 235] },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 60 },
          1: { cellWidth: "auto" },
        },
      })
    })

    if (approvedApps.length === 0) {
      doc.setFontSize(14)
      doc.text("No approved associations to export.", doc.internal.pageSize.getWidth() / 2, 50, { align: "center" })
    }

    doc.save("approved-associations.pdf")
    setShowExportDialog(false)
  }, [associationApplications])

  const handleExportDOCX = useCallback(async () => {
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, BorderStyle } = await import("docx")
    const { saveAs } = await import("file-saver")

    const approvedApps = associationApplications.filter((app) => app.status === "approved")

    const createTableForApp = (app: AssociationApplication) => {
      const rows = [
        ["رقم الطلب", app.applicationId],
        ["اسم الجمعية", app.associationName],
        ["اسم المؤسسة", app.institutionName],
        ["رئيس الجمعية", `${app.presidentName} - ${app.presidentPhone}`],
        ["أمين الصندوق", `${app.treasurerName} - ${app.treasurerPhone}`],
        ["الأمين العام", `${app.secretaryGeneralName} - ${app.secretaryGeneralPhone}`],
        ["البريد الإلكتروني", app.email],
        ["رقم الهاتف", app.phone],
        ["تاريخ التقديم", new Date(app.submissionDate).toLocaleDateString("ar-SA")],
        ["الحالة", "مقبول"],
        ["تمت المراجعة بواسطة", app.reviewedBy || "-"],
        ["تاريخ المراجعة", app.reviewDate ? new Date(app.reviewDate).toLocaleDateString("ar-SA") : "-"],
        ["ملاحظات", app.notes || "-"],
      ]

      const borderStyle = {
        style: BorderStyle.SINGLE,
        size: 1,
        color: "999999",
      }

      return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Field", bold: true, size: 22, font: "Arial" })], alignment: AlignmentType.CENTER })],
                width: { size: 30, type: WidthType.PERCENTAGE },
                shading: { fill: "D97706" },
                borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true, size: 22, font: "Arial" })], alignment: AlignmentType.CENTER })],
                width: { size: 70, type: WidthType.PERCENTAGE },
                shading: { fill: "D97706" },
                borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
              }),
            ],
          }),
          ...rows.map(
            ([label, value], idx) =>
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial" })] })],
                    shading: idx % 2 === 0 ? { fill: "FFFBEB" } : undefined,
                    borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Arial" })] })],
                    shading: idx % 2 === 0 ? { fill: "FFFBEB" } : undefined,
                    borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
                  }),
                ],
              }),
          ),
        ],
      })
    }

    const sections = approvedApps.length > 0
      ? approvedApps.map((app, index) => ({
          properties: {},
          children: [
            ...(index === 0
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Approved Association Applications", bold: true, size: 36, font: "Arial" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString("en-US")}`, size: 20, font: "Arial", color: "666666" })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                  }),
                ]
              : []),
            new Paragraph({
              children: [new TextRun({ text: `${index + 1}. ${app.associationName}`, bold: true, size: 28, font: "Arial" })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 200 },
            }),
            createTableForApp(app),
          ],
        }))
      : [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun({ text: "No approved associations to export.", size: 24, font: "Arial" })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          },
        ]

    const doc = new Document({ sections })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, "approved-associations.docx")
    setShowExportDialog(false)
  }, [associationApplications])

  const handleAddNews = () => {
    if (newNews.title && newNews.content) {
      const article: NewsArticle = {
        id: Date.now().toString(),
        title: newNews.title,
        content: newNews.content,
        excerpt: newNews.excerpt || newNews.content.substring(0, 150) + "...",
        category: newNews.category || "عام",
        author: newNews.author || "إدارة الجمعية",
        publishDate: new Date().toISOString(),
        status: (newNews.status as "draft" | "published" | "archived") || "draft",
        image: newNews.image || "/placeholder.svg",
        tags: newNews.tags || [],
        views: 0,
        featured: newNews.featured || false,
      }
      setNewsArticles([...newsArticles, article])
      setNewNews({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        author: "",
        status: "draft",
        image: "",
        tags: [],
        featured: false,
      })
      setIsAddingNews(false)
    }
  }

  const handleEditNews = (article: NewsArticle) => {
    setEditingNews(article)
    setNewNews(article)
  }

  const handleUpdateNews = () => {
    if (editingNews && newNews.title && newNews.content) {
      setNewsArticles(
        newsArticles.map((article) =>
          article.id === editingNews.id ? ({ ...article, ...newNews } as NewsArticle) : article,
        ),
      )
      setEditingNews(null)
      setNewNews({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        author: "",
        status: "draft",
        image: "",
        tags: [],
        featured: false,
      })
    }
  }

  const handleDeleteNews = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      setNewsArticles(newsArticles.filter((article) => article.id !== id))
    }
  }

  const handlePublishNews = (id: string) => {
    setNewsArticles(
      newsArticles.map((article) =>
        article.id === id ? { ...article, status: "published", publishDate: new Date().toISOString() } : article,
      ),
    )
  }

  const handleArchiveNews = (id: string) => {
    setNewsArticles(newsArticles.map((article) => (article.id === id ? { ...article, status: "archived" } : article)))
  }

  const handleToggleFeatured = (id: string) => {
    setNewsArticles(
      newsArticles.map((article) => (article.id === id ? { ...article, featured: !article.featured } : article)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "unread":
        return "bg-red-100 text-red-800"
      case "read":
        return "bg-blue-100 text-blue-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط"
      case "completed":
        return "مكتمل"
      case "cancelled":
        return "ملغي"
      case "unread":
        return "غير مقروءة"
      case "read":
        return "مقروءة"
      case "replied":
        return "تم الرد"
      default:
        return "غير محدد"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد المراجعة"
      case "approved":
        return "مقبولة"
      case "rejected":
        return "مرفوضة"
      default:
        return "غير محدد"
    }
  }

  const getNewsStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNewsStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "منشور"
      case "draft":
        return "مسودة"
      case "archived":
        return "مؤرشف"
      default:
        return "غير محدد"
    }
  }

  const filteredMessages = messages.filter((message) => {
    const matchesFilter = messageFilter === "all" || message.status === messageFilter
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filteredApplications = associationApplications.filter((application) => {
    const matchesFilter = applicationFilter === "all" || application.status === applicationFilter
    const matchesSearch =
      application.associationName.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
      application.applicationId.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
      application.institutionName.toLowerCase().includes(applicationSearchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filteredNews = newsArticles.filter((article) => {
    const matchesFilter = newsFilter === "all" || article.status === newsFilter
    const matchesSearch =
      article.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(newsSearchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = [
    { title: "إجمالي الأعضاء", value: "156", icon: Users, color: "text-blue-600" },
    {
      title: "الأنشطة النشطة",
      value: activities.filter((a) => a.status === "active").length.toString(),
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "الرسائل الجديدة",
      value: messages.filter((m) => m.status === "unread").length.toString(),
      icon: MessageSquare,
      color: "text-amber-600",
    },
    {
      title: "طلبات الانتساب",
      value: associationApplications.filter((app) => app.status === "pending").length.toString(),
      icon: UserCheck,
      color: "text-purple-600",
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-amber-600">لوحة التحكم الإدارية</CardTitle>
            <CardDescription>يرجى إدخال كلمة المرور للوصول إلى النظام الإداري</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleLogin} className="w-full bg-amber-600 hover:bg-amber-700">
              <LogIn className="ml-2 h-4 w-4" />
              دخول
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sidebarItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: BarChart3 },
    { id: "activities", label: "إدارة الأنشطة", icon: Calendar },
    { id: "messages", label: "الرسائل", icon: MessageSquare },
    { id: "memberships", label: "إدارة الانتسابات", icon: UserCheck },
    { id: "members", label: "إدارة الأعضاء", icon: Users },
    { id: "news", label: "إدارة الأخبار", icon: Newspaper },
    { id: "permissions", label: "الصلاحيات", icon: Shield },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg border-l border-gray-200 z-40">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-amber-600">لوحة التحكم</h1>
          <p className="text-sm text-gray-600">جمعية المنار للشباب</p>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeSection === item.id ? "bg-amber-600 hover:bg-amber-700 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="ml-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="mr-64 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {sidebarItems.find((item) => item.id === activeSection)?.label}
          </h2>
          <p className="text-gray-600">مرحباً بك في النظام الإداري لجمعية المنار للشباب</p>
        </div>

        {activeSection === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
                <CardDescription>آخر العمليات في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "تم إضافة عضو جديد", user: "أحمد محمد", time: "منذ 5 دقائق", type: "member" },
                    {
                      action: "رسالة جديدة من نموذج الاتصال",
                      user: "فاطمة علي",
                      time: "منذ 15 دقيقة",
                      type: "message",
                    },
                    { action: "تم تحديث نشاط المخيم الصيفي", user: "المدير", time: "منذ ساعة", type: "activity" },
                    { action: "طلب عضوية جديد", user: "محمد حسن", time: "منذ ساعتين", type: "membership" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Badge
                          variant={
                            activity.type === "member"
                              ? "default"
                              : activity.type === "message"
                                ? "secondary"
                                : activity.type === "activity"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {activity.type === "member"
                            ? "عضو"
                            : activity.type === "message"
                              ? "رسالة"
                              : activity.type === "activity"
                                ? "نشاط"
                                : "طلب"}
                        </Badge>
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "activities" && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">جميع الأنشطة</h3>
                <p className="text-sm text-gray-600">إدارة وتنظيم أنشطة الجمعية</p>
              </div>
              <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة نشاط جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إضافة نشاط جديد</DialogTitle>
                    <DialogDescription>املأ البيانات التالية لإضافة نشاط جديد</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">عنوان النشاط</Label>
                        <Input
                          id="title"
                          value={newActivity.title}
                          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                          placeholder="مثال: المخيم الصيفي"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">نوع النشاط</Label>
                        <Select
                          value={newActivity.type}
                          onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع النشاط" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مخيم">مخيم</SelectItem>
                            <SelectItem value="ورشة">ورشة</SelectItem>
                            <SelectItem value="رياضة">رياضة</SelectItem>
                            <SelectItem value="ثقافي">ثقافي</SelectItem>
                            <SelectItem value="اجتماعي">اجتماعي</SelectItem>
                            <SelectItem value="تطوعي">تطوعي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">وصف النشاط</Label>
                      <Textarea
                        id="description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        placeholder="وصف مفصل عن النشاط وأهدافه"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">تاريخ النشاط</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newActivity.date}
                          onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">المكان</Label>
                        <Input
                          id="location"
                          value={newActivity.location}
                          onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                          placeholder="مثال: مركز الجمعية"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">المدة</Label>
                        <Input
                          id="duration"
                          value={newActivity.duration}
                          onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                          placeholder="مثال: 3 أيام"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">السعر</Label>
                        <Input
                          id="price"
                          value={newActivity.price}
                          onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                          placeholder="مثال: 100 أو مجاني"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">السعة القصوى</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newActivity.capacity}
                          onChange={(e) =>
                            setNewActivity({ ...newActivity, capacity: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">رابط الصورة</Label>
                      <Input
                        id="image"
                        value={newActivity.image}
                        onChange={(e) => setNewActivity({ ...newActivity, image: e.target.value })}
                        placeholder="رابط صورة النشاط"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddActivity} className="bg-amber-600 hover:bg-amber-700">
                      إضافة النشاط
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(activity.status)}`}>
                      {getStatusText(activity.status)}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">{activity.title}</h4>
                        <Badge variant="outline" className="mt-1">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 ml-2" />
                          {activity.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 ml-2" />
                          {activity.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 ml-2" />
                          {activity.duration}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 ml-2" />
                          {activity.price}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-sm">
                          <span className="font-medium">{activity.registered}</span>
                          <span className="text-gray-500">/{activity.capacity} مسجل</span>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <Button size="sm" variant="outline" onClick={() => handleEditActivity(activity)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Activity Dialog */}
            <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle>تعديل النشاط</DialogTitle>
                  <DialogDescription>تعديل بيانات النشاط</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">عنوان النشاط</Label>
                      <Input
                        id="edit-title"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">نوع النشاط</Label>
                      <Select
                        value={newActivity.type}
                        onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مخيم">مخيم</SelectItem>
                          <SelectItem value="ورشة">ورشة</SelectItem>
                          <SelectItem value="رياضة">رياضة</SelectItem>
                          <SelectItem value="ثقافي">ثقافي</SelectItem>
                          <SelectItem value="اجتماعي">اجتماعي</SelectItem>
                          <SelectItem value="تطوعي">تطوعي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">وصف النشاط</Label>
                    <Textarea
                      id="edit-description"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">تاريخ النشاط</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-location">المكان</Label>
                      <Input
                        id="edit-location"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-duration">المدة</Label>
                      <Input
                        id="edit-duration"
                        value={newActivity.duration}
                        onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">السعر</Label>
                      <Input
                        id="edit-price"
                        value={newActivity.price}
                        onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-capacity">السعة القصوى</Label>
                      <Input
                        id="edit-capacity"
                        type="number"
                        value={newActivity.capacity}
                        onChange={(e) =>
                          setNewActivity({ ...newActivity, capacity: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">الحالة</Label>
                      <Select
                        value={newActivity.status}
                        onValueChange={(value) =>
                          setNewActivity({ ...newActivity, status: value as "active" | "completed" | "cancelled" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <Button variant="outline" onClick={() => setEditingActivity(null)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleUpdateActivity} className="bg-amber-600 hover:bg-amber-700">
                    حفظ التغييرات
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeSection === "messages" && (
          <div className="space-y-6">
            {/* Header with Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">الرسائل والاستفسارات</h3>
                <p className="text-sm text-gray-600">إدارة رسائل الزوار والاستفسارات</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في الرسائل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-64"
                  />
                </div>
                <Select value={messageFilter} onValueChange={setMessageFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الرسائل</SelectItem>
                    <SelectItem value="unread">غير مقروءة</SelectItem>
                    <SelectItem value="read">مقروءة</SelectItem>
                    <SelectItem value="replied">تم الرد عليها</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Messages Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">إجمالي الرسائل</p>
                      <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                    </div>
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">غير مقروءة</p>
                      <p className="text-2xl font-bold text-red-600">
                        {messages.filter((m) => m.status === "unread").length}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تم الرد عليها</p>
                      <p className="text-2xl font-bold text-green-600">
                        {messages.filter((m) => m.status === "replied").length}
                      </p>
                    </div>
                    <Reply className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">عالية الأولوية</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {messages.filter((m) => m.priority === "high").length}
                      </p>
                    </div>
                    <Filter className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages List */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة الرسائل</CardTitle>
                <CardDescription>جميع الرسائل الواردة من نموذج الاتصال</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد رسائل تطابق البحث</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                          message.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-white"
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(message.priority)}`} />
                              <h4 className="font-semibold text-gray-900">{message.name}</h4>
                              <Badge className={getStatusColor(message.status)}>{getStatusText(message.status)}</Badge>
                              <Badge variant="outline">{message.department}</Badge>
                            </div>
                            <p className="font-medium text-gray-800 mb-1">{message.subject}</p>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{message.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {message.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {message.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(message.date).toLocaleDateString("ar-SA")}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {message.status === "unread" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(message.id)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteMessage(message.id)
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Detail Dialog */}
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedMessage?.name}
                  </DialogTitle>
                  <DialogDescription>{selectedMessage?.subject}</DialogDescription>
                </DialogHeader>
                {selectedMessage && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">البريد الإلكتروني</Label>
                        <p className="text-sm">{selectedMessage.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">رقم الهاتف</Label>
                        <p className="text-sm">{selectedMessage.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">القسم</Label>
                        <p className="text-sm">{selectedMessage.department}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">التاريخ</Label>
                        <p className="text-sm">{new Date(selectedMessage.date).toLocaleString("ar-SA")}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">الرسالة</Label>
                      <div className="mt-2 p-4 bg-white border rounded-lg">
                        <p className="text-gray-800 leading-relaxed">{selectedMessage.message}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reply">الرد على الرسالة</Label>
                      <Textarea
                        id="reply"
                        placeholder="اكتب ردك هنا..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                        إغلاق
                      </Button>
                      <Button
                        onClick={() => handleReplyMessage(selectedMessage.id)}
                        className="bg-amber-600 hover:bg-amber-700"
                        disabled={!replyText.trim()}
                      >
                        <Reply className="ml-2 h-4 w-4" />
                        إرسال الرد
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeSection === "memberships" && (
          <div className="space-y-6">
            {/* Header with Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">إدارة طلبات الانتساب</h3>
                <p className="text-sm text-gray-600">مراجعة وإدارة طلبات انتساب الجمعيات</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في الطلبات..."
                    value={applicationSearchTerm}
                    onChange={(e) => setApplicationSearchTerm(e.target.value)}
                    className="pr-10 w-64"
                  />
                </div>
                <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الانتسابات</SelectItem>
                    <SelectItem value="approved">مقبولة</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <FileDown className="h-4 w-4" />
                      تصدير
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                      <FileText className="ml-2 h-4 w-4 text-red-600" />
                      تصدير PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDOCX} className="cursor-pointer">
                      <FileText className="ml-2 h-4 w-4 text-blue-600" />
                      تصدير Word
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Applications Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">إجمالي الانتسابات</p>
                      <p className="text-2xl font-bold text-gray-900">{associationApplications.length}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">بانتظار المراجعة</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {associationApplications.filter((app) => app.status === "pending").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">مقبولة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {associationApplications.filter((app) => app.status === "approved").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">مرفوضة (بانتظار الحذف)</p>
                      <p className="text-2xl font-bold text-red-600">
                        {associationApplications.filter((app) => app.status === "rejected").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة طلبات الانتساب</CardTitle>
                <CardDescription>جميع طلبات انتساب الجمعيات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد طلبات تطابق البحث</p>
                    </div>
                  ) : (
                    filteredApplications.map((application) => (
                      <div
                        key={application.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                          application.status === "rejected"
                            ? "bg-red-50 border-red-200 opacity-75"
                            : application.status === "pending"
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-white"
                        }`}
                        onClick={() => setSelectedApplication(application)}
                      >
                        {/* Rejection countdown banner */}
                        {application.status === "rejected" && application.rejectedAt && (
                          <div className="flex items-center justify-between mb-3 p-2 bg-red-100 rounded-md border border-red-200">
                            <div className="flex items-center gap-2 text-sm text-red-700">
                              <Timer className="h-4 w-4" />
                              <span>
                                سيتم الحذف التلقائي خلال{" "}
                                <strong>{getRejectionDaysRemaining(application.rejectedAt)} أيام</strong>
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-amber-700 border-amber-400 hover:bg-amber-50 bg-transparent h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUndoRejection(application.id)
                              }}
                            >
                              <Undo2 className="ml-1 h-3 w-3" />
                              تراجع عن الرفض
                            </Button>
                          </div>
                        )}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                              <Building2 className="h-6 w-6 text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h4 className="font-semibold text-gray-900">{application.associationName}</h4>
                                <Badge className={getApplicationStatusColor(application.status)}>
                                  {getApplicationStatusText(application.status)}
                                </Badge>
                                <Badge variant="outline">{application.applicationId}</Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{application.institutionName}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Crown className="h-3 w-3 text-amber-600" />
                                  <span className="text-gray-500">الرئيس:</span> {application.presidentName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3 text-blue-600" />
                                  <span className="text-gray-500">الأمين العام:</span> {application.secretaryGeneralName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-green-600" />
                                  <span className="text-gray-500">أمين الصندوق:</span> {application.treasurerName}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {application.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {application.phone}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                تاريخ التقديم: {new Date(application.submissionDate).toLocaleDateString("ar-SA")}
                                {application.reviewDate && (
                                  <span className="mr-4">
                                    تاريخ المراجعة: {new Date(application.reviewDate).toLocaleDateString("ar-SA")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {application.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleApproveApplication(application.id)
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 bg-transparent"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRejectApplication(application.id)
                                  }}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteApplication(application.id)
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application Detail Dialog */}
            <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    طلب الانتساب - {selectedApplication?.associationName}
                  </DialogTitle>
                  <DialogDescription>رقم الطلب: {selectedApplication?.applicationId}</DialogDescription>
                </DialogHeader>
                {selectedApplication && (
                  <div className="space-y-6">
                    {/* Rejection banner in dialog */}
                    {selectedApplication.status === "rejected" && selectedApplication.rejectedAt && (
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            تم رفض هذا الطلب - سيتم الحذف التلقائي خلال{" "}
                            <strong>{getRejectionDaysRemaining(selectedApplication.rejectedAt)} أيام</strong>
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-700 border-amber-400 hover:bg-amber-50 bg-transparent"
                          onClick={() => handleUndoRejection(selectedApplication.id)}
                        >
                          <Undo2 className="ml-1 h-4 w-4" />
                          تراجع عن الرفض
                        </Button>
                      </div>
                    )}

                    {/* Association Info */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">اسم الجمعية</Label>
                          <p className="text-sm font-medium">{selectedApplication.associationName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">رقم الطلب</Label>
                          <p className="text-sm font-medium">{selectedApplication.applicationId}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-600">اسم المؤسسة</Label>
                          <p className="text-sm">{selectedApplication.institutionName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Leadership Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        معلومات القيادة
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <Label className="text-xs font-medium text-amber-700">رئيس الجمعية</Label>
                          <p className="text-sm font-medium">{selectedApplication.presidentName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Phone className="h-3 w-3" />
                            {selectedApplication.presidentPhone}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <Label className="text-xs font-medium text-blue-700">الأمين العام</Label>
                          <p className="text-sm font-medium">{selectedApplication.secretaryGeneralName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Phone className="h-3 w-3" />
                            {selectedApplication.secretaryGeneralPhone}
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <Label className="text-xs font-medium text-green-700">أمين الصندوق</Label>
                          <p className="text-sm font-medium">{selectedApplication.treasurerName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Phone className="h-3 w-3" />
                            {selectedApplication.treasurerPhone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        معلومات الاتصال
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">البريد الإلكتروني</Label>
                          <p className="text-sm">{selectedApplication.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">رقم الهاتف</Label>
                          <p className="text-sm">{selectedApplication.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status and Review */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">حالة الطلب</Label>
                        <Badge className={`mt-1 ${getApplicationStatusColor(selectedApplication.status)}`}>
                          {getApplicationStatusText(selectedApplication.status)}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">تاريخ التقديم</Label>
                        <p className="text-sm">
                          {new Date(selectedApplication.submissionDate).toLocaleString("ar-SA")}
                        </p>
                      </div>
                      {selectedApplication.reviewedBy && (
                        <>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">تمت المراجعة بواسطة</Label>
                            <p className="text-sm">{selectedApplication.reviewedBy}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">تاريخ المراجعة</Label>
                            <p className="text-sm">
                              {new Date(selectedApplication.reviewDate!).toLocaleString("ar-SA")}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {selectedApplication.notes && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ملاحظات المراجعة</Label>
                        <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">{selectedApplication.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Review Actions */}
                    {selectedApplication.status === "pending" && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <Label htmlFor="review-notes">ملاحظات المراجعة</Label>
                          <Textarea
                            id="review-notes"
                            placeholder="اكتب ملاحظاتك حول الطلب..."
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleRejectApplication(selectedApplication.id)}
                          >
                            <XCircle className="ml-2 h-4 w-4" />
                            رفض الطلب
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveApplication(selectedApplication.id)}
                          >
                            <CheckCircle className="ml-2 h-4 w-4" />
                            قبول الطلب
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                        إغلاق
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation AlertDialog */}
            <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    تأكيد الحذف
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من حذف هذا الانتساب؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع البيانات المرتبطة بشكل نهائي.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 sm:justify-start">
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={confirmDeleteApplication}
                  >
                    حذف نهائي
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {activeSection === "news" && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">إدارة الأخبار والمقالات</h3>
                <p className="text-sm text-gray-600">إنشاء وإدارة أخبار ومقالات الجمعية</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في الأخبار..."
                    value={newsSearchTerm}
                    onChange={(e) => setNewsSearchTerm(e.target.value)}
                    className="pr-10 w-64"
                  />
                </div>
                <Select value={newsFilter} onValueChange={setNewsFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المقالات</SelectItem>
                    <SelectItem value="published">منشورة</SelectItem>
                    <SelectItem value="draft">مسودات</SelectItem>
                    <SelectItem value="archived">مؤرشفة</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مقال جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة مقال جديد</DialogTitle>
                      <DialogDescription>املأ البيانات التالية لإضافة مقال جديد</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="news-title">عنوان المقال</Label>
                          <Input
                            id="news-title"
                            value={newNews.title}
                            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                            placeholder="عنوان المقال"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="news-category">التصنيف</Label>
                          <Select
                            value={newNews.category}
                            onValueChange={(value) => setNewNews({ ...newNews, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="أخبار">أخبار</SelectItem>
                              <SelectItem value="فعاليات">فعاليات</SelectItem>
                              <SelectItem value="تعليم">تعليم</SelectItem>
                              <SelectItem value="تدريب">تدريب</SelectItem>
                              <SelectItem value="إعلانات">إعلانات</SelectItem>
                              <SelectItem value="تطوع">تطوع</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="news-excerpt">المقدمة</Label>
                        <Textarea
                          id="news-excerpt"
                          value={newNews.excerpt}
                          onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                          placeholder="مقدمة مختصرة عن المقال"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="news-content">محتوى المقال</Label>
                        <Textarea
                          id="news-content"
                          value={newNews.content}
                          onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                          placeholder="محتوى المقال الكامل"
                          rows={8}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="news-author">الكاتب</Label>
                          <Input
                            id="news-author"
                            value={newNews.author}
                            onChange={(e) => setNewNews({ ...newNews, author: e.target.value })}
                            placeholder="اسم الكاتب"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="news-status">الحالة</Label>
                          <Select
                            value={newNews.status}
                            onValueChange={(value) =>
                              setNewNews({ ...newNews, status: value as "draft" | "published" | "archived" })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">مسودة</SelectItem>
                              <SelectItem value="published">منشور</SelectItem>
                              <SelectItem value="archived">مؤرشف</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="news-image">رابط الصورة</Label>
                        <Input
                          id="news-image"
                          value={newNews.image}
                          onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
                          placeholder="رابط صورة المقال"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="news-tags">الكلمات المفتاحية</Label>
                        <Input
                          id="news-tags"
                          value={newNews.tags?.join(", ")}
                          onChange={(e) =>
                            setNewNews({ ...newNews, tags: e.target.value.split(",").map((tag) => tag.trim()) })
                          }
                          placeholder="الكلمات المفتاحية مفصولة بفواصل"
                        />
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          id="news-featured"
                          checked={newNews.featured}
                          onChange={(e) => setNewNews({ ...newNews, featured: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="news-featured">مقال مميز</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 space-x-reverse">
                      <Button variant="outline" onClick={() => setIsAddingNews(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={handleAddNews} className="bg-amber-600 hover:bg-amber-700">
                        إضافة المقال
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* News Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">إجمالي المقالات</p>
                      <p className="text-2xl font-bold text-gray-900">{newsArticles.length}</p>
                    </div>
                    <Newspaper className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">منشورة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {newsArticles.filter((article) => article.status === "published").length}
                      </p>
                    </div>
                    <Globe className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">مسودات</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {newsArticles.filter((article) => article.status === "draft").length}
                      </p>
                    </div>
                    <Edit className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">إجمالي المشاهدات</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {newsArticles.reduce((total, article) => total + article.views, 0)}
                      </p>
                    </div>
                    <EyeIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* News List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد مقالات تطابق البحث</p>
                </div>
              ) : (
                filteredNews.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className={getNewsStatusColor(article.status)}>
                          {getNewsStatusText(article.status)}
                        </Badge>
                        {article.featured && <Badge className="bg-amber-100 text-amber-800">مميز</Badge>}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900 line-clamp-2">{article.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-xs text-gray-500">{article.views} مشاهدة</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>

                        <div className="text-xs text-gray-500 space-y-1">
                          <div>بواسطة: {article.author}</div>
                          <div>{new Date(article.publishDate).toLocaleDateString("ar-SA")}</div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <Button size="sm" variant="outline" onClick={() => setSelectedNews(article)}>
                            <EyeIcon className="h-4 w-4 ml-1" />
                            عرض
                          </Button>
                          <div className="flex space-x-2 space-x-reverse">
                            {article.status === "draft" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handlePublishNews(article.id)}
                              >
                                <Globe className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleEditNews(article)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteNews(article.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Edit News Dialog */}
            <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle>تعديل المقال</DialogTitle>
                  <DialogDescription>تعديل بيانات المقال</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-news-title">عنوان المقال</Label>
                      <Input
                        id="edit-news-title"
                        value={newNews.title}
                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-news-category">التصنيف</Label>
                      <Select
                        value={newNews.category}
                        onValueChange={(value) => setNewNews({ ...newNews, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="أخبار">أخبار</SelectItem>
                          <SelectItem value="فعاليات">فعاليات</SelectItem>
                          <SelectItem value="تعليم">تعليم</SelectItem>
                          <SelectItem value="تدريب">تدريب</SelectItem>
                          <SelectItem value="إعلانات">إعلانات</SelectItem>
                          <SelectItem value="تطوع">تطوع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-excerpt">المقدمة</Label>
                    <Textarea
                      id="edit-news-excerpt"
                      value={newNews.excerpt}
                      onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-content">محتوى المقال</Label>
                    <Textarea
                      id="edit-news-content"
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      rows={8}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-news-author">الكاتب</Label>
                      <Input
                        id="edit-news-author"
                        value={newNews.author}
                        onChange={(e) => setNewNews({ ...newNews, author: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-news-status">الحالة</Label>
                      <Select
                        value={newNews.status}
                        onValueChange={(value) =>
                          setNewNews({ ...newNews, status: value as "draft" | "published" | "archived" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">مسودة</SelectItem>
                          <SelectItem value="published">منشور</SelectItem>
                          <SelectItem value="archived">مؤرشف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-image">رابط الصورة</Label>
                    <Input
                      id="edit-news-image"
                      value={newNews.image}
                      onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-tags">الكلمات المفتاحية</Label>
                    <Input
                      id="edit-news-tags"
                      value={newNews.tags?.join(", ")}
                      onChange={(e) =>
                        setNewNews({ ...newNews, tags: e.target.value.split(",").map((tag) => tag.trim()) })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="edit-news-featured"
                      checked={newNews.featured}
                      onChange={(e) => setNewNews({ ...newNews, featured: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="edit-news-featured">مقال مميز</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <Button variant="outline" onClick={() => setEditingNews(null)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleUpdateNews} className="bg-amber-600 hover:bg-amber-700">
                    حفظ التغييرات
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* News Detail Dialog */}
            <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    {selectedNews?.title}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedNews?.category} • بواسطة {selectedNews?.author}
                  </DialogDescription>
                </DialogHeader>
                {selectedNews && (
                  <div className="space-y-4">
                    <img
                      src={selectedNews.image || "/placeholder.svg"}
                      alt={selectedNews.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedNews.publishDate).toLocaleDateString("ar-SA")}
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        {selectedNews.views} مشاهدة
                      </div>
                      <Badge className={getNewsStatusColor(selectedNews.status)}>
                        {getNewsStatusText(selectedNews.status)}
                      </Badge>
                      {selectedNews.featured && <Badge className="bg-amber-100 text-amber-800">مميز</Badge>}
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedNews.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedNews.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-2">
                        {selectedNews.status === "draft" && (
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              handlePublishNews(selectedNews.id)
                              setSelectedNews(null)
                            }}
                          >
                            <Globe className="ml-2 h-4 w-4" />
                            نشر المقال
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => handleToggleFeatured(selectedNews.id)}>
                          {selectedNews.featured ? "إلغاء التمييز" : "جعل مميز"}
                        </Button>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedNews(null)}>
                        إغلاق
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeSection === "permissions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إدارة الصلاحيات</h2>
                <p className="text-gray-600 mt-1">إدارة فريق الإدارة والصلاحيات</p>
              </div>
              <Button onClick={() => setShowAddAdminModal(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 ml-2" />
                إضافة مدير جديد
              </Button>
            </div>

            {/* Admin Team Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">إجمالي المديرين</p>
                      <p className="text-2xl font-bold text-gray-900">{adminTeam.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Crown className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">المديرين العامين</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminTeam.filter((admin) => admin.role === "Super Admin").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">مديري المحتوى</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminTeam.filter((admin) => admin.role === "Content Manager").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <UserCheck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-600">المشرفين</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminTeam.filter((admin) => admin.role === "Moderator").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Team List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  فريق الإدارة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminTeam.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <img
                          src={admin.avatar || "/placeholder.svg"}
                          alt={admin.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{admin.name}</h3>
                          <p className="text-sm text-gray-600">{admin.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                admin.role === "Super Admin"
                                  ? "default"
                                  : admin.role === "Content Manager"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {admin.role}
                            </Badge>
                            <span className="text-xs text-gray-500">انضم في {admin.joinDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-left">
                          <p className="text-sm text-gray-600">آخر نشاط</p>
                          <p className="text-xs text-gray-500">{admin.lastActive}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAdmin(admin)
                              setShowEditPermissionsModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {admin.role !== "Super Admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAdminTeam(adminTeam.filter((a) => a.id !== admin.id))
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permissions Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  مصفوفة الصلاحيات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3 font-medium text-gray-900">الصلاحية</th>
                        <th className="text-center p-3 font-medium text-gray-900">مدير عام</th>
                        <th className="text-center p-3 font-medium text-gray-900">مدير محتوى</th>
                        <th className="text-center p-3 font-medium text-gray-900">مشرف</th>
                        <th className="text-center p-3 font-medium text-gray-900">مشاهد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availablePermissions.map((permission) => (
                        <tr key={permission.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-900">{permission.label}</p>
                              <p className="text-sm text-gray-600">{permission.description}</p>
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                          </td>
                          <td className="text-center p-3">
                            {rolePermissions["Content Manager"].includes(permission.id) ||
                            rolePermissions["Content Manager"].includes("all") ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="text-center p-3">
                            {rolePermissions["Moderator"].includes(permission.id) ||
                            rolePermissions["Moderator"].includes("all") ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="text-center p-3">
                            {permission.id === "dashboard" ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Admin Modal */}
        {showAddAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">إضافة مدير جديد</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddAdminModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اختيار العضو</label>
                  <select
                    value={newAdminData.memberId}
                    onChange={(e) => setNewAdminData({ ...newAdminData, memberId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">اختر عضو من القائمة</option>
                    {members
                      .filter((member) => !adminTeam.some((admin) => admin.email === member.email))
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name} - {member.email}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الدور الإداري</label>
                  <select
                    value={newAdminData.role}
                    onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Viewer">مشاهد</option>
                    <option value="Moderator">مشرف</option>
                    <option value="Content Manager">مدير محتوى</option>
                    <option value="Super Admin">مدير عام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الصلاحيات المخصصة</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availablePermissions.map((permission) => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAdminData.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdminData({
                                ...newAdminData,
                                permissions: [...newAdminData.permissions, permission.id],
                              })
                            } else {
                              setNewAdminData({
                                ...newAdminData,
                                permissions: newAdminData.permissions.filter((p) => p !== permission.id),
                              })
                            }
                          }}
                          className="ml-2"
                        />
                        <span className="text-sm">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => {
                    const selectedMember = members.find((m) => m.id === Number.parseInt(newAdminData.memberId))
                    if (selectedMember) {
                      const newAdmin = {
                        id: adminTeam.length + 1,
                        name: selectedMember.name,
                        email: selectedMember.email,
                        role: newAdminData.role,
                        permissions:
                          newAdminData.permissions.length > 0
                            ? newAdminData.permissions
                            : rolePermissions[newAdminData.role as keyof typeof rolePermissions],
                        avatar: selectedMember.avatar,
                        joinDate: new Date().toLocaleDateString("ar-SA"),
                        lastActive: "الآن",
                      }
                      setAdminTeam([...adminTeam, newAdmin])
                      setShowAddAdminModal(false)
                      setNewAdminData({ memberId: "", role: "Viewer", permissions: [] })
                    }
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  إضافة مدير
                </Button>
                <Button variant="outline" onClick={() => setShowAddAdminModal(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Permissions Modal */}
        {showEditPermissionsModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">تعديل صلاحيات {selectedAdmin.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowEditPermissionsModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الدور الإداري</label>
                  <select
                    value={selectedAdmin.role}
                    onChange={(e) => setSelectedAdmin({ ...selectedAdmin, role: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Viewer">مشاهد</option>
                    <option value="Moderator">مشرف</option>
                    <option value="Content Manager">مدير محتوى</option>
                    <option value="Super Admin">مدير عام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الصلاحيات المخصصة</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availablePermissions.map((permission) => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedAdmin.permissions.includes(permission.id) ||
                            selectedAdmin.permissions.includes("all")
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAdmin({
                                ...selectedAdmin,
                                permissions: [...selectedAdmin.permissions.filter((p) => p !== "all"), permission.id],
                              })
                            } else {
                              setSelectedAdmin({
                                ...selectedAdmin,
                                permissions: selectedAdmin.permissions.filter((p) => p !== permission.id),
                              })
                            }
                          }}
                          disabled={selectedAdmin.permissions.includes("all")}
                          className="ml-2"
                        />
                        <span className="text-sm">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => {
                    setAdminTeam(adminTeam.map((admin) => (admin.id === selectedAdmin.id ? selectedAdmin : admin)))
                    setShowEditPermissionsModal(false)
                    setSelectedAdmin(null)
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setShowEditPermissionsModal(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeSection !== "dashboard" &&
          activeSection !== "activities" &&
          activeSection !== "messages" &&
          activeSection !== "memberships" &&
          activeSection !== "news" && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  قسم {sidebarItems.find((item) => item.id === activeSection)?.label}
                </h3>
                <p className="text-gray-600">سيتم تطوير هذا القسم في المرحلة التالية</p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}
