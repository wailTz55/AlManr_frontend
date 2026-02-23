// types.ts

// Activity template types
export type ActivityTemplate =
  | "announcement"                    // إعلان فقط
  | "announcement_reg"                // إعلان + تسجيل جمعيات
  | "announcement_reg_participants"   // إعلان + تسجيل جمعيات + مشاركين
  | "special"                         // نشاط خاص (بطولة، مسابقة...)

// النشاطات
export interface Activity {
  id: number
  title: string
  date: string
  location: string
  participants: number
  duration?: string            // (اختياري لأنه عندك blank=True في Django)
  status: string
  images?: string[]            // JSONField => array of strings
  videos?: string[]            // JSONField => array of strings
  description: string
  achievements?: string[]      // JSONField => array of strings
  highlights?: string[]        // JSONField => array of strings
  // --- New activity template fields ---
  activityTemplate?: ActivityTemplate
  allowAssociationRegistration?: boolean
  allowParticipantRegistration?: boolean
  categories?: string[]        // e.g. ["U12", "U16", "Senior"] for special activities
}

// تسجيل الجمعيات في الأنشطة
export interface ActivityRegistration {
  id: string
  activityId: number
  associationId: string
  associationName: string
  associationEmail: string
  associationPhone: string
  status: "pending" | "approved" | "rejected"
  registrationDate: string
  notes?: string
  participants?: ActivityParticipant[]
}

// مشاركون في النشاط (تابعون لجمعية مسجلة)
export interface ActivityParticipant {
  id: string
  registrationId: string
  name: string
  age: number
  category?: string   // e.g. "U12", "U16", "Senior"
}

// الأخبار
export interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  time: string;
  author: string;
  category: string;
  type: string;
  icon: string; // استعمل string إذا من API يرجع اسم أيقونة
  color: string;
  bgColor: string;
  image: string;
  views: number;
  likes: number;
  featured: boolean;
}

// الأعضاء
export interface Member {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  achievements?: string[];
  type?: string;
  memberType?: "association" | "staff" | string;
  status?: "approved" | "pending" | "rejected" | "active" | "inactive";
  color?: string;
  icon?: string;
}

// الرد الكامل من API
export interface AllDataResponse {
  activities: Activity[];
  news: News[];
  members: Member[];
}
