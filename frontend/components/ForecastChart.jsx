"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Settings2, RefreshCw, Loader2, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ForecastChart({ data, targetCol, colSchema = [], onRefresh, isLoading }) {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(targetCol);

  if (!data || data.length === 0) return null;

  const numericCols = colSchema.filter(c => c.dtype === "numeric");
  const dateCols = colSchema.filter(c => c.dtype === "date");

  // Find where forecast starts
  const totalPoints = data.length;
  const forecastStart = totalPoints > 90 ? totalPoints - 90 : 0;

  const stride = Math.max(1, Math.floor(data.length / 120));
  const thinned = data.filter((_, i) => i % stride === 0);

  function handleApply() {
    if (onRefresh) {
      onRefresh({ target_col: selectedTarget });
      setShowSettings(false);
    }
  }

  return (
    <div className="glass-card p-5 col-span-full relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-bold mb-0.5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            90-Day Forecast — {targetCol}
          </p>
          <p className="text-xs text-white/30">
            AI-powered time-series prediction using Prophet
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="h-8 border-white/10 bg-white/5 hover:bg-white/10 gap-2 text-xs"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Customize
        </Button>
      </div>

      {showSettings && (
        <div className="absolute inset-0 z-10 bg-sidebar/95 backdrop-blur-md p-6 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h3 className="font-bold text-lg">Forecast Settings</h3>
              <p className="text-xs text-white/40 mt-1">Configure your prediction parameters</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-white/60 flex items-center gap-2">
                  <Target className="h-3.5 w-3.5" /> Target Metric
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {numericCols.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedTarget(c.name)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        selectedTarget === c.name 
                          ? "bg-violet-500/20 border-violet-500/50 text-violet-300 ring-1 ring-violet-500/30"
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowSettings(false)}
                className="flex-1 border border-white/10 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApply}
                disabled={isLoading}
                className="flex-1 bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/20"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[280px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={thinned} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="yhatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="ds"
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(thinned.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
              tickLine={false}
              axisLine={false}
              width={45}
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1_000
                  ? `${(v / 1_000).toFixed(1)}K`
                  : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,12,30,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
                backdropFilter: "blur(8px)",
              }}
              formatter={(value, name) => {
                const labels = {
                  yhat: "Forecast",
                  yhat_upper: "Upper bound",
                  yhat_lower: "Lower bound",
                };
                const label = name ? (labels[name] ?? name) : "";
                return [value != null ? value.toLocaleString() : "—", label];
              }}
            />
            <Area
              type="monotone"
              dataKey="yhat_upper"
              stroke="none"
              fill="url(#confGrad)"
            />
            <Area
              type="monotone"
              dataKey="yhat_lower"
              stroke="none"
              fill="white"
              fillOpacity={0}
            />
            <Area
              type="monotone"
              dataKey="yhat"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="url(#yhatGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }}
            />
            {forecastStart > 0 && thinned[Math.floor(forecastStart / stride)] && (
              <ReferenceLine
                x={thinned[Math.floor(forecastStart / stride)]?.ds}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="4 4"
                label={{ value: "Forecast Start", position: "top", fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-white/10 mt-2 text-center">
        90-day horizon • 80% confidence interval • Prophet v1.1
      </p>
    </div>
  );
}

function TrendingUp(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
