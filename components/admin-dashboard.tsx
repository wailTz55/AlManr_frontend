"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// --- Export Helpers ---
const exportToWord = (htmlContent: string, filename: string) => {
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${filename}</title></head><body>`;
  const footer = "</body></html>";
  const sourceHTML = header + htmlContent + footer;

  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `${filename}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

const exportToPDF = (htmlContent: string, title: string) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1, h2, h3 { text-align: center; color: #333; }
            p { text-align: center; color: #555; }
            .header-info { margin-bottom: 20px; text-align: center; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  }
};

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
  Building2,
  Undo2,
  AlertTriangle,
  Printer,
  FileDown,
  Link2,
  Upload,
} from "lucide-react"

type ActivityTemplate =
  | "announcement"
  | "announcement_reg"
  | "announcement_reg_participants"
  | "special"

const ACTIVITY_TEMPLATES: { value: ActivityTemplate; label: string; description: string; color: string }[] = [
  {
    value: "announcement",
    label: "إعلان فقط",
    description: "عرض معلومات النشاط فقط، بدون تسجيل",
    color: "bg-gray-100 text-gray-700",
  },
  {
    value: "announcement_reg",
    label: "إعلان + تسجيل جمعيات",
    description: "يمكن للجمعيات التسجيل في هذا النشاط",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "announcement_reg_participants",
    label: "إعلان + جمعيات + مشاركون",
    description: "يمكن للجمعيات التسجيل وإضافة مشاركين",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "special",
    label: "نشاط خاص (بطولة / مسابقة)",
    description: "تسجيل جمعيات ومشاركين مع تصنيفات قابلة للتخصيص (مثل U12، U16، Senior)",
    color: "bg-orange-100 text-orange-700",
  },
]

interface Activity {
  id: string
  title: string
  description: string
  type: string
  date: string
  location: string
  duration: string
  capacity: number
  registered: number
  status: "active" | "completed" | "cancelled"
  image: string
  // --- Template fields ---
  activityTemplate: ActivityTemplate
  categories: string[]   // for "special" type, e.g. ["U12", "U16", "Senior"]
}

interface ActivityRegistration {
  id: string
  activityId: string
  associationName: string
  associationEmail: string
  associationPhone: string
  status: "pending" | "approved" | "rejected"
  registrationDate: string
  notes?: string
  participants: ActivityParticipant[]
}

interface ActivityParticipant {
  id: string
  registrationId: string
  name: string
  age: number
  category?: string
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

interface AssociationPartnership {
  id: string
  associationName: string
  institutionName: string
  presidentName: string
  presidentPhone: string
  treasurerName: string
  treasurerPhone: string
  secretaryName: string
  secretaryPhone: string
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
  memberType: "Association Member" | "Staff" | string
  role: "President" | "Treasurer" | "Secretary" | "Staff" | string
  bio: string
  joinDate: string
  lastActive: string
  status: "active" | "inactive" | "pending"
  avatar: string
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  const handleImageOptimize = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.floor(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to highly optimized WebP format to save space and bandwidth
          const dataUrl = canvas.toDataURL("image/webp", 0.8);
          callback(dataUrl);
        }
      };
      if (e.target?.result) img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  };
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
      capacity: 50,
      registered: 35,
      status: "active",
      image: "/placeholder.svg",
      activityTemplate: "announcement",
      categories: [],
    },
    {
      id: "2",
      title: "ورشة الإبداع والابتكار",
      description: "ورشة تدريبية لتطوير مهارات الإبداع والتفكير النقدي",
      type: "ورشة",
      date: "2024-06-20",
      location: "مركز الجمعية",
      duration: "يوم واحد",
      capacity: 30,
      registered: 28,
      status: "completed",
      image: "/placeholder.svg",
      activityTemplate: "announcement_reg",
      categories: [],
    },
    {
      id: "3",
      title: "بطولة كرة القدم الشبابية",
      description: "بطولة كرة قدم للشباب من مختلف الأعمار",
      type: "رياضة",
      date: "2024-08-10",
      location: "الملعب البلدي",
      duration: "3 أيام",
      capacity: 100,
      registered: 67,
      status: "active",
      image: "/placeholder.svg",
      activityTemplate: "special",
      categories: ["U12", "U16", "Senior"],
    },
  ])

  // --- New Activity Registration State ---
  const [activityRegistrations, setActivityRegistrations] = useState<ActivityRegistration[]>([
    {
      id: "reg-1",
      activityId: "2",
      associationName: "جمعية الأمل للشباب",
      associationEmail: "amal@youth.dz",
      associationPhone: "0551234567",
      status: "pending",
      registrationDate: "2024-06-01T10:00:00",
      participants: [],
    },
    {
      id: "reg-2",
      activityId: "2",
      associationName: "منتدى الإبداع الشبابي",
      associationEmail: "ibdaa@forum.dz",
      associationPhone: "0667891234",
      status: "approved",
      registrationDate: "2024-06-02T09:00:00",
      participants: [
        { id: "p-1", registrationId: "reg-2", name: "كريم بوعلي", age: 22, category: undefined },
        { id: "p-2", registrationId: "reg-2", name: "نور الدين مسعود", age: 20, category: undefined },
      ],
    },
    {
      id: "reg-3",
      activityId: "3",
      associationName: "رابطة الطلاب الرياضيين",
      associationEmail: "sport@students.dz",
      associationPhone: "0773456789",
      status: "approved",
      registrationDate: "2024-07-15T14:00:00",
      participants: [
        { id: "p-3", registrationId: "reg-3", name: "أحمد زيد", age: 14, category: "U16" },
        { id: "p-4", registrationId: "reg-3", name: "سامي علي", age: 11, category: "U12" },
        { id: "p-5", registrationId: "reg-3", name: "يوسف محمد", age: 25, category: "Senior" },
      ],
    },
  ])

  // --- UI state for new features ---
  const [activityDeleteConfirmId, setActivityDeleteConfirmId] = useState<string | null>(null)
  const [viewingRegistrationsActivity, setViewingRegistrationsActivity] = useState<Activity | null>(null)
  const [expandedRegistrationId, setExpandedRegistrationId] = useState<string | null>(null)
  const [newCategoryInput, setNewCategoryInput] = useState("")

  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    title: "",
    description: "",
    type: "",
    date: "",
    location: "",
    duration: "",
    capacity: 0,
    status: "active",
    image: "",
    activityTemplate: "announcement",
    categories: [],
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

  const [partnerships, setPartnerships] = useState<AssociationPartnership[]>([
    {
      id: "1",
      associationName: "جمعية الأمل للشباب",
      institutionName: "وزارة الشباب والرياضة",
      presidentName: "محمد بن عبد الله",
      presidentPhone: "0551234567",
      treasurerName: "فاطمة زهراء",
      treasurerPhone: "0559876543",
      secretaryName: "عمر خالد",
      secretaryPhone: "0554561234",
      email: "amal.youth@gmail.com",
      phone: "0551112233",
      submissionDate: "2024-01-15T10:30:00",
      status: "pending",
    },
    {
      id: "2",
      associationName: "منتدى الإبداع الشبابي",
      institutionName: "المديرية العامة للثقافة",
      presidentName: "سارة بن يوسف",
      presidentPhone: "0667891234",
      treasurerName: "كريم بوعلي",
      treasurerPhone: "0662345678",
      secretaryName: "نور الدين مسعود",
      secretaryPhone: "0665678901",
      email: "ibdaa.forum@outlook.com",
      phone: "0661122334",
      submissionDate: "2024-01-10T09:00:00",
      status: "approved",
      reviewedBy: "المدير العام",
      reviewDate: "2024-01-12T11:00:00",
      notes: "تتوافق أهداف المنتدى مع رسالة الجمعية",
    },
    {
      id: "3",
      associationName: "رابطة الطلاب المتطوعين",
      institutionName: "جامعة سطيف",
      presidentName: "يوسف بن حمزة",
      presidentPhone: "0773456789",
      treasurerName: "إيمان بلقاسم",
      treasurerPhone: "0779012345",
      secretaryName: "عبد الرحمن صالح",
      secretaryPhone: "0776543210",
      email: "volunteers@setif-univ.dz",
      phone: "0770011223",
      submissionDate: "2024-01-08T14:00:00",
      status: "approved",
      reviewedBy: "نائب الرئيس",
      reviewDate: "2024-01-09T10:30:00",
      notes: "شراكة ممتازة على مستوى الجامعة",
    },
  ])

  const [selectedPartnership, setSelectedPartnership] = useState<AssociationPartnership | null>(null)
  const [partnershipFilter, setPartnershipFilter] = useState("all")
  const [partnershipSearchTerm, setPartnershipSearchTerm] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [exportFormatOpen, setExportFormatOpen] = useState(false)

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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      name: "أحمد بنسعيد",
      email: "ahmed@almanar.org",
      role: "Super Admin",
      permissions: ["all"],
      joinDate: "2023-01-15",
      lastActive: "منذ ساعتين",
    },
    {
      id: 2,
      name: "فاطمة الزهراء",
      email: "fatima@almanar.org",
      role: "Content Manager",
      permissions: ["activities", "news", "members"],
      joinDate: "2023-06-20",
      lastActive: "اليوم 10:30 ص",
    },
    {
      id: 3,
      name: "محمد علي",
      email: "mohammed@almanar.org",
      role: "Moderator",
      permissions: ["messages", "memberships"],
      joinDate: "2024-03-10",
      lastActive: "منذ يومين",
    },
  ])

  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [showEditPermissionsModal, setShowEditPermissionsModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
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
    { id: "memberships", label: "إدارة العضويات", description: "قبول ورفض طلبات العضوية" },
    { id: "members", label: "إدارة الأعضاء", description: "عرض وإدارة بيانات الأعضاء" },
    { id: "permissions", label: "إدارة الصلاحيات", description: "منح وإلغاء صلاحيات المديرين" },
  ]

  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+961 70 123 456",
      memberType: "Association Member",
      role: "President",
      bio: "رئيس الجمعية ومؤسسها.",
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
      memberType: "Staff",
      role: "Secretary",
      bio: "مسؤولة العمليات.",
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
      memberType: "Association Member",
      role: "Treasurer",
      bio: "أمين الصندوق المعني بالمالية.",
      joinDate: "2024-03-10",
      lastActive: "منذ يومين",
      status: "pending",
      avatar: "/young-arab-man-sports.png",
    },
  ])

  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [selectedMemberObj, setSelectedMemberObj] = useState<Member | null>(null)
  const [newMemberObj, setNewMemberObj] = useState<Partial<Member>>({
    name: "",
    email: "",
    phone: "",
    memberType: "Association Member",
    role: "Staff",
    bio: "",
    status: "active",
    avatar: "",
  })

  const handleAddMemberObj = () => {
    if (!newMemberObj.name || !newMemberObj.email) return;
    const newM = {
      ...(newMemberObj as Member),
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "الآن",
      avatar: newMemberObj.avatar || "/placeholder.svg",
    }
    setMembers([...members, newM])
    setShowAddMemberModal(false)
    setNewMemberObj({ name: "", email: "", phone: "", memberType: "Association Member", role: "Staff", bio: "", status: "active", avatar: "" })
  }

  const handleEditMemberObj = () => {
    if (selectedMemberObj) {
      setMembers(members.map((m) => (m.id === selectedMemberObj.id ? { ...m, ...selectedMemberObj } : m)))
      setSelectedMemberObj(null)
    }
  }

  const handleDeleteMemberObj = (id: number) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("كلمة مرور خاطئة")
    }
  }

  // --- Activity helper ---
  const getTemplateMeta = (template: ActivityTemplate) =>
    ACTIVITY_TEMPLATES.find((t) => t.value === template) || ACTIVITY_TEMPLATES[0]

  const templateNeedsReg = (t?: ActivityTemplate) =>
    t === "announcement_reg" || t === "announcement_reg_participants" || t === "special"

  const templateNeedsParticipants = (t?: ActivityTemplate) =>
    t === "announcement_reg_participants" || t === "special"

  const templateNeedsCategories = (t?: ActivityTemplate) => t === "special"

  const resetNewActivity = () =>
    setNewActivity({
      title: "",
      description: "",
      type: "",
      date: "",
      location: "",
      duration: "",
      capacity: 0,
      status: "active",
      image: "",
      activityTemplate: "announcement",
      categories: [],
    })

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
        capacity: newActivity.capacity || 0,
        registered: 0,
        status: (newActivity.status as "active" | "completed" | "cancelled") || "active",
        image: newActivity.image ? newActivity.image : "/placeholder.svg",
        activityTemplate: newActivity.activityTemplate || "announcement",
        categories: newActivity.categories || [],
      }
      setActivities([...activities, activity])
      resetNewActivity()
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
      resetNewActivity()
    }
  }

  const handleDeleteActivityConfirmed = () => {
    if (activityDeleteConfirmId) {
      setActivities(activities.filter((a) => a.id !== activityDeleteConfirmId))
      setActivityRegistrations(activityRegistrations.filter((r) => r.activityId !== activityDeleteConfirmId))
      setActivityDeleteConfirmId(null)
    }
  }

  // --- Registration handlers ---
  const handleApproveRegistration = (registrationId: string) => {
    setActivityRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status: "approved" as const } : r)),
    )
  }

  const handleRejectRegistration = (registrationId: string) => {
    // Rejection = permanent delete per spec
    setActivityRegistrations((prev) => prev.filter((r) => r.id !== registrationId))
  }

  const getActivityRegistrations = (activityId: string) =>
    activityRegistrations.filter((r) => r.activityId === activityId)

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRegistrationStatusText = (status: string) => {
    switch (status) {
      case "pending": return "قيد المراجعة"
      case "approved": return "مقبول"
      case "rejected": return "مرفوض"
      default: return "غير محدد"
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

  const handleApprovePartnership = (partnershipId: string) => {
    setPartnerships((prev) =>
      prev.map((p) =>
        p.id === partnershipId
          ? {
            ...p,
            status: "approved" as const,
            reviewedBy: "المدير العام",
            reviewDate: new Date().toISOString(),
            notes: reviewNotes || "تمت الموافقة على الشراكة",
            rejectedAt: undefined,
          }
          : p,
      ),
    )
    setReviewNotes("")
    setSelectedPartnership(null)
  }

  const handleRejectPartnership = (partnershipId: string) => {
    setPartnerships((prev) =>
      prev.map((p) =>
        p.id === partnershipId
          ? {
            ...p,
            status: "rejected" as const,
            reviewedBy: "المدير العام",
            reviewDate: new Date().toISOString(),
            rejectedAt: new Date().toISOString(),
            notes: reviewNotes || "تم رفض طلب الشراكة",
          }
          : p,
      ),
    )
    setReviewNotes("")
    setSelectedPartnership(null)
  }

  const handleUndoReject = (partnershipId: string) => {
    setPartnerships((prev) =>
      prev.map((p) =>
        p.id === partnershipId
          ? { ...p, status: "pending" as const, rejectedAt: undefined, reviewedBy: undefined, reviewDate: undefined, notes: undefined }
          : p,
      ),
    )
  }

  const handleDeletePartnership = (partnershipId: string) => {
    setPartnerships((prev) => prev.filter((p) => p.id !== partnershipId))
    setDeleteConfirmId(null)
    setSelectedPartnership(null)
  }

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
        image: newNews.image ? newNews.image : "/placeholder.svg",
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
        return "مقبول"
      case "rejected":
        return "مرفوض"
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

  const filteredPartnerships = partnerships.filter((p) => {
    if (p.status === "rejected") return false // rejected entries shown separately
    const matchesFilter = partnershipFilter === "all" || p.status === partnershipFilter
    const matchesSearch =
      p.associationName.toLowerCase().includes(partnershipSearchTerm.toLowerCase()) ||
      p.institutionName.toLowerCase().includes(partnershipSearchTerm.toLowerCase()) ||
      p.presidentName.toLowerCase().includes(partnershipSearchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(partnershipSearchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const rejectedPartnerships = partnerships.filter((p) => p.status === "rejected")

  const GRACE_DAYS = 5
  const getRemainingDays = (rejectedAt: string) => {
    const diff = Date.now() - new Date(rejectedAt).getTime()
    const daysPassed = diff / (1000 * 60 * 60 * 24)
    return Math.max(0, Math.ceil(GRACE_DAYS - daysPassed))
  }

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
      title: "طلبات الشراكة",
      value: partnerships.filter((p) => p.status === "pending").length.toString(),
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
          <CardContent className="space-y-6 p-6">
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
    { id: "memberships", label: "إدارة العضويات", icon: UserCheck },
    // { id: "members", label: "إدارة الأعضاء", icon: Users },
    { id: "news", label: "إدارة الأخبار", icon: Newspaper },
    { id: "permissions", label: "الصلاحيات", icon: Shield },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ]

  // --- Export Handlers for Activities ---
  const generateAssociationsHTML = (activity: any, regs: any[]) => {
    return `
      <div class="header-info">
        <h1>الجمعيات المسجلة</h1>
        <h2>النشاط: ${activity.title}</h2>
        <p>تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-DZ')}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>اسم الجمعية</th>
            <th>البريد الإلكتروني</th>
            <th>الهاتف</th>
            <th>تاريخ التسجيل</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          ${regs.map((reg, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${reg.associationName}</td>
              <td>${reg.associationEmail}</td>
              <td>${reg.associationPhone}</td>
              <td>${new Date(reg.registrationDate).toLocaleDateString('ar-DZ')}</td>
              <td>${reg.status === 'approved' ? 'مقبول' : reg.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const generateParticipantsHTML = (activity: any, regs: any[]) => {
    const approvedRegs = regs.filter(r => r.status === 'approved');
    let participantsRows = '';
    let counter = 1;
    approvedRegs.forEach(reg => {
      reg.participants.forEach((p: any) => {
        participantsRows += `
          <tr>
            <td>${counter++}</td>
            <td>${p.firstName}</td>
            <td>${p.lastName}</td>
            <td>${new Date(p.dateOfBirth).toLocaleDateString('ar-DZ')}</td>
            <td>${reg.associationName}</td>
          </tr>
        `;
      });
    });

    return `
      <div class="header-info">
        <h1>المشاركون المسجلون</h1>
        <h2>النشاط: ${activity.title}</h2>
        <p>تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-DZ')}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>اللقب</th>
            <th>تاريخ الميلاد</th>
            <th>الجمعية</th>
          </tr>
        </thead>
        <tbody>
          ${participantsRows || '<tr><td colspan="5" style="text-align:center;">لا يوجد مشاركين</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const generateGroupedParticipantsHTML = (activity: any, regs: any[]) => {
    const approvedRegs = regs.filter(r => r.status === 'approved');
    if (!activity.categories || activity.categories.length === 0) return generateParticipantsHTML(activity, regs);

    let html = `
      <div class="header-info">
        <h1>المشاركون المسجلون (حسب الفئة)</h1>
        <h2>النشاط: ${activity.title}</h2>
        <p>تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-DZ')}</p>
      </div>
    `;

    activity.categories.forEach((cat: any) => {
      let participantsRows = '';
      let counter = 1;
      approvedRegs.forEach(reg => {
        const catParticipants = reg.participants.filter((p: any) => p.category === cat);
        catParticipants.forEach((p: any) => {
          participantsRows += `
            <tr>
              <td>${counter++}</td>
              <td>${p.firstName}</td>
              <td>${p.lastName}</td>
              <td>${new Date(p.dateOfBirth).toLocaleDateString('ar-DZ')}</td>
              <td>${reg.associationName}</td>
            </tr>
          `;
        });
      });

      html += `
        <h3>الفئة: ${cat}</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>اللقب</th>
              <th>تاريخ الميلاد</th>
              <th>الجمعية</th>
            </tr>
          </thead>
          <tbody>
            ${participantsRows || '<tr><td colspan="5" style="text-align:center;">لا يوجد مشاركين في هذه الفئة</td></tr>'}
          </tbody>
        </table>
        <br/>
      `;
    });

    return html;
  };

  const handleExportAssociations = (format: 'pdf' | 'word') => {
    if (!viewingRegistrationsActivity) return;
    const regs = getActivityRegistrations(viewingRegistrationsActivity.id);
    const html = generateAssociationsHTML(viewingRegistrationsActivity, regs);
    const filename = `الجمعيات_المسجلة_${viewingRegistrationsActivity.title.replace(/\s+/g, '_')}`;
    if (format === 'pdf') exportToPDF(html, filename);
    else exportToWord(html, filename);
  };

  const handleExportParticipants = (format: 'pdf' | 'word') => {
    if (!viewingRegistrationsActivity) return;
    const regs = getActivityRegistrations(viewingRegistrationsActivity.id);
    let html = '';
    if (templateNeedsCategories(viewingRegistrationsActivity.activityTemplate)) {
      html = generateGroupedParticipantsHTML(viewingRegistrationsActivity, regs);
    } else {
      html = generateParticipantsHTML(viewingRegistrationsActivity, regs);
    }
    const filename = `المشاركون_${viewingRegistrationsActivity.title.replace(/\s+/g, '_')}`;
    if (format === 'pdf') exportToPDF(html, filename);
    else exportToWord(html, filename);
  };

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
                className={`w-full justify-start ${activeSection === item.id ? "bg-amber-600 hover:bg-amber-700 text-white" : "hover:bg-gray-100"
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
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg">النشاط الأخير</CardTitle>
                <CardDescription>آخر العمليات في النظام</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
                        <div className="mr-2">
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sidebarItems.find((item) => item.id === activeSection)?.label}
                </h2>
                <p className="text-black-600">مرحباً بك في النظام الإداري لجمعية المنار للشباب</p>
              </div>
              <Dialog open={isAddingActivity} onOpenChange={(open) => { setIsAddingActivity(open); if (!open) resetNewActivity() }}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة نشاط جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إضافة نشاط جديد</DialogTitle>
                    <DialogDescription>اختر نمط النشاط ثم أدخل البيانات المطلوبة</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Activity Template Selector */}
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">نمط النشاط</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {ACTIVITY_TEMPLATES.map((tmpl) => (
                          <button
                            key={tmpl.value}
                            type="button"
                            onClick={() => setNewActivity({ ...newActivity, activityTemplate: tmpl.value, categories: tmpl.value !== "special" ? [] : (newActivity.categories || []) })}
                            className={`p-3 rounded-lg border-2 text-right transition-all ${newActivity.activityTemplate === tmpl.value ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}
                          >
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1 ${tmpl.color}`}>{tmpl.label}</span>
                            <p className="text-xs text-gray-500 mt-1">{tmpl.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-title">عنوان النشاط</Label>
                        <Input id="add-title" value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} placeholder="مثال: المخيم الصيفي" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-type">تصنيف النشاط</Label>
                        <Select dir="rtl" value={newActivity.type} onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}>
                          <SelectTrigger><SelectValue placeholder="اختر تصنيف النشاط" /></SelectTrigger>
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
                      <Label htmlFor="add-description">وصف النشاط</Label>
                      <Textarea id="add-description" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} placeholder="وصف مفصل عن النشاط وأهدافه" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2" >
                        <Label htmlFor="add-date">تاريخ النشاط</Label>
                        <Input id="add-date" type="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-location">المكان</Label>
                        <Input id="add-location" value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} placeholder="مثال: مركز الجمعية" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-duration">المدة</Label>
                        <Input id="add-duration" value={newActivity.duration} onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })} placeholder="مثال: 3 أيام" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-capacity">السعة القصوى</Label>
                        <Input id="add-capacity" type="number" value={newActivity.capacity} onChange={(e) => setNewActivity({ ...newActivity, capacity: parseInt(e.target.value) || 0 })} placeholder="50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>صورة النشاط</Label>
                      <div className="flex items-center gap-3">
                        <label htmlFor="add-image-upload" className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 border-dashed border-gray-300 flex-1 justify-center">
                          <Upload className="h-4 w-4 text-amber-600" />
                          {newActivity.image ? "تغيير الصورة" : "رفع صورة"}
                        </label>
                        <input id="add-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageOptimize(file, (optimizedUrl) => {
                              setNewActivity({ ...newActivity, image: optimizedUrl })
                            })
                          }
                        }} />
                        {newActivity.image && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <img src={newActivity.image} alt="preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setNewActivity({ ...newActivity, image: "" })} className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg">×</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conditional: Registration Settings */}
                    {templateNeedsReg(newActivity.activityTemplate) && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
                        <h4 className="font-medium text-blue-900 flex items-center gap-2"><Users className="h-4 w-4" />إعدادات تسجيل الجمعيات</h4>
                        <p className="text-sm text-blue-700">سيُتاح للجمعيات التسجيل في هذا النشاط. يمكنك مراجعة وقبول أو رفض التسجيلات لاحقاً.</p>
                      </div>
                    )}

                    {/* Conditional: Participant Config */}
                    {templateNeedsParticipants(newActivity.activityTemplate) && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-1">
                        <h4 className="font-medium text-purple-900 flex items-center gap-2"><UserCheck className="h-4 w-4" />تكوين المشاركين</h4>
                        <p className="text-sm text-purple-700">سيتمكن ممثلو الجمعيات المقبولة من إضافة قوائم المشاركين إلى النشاط.</p>
                      </div>
                    )}

                    {/* Conditional: Categories Editor */}
                    {templateNeedsCategories(newActivity.activityTemplate) && (
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 space-y-3">
                        <h4 className="font-medium text-orange-900 flex items-center gap-2"><Shield className="h-4 w-4" />تصنيفات المشاركين</h4>
                        <p className="text-sm text-orange-700">أضف التصنيفات المطلوبة لهذا النشاط (مثل U12، U16، Senior)</p>
                        <div className="flex gap-2">
                          <Input
                            placeholder="أدخل اسم التصنيف..."
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newCategoryInput.trim()) {
                                setNewActivity({ ...newActivity, categories: [...(newActivity.categories || []), newCategoryInput.trim()] })
                                setNewCategoryInput("")
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={() => {
                            if (newCategoryInput.trim()) {
                              setNewActivity({ ...newActivity, categories: [...(newActivity.categories || []), newCategoryInput.trim()] })
                              setNewCategoryInput("")
                            }
                          }}>إضافة</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(newActivity.categories || []).map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                              {cat}
                              <button onClick={() => setNewActivity({ ...newActivity, categories: (newActivity.categories || []).filter((_, i) => i !== idx) })} className="text-orange-600 hover:text-orange-900 font-bold ml-1">×</button>
                            </span>
                          ))}
                          {(newActivity.categories || []).length === 0 && <p className="text-xs text-orange-600">لم تُضف أي تصنيفات بعد</p>}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <Button variant="outline" onClick={() => { resetNewActivity(); setIsAddingActivity(false) }}>إلغاء</Button>
                    <Button onClick={handleAddActivity} className="mr-2 bg-amber-600 hover:bg-amber-700">إضافة النشاط</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((activity) => {
                const tmplMeta = getTemplateMeta(activity.activityTemplate)
                const regs = getActivityRegistrations(activity.id)
                return (
                  <Card key={activity.id} className="hover:shadow-lg transition-shadow flex flex-col">
                    <div className="relative">
                      <img src={activity.image || "/placeholder.svg"} alt={activity.title} className="w-full h-48 object-cover rounded-t-lg" />
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(activity.status)}`}>{getStatusText(activity.status)}</Badge>
                      <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium ${tmplMeta.color}`}>{tmplMeta.label}</span>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{activity.title}</h4>
                          <Badge variant="outline" className="mt-1">{activity.type}</Badge>
                          {activity.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {activity.categories.map((cat, i) => (
                                <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{cat}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center"><Calendar className="h-4 w-4 ml-2 flex-shrink-0" />{activity.date}</div>
                          <div className="flex items-center"><MapPin className="h-4 w-4 ml-2 flex-shrink-0" />{activity.location}</div>
                          <div className="flex items-center"><Clock className="h-4 w-4 ml-2 flex-shrink-0" />{activity.duration}</div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="text-sm">
                            <span className="font-medium">{activity.registered}</span>
                            <span className="text-gray-500">/{activity.capacity} مسجل</span>
                          </div>
                          {templateNeedsReg(activity.activityTemplate) && (
                            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                              <Users className="h-3 w-3" />{regs.length} جمعية
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditActivity(activity)}>
                          <Edit className="h-4 w-4 ml-1" />تعديل
                        </Button>
                        {templateNeedsReg(activity.activityTemplate) && (
                          <Button size="sm" variant="outline" className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => setViewingRegistrationsActivity(activity)}>
                            <EyeIcon className="h-4 w-4 ml-1" />التسجيلات
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setActivityDeleteConfirmId(activity.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Edit Activity Dialog */}
            <Dialog open={!!editingActivity} onOpenChange={(open) => { if (!open) { setEditingActivity(null); resetNewActivity() } }}>
              <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8" dir="rtl">
                <DialogHeader>
                  <DialogTitle>تعديل النشاط</DialogTitle>
                  <DialogDescription>تعديل بيانات النشاط</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Template Selector */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">نمط النشاط</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {ACTIVITY_TEMPLATES.map((tmpl) => (
                        <button
                          key={tmpl.value}
                          type="button"
                          onClick={() => setNewActivity({ ...newActivity, activityTemplate: tmpl.value, categories: tmpl.value !== "special" ? [] : (newActivity.categories || []) })}
                          className={`p-3 rounded-lg border-2 text-right transition-all ${newActivity.activityTemplate === tmpl.value ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1 ${tmpl.color}`}>{tmpl.label}</span>
                          <p className="text-xs text-gray-500 mt-1">{tmpl.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>عنوان النشاط</Label>
                      <Input value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>تصنيف النشاط</Label>
                      <Select value={newActivity.type} onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label>وصف النشاط</Label>
                    <Textarea value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>تاريخ النشاط</Label>
                      <Input type="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>المكان</Label>
                      <Input value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>صورة النشاط</Label>
                    <div className="flex items-center gap-3">
                      <label htmlFor="edit-image-upload" className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 border-dashed border-gray-300 flex-1 justify-center">
                        <Upload className="h-4 w-4 text-amber-600" />
                        {newActivity.image ? "تغيير الصورة" : "رفع صورة"}
                      </label>
                      <input id="edit-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageOptimize(file, (optimizedUrl) => {
                            setNewActivity({ ...newActivity, image: optimizedUrl })
                          })
                        }
                      }} />
                      {newActivity.image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <img src={newActivity.image} alt="preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setNewActivity({ ...newActivity, image: "" })} className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg">×</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>المدة</Label>
                      <Input value={newActivity.duration} onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>السعة القصوى</Label>
                      <Input type="number" value={newActivity.capacity} onChange={(e) => setNewActivity({ ...newActivity, capacity: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label>الحالة</Label>
                      <Select value={newActivity.status} onValueChange={(value) => setNewActivity({ ...newActivity, status: value as "active" | "completed" | "cancelled" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Conditional sections */}
                  {templateNeedsReg(newActivity.activityTemplate) && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 flex items-center gap-2"><Users className="h-4 w-4" />تسجيل الجمعيات مُفعَّل</h4>
                      <p className="text-sm text-blue-700 mt-1">الجمعيات يمكنها التسجيل في هذا النشاط.</p>
                    </div>
                  )}
                  {templateNeedsParticipants(newActivity.activityTemplate) && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 flex items-center gap-2"><UserCheck className="h-4 w-4" />تسجيل المشاركين مُفعَّل</h4>
                      <p className="text-sm text-purple-700 mt-1">الجمعيات المقبولة يمكنها إضافة مشاركين.</p>
                    </div>
                  )}
                  {templateNeedsCategories(newActivity.activityTemplate) && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 space-y-3">
                      <h4 className="font-medium text-orange-900 flex items-center gap-2"><Shield className="h-4 w-4" />تصنيفات المشاركين</h4>
                      <div className="flex gap-2">
                        <Input placeholder="أدخل اسم التصنيف..." value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && newCategoryInput.trim()) { setNewActivity({ ...newActivity, categories: [...(newActivity.categories || []), newCategoryInput.trim()] }); setNewCategoryInput("") } }} />
                        <Button type="button" variant="outline" onClick={() => { if (newCategoryInput.trim()) { setNewActivity({ ...newActivity, categories: [...(newActivity.categories || []), newCategoryInput.trim()] }); setNewCategoryInput("") } }}>إضافة</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(newActivity.categories || []).map((cat, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            {cat}
                            <button onClick={() => setNewActivity({ ...newActivity, categories: (newActivity.categories || []).filter((_, i) => i !== idx) })} className="text-orange-600 hover:text-orange-900 font-bold ml-1">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <Button variant="outline" onClick={() => { setEditingActivity(null); resetNewActivity() }}>إلغاء</Button>
                  <Button onClick={handleUpdateActivity} className="mr-2 bg-amber-600 hover:bg-amber-700">حفظ التغييرات</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={!!activityDeleteConfirmId} onOpenChange={(open) => { if (!open) setActivityDeleteConfirmId(null) }}>
              <DialogContent dir="rtl" className="max-w-lg w-[95vw] p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    تأكيد حذف النشاط
                  </DialogTitle>
                  <DialogDescription>
                    هل أنت متأكد من حذف النشاط{" "}
                    <strong>{activities.find((a) => a.id === activityDeleteConfirmId)?.title}</strong>؟
                    <br />
                    سيتم حذف جميع التسجيلات المرتبطة به. هذا الإجراء لا يمكن التراجع عنه.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setActivityDeleteConfirmId(null)}>إلغاء</Button>
                  <Button variant="destructive" onClick={handleDeleteActivityConfirmed}>
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف النشاط
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Registrations Panel Dialog */}
            <Dialog open={!!viewingRegistrationsActivity} onOpenChange={(open) => { if (!open) { setViewingRegistrationsActivity(null); setExpandedRegistrationId(null) } }}>
              <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8" dir="rtl">
                <DialogHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-amber-600" />
                        تسجيلات النشاط: {viewingRegistrationsActivity?.title}
                      </DialogTitle>
                      <DialogDescription>
                        إدارة طلبات تسجيل الجمعيات — القبول يحفظ التسجيل، الرفض يحذفه نهائياً
                      </DialogDescription>
                    </div>
                    {/* Export Buttons */}
                    {viewingRegistrationsActivity && templateNeedsReg(viewingRegistrationsActivity.activityTemplate) && (
                      <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 ml-2">
                            تصدير الجمعيات:
                          </span>
                          <Button size="sm" className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-2" onClick={() => handleExportAssociations('word')}>
                            <FileDown className="h-4 w-4" /> Word
                          </Button>
                          <Button size="sm" className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all flex items-center gap-2" onClick={() => handleExportAssociations('pdf')}>
                            <Printer className="h-4 w-4" /> PDF
                          </Button>
                        </div>
                        {templateNeedsParticipants(viewingRegistrationsActivity.activityTemplate) && (
                          <div className="flex items-center gap-2 border-r pr-3 border-gray-300">
                            <span className="text-sm font-semibold text-gray-700 ml-2">
                              تصدير المشاركين:
                            </span>
                            <Button size="sm" className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-2" onClick={() => handleExportParticipants('word')}>
                              <FileDown className="h-4 w-4" /> Word
                            </Button>
                            <Button size="sm" className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all flex items-center gap-2" onClick={() => handleExportParticipants('pdf')}>
                              <Printer className="h-4 w-4" /> PDF
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {viewingRegistrationsActivity && getActivityRegistrations(viewingRegistrationsActivity.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>لا توجد تسجيلات لهذا النشاط بعد</p>
                    </div>
                  )}
                  {viewingRegistrationsActivity && getActivityRegistrations(viewingRegistrationsActivity.id).map((reg) => (
                    <div key={reg.id} className="border rounded-lg overflow-hidden">
                      {/* Registration Row */}
                      <div className="flex items-center justify-between p-4 bg-gray-50">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">{reg.associationName}</p>
                            <p className="text-sm text-gray-500 truncate">{reg.associationEmail} · {reg.associationPhone}</p>
                            <p className="text-xs text-gray-400">{new Date(reg.registrationDate).toLocaleDateString("ar-DZ")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getRegistrationStatusColor(reg.status)}>{getRegistrationStatusText(reg.status)}</Badge>
                          {reg.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApproveRegistration(reg.id)}>
                                <Check className="h-4 w-4 ml-1" />قبول
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRejectRegistration(reg.id)}>
                                <X className="h-4 w-4 ml-1" />رفض
                              </Button>
                            </>
                          )}
                          {reg.status === "approved" && templateNeedsParticipants(viewingRegistrationsActivity.activityTemplate) && (
                            <Button size="sm" variant="outline" onClick={() => setExpandedRegistrationId(expandedRegistrationId === reg.id ? null : reg.id)}>
                              <Users className="h-4 w-4 ml-1" />{reg.participants.length} مشارك
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Participants Expandable */}
                      {expandedRegistrationId === reg.id && (
                        <div className="p-4 bg-white border-t">
                          <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />قائمة المشاركين
                          </h5>
                          {reg.participants.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">لم تُضف أي مشاركين بعد</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-right text-gray-500 border-b">
                                    <th className="pb-2 font-medium">الاسم</th>
                                    <th className="pb-2 font-medium">العمر</th>
                                    {viewingRegistrationsActivity.activityTemplate === "special" && <th className="pb-2 font-medium">الفئة</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {reg.participants.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0">
                                      <td className="py-2 font-medium">{p.name}</td>
                                      <td className="py-2 text-gray-600">{p.age} سنة</td>
                                      {viewingRegistrationsActivity.activityTemplate === "special" && (
                                        <td className="py-2">
                                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{p.category || "—"}</span>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => { setViewingRegistrationsActivity(null); setExpandedRegistrationId(null) }}>إغلاق</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeSection === "messages" && (
          <div className="space-y-6">
            {/* Header with Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sidebarItems.find((item) => item.id === activeSection)?.label}
                </h2>
                <p className="text-black-600">إدارة رسائل الزوار والاستفسارات</p>
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
                <Select dir="rtl" value={messageFilter} onValueChange={setMessageFilter}>
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
              <Card className="p-6">
                <CardContent className="p-6">
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
            <Card >
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg">قائمة الرسائل</CardTitle>
                <CardDescription>جميع الرسائل الواردة من نموذج الاتصال</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 ">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد رسائل تطابق البحث</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${message.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-white"
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
              <DialogContent className="max-w-3xl w-[95vw] p-6 md:p-8" dir="rtl">
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
            {/* ── Export Print Styles (hidden except when printing) ── */}
            <style>{`
                  @media print {
                    body > *:not(#membership-print-area) { display: none !important; }
                    #membership-print-area { display: block !important; }
                    .no-print { display: none !important; }
                  }
                  #membership-print-area { display: none; }
              `}</style>

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center no-print">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sidebarItems.find((item) => item.id === activeSection)?.label}
                </h2>
                <p className="text-black-600">مراجعة وإدارة طلبات الشراكة مع الجمعيات</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في الجمعيات..."
                    value={partnershipSearchTerm}
                    onChange={(e) => setPartnershipSearchTerm(e.target.value)}
                    className="pr-10 w-56"
                  />
                </div>
                <Select dir="rtl" value={partnershipFilter} onValueChange={setPartnershipFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="all">جميع الطلبات</SelectItem>
                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                    <SelectItem value="approved">مقبولة</SelectItem>
                  </SelectContent>
                </Select>
                {/* Export Button */}
                <Dialog open={exportFormatOpen} onOpenChange={setExportFormatOpen}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                    onClick={() => setExportFormatOpen(true)}
                    disabled={partnerships.filter((p) => p.status === "approved").length === 0}
                  >
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                  <DialogContent className="max-w-md w-[95vw] p-6" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>اختر صيغة التصدير</DialogTitle>
                      <DialogDescription>سيتم تصدير جميع الشراكات المقبولة</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 bg-transparent border-2 hover:border-red-400 hover:bg-red-50"
                        onClick={() => {
                          setExportFormatOpen(false)
                          const approved = partnerships.filter((p) => p.status === "approved")
                          // Build printable HTML
                          const rows = approved.map((p) => `
  < div style = "page-break-inside:avoid;margin-bottom:32px;border:1px solid #e5e7eb;border-radius:8px;padding:20px" >
                              <h2 style="font-size:18px;font-weight:700;color:#d97706;margin-bottom:12px;border-bottom:2px solid #d97706;padding-bottom:6px">${p.associationName}</h2>
                              <table style="width:100%;border-collapse:collapse;font-size:13px">
                                <tr style="background:#fef9f0"><td style="padding:6px 10px;font-weight:600;width:35%;border:1px solid #e5e7eb">المؤسسة المشرفة</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.institutionName}</td></tr>
                                <tr><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">رئيس الجمعية</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.presidentName}</td></tr>
                                <tr style="background:#fef9f0"><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">هاتف الرئيس</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.presidentPhone}</td></tr>
                                <tr><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">أمين المال</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.treasurerName}</td></tr>
                                <tr style="background:#fef9f0"><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">هاتف أمين المال</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.treasurerPhone}</td></tr>
                                <tr><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">الأمين العام</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.secretaryName}</td></tr>
                                <tr style="background:#fef9f0"><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">هاتف الأمين العام</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.secretaryPhone}</td></tr>
                                <tr><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">البريد الإلكتروني</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.email}</td></tr>
                                <tr style="background:#fef9f0"><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">رقم الهاتف</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.phone}</td></tr>
                                <tr><td style="padding:6px 10px;font-weight:600;border:1px solid #e5e7eb">تاريخ الموافقة</td><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.reviewDate ? new Date(p.reviewDate).toLocaleDateString("ar-DZ") : "-"}</td></tr>
                              </table>
                            </div >
  `).join("")
                          const printWin = window.open("", "_blank", "width=900,height=700")
                          if (printWin) {
                            printWin.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>شراكات الجمعية المنار</title><style>body{font-family:Arial,sans-serif;padding:30px;direction:rtl} h1{color:#d97706;text-align:center;margin-bottom:6px} .subtitle{text-align:center;color:#6b7280;margin-bottom:24px}</style></head><body><h1>جمعية المنار للشباب</h1><p class="subtitle">قائمة الشراكات المعتمدة — ${new Date().toLocaleDateString("ar-DZ")}</p>${rows}</body></html>`)
                            printWin.document.close()
                            printWin.focus()
                            setTimeout(() => printWin.print(), 500)
                          }
                        }}
                      >
                        <Printer className="h-8 w-8 text-red-500" />
                        <span className="text-sm font-medium">PDF / طباعة</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 bg-transparent border-2 hover:border-blue-400 hover:bg-blue-50"
                        onClick={() => {
                          setExportFormatOpen(false)
                          const approved = partnerships.filter((p) => p.status === "approved")
                          const tableRows = approved.map((p) => `
  < h2 > ${p.associationName}</h2 >
                            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
                              <tr style="background:#fef9f0"><td><b>المؤسسة المشرفة</b></td><td>${p.institutionName}</td></tr>
                              <tr><td><b>رئيس الجمعية</b></td><td>${p.presidentName}</td></tr>
                              <tr style="background:#fef9f0"><td><b>هاتف الرئيس</b></td><td>${p.presidentPhone}</td></tr>
                              <tr><td><b>أمين المال</b></td><td>${p.treasurerName}</td></tr>
                              <tr style="background:#fef9f0"><td><b>هاتف أمين المال</b></td><td>${p.treasurerPhone}</td></tr>
                              <tr><td><b>الأمين العام</b></td><td>${p.secretaryName}</td></tr>
                              <tr style="background:#fef9f0"><td><b>هاتف الأمين العام</b></td><td>${p.secretaryPhone}</td></tr>
                              <tr><td><b>البريد الإلكتروني</b></td><td>${p.email}</td></tr>
                              <tr style="background:#fef9f0"><td><b>رقم الهاتف</b></td><td>${p.phone}</td></tr>
                              <tr><td><b>تاريخ الموافقة</b></td><td>${p.reviewDate ? new Date(p.reviewDate).toLocaleDateString("ar-DZ") : "-"}</td></tr>
                            </table><br/>
`).join("")
                          const html = `< html xmlns: o = "urn:schemas-microsoft-com:office:office" xmlns: w = "urn:schemas-microsoft-com:office:word" xmlns = "http://www.w3.org/TR/REC-html40" ><head><meta charset="utf-8"><title>شراكات</title><style>body{font-family:Arial;direction:rtl} table{border-collapse:collapse;width:100%} td{padding:6px 10px} h2{color:#d97706}</style></head><body><h1 style="text-align:center;color:#d97706">جمعية المنار للشباب — الشراكات المعتمدة</h1><p style="text-align:center;color:#6b7280">${new Date().toLocaleDateString("ar-DZ")}</p><hr/>${tableRows}</body></html > `
                          const blob = new Blob(["\ufeff" + html], { type: "application/msword" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `شراكات_المنار_${new Date().toISOString().slice(0, 10)}.doc`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <FileDown className="h-8 w-8 text-blue-500" />
                        <span className="text-sm font-medium">Word (.doc)</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                      <p className="text-2xl font-bold text-gray-900">{partnerships.filter(p => p.status !== "rejected").length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {partnerships.filter((p) => p.status === "pending").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">شراكات معتمدة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {partnerships.filter((p) => p.status === "approved").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Soft-deleted (rejected) Grace Period Zone ── */}
            {rejectedPartnerships.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    جمعيات مرفوضة مؤقتاً — سيتم حذفها نهائياً خلال {GRACE_DAYS} أيام
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {rejectedPartnerships.map((p) => {
                      const remaining = p.rejectedAt ? getRemainingDays(p.rejectedAt) : GRACE_DAYS
                      return (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <Building2 className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{p.associationName}</p>
                              <p className="text-xs text-orange-600">
                                يتبقى <strong>{remaining}</strong> {remaining === 1 ? "يوم" : "أيام"} قبل الحذف النهائي
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300 bg-transparent"
                              onClick={() => handleUndoReject(p.id)}
                            >
                              <Undo2 className="h-4 w-4 ml-1" />
                              تراجع
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 border-red-300 bg-transparent"
                              onClick={() => setDeleteConfirmId(p.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Partnerships List ── */}
            <Card >
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg">قائمة الشراكات</CardTitle>
                <CardDescription>جميع طلبات الشراكة المقدمة من الجمعيات</CardDescription>
              </CardHeader>
              <CardContent >
                <div className="space-y-4">
                  {filteredPartnerships.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <Link2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد جمعيات تطابق البحث</p>
                    </div>
                  ) : (
                    filteredPartnerships.map((p) => (
                      <div
                        key={p.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${p.status === "pending" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                          }`}
                        onClick={() => setSelectedPartnership(p)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Association Avatar */}
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 border-2 border-amber-300">
                              <Building2 className="h-7 w-7 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <h4 className="font-bold text-gray-900">{p.associationName}</h4>
                                <Badge
                                  className={
                                    p.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }
                                >
                                  {p.status === "pending" ? "قيد المراجعة" : "مقبولة"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{p.institutionName}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">الرئيس: {p.presidentName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 flex-shrink-0" />
                                  <span>{p.presidentPhone}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{p.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 flex-shrink-0" />
                                  <span>{p.phone}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                تاريخ التقديم: {new Date(p.submissionDate).toLocaleDateString("ar-DZ")}
                              </p>
                            </div>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex gap-2 flex-shrink-0 mr-2" onClick={(e) => e.stopPropagation()}>
                            {p.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprovePartnership(p.id)}
                                  title="قبول"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 bg-transparent border-red-300"
                                  onClick={() => handleRejectPartnership(p.id)}
                                  title="رفض"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 border-red-200 bg-transparent"
                              onClick={() => setDeleteConfirmId(p.id)}
                              title="حذف"
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

            {/* ── Partnership Detail Dialog ── */}
            <Dialog open={!!selectedPartnership} onOpenChange={() => setSelectedPartnership(null)}>
              <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-600" />
                    {selectedPartnership?.associationName}
                  </DialogTitle>
                  <DialogDescription>{selectedPartnership?.institutionName}</DialogDescription>
                </DialogHeader>
                {selectedPartnership && (
                  <div className="space-y-6">
                    {/* Contact Grid */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">معلومات القيادة</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <Label className="text-xs font-medium text-amber-700">رئيس الجمعية</Label>
                          <p className="text-sm font-semibold mt-1">{selectedPartnership.presidentName}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />{selectedPartnership.presidentPhone}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <Label className="text-xs font-medium text-blue-700">أمين المال</Label>
                          <p className="text-sm font-semibold mt-1">{selectedPartnership.treasurerName}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />{selectedPartnership.treasurerPhone}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <Label className="text-xs font-medium text-green-700">الأمين العام</Label>
                          <p className="text-sm font-semibold mt-1">{selectedPartnership.secretaryName}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />{selectedPartnership.secretaryPhone}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Label className="text-xs font-medium text-gray-600">معلومات التواصل</Label>
                          <p className="text-sm text-gray-800 flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />{selectedPartnership.email}
                          </p>
                          <p className="text-sm text-gray-800 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />{selectedPartnership.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">حالة الطلب</Label>
                        <Badge
                          className={`mt-1 ${selectedPartnership.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-green-100 text-green-800"
                            }`}
                        >
                          {selectedPartnership.status === "pending" ? "قيد المراجعة" : "مقبولة"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">تاريخ التقديم</Label>
                        <p className="text-sm mt-1">{new Date(selectedPartnership.submissionDate).toLocaleDateString("ar-DZ")}</p>
                      </div>
                      {selectedPartnership.reviewedBy && (
                        <>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">تمت المراجعة بواسطة</Label>
                            <p className="text-sm mt-1">{selectedPartnership.reviewedBy}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">تاريخ المراجعة</Label>
                            <p className="text-sm mt-1">{selectedPartnership.reviewDate ? new Date(selectedPartnership.reviewDate).toLocaleDateString("ar-DZ") : "-"}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {selectedPartnership.notes && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ملاحظات</Label>
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-blue-800">{selectedPartnership.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Approve / Reject actions for pending */}
                    {selectedPartnership.status === "pending" && (
                      <div className="space-y-3 border-t pt-4">
                        <div>
                          <Label htmlFor="review-notes-dialog">ملاحظات المراجعة (اختياري)</Label>
                          <Textarea
                            id="review-notes-dialog"
                            placeholder="اكتب ملاحظاتك حول طلب الشراكة..."
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent border-red-300"
                            onClick={() => handleRejectPartnership(selectedPartnership.id)}
                          >
                            <XCircle className="ml-2 h-4 w-4" />
                            رفض الطلب
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprovePartnership(selectedPartnership.id)}
                          >
                            <CheckCircle className="ml-2 h-4 w-4" />
                            قبول الشراكة
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button variant="outline" onClick={() => setSelectedPartnership(null)}>
                        إغلاق
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
              <DialogContent className="max-w-lg w-[95vw] p-6" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    تأكيد الحذف النهائي
                  </DialogTitle>
                  <DialogDescription>
                    هذا الإجراء لا يمكن التراجع عنه بعد التأكيد
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      ستقوم بحذف الجمعية التالية بشكل نهائي:
                    </p>
                    <p className="text-base font-bold text-red-900 mt-2 pr-6">
                      {partnerships.find((p) => p.id === deleteConfirmId)?.associationName}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    سيتم حذف جميع بيانات هذه الجمعية نهائياً ولن تتمكن من استعادتها لاحقاً.
                    هل أنت متأكد من المتابعة؟
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                    إلغاء — ابقِ الجمعية
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => deleteConfirmId && handleDeletePartnership(deleteConfirmId)}
                  >
                    <Trash2 className="ml-2 h-4 w-4" />
                    نعم، احذف نهائياً
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeSection === "news" && (
          <div className="space-y-6 " >
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sidebarItems.find((item) => item.id === activeSection)?.label}
                </h2>
                <p className="text-black-600">إنشاء وإدارة أخبار ومقالات الجمعية</p>
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
                <Select dir="rtl" value={newsFilter} onValueChange={setNewsFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent >
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
                  <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8" dir="rtl">
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
                          <Label htmlFor="news-excerpt">المقدمة</Label>
                          <Textarea
                            id="news-excerpt"
                            value={newNews.excerpt}
                            onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                            placeholder="مقدمة مختصرة عن المقال"
                            rows={2}
                          />
                        </div>
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
                          <Select dir="rtl"
                            value={newNews.status}
                            onValueChange={(value) =>
                              setNewNews({ ...newNews, status: value as "draft" | "published" | "archived" })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent >
                              <SelectItem value="draft">مسودة</SelectItem>
                              <SelectItem value="published">منشور</SelectItem>
                              <SelectItem value="archived">مؤرشف</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>صورة المقال (يتم ضغطها تلقائياً)</Label>
                        <div className="flex items-center gap-3">
                          <label htmlFor="news-image" className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 border-dashed border-gray-300 flex-1 justify-center">
                            <Upload className="h-4 w-4 text-amber-600" />
                            {newNews.image && newNews.image !== "/placeholder.svg" ? "تغيير الصورة" : "رفع صورة"}
                          </label>
                          <input
                            id="news-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageOptimize(file, (optimizedUrl) => {
                                  setNewNews({ ...newNews, image: optimizedUrl });
                                });
                              }
                            }}
                          />
                          {newNews.image && newNews.image !== "/placeholder.svg" && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              <img src={newNews.image} alt="Preview" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => setNewNews({ ...newNews, image: "/placeholder.svg" })} className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg">×</button>
                            </div>
                          )}
                        </div>
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
                        <Label htmlFor="news-featured" className="mr-2">مقال مميز</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 space-x-reverse">
                      <Button variant="outline" onClick={() => setIsAddingNews(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={handleAddNews} className="mr-2 bg-amber-600 hover:bg-amber-700">
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900 line-clamp-2">{article.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
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
                              className="mr-2 text-red-600 hover:text-red-700"
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
              <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8" dir="rtl">
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
                    <Label>صورة المقال (تحديث - يتم ضغطها تلقائياً)</Label>
                    <div className="flex items-center gap-3">
                      <label htmlFor="edit-news-image" className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 border-dashed border-gray-300 flex-1 justify-center">
                        <Upload className="h-4 w-4 text-amber-600" />
                        {newNews.image && newNews.image !== "/placeholder.svg" ? "تغيير الصورة" : "رفع صورة"}
                      </label>
                      <input
                        id="edit-news-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageOptimize(file, (optimizedUrl) => {
                              setNewNews({ ...newNews, image: optimizedUrl });
                            });
                          }
                        }}
                      />
                      {newNews.image && newNews.image !== "/placeholder.svg" && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <img src={newNews.image} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setNewNews({ ...newNews, image: "/placeholder.svg" })} className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg">×</button>
                        </div>
                      )}
                    </div>
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
                  <Button onClick={handleUpdateNews} className="mr-2 bg-amber-600 hover:bg-amber-700">
                    حفظ التغييرات
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* News Detail Dialog */}
            <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
              <DialogContent className="max-w-5xl md:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 md:p-8" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    {selectedNews?.title}
                  </DialogTitle>
                  <DialogDescription>
                    بواسطة {selectedNews?.author}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sidebarItems.find((item) => item.id === activeSection)?.label || "إدارة الصلاحيات"}
                </h2>
                <p className="text-black-600">إدارة فريق الإدارة والصلاحيات</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddAdminModal(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مدير جديد
                </Button>
              </div>
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
                <CardTitle className="flex items-center gap-2 p-6 pb-0">
                  <Users className="h-5 w-5 text-lg" />
                  فريق الإدارة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {adminTeam.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="ml-3 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          {admin.name.charAt(0)}
                        </div>
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
              <CardHeader className="p-6 pb-0">
                <CardTitle className="flex items-center gap-2 ">
                  <Shield className="h-5 w-5 text-lg" />
                  مصفوفة الصلاحيات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#2a3b5c]/10">
                      <tr>
                        <th className="text-right p-3 font-semibold text-[#2a3b5c] rounded-tr-lg">الصلاحية</th>
                        <th className="text-center p-3 font-semibold text-[#2a3b5c]">مدير عام</th>
                        <th className="text-center p-3 font-semibold text-[#2a3b5c]">مدير محتوى</th>
                        <th className="text-center p-3 font-semibold text-[#2a3b5c]">مشرف</th>
                        <th className="text-center p-3 font-semibold text-[#2a3b5c] rounded-tl-lg">مشاهد</th>
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

        {/* 
        {activeSection === "members" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sidebarItems.find((item) => item.id === activeSection)?.label || "إدارة الأعضاء"}
                </h2>
                <p className="text-black-600">إدارة بيانات وأدوار أعضاء ومتطوعي الجمعية</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddMemberModal(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة عضو جديد
                </Button>
              </div>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden mt-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-[#2a3b5c]/10">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-[#2a3b5c] rounded-tr-lg">العضو</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[#2a3b5c]">النوع</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[#2a3b5c]">الدور</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[#2a3b5c]">الحالة</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[#2a3b5c]">تاريخ الانضمام</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[#2a3b5c] rounded-tl-lg">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-10 h-10 rounded-full" />
                              <div>
                                <p className="font-medium text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {member.memberType === "Association Member" ? "عضو جمعية" : "موظف / متطوع"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-medium">{member.role}</td>
                          <td className="px-6 py-4">
                            <Badge className={member.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-100" : member.status === "pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                              {member.status === "active" ? "نشط" : member.status === "pending" ? "قيد الانتظار" : "غير نشط"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{member.joinDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedMemberObj({ ...member })}>
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteMemberObj(member.id)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {members.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            لا يوجد أعضاء حالياً.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
              <DialogContent className="max-w-2xl p-6" dir="rtl">
                <DialogHeader><DialogTitle>إضافة عضو جديد</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>الاسم</Label><Input value={newMemberObj.name} onChange={(e) => setNewMemberObj({ ...newMemberObj, name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input value={newMemberObj.email} onChange={(e) => setNewMemberObj({ ...newMemberObj, email: e.target.value })} /></div>
                  <div className="space-y-2"><Label>رقم الهاتف</Label><Input value={newMemberObj.phone} onChange={(e) => setNewMemberObj({ ...newMemberObj, phone: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>النوع</Label>
                    <Select value={newMemberObj.memberType} onValueChange={(v) => setNewMemberObj({ ...newMemberObj, memberType: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Association Member">عضو جمعية</SelectItem><SelectItem value="Staff">موظف / متطوع</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الدور</Label>
                    <Select dir="rtl" value={newMemberObj.role} onValueChange={(v) => setNewMemberObj({ ...newMemberObj, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="President">الرئيس (President)</SelectItem>
                        <SelectItem value="Treasurer">أمين الصندوق (Treasurer)</SelectItem>
                        <SelectItem value="Secretary">الكاتب العام (Secretary)</SelectItem>
                        <SelectItem value="Staff">متطوع / موظف (Staff)</SelectItem>
                        <SelectItem value="Custom">دور مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الحالة</Label>
                    <Select value={newMemberObj.status} onValueChange={(v) => setNewMemberObj({ ...newMemberObj, status: v as "active" | "inactive" | "pending" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="active">نشط / معتمد</SelectItem><SelectItem value="pending">قيد الانتظار</SelectItem><SelectItem value="inactive">غير نشط / مرفوض</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2"><Label>نبذة (Bio)</Label><Textarea value={newMemberObj.bio} onChange={(e) => setNewMemberObj({ ...newMemberObj, bio: e.target.value })} /></div>
                </div>
                <div className="flex justify-end gap-2 mt-4"><Button variant="outline" onClick={() => setShowAddMemberModal(false)}>إلغاء</Button><Button onClick={handleAddMemberObj}>إضافة</Button></div>
              </DialogContent>
            </Dialog>

            <Dialog open={!!selectedMemberObj} onOpenChange={(open) => !open && setSelectedMemberObj(null)}>
              <DialogContent className="max-w-2xl p-6" dir="rtl">
                <DialogHeader><DialogTitle>تعديل بيانات العضو</DialogTitle></DialogHeader>
                {selectedMemberObj && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>الاسم</Label><Input value={selectedMemberObj.name} onChange={(e) => setSelectedMemberObj({ ...selectedMemberObj, name: e.target.value })} /></div>
                    <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input value={selectedMemberObj.email} onChange={(e) => setSelectedMemberObj({ ...selectedMemberObj, email: e.target.value })} /></div>
                    <div className="space-y-2"><Label>رقم الهاتف</Label><Input value={selectedMemberObj.phone} onChange={(e) => setSelectedMemberObj({ ...selectedMemberObj, phone: e.target.value })} /></div>
                    <div className="space-y-2">
                      <Label>النوع</Label>
                      <Select value={selectedMemberObj.memberType} onValueChange={(v) => setSelectedMemberObj({ ...selectedMemberObj, memberType: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Association Member">عضو جمعية</SelectItem><SelectItem value="Staff">موظف / متطوع</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>الدور</Label>
                      <Select value={selectedMemberObj.role} onValueChange={(v) => setSelectedMemberObj({ ...selectedMemberObj, role: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="President">الرئيس (President)</SelectItem>
                          <SelectItem value="Treasurer">أمين الصندوق (Treasurer)</SelectItem>
                          <SelectItem value="Secretary">الكاتب العام (Secretary)</SelectItem>
                          <SelectItem value="Staff">متطوع / موظف (Staff)</SelectItem>
                          <SelectItem value="Custom">دور مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>الحالة</Label>
                      <Select value={selectedMemberObj.status} onValueChange={(v) => setSelectedMemberObj({ ...selectedMemberObj, status: v as "active" | "inactive" | "pending" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="active">نشط / معتمد</SelectItem><SelectItem value="pending">قيد الانتظار</SelectItem><SelectItem value="inactive">غير نشط / مرفوض</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2"><Label>نبذة (Bio)</Label><Textarea value={selectedMemberObj.bio} onChange={(e) => setSelectedMemberObj({ ...selectedMemberObj, bio: e.target.value })} /></div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4"><Button variant="outline" onClick={() => setSelectedMemberObj(null)}>إلغاء</Button><Button onClick={handleEditMemberObj}>حفظ التغييرات</Button></div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        */
        }




        {/* Add Admin Modal */}
        <Dialog open={showAddAdminModal} onOpenChange={setShowAddAdminModal}>
          <DialogContent className="max-w-md p-6" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مدير جديد</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <Input
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
                <Input
                  value={newAdminData.username}
                  onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                  placeholder="اسم المستخدم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  placeholder="البريد الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                <Input
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  placeholder="كلمة المرور"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدور الإداري</label>
                <select
                  value={newAdminData.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    const defaultPerms = role === "Custom" ? [] : (rolePermissions[role as keyof typeof rolePermissions] || []);
                    setNewAdminData({ ...newAdminData, role, permissions: defaultPerms });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Viewer">مشاهد</option>
                  <option value="Moderator">مشرف</option>
                  <option value="Content Manager">مدير محتوى</option>
                  <option value="Super Admin">مدير عام</option>
                  <option value="Custom">مخصص</option>
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
                          newAdminData.permissions.includes(permission.id) ||
                          newAdminData.permissions.includes("all")
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAdminData({
                              ...newAdminData,
                              permissions: [...newAdminData.permissions.filter((p) => p !== "all"), permission.id],
                            })
                          } else {
                            setNewAdminData({
                              ...newAdminData,
                              permissions: newAdminData.permissions.filter((p) => p !== permission.id),
                            })
                          }
                        }}
                        disabled={newAdminData.role !== "Custom"}
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
                  if (newAdminData.name && newAdminData.email && newAdminData.password && newAdminData.username) {
                    const newAdmin = {
                      id: adminTeam.length + 1,
                      name: newAdminData.name,
                      email: newAdminData.email,
                      username: newAdminData.username,
                      role: newAdminData.role,
                      permissions:
                        newAdminData.permissions.length > 0
                          ? newAdminData.permissions
                          : newAdminData.role === "Custom"
                            ? []
                            : rolePermissions[newAdminData.role as keyof typeof rolePermissions] || [],
                      joinDate: new Date().toLocaleDateString("ar-SA"),
                      lastActive: "الآن",
                    }
                    setAdminTeam([...adminTeam, newAdmin])
                    setShowAddAdminModal(false)
                    setNewAdminData({ name: "", username: "", email: "", password: "", role: "Viewer", permissions: [] })
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
          </DialogContent>
        </Dialog>

        {/* Edit Permissions Modal */}
        <Dialog open={showEditPermissionsModal && !!selectedAdmin} onOpenChange={setShowEditPermissionsModal}>
          {selectedAdmin && (
            <DialogContent className="max-w-md p-6" dir="rtl">
              <DialogHeader>
                <DialogTitle>تعديل صلاحيات {selectedAdmin.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الدور الإداري</label>
                  <select
                    value={selectedAdmin.role}
                    onChange={(e) => {
                      const role = e.target.value;
                      const defaultPerms = role === "Custom" ? selectedAdmin.permissions : (rolePermissions[role as keyof typeof rolePermissions] || []);
                      setSelectedAdmin({ ...selectedAdmin, role, permissions: defaultPerms });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Viewer">مشاهد</option>
                    <option value="Moderator">مشرف</option>
                    <option value="Content Manager">مدير محتوى</option>
                    <option value="Super Admin">مدير عام</option>
                    <option value="Custom">مخصص</option>
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
                                permissions: [...selectedAdmin.permissions.filter((p: string) => p !== "all"), permission.id],
                              })
                            } else {
                              setSelectedAdmin({
                                ...selectedAdmin,
                                permissions: selectedAdmin.permissions.filter((p: string) => p !== permission.id),
                              })
                            }
                          }}
                          disabled={selectedAdmin.role !== "Custom"}
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
                  className=" flex-1 bg-primary hover:bg-primary/90"
                >
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setShowEditPermissionsModal(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {activeSection !== "dashboard" &&
          activeSection !== "activities" &&
          activeSection !== "messages" &&
          activeSection !== "memberships" &&
          activeSection !== "news" &&
          activeSection !== "members" &&
          activeSection !== "permissions" && (
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
    </div >
  )
}
