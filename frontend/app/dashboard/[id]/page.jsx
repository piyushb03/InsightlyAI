import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { flaskFetch, getAuthHeaders } from "@/lib/api";
import DashboardGrid from "@/components/DashboardGrid";

async function getDashboard(id, token) {
  const res = await flaskFetch(`/api/dashboards/${id}`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) return null;
  return res.json();
}

async function getInsight(uploadId, token) {
  try {
    const res = await flaskFetch(`/api/insights/${uploadId}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getForecast(uploadId, token) {
  try {
    const res = await flaskFetch(`/api/forecast/${uploadId}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardDetailPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  const dashboard = await getDashboard(id, token);
  if (!dashboard) notFound();

  const uploadId = dashboard.upload_id;
  const [insight, forecast] = await Promise.all([
    getInsight(uploadId, token),
    getForecast(uploadId, token),
  ]);

  return (
    <DashboardGrid
      dashboard={dashboard}
      insight={insight}
      forecast={forecast}
    />
  );
}
