import { flaskFetch } from "@/lib/api";

export async function GET() {
  try {
    const res = await flaskFetch("/health");
    if (!res.ok) {
      return new Response(JSON.stringify({ status: "error" }), { status: 500 });
    }
    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }
}
