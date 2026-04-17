"use client";

import { useTransition } from "react";
import { FileText, Calendar, Trash2, Loader2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteUpload } from "@/app/actions/workspace";
import { toast } from "sonner";

export default function UploadTable({ uploads }) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id, filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"? This will also remove all associated dashboards and insights.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteUpload(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${filename}" has been deleted.`);
      }
    });
  }

  if (uploads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center glass-card border-dashed">
        <Database className="h-12 w-12 text-white/10 mb-4" />
        <h3 className="text-lg font-medium">No datasets found</h3>
        <p className="text-sm text-white/40 max-w-xs mt-1">
          Once you upload your first file, it will appear here for management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 font-semibold text-white/60">Dataset</th>
                <th className="px-6 py-4 font-semibold text-white/60">Status</th>
                <th className="px-6 py-4 font-semibold text-white/60">Rows</th>
                <th className="px-6 py-4 font-semibold text-white/60">Uploaded</th>
                <th className="px-6 py-4 font-semibold text-white/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {uploads.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                        <FileText className="h-4 w-4 text-white/40" />
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{u.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-6 py-4 font-mono text-white/40">
                    {u.row_count?.toLocaleString() ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(u.id, u.filename)}
                      disabled={isPending}
                      className="h-8 w-8 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {uploads.map((u) => (
          <div key={u.id} className="glass-card p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                  <FileText className="h-4 w-4 text-white/40" />
                </div>
                <div>
                  <h4 className="font-medium text-sm truncate max-w-[180px]">{u.filename}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={u.status} />
                    <span className="text-[10px] text-white/20 font-mono">
                      {u.row_count?.toLocaleString() ?? 0} rows
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(u.id, u.filename)}
                disabled={isPending}
                className="h-8 w-8 text-white/20 hover:text-red-400 hover:bg-red-400/10"
              >
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              </Button>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] text-white/30">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(u.created_at).toLocaleDateString()}
              </span>
              <span className="truncate max-w-[150px]">ID: {u.id.split("-")[0]}...</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <Badge 
      variant="outline" 
      className={
        status === "ready" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0" :
        status === "pending" ? "border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0" :
        "border-red-500/30 bg-red-500/10 text-red-400 text-[10px] px-1.5 py-0"
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
