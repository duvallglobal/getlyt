import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { resend, emailTemplates } from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const supabase = getSupabaseServerClient()

    // Handle order creation event
    if (payload.type === "order.created") {
      const { order } = payload

      // Get user details
      let userName = "Customer"
      if (order.user_id) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("first_name, last_name")
          .eq("id", order.user_id)
          .single()

        if (profile && profile.first_name) {
          userName = profile.first_name
        }
      }

      // Send order confirmation email
      await resend.emails.send({
        from: "LTY <noreply@yourdomain.com>",
        to: order.email,
        subject: emailTemplates.orderConfirmation(userName, order.order_number, order.total).subject,
        html: emailTemplates.orderConfirmation(userName, order.order_number, order.total).html,
      })
    }

    // Handle order shipping event
    if (payload.type === "order.shipped") {
      const { order, tracking } = payload

      // Get user details
      let userName = "Customer"
      if (order.user_id) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("first_name, last_name")
          .eq("id", order.user_id)
          .single()

        if (profile && profile.first_name) {
          userName = profile.first_name
        }
      }

      // Send shipping update email
      await resend.emails.send({
        from: "LTY <noreply@yourdomain.com>",
        to: order.email,
        subject: emailTemplates.shippingUpdate(userName, order.order_number, tracking.number, tracking.url).subject,
        html: emailTemplates.shippingUpdate(userName, order.order_number, tracking.number, tracking.url).html,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

