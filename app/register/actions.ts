"use server"

import { associationRegister, associationLogin, associationLogout, getAssociationSession } from "@/services/AuthService"
import { redirect } from "next/navigation"

import { getServiceRoleClient } from "@/lib/supabase/admin"
import { getRecentRegistrations } from "@/services/RegistrationService"

/**
 * Server action: Register a new association.
 * Calls AuthService.associationRegister which:
 *   1. Creates a Supabase Auth user
 *   2. Inserts a row into `associations` table with status = "pending"
 */
export async function registerAssociationAction(formData: FormData) {
    // Extract file
    const file = formData.get("officeApproval") as File | null;
    let office_approval_url = "";

    if (!file || file.size === 0) {
        return { success: false, error: "ملف الاعتماد مطلوب" };
    }

    if (file.type !== "application/pdf") {
        return { success: false, error: "يجب أن يكون الملف بصيغة PDF فقط" };
    }

    // Upload file to Supabase Admin Client
    const adminDb = getServiceRoleClient();
    const fileExt = file.name.split('.').pop() || 'pdf';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `approvals/${fileName}`;

    const { error: uploadError } = await adminDb.storage
        .from("office-approvals")
        .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error("File upload error:", uploadError);
        return { success: false, error: "فشل في رفع ملف الاعتماد" };
    }

    const { data: { publicUrl } } = adminDb.storage
        .from("office-approvals")
        .getPublicUrl(filePath);

    office_approval_url = publicUrl;

    const authData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone: formData.get("phone") as string,
        city: formData.get("city") as string,
        wilaya: formData.get("wilaya") as string,
        description: formData.get("description") as string,
        institution_name: formData.get("institution_name") as string,
        president_name: formData.get("president_name") as string,
        president_phone: formData.get("president_phone") as string,
        secretary_name: formData.get("secretary_name") as string,
        secretary_phone: formData.get("secretary_phone") as string,
        clerk_name: formData.get("clerk_name") as string,
        clerk_phone: formData.get("clerk_phone") as string,
        office_approval_url
    };

    return associationRegister(authData)
}

/**
 * Server action: Login an association.
 * Uses Supabase Auth signInWithPassword.
 */
export async function loginAssociationAction(formData: {
    email: string
    password: string
}) {
    return associationLogin(formData)
}

/**
 * Server action: Logout association.
 */
export async function logoutAssociationAction() {
    await associationLogout()
    redirect("/register")
}

/**
 * Server action: Get the 5 most recent activity registrations for the logged-in association.
 * Used by the mini-dashboard on the /register page.
 */
export async function getRecentRegistrationsAction() {
    const session = await getAssociationSession()
    if (!session) return []
    try {
        return await getRecentRegistrations(session.associationId)
    } catch {
        return []
    }
}
