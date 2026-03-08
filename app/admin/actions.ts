// app/admin/actions.ts — Server actions for admin dashboard
"use server"

import { adminLogout, verifyAdminAction, revokeAdminSessions } from "@/services/AdminAuthService"
import { redirect } from "next/navigation"
import { updateRegistrationStatus } from "@/services/RegistrationService"
import { createActivity, updateActivity, deleteActivity } from "@/services/ActivityService"
import { createNews, updateNews, deleteNews } from "@/services/NewsService"
import { approveAssociation, deleteAssociation, rejectAssociation, undoRejectAssociation } from "@/services/AdminService"
import type { CreateActivityDTO, UpdateActivityDTO, CreateNewsDTO, UpdateNewsDTO } from "@/types/dto"

// ============================================================
// Auth Actions
// ============================================================
export async function logoutAction() {
    await adminLogout()
    redirect("/admin/login")
}

/**
 * Emergency action — invalidates ALL active sessions for the admin user.
 * Call this if the admin account is suspected to be compromised.
 */
export async function revokeAllSessionsAction() {
    await verifyAdminAction() // Must be called from a valid admin session
    const result = await revokeAdminSessions()
    if (result.success) {
        redirect("/admin/login")
    }
    return result
}

// ============================================================
// Activity Actions
// ============================================================
export async function addActivityAction(data: CreateActivityDTO) {
    await verifyAdminAction()
    return createActivity(data)
}

export async function editActivityAction(id: string, data: UpdateActivityDTO) {
    await verifyAdminAction()
    return updateActivity(id, data)
}

export async function removeActivityAction(id: string) {
    await verifyAdminAction()
    return deleteActivity(id)
}

// ============================================================
// News Actions
// ============================================================
export async function addNewsAction(data: CreateNewsDTO) {
    await verifyAdminAction()
    return createNews(data)
}

export async function editNewsAction(id: string, data: UpdateNewsDTO) {
    await verifyAdminAction()
    return updateNews(id, data)
}

export async function removeNewsAction(id: string) {
    await verifyAdminAction()
    return deleteNews(id)
}

// ============================================================
// Association Actions
// ============================================================
export async function approveAssociationAction(id: string) {
    await verifyAdminAction()
    return approveAssociation(id)
}

export async function rejectAssociationAction(id: string, reason?: string) {
    await verifyAdminAction()
    return rejectAssociation(id, reason)
}

export async function undoRejectAssociationAction(id: string) {
    await verifyAdminAction()
    return undoRejectAssociation(id)
}

export async function deleteAssociationAction(id: string) {
    await verifyAdminAction()
    return deleteAssociation(id)
}

// ============================================================
// Registration Status Actions (activity registrations)
// ============================================================

export async function updateRegistrationStatusAction(
    id: string,
    status: "pending" | "approved" | "rejected",
    rejection_reason?: string
) {
    await verifyAdminAction()
    return updateRegistrationStatus({ id, status, rejection_reason })
}

// ============================================================
// Contact / Message Actions
// ============================================================
import { ContactService } from "@/services/ContactService"

export async function getMessagesAction() {
    await verifyAdminAction()
    return ContactService.getAllContactMessages()
}

export async function replyMessageAction(id: string, replyText: string) {
    await verifyAdminAction()
    return ContactService.replyToContactMessage(id, replyText)
}

export async function markMessageReadAction(id: string) {
    await verifyAdminAction()
    return ContactService.markMessageRead(id)
}

export async function deleteMessageAction(id: string) {
    await verifyAdminAction()
    return ContactService.deleteContactMessage(id)
}
