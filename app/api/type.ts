// types.ts

// النشاطات
export interface Activity {
  id: number
  title: string
  date: string
  location: string
  participants: number
  duration?: string            // (اختياري لأنه عندك blank=True في Django)
  category: string
  status: string
  images?: string[]            // JSONField => array of strings
  videos?: string[]            // JSONField => array of strings
  description: string
  achievements?: string[]      // JSONField => array of strings
  highlights?: string[]        // JSONField => array of strings
}

// الأخبار
export interface News  {
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
  achievements: string[];
  type: string;
  color: string;
  icon: string;
}

// الرد الكامل من API
export interface AllDataResponse {
  activities: Activity[];
  news: News [];
  members: Member[];
}
