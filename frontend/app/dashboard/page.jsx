import Link from "next/link";
import { cookies } from "next/headers";
import { Upload, LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flaskFetch, getAuthHeaders } from "@/lib/api";

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
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((d) => (
            <Link key={d.id} href={`/dashboard/${d.id}`}>
              <div className="glass-card glow-border p-5 hover:bg-white/[0.07] transition-all hover:-translate-y-0.5 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-violet-500/15 ring-1 ring-violet-500/20">
                    <LayoutDashboard className="h-4 w-4 text-violet-400" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate">{d.name}</h3>
                <p className="text-xs text-white/30 truncate">{d.upload?.filename ?? "—"}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-white/25">
                    {d.upload?.row_count?.toLocaleString() ?? "—"} rows
                  </span>
                  <span className="text-xs text-white/25">
                    {new Date(d.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
