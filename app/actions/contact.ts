"use server"

import { ContactService } from "@/services/ContactService"

export async function createContactMessageAction(data: {
    name: string
    email?: string
    phone: string
    subject: string
    message: string
    contactReason: string
}) {
    return ContactService.createContactMessage(data)
}
