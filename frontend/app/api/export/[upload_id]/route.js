import { createClient } from "@/lib/supabase/server";

const FLASK_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function GET(_request, { params }) {
  const { upload_id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";

  const res = await fetch(`${FLASK_URL}/api/export-report/${upload_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "File not found" }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Stream the file response with original headers preserved
  const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";
  const contentDisposition = res.headers.get("Content-Disposition") ?? "";

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  if (contentDisposition) headers.set("Content-Disposition", contentDisposition);

  return new Response(res.body, { status: 200, headers });
}
