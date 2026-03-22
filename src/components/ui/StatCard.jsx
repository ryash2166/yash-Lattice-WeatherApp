import React from "react";
import { cn } from "../../utils/helpers";

export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  color = "#f59e0b",
  className,
  badge,
  badgeColor,
  size = "md",
}) {
  const isLarge = size === "lg";

  return (
    <div className={cn("weather-card p-4 animate-fade-in", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <div
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}18` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
          )}
          <span className="text-xs text-slate-400 font-medium truncate">
            {label}
          </span>
        </div>
        {badge && (
          <span
            className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: `${badgeColor || color}18`,
              color: badgeColor || color,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span
          className={cn(
            "font-display font-bold text-slate-100",
            isLarge ? "text-3xl" : "text-2xl",
          )}
        >
          {value ?? "N/A"}
        </span>
        {unit && value !== "N/A" && value !== "–" && (
          <span className="text-sm text-slate-400 font-medium">{unit}</span>
        )}
      </div>

      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
