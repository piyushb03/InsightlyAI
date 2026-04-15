import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const FLASK_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  let res;
  try {
    const formData = await request.formData();
    
    res = await fetch(`${FLASK_URL}/api/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Could not reach backend: ${msg}. Is Flask running on port 8000?` },
      { status: 503 }
    );
  }

  let data;
  let responseText = "";
  try {
    responseText = await res.text();
    data = JSON.parse(responseText);
  } catch (err) {
    return NextResponse.json(
      { error: `Backend returned unexpected response: ${responseText.slice(0, 200)}` },
      { status: res.status }
    );
  }
  
  return NextResponse.json(data, { status: res.status });
}
