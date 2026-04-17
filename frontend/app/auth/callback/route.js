/**
 * /auth/callback/route.js
 * Handles Supabase email confirmation and magic-link redirects.
 * Supabase redirects here after the user clicks the confirmation email.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" param lets you redirect to a specific page after auth
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — redirect to login with error message
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
