/**
 * scripts/seed-admin.mjs
 * ─────────────────────────────────────────────────────────────
 * One-time script to create the admin user in Supabase Auth.
 *
 * USAGE:
 *   node scripts/seed-admin.mjs <email> <password>
 *
 * EXAMPLE:
 *   node scripts/seed-admin.mjs admin@example.com MySecretPass123!
 *
 * After running this script:
 *   1. Set ADMIN_EMAIL=<email> in .env.local
 *   2. Restart the dev server  (npm run dev)
 *   3. Log in at http://localhost:3000/admin/login
 * ─────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"

// ── Load .env.local manually (no dotenv dependency needed) ────
function loadEnv() {
    const envPath = resolve(process.cwd(), ".env.local")
    const lines = readFileSync(envPath, "utf-8").split("\n")
    const env = {}
    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) continue
        const [key, ...rest] = trimmed.split("=")
        env[key.trim()] = rest.join("=").trim()
    }
    return env
}

// ── Main ──────────────────────────────────────────────────────
const [, , email, password] = process.argv

if (!email || !password) {
    console.error("❌  Usage: node scripts/seed-admin.mjs <email> <password>")
    process.exit(1)
}

const env = loadEnv()
const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"]
const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"]

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
})

console.log(`\n🔧  Creating Supabase Auth user for: ${email}`)

const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,   // auto-confirm email, no verification needed locally
})

if (error) {
    if (error.message.includes("already been registered")) {
        console.log("⚠️   User already exists in Supabase Auth.")
        console.log("     If you forgot the password, run this script again to recreate it.")
        // Try to update password instead
        const { data: users } = await supabase.auth.admin.listUsers()
        const existing = users?.users?.find(u => u.email === email)
        if (existing) {
            const { error: updateErr } = await supabase.auth.admin.updateUserById(existing.id, { password })
            if (updateErr) {
                console.error("❌  Failed to update password:", updateErr.message)
                process.exit(1)
            }
            console.log("✅  Password updated successfully.")
        }
    } else {
        console.error("❌  Error creating user:", error.message)
        process.exit(1)
    }
} else {
    console.log(`✅  Admin user created successfully! (ID: ${data.user.id})`)
}

console.log(`
────────────────────────────────────────────
  Next steps:
  1. Open .env.local and set:
     ADMIN_EMAIL=${email}
  2. Restart dev server: npm run dev
  3. Log in at: http://localhost:3000/admin/login
────────────────────────────────────────────
`)
