import { NextResponse } from "next/server";

// Paths accessible without auth
const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback", "/api/auth"];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname === p
  );

  // Supabase SSR stores session in cookies named sb-<ref>-auth-token or similar.
  // We also keep checking our own "token" cookie for compatibility.
  const hasToken =
    request.cookies.get("token")?.value ||
    [...request.cookies.getAll()].some(
      (c) => c.name.startsWith("sb-") && c.name.includes("auth-token")
    );

  // Redirect unauthenticated users away from protected routes
  if (!isPublic && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from login/signup
  if (hasToken && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
