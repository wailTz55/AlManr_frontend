// app/admin/actions.ts - Server actions for admin dashboard
"use server"

import { adminLogout } from "@/services/AdminAuthService"
import { redirect } from "next/navigation"

export async function logoutAction() {
    await adminLogout()
    redirect("/admin/login")
}
