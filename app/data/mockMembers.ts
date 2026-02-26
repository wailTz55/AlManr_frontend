import { Member } from "../api/type";

export const mockMembers: Member[] = [
    {
        id: 1,
        name: "جمعية الأمل الأخضر",
        role: "شريك مؤسس",
        image: "/placeholder.svg",
        bio: "جمعية تهتم بالبيئة والمساحات الخضراء.",
        memberType: "association",
        status: "active"
    },
    {
        id: 2,
        name: "نادي الإبداع العلمي",
        role: "عضو نشط",
        image: "/placeholder.svg",
        bio: "نادي يجمع الشباب المهتمين بالتكنولوجيا والابتكار.",
        memberType: "association",
        status: "active"
    },
    {
        id: 3,
        name: "فريق الإغاثة التطوعي",
        role: "عضو شرفي",
        image: "/placeholder.svg",
        bio: "فريق متخصص في تقديم الإسعافات والمساعدات الإنسانية.",
        memberType: "association",
        status: "active"
    }
];
