"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error("Only CSV and Excel files (.csv, .xlsx, .xls) are accepted.");
      return;
    }
    if (accepted.length === 0) return;

    const file = accepted[0];
    setStatus("uploading");
    setErrorMsg("");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      setStatus("success");
      toast.success("File uploaded! Redirecting to your dashboard…");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setStatus("error");
      setErrorMsg(msg);
      toast.error(msg);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: status === "uploading",
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Upload Data</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload a CSV or Excel file to auto-generate your dashboard.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={[
          "glass-card glow-border flex flex-col items-center justify-center gap-4 py-20 px-8 cursor-pointer transition-all",
          isDragActive ? "bg-violet-500/10 border-violet-500/40" : "hover:bg-white/[0.07]",
          status === "uploading" ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />

        {status === "idle" && (
          <>
            <div className="p-4 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
              {isDragActive ? (
                <Upload className="h-8 w-8 text-violet-400" />
              ) : (
                <FileSpreadsheet className="h-8 w-8 text-violet-400" />
              )}
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">
                {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                or click to browse — CSV, XLSX, XLS (max 50 MB)
              </p>
            </div>
            <Button size="sm" variant="outline" className="mt-2">
              Browse files
            </Button>
          </>
        )}

        {status === "uploading" && (
          <>
            <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
            <p className="text-sm font-medium">Uploading and analyzing your file…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-10 w-10 text-emerald-400" />
            <p className="text-sm font-medium text-emerald-400">Upload complete! Redirecting…</p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-sm font-medium text-red-400">{errorMsg}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatus("idle")}
            >
              Try again
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Supported formats: CSV, Excel (.xlsx, .xls). Maximum file size: 50 MB.
        Your data is processed on our servers and never shared.
      </p>
    </div>
  );
}
