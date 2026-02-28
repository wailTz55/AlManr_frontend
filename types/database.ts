export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            activities: {
                Row: {
                    achievements: string[] | null
                    allow_association_registration: boolean
                    allow_participant_registration: boolean
                    categories: string[] | null
                    created_at: string
                    created_by: string | null
                    date: string
                    description: string | null
                    duration: string | null
                    end_date: string | null
                    highlights: string[] | null
                    id: string
                    images: string[] | null
                    location: string | null
                    max_associations: number | null
                    max_participants: number | null
                    status: string
                    template: Database["public"]["Enums"]["activity_template"]
                    title: string
                    updated_at: string
                    videos: string[] | null
                    wilaya: string | null
                }
                Insert: {
                    achievements?: string[] | null
                    allow_association_registration?: boolean
                    allow_participant_registration?: boolean
                    categories?: string[] | null
                    created_at?: string
                    created_by?: string | null
                    date: string
                    description?: string | null
                    duration?: string | null
                    end_date?: string | null
                    highlights?: string[] | null
                    id?: string
                    images?: string[] | null
                    location?: string | null
                    max_associations?: number | null
                    max_participants?: number | null
                    status?: string
                    template?: Database["public"]["Enums"]["activity_template"]
                    title: string
                    updated_at?: string
                    videos?: string[] | null
                    wilaya?: string | null
                }
                Update: Partial<Database["public"]["Tables"]["activities"]["Insert"]>
                Relationships: []
            }
            activity_participants: {
                Row: {
                    age: number | null
                    category: string | null
                    created_at: string
                    id: string
                    name: string
                    notes: string | null
                    registration_id: string
                }
                Insert: {
                    age?: number | null
                    category?: string | null
                    created_at?: string
                    id?: string
                    name: string
                    notes?: string | null
                    registration_id: string
                }
                Update: Partial<Database["public"]["Tables"]["activity_participants"]["Insert"]>
                Relationships: []
            }
            activity_registrations: {
                Row: {
                    activity_id: string
                    association_id: string
                    created_at: string
                    id: string
                    notes: string | null
                    rejection_reason: string | null
                    reviewed_at: string | null
                    reviewed_by: string | null
                    status: Database["public"]["Enums"]["registration_status"]
                    updated_at: string
                }
                Insert: {
                    activity_id: string
                    association_id: string
                    created_at?: string
                    id?: string
                    notes?: string | null
                    rejection_reason?: string | null
                    reviewed_at?: string | null
                    reviewed_by?: string | null
                    status?: Database["public"]["Enums"]["registration_status"]
                    updated_at?: string
                }
                Update: Partial<Database["public"]["Tables"]["activity_registrations"]["Insert"]>
                Relationships: []
            }
            admin_sessions: {
                Row: {
                    admin_id: string
                    created_at: string
                    expires_at: string
                    id: string
                    ip_address: unknown
                    revoked_at: string | null
                    session_token: string
                    user_agent: string | null
                }
                Insert: {
                    admin_id: string
                    created_at?: string
                    expires_at?: string
                    id?: string
                    ip_address?: unknown
                    revoked_at?: string | null
                    session_token?: string
                    user_agent?: string | null
                }
                Update: Partial<Database["public"]["Tables"]["admin_sessions"]["Insert"]>
                Relationships: []
            }
            admins: {
                Row: {
                    created_at: string
                    email: string
                    id: string
                    is_active: boolean
                    last_login_at: string | null
                    locked_until: string | null
                    login_attempts: number
                    name: string | null
                    password_hash: string
                    role: Database["public"]["Enums"]["user_role"]
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    email: string
                    id?: string
                    is_active?: boolean
                    last_login_at?: string | null
                    locked_until?: string | null
                    login_attempts?: number
                    name?: string | null
                    password_hash: string
                    role?: Database["public"]["Enums"]["user_role"]
                    updated_at?: string
                }
                Update: Partial<Database["public"]["Tables"]["admins"]["Insert"]>
                Relationships: []
            }
            associations: {
                Row: {
                    address: string | null
                    approved_at: string | null
                    approved_by: string | null
                    city: string | null
                    created_at: string
                    description: string | null
                    email: string
                    id: string
                    logo_url: string | null
                    name: string
                    phone: string | null
                    registration_number: string | null
                    rejection_reason: string | null
                    status: Database["public"]["Enums"]["association_status"]
                    updated_at: string
                    user_id: string | null
                    wilaya: string | null
                }
                Insert: {
                    address?: string | null
                    approved_at?: string | null
                    approved_by?: string | null
                    city?: string | null
                    created_at?: string
                    description?: string | null
                    email: string
                    id?: string
                    logo_url?: string | null
                    name: string
                    phone?: string | null
                    registration_number?: string | null
                    rejection_reason?: string | null
                    status?: Database["public"]["Enums"]["association_status"]
                    updated_at?: string
                    user_id?: string | null
                    wilaya?: string | null
                }
                Update: Partial<Database["public"]["Tables"]["associations"]["Insert"]>
                Relationships: []
            }
            audit_logs: {
                Row: {
                    action: string
                    admin_id: string | null
                    created_at: string
                    entity_id: string | null
                    entity_type: string
                    id: string
                    ip_address: unknown
                    metadata: Json | null
                    user_agent: string | null
                }
                Insert: {
                    action: string
                    admin_id?: string | null
                    created_at?: string
                    entity_id?: string | null
                    entity_type: string
                    id?: string
                    ip_address?: unknown
                    metadata?: Json | null
                    user_agent?: string | null
                }
                Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>
                Relationships: []
            }
            news: {
                Row: {
                    author: string
                    bg_color: string | null
                    category: string | null
                    color: string | null
                    content: string
                    created_at: string
                    created_by: string | null
                    excerpt: string | null
                    featured: boolean
                    icon: string | null
                    id: string
                    image: string | null
                    likes: number
                    published_at: string | null
                    title: string
                    type: string | null
                    updated_at: string
                    views: number
                }
                Insert: {
                    author?: string
                    bg_color?: string | null
                    category?: string | null
                    color?: string | null
                    content: string
                    created_at?: string
                    created_by?: string | null
                    excerpt?: string | null
                    featured?: boolean
                    icon?: string | null
                    id?: string
                    image?: string | null
                    likes?: number
                    published_at?: string | null
                    title: string
                    type?: string | null
                    updated_at?: string
                    views?: number
                }
                Update: Partial<Database["public"]["Tables"]["news"]["Insert"]>
                Relationships: []
            }
            rate_limits: {
                Row: {
                    created_at: string
                    hits: number
                    id: string
                    key: string
                    window_start: string
                }
                Insert: {
                    created_at?: string
                    hits?: number
                    id?: string
                    key: string
                    window_start?: string
                }
                Update: Partial<Database["public"]["Tables"]["rate_limits"]["Insert"]>
                Relationships: []
            }
        }
        Views: { [_ in never]: never }
        Functions: {
            get_association_id: { Args: never; Returns: string }
        }
        Enums: {
            activity_template:
            | "announcement"
            | "announcement_reg"
            | "announcement_reg_participants"
            | "special"
            association_status: "pending" | "approved" | "rejected" | "suspended"
            registration_status: "pending" | "approved" | "rejected" | "cancelled"
            user_role: "admin" | "super_admin" | "association"
        }
        CompositeTypes: { [_ in never]: never }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
    DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
    DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
    DefaultSchema["Tables"][T]["Update"]

export type Enums<T extends keyof DefaultSchema["Enums"]> =
    DefaultSchema["Enums"][T]
