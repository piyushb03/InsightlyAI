import { getUploads } from "@/app/actions/workspace";
import UploadTable from "./UploadTable";
import { Button } from "@/components/ui/button";
import { Upload, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function WorkspacePage() {
  const uploads = await getUploads();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
          <p className="text-muted-foreground mt-1">
            Manage your datasets and monitor their processing status.
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/20">
          <Link href="/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload New
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-card glow-border p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
            <Briefcase className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-white/40 font-medium">Total Datasets</p>
            <p className="text-2xl font-bold">{uploads.length}</p>
          </div>
        </div>
        
        <div className="glass-card glow-border p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <div className="h-6 w-6 text-emerald-400 font-bold flex items-center justify-center">
              {uploads.filter(u => u.status === "ready").length}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 font-medium">Ready</p>
            <p className="text-2xl font-bold">{uploads.filter(u => u.status === "ready").length}</p>
          </div>
        </div>
      </div>

      <UploadTable uploads={uploads} />
    </div>
  );
}
