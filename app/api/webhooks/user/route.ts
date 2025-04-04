import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { resend, emailTemplates } from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const supabase = getSupabaseServerClient()

    // Handle user creation event
    if (payload.type === "user.created") {
      const { user } = payload

      // Send welcome email
      if (user.email) {
        const firstName = user.user_metadata?.first_name || "there"

        await resend.emails.send({
          from: "LTY <noreply@yourdomain.com>",
          to: user.email,
          subject: emailTemplates.welcome(firstName).subject,
          html: emailTemplates.welcome(firstName).html,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

