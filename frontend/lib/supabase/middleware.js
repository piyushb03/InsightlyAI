/**
 * lib/supabase/middleware.js
 * Supabase client for Next.js middleware — refreshes the session on every request.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — MUST be called before route protection checks
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  
  // Public routes that don't need auth
  const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback", "/api/health"];
  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));

  // Auth pages (login/signup)
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Redirect unauthenticated users away from everything else
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
