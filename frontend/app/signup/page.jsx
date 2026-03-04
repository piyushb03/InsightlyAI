"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart2, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const perks = ["Free forever", "No credit card", "Your data stays private"];

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Sign up failed");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#07060f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="animate-blob absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-fuchsia-700/15 blur-[120px]" />
        <div className="animate-blob-delay absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-700/20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-2 rounded-xl bg-violet-500/20 ring-1 ring-violet-500/30 mb-3">
            <BarChart2 className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-white/40 mt-1">Start turning data into insights today</p>
        </div>

        {/* Card */}
        <div className="glass-card glow-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-white/60">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                autoComplete="email"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/60 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-white/60">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-violet-500/60 focus:ring-violet-500/20"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-5 shadow-lg shadow-violet-900/30 glow-violet transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</>
              ) : (
                <>Create free account <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>

            {/* Perks */}
            <div className="flex justify-center gap-4 pt-1">
              {perks.map((p) => (
                <span key={p} className="flex items-center gap-1 text-xs text-white/25">
                  <CheckCircle2 className="h-3 w-3 text-violet-500/60" />
                  {p}
                </span>
              ))}
            </div>
          </form>

          <p className="text-sm text-white/30 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          <Link href="/" className="hover:text-white/40 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
