import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FLASK_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request, { params }) {
  const { upload_id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";

  const body = await request.text();

  const res = await fetch(`${FLASK_URL}/api/forecast/${upload_id}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body || "{}",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
