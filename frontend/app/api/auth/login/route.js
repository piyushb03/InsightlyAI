// This route is no longer used.
// Auth is handled by Server Actions in app/actions/auth.js
// and the Supabase SSR clients in lib/supabase/

export async function POST() {
  return new Response(JSON.stringify({ deprecated: true }), { status: 410 });
}
