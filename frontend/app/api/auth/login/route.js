import { NextResponse } from "next/server";
import { flaskFetch } from "@/lib/api";

export async function POST(request) {
  const body = await request.json();
  const res = await flaskFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const response = NextResponse.json(data);
  response.cookies.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
