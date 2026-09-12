"use client";

import React from "react";
import { Calendar } from "lucide-react";

export type DateRangeOption = "6m" | "1y" | "ytd" | "2y";

interface DateRangeSelectorProps {
  value: DateRangeOption;
  onChange: (range: DateRangeOption) => void;
}

const RANGES: { id: DateRangeOption; label: string }[] = [
  { id: "6m", label: "Last 6 Mo" },
  { id: "1y", label: "1 Year" },
  { id: "ytd", label: "YTD 2024" },
  { id: "2y", label: "All History + Forecast" },
];

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 p-1 backdrop-blur-md">
      <Calendar className="h-4 w-4 ml-2 mr-1 text-slate-400 hidden sm:inline-block" />
      {RANGES.map((r) => {
        const isActive = value === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isActive
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
