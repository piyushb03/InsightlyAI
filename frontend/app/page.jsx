import Link from "next/link";
import { BarChart2, Upload, Sparkles, TrendingUp, ArrowRight, CheckCircle2, Zap, Shield, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Upload,
    title: "Upload in Seconds",
    desc: "Drag and drop your CSV or Excel file. We handle any format, any size.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    desc: "Gemini AI analyzes your data and surfaces trends, anomalies, and top performers.",
    color: "from-fuchsia-500 to-violet-500",
  },
  {
    icon: TrendingUp,
    title: "90-Day Forecasts",
    desc: "Prophet-powered sales forecasting with confidence intervals, ready in seconds.",
    color: "from-indigo-500 to-blue-500",
  },
];

const stats = [
  { value: "10x", label: "Faster than spreadsheets" },
  { value: "90 days", label: "Sales forecast horizon" },
  { value: "< 30s", label: "From upload to insights" },
  { value: "100%", label: "Your data, your control" },
];

const benefits = [
  "No spreadsheet skills required",
  "Auto-generated interactive charts",
  "AI-written insight summaries",
  "One-click CSV export",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07060f] text-white overflow-x-hidden">

      {/* ── Animated background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="animate-blob absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="animate-blob-delay absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-indigo-700/15 blur-[120px]" />
        <div className="animate-blob-delay2 absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-fuchsia-700/10 blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/20 ring-1 ring-violet-500/30">
            <BarChart2 className="h-5 w-5 text-violet-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">InsightlyAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40 transition-all hover:shadow-violet-800/50">
              Get started free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-24 max-w-4xl mx-auto">
        <div className="animate-fade-up inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-violet-300 mb-8 ring-1 ring-violet-500/20">
          <Zap className="h-3.5 w-3.5" />
          <span>Powered by Gemini AI + Prophet Forecasting</span>
        </div>

        <h1 className="animate-fade-up animation-delay-100 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          Turn your sales data into{" "}
          <span className="text-gradient">actionable insights</span>
        </h1>

        <p className="animate-fade-up animation-delay-200 text-lg sm:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
          Upload a CSV or Excel file — InsightlyAI auto-generates interactive dashboards,
          AI-written insights, and 90-day sales forecasts in under 30 seconds.
        </p>

        <div className="animate-fade-up animation-delay-300 flex flex-col sm:flex-row gap-3 mb-12">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-500 text-white text-base px-8 py-6 shadow-2xl shadow-violet-900/50 glow-violet transition-all hover:scale-[1.02]"
            >
              Start for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white backdrop-blur-sm"
            >
              Sign in to dashboard
            </Button>
          </Link>
        </div>

        {/* Benefits checklist */}
        <div className="animate-fade-up animation-delay-500 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {benefits.map((b) => (
            <span key={b} className="flex items-center gap-1.5 text-sm text-white/40">
              <CheckCircle2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── Dashboard preview mockup ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        <div className="glass-card glow-border overflow-hidden p-1">
          <div className="rounded-[1rem] bg-[#0e0d1a] p-6">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="ml-3 flex-1 h-6 rounded bg-white/5 max-w-xs" />
            </div>
            {/* Fake KPI row */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {["$284K", "1,240", "$229", "94.3%"].map((v, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="text-xs text-white/30 mb-1">{["Revenue", "Orders", "Avg Order", "Growth"][i]}</div>
                  <div className="text-lg font-bold text-gradient-violet">{v}</div>
                </div>
              ))}
            </div>
            {/* Fake chart bars */}
            <div className="glass rounded-xl p-4">
              <div className="text-xs text-white/30 mb-3">Revenue Over Time</div>
              <div className="flex items-end gap-1.5 h-24">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-violet-600/60 to-indigo-500/40 transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card glow-border p-5 text-center">
              <div className="text-2xl font-extrabold text-gradient mb-1">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Everything you need to understand your sales
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            No BI team required. Just upload your file and let AI do the heavy lifting.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card glow-border p-6 hover:bg-white/[0.07] transition-all hover:-translate-y-1 group"
            >
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${f.color} mb-4 shadow-lg`}>
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", icon: Upload, title: "Upload your file", desc: "Drag & drop any CSV or Excel. We detect columns automatically." },
            { step: "02", icon: BarChart, title: "Dashboard auto-generates", desc: "Charts, KPI cards, and trend lines appear instantly — no config needed." },
            { step: "03", icon: Sparkles, title: "Get AI insights", desc: "Click one button for AI-written summaries, anomalies, and a 90-day forecast." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center ring-1 ring-violet-500/20">
                  <item.icon className="h-6 w-6 text-violet-400" />
                </div>
                <span className="absolute -top-2 -right-2 text-xs font-bold text-violet-400/60">{item.step}</span>
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 pb-32 text-center">
        <div className="glass-card glow-border p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 pointer-events-none" />
          <Shield className="mx-auto h-8 w-8 text-violet-400 mb-4" />
          <h2 className="text-3xl font-bold mb-3">Ready to unlock your sales data?</h2>
          <p className="text-white/40 mb-8">
            Free forever. No credit card. Your data stays private.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-500 text-white text-base px-10 py-6 shadow-2xl shadow-violet-900/50 glow-violet transition-all hover:scale-[1.02]"
            >
              Create your free account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
          <BarChart2 className="h-4 w-4" />
          <span>InsightlyAI · Built for growing businesses</span>
        </div>
      </footer>
    </div>
  );
}
