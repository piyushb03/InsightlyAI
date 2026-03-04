"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, TrendingUp, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SalesLineChart from "@/components/charts/SalesLineChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import InsightCard from "@/components/InsightCard";
import ForecastChart from "@/components/ForecastChart";

function KPICard({ label, value }) {
  return (
    <div className="glass-card glow-border p-4 flex flex-col gap-1">
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold truncate">{value}</p>
    </div>
  );
}

function fmt(n) {
  if (n == null) return "—";
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(num)) return String(n);
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function DashboardGrid({ dashboard, insight: initialInsight, forecast: initialForecast }) {
  const [insight, setInsight] = useState(initialInsight);
  const [forecast, setForecast] = useState(initialForecast);
  const [generatingInsight, setGeneratingInsight] = useState(false);
  const [generatingForecast, setGeneratingForecast] = useState(false);

  const stats = dashboard.upload?.stats ?? {};
  const config = dashboard.config ?? [];
  const timeSeries = stats._time_series;

  async function handleGenerateInsight() {
    setGeneratingInsight(true);
    try {
      const res = await fetch(`/api/insights/${dashboard.upload_id}/generate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate insights");
      setInsight(data);
      toast.success("Insights generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate insights");
    } finally {
      setGeneratingInsight(false);
    }
  }

  async function handleGenerateForecast() {
    setGeneratingForecast(true);
    try {
      const res = await fetch(`/api/forecast/${dashboard.upload_id}/generate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate forecast");
      setForecast(data);
      toast.success("Forecast generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate forecast");
    } finally {
      setGeneratingForecast(false);
    }
  }

  // Build KPI cards from numeric column stats
  const kpiItems = config
    .filter((c) => c.type === "KPICard" && c.col)
    .map((c) => {
      const colStats = stats[c.col];
      return { col: c.col, stats: colStats };
    });

  // Build line chart data
  const lineChartConfig = config.find((c) => c.type === "SalesLineChart");
  const lineData = lineChartConfig?.value_col && timeSeries?.series[lineChartConfig.value_col]
    ? timeSeries.series[lineChartConfig.value_col]
    : null;

  // Build bar chart data
  const barChartConfigs = config.filter((c) => c.type === "CategoryBarChart" && c.col);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/dashboard" className="mt-0.5 text-white/30 hover:text-white/70 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{dashboard.name}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dashboard.upload?.filename} · {dashboard.upload?.row_count?.toLocaleString() ?? "—"} rows ·{" "}
              {new Date(dashboard.upload?.created_at ?? "").toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={handleGenerateInsight}
            disabled={generatingInsight}
          >
            {generatingInsight ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {insight ? "Refresh Insights" : "Generate Insights"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={handleGenerateForecast}
            disabled={generatingForecast}
          >
            {generatingForecast ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {forecast ? "Refresh Forecast" : "Generate Forecast"}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" asChild>
            <a href={`/api/export/${dashboard.upload_id}`} download>
              <Download className="h-3.5 w-3.5" />
              Export
            </a>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpiItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpiItems.map(({ col, stats: s }) => (
            <KPICard key={`sum-${col}`} label={`Total ${col}`} value={fmt(s?.sum)} />
          ))}
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lineChartConfig && lineData && (
          <div className="lg:col-span-2">
            <SalesLineChart
              title={lineChartConfig.title ?? `${lineChartConfig.value_col} Over Time`}
              data={lineData}
            />
          </div>
        )}

        {barChartConfigs.map((c) => {
          const colStats = stats[c.col];
          const topValues = colStats?.top_values;
          const barData = topValues
            ? Object.entries(topValues)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
            : [];
          return (
            <CategoryBarChart
              key={c.col}
              title={c.title ?? `Top ${c.col}`}
              data={barData}
            />
          );
        })}
      </div>

      {/* Forecast */}
      {forecast?.data && (
        <div className="grid grid-cols-1">
          <ForecastChart data={forecast.data} targetCol={forecast.target_col} />
        </div>
      )}

      {/* Insights */}
      {insight?.content && (
        <div className="grid grid-cols-1">
          <InsightCard content={insight.content} />
        </div>
      )}

      {/* Empty states */}
      {!insight && !generatingInsight && (
        <div className="glass-card p-6 text-center">
          <Sparkles className="h-8 w-8 text-violet-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">
            Click <strong>Generate Insights</strong> to get AI-powered analysis of your data.
          </p>
        </div>
      )}
    </div>
  );
}
