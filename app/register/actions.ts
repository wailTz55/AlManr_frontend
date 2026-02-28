"use server"

import { associationRegister, associationLogin, associationLogout } from "@/services/AuthService"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Server action: Register a new association.
 * Calls AuthService.associationRegister which:
 *   1. Creates a Supabase Auth user
 *   2. Inserts a row into `associations` table with status = "pending"
 */
export async function registerAssociationAction(formData: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
    city?: string
    wilaya?: string
    registration_number?: string
    description?: string
}) {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? undefined

    return associationRegister(formData, ip)
}

/**
 * Server action: Login an association.
 * Uses Supabase Auth signInWithPassword.
 */
export async function loginAssociationAction(formData: {
    email: string
    password: string
}) {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? undefined

    return associationLogin(formData, ip)
}

/**
 * Server action: Logout association.
 */
export async function logoutAssociationAction() {
    await associationLogout()
    redirect("/register")
}
