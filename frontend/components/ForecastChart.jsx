"use client";

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

export default function ForecastChart({ data, targetCol }) {
  if (!data || data.length === 0) return null;

  // Find where forecast starts (first point beyond historical data — approximate as last 90 days)
  const totalPoints = data.length;
  const forecastStart = totalPoints > 90 ? totalPoints - 90 : 0;

  // Thin out data for performance: show every Nth point if too many
  const stride = Math.max(1, Math.floor(data.length / 120));
  const thinned = data.filter((_, i) => i % stride === 0);

  return (
    <div className="glass-card p-5 col-span-full">
      <p className="text-sm font-medium mb-1">90-Day Forecast — {targetCol}</p>
      <p className="text-xs text-muted-foreground mb-4">
        Shaded area shows 80% confidence interval
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={thinned} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
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
            width={55}
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
              background: "rgba(15,12,30,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
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
          {/* Confidence band */}
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
          {/* Forecast line */}
          <Area
            type="monotone"
            dataKey="yhat"
            stroke="#a78bfa"
            strokeWidth={2}
            fill="url(#yhatGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#a78bfa" }}
          />
          {forecastStart > 0 && thinned[forecastStart] && (
            <ReferenceLine
              x={thinned[Math.floor(forecastStart / stride)]?.ds}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="4 4"
              label={{ value: "Forecast →", position: "top", fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
