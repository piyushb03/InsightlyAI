"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp, AlertTriangle, Lightbulb, Star, BarChart2 } from "lucide-react";

const sections = [
  { key: "top_performers", label: "Top Performers", icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { key: "trends", label: "Trends", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "anomalies", label: "Anomalies", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  { key: "recommendations", label: "Recommendations", icon: Lightbulb, color: "text-violet-400", bg: "bg-violet-500/10" },
];

function CollapsibleSection({
  label,
  icon: Icon,
  color,
  bg,
  items,
}) {
  const [open, setOpen] = useState(true);

  if (!items || items.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${bg}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">({items.length})</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-white/30" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/30" />
        )}
      </button>
      {open && (
        <ul className="px-4 pb-4 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
              <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${color.replace("text-", "bg-")}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function InsightCard({ content }) {
  return (
    <div className="space-y-4 col-span-full">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-violet-500/10">
          <BarChart2 className="h-4 w-4 text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold">AI Insights</h3>
      </div>

      {content.summary && (
        <div className="glass-card p-4">
          <p className="text-sm text-white/70 leading-relaxed">{content.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(({ key, label, icon, color, bg }) => (
          <CollapsibleSection
            key={key}
            label={label}
            icon={icon}
            color={color}
            bg={bg}
            items={content[key] ?? []}
          />
        ))}
      </div>
    </div>
  );
}
