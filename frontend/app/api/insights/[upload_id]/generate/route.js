import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const FLASK_URL = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function POST(_request, { params }) {
  const { upload_id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

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
