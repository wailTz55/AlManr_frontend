// app/admin/actions.ts - Server actions for admin dashboard
"use server"

import { adminLogout, getAdminSession } from "@/services/AdminAuthService"
import { redirect } from "next/navigation"

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

// Helper to get session or throw
async function getRequiredAdminSession() {
    const session = await getAdminSession()
    if (!session) throw new Error("Unauthorized: Admin session required")
    return session
}

// ============================================================
// Activity Actions
// ============================================================
export async function addActivityAction(data: CreateActivityDTO) {
    const session = await getRequiredAdminSession()
    return createActivity(data, session.adminId)
}

export async function editActivityAction(id: string, data: UpdateActivityDTO) {
    const session = await getRequiredAdminSession()
    return updateActivity(id, data, session.adminId)
}

export async function removeActivityAction(id: string) {
    const session = await getRequiredAdminSession()
    return deleteActivity(id, session.adminId)
}

// ============================================================
// News Actions
// ============================================================
export async function addNewsAction(data: CreateNewsDTO) {
    const session = await getRequiredAdminSession()
    return createNews(data, session.adminId)
}

export async function editNewsAction(id: string, data: UpdateNewsDTO) {
    const session = await getRequiredAdminSession()
    return updateNews(id, data, session.adminId)
}

export async function removeNewsAction(id: string) {
    const session = await getRequiredAdminSession()
    return deleteNews(id, session.adminId)
}

// ============================================================
// Association Actions
// ============================================================
export async function approveAssociationAction(id: string) {
    const session = await getRequiredAdminSession()
    return approveAssociation(id, session.adminId)
}

export async function rejectAssociationAction(id: string, reason?: string) {
    const session = await getRequiredAdminSession()
    return rejectAssociation(id, session.adminId, reason)
}

export async function undoRejectAssociationAction(id: string) {
    const session = await getRequiredAdminSession()
    return undoRejectAssociation(id, session.adminId)
}

export async function deleteAssociationAction(id: string) {
    const session = await getRequiredAdminSession()
    return deleteAssociation(id, session.adminId)
}
