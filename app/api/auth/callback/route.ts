import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = getSupabaseServerClient()

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}

