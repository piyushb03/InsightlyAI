"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CategoryBarChart({ title, data }) {
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
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(1)}M`
                : v >= 1_000
                ? `${(v / 1_000).toFixed(0)}K`
                : String(v)
            }
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,12,30,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [value != null ? value.toLocaleString() : "—", "Count"]}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
