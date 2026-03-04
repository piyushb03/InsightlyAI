"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesLineChart({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-5">
        <p className="text-sm font-medium mb-4">{title}</p>
        <p className="text-xs text-muted-foreground text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <p className="text-sm font-medium mb-4">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
            tickLine={false}
            axisLine={false}
            width={50}
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
            formatter={(value) => [value != null ? value.toLocaleString() : "—", "Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#a78bfa" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
