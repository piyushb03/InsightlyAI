import Link from "next/link";
import { Upload, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flaskFetch, getAuthHeaders } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import DashboardList from "./DashboardList";

async function getDashboards(token) {
  try {
    const res = await flaskFetch("/api/dashboards", {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";
  const dashboards = await getDashboards(token);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboards</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your auto-generated sales dashboards
          </p>
        </div>
        <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-500">
          <Link href="/upload">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Upload data
          </Link>
        </Button>
      </div>

      {dashboards.length > 0 ? (
        <DashboardList dashboards={dashboards} />
      ) : (
        <div className="flex flex-col items-center justify-center py-28 text-center glass-card">
          <div className="p-4 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 mb-5">
            <LayoutDashboard className="h-10 w-10 text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold mb-1">No dashboards yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Upload a CSV or Excel file to auto-generate your first dashboard with AI insights.
          </p>
          <Button asChild className="bg-violet-600 hover:bg-violet-500">
            <Link href="/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload your first file
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
