import { cookies } from "next/headers";

const FLASK_URL = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function GET(_request, { params }) {
  const { upload_id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  const res = await fetch(`${FLASK_URL}/api/export/${upload_id}`, {
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
