"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, ArrowRight, Search, SortDesc, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardList({ dashboards }) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' or 'asc'

  const filtered = dashboards
    .filter((d) => 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.upload?.filename?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-card p-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Search dashboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-sm h-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="border-white/10 bg-white/5 text-xs flex-1 sm:flex-none"
          >
            {sortOrder === "desc" ? <SortDesc className="h-4 w-4 mr-2" /> : <SortAsc className="h-4 w-4 mr-2" />}
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
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
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card border-dashed">
          <p className="text-sm text-white/40">No dashboards match your search.</p>
        </div>
      )}
    </div>
  );
}
