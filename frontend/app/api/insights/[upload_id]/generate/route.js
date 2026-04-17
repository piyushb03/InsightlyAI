import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FLASK_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(_request, { params }) {
  const { upload_id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";

  const res = await fetch(`${FLASK_URL}/api/insights/${upload_id}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
