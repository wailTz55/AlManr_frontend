"use server"

import { associationRegister, associationLogin, associationLogout } from "@/services/AuthService"
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
    return associationRegister(formData)
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
