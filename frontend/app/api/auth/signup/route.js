// This route is no longer used.
// Auth is handled by Server Actions in app/actions/auth.js

export async function POST() {
  return new Response(JSON.stringify({ deprecated: true }), { status: 410 });
}
