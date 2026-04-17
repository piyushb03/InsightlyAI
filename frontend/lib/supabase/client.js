/**
 * lib/supabase/client.js
 * Browser (client component) Supabase client — uses @supabase/ssr.
 * Import this inside "use client" components.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
