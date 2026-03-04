import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const FLASK_URL = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  // Forward raw body + original Content-Type (preserves multipart boundary)
  const contentType = request.headers.get("content-type") ?? "";

  let res;
  try {
    res = await fetch(`${FLASK_URL}/api/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      },
      duplex: "half",
      body: request.body,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Could not reach backend: ${msg}. Is Flask running on port 8000?` },
      { status: 503 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
