// This route is no longer used.
// Logout is handled by the logout() Server Action in app/actions/auth.js

export async function POST() {
  return new Response(JSON.stringify({ deprecated: true }), { status: 410 });
}
