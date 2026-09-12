"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { ALL_INDIAN_STATES } from "@/lib/stream/indiaTransactionEngine";

interface StateSelectorProps {
  value: string;
  onChange: (stateCode: string) => void;
}

const REGION_GROUPS = ["West", "South", "North", "East", "Central", "North-East"] as const;

export function StateSelector({ value, onChange }: StateSelectorProps) {
  return (
    <div className="relative flex items-center">
      <MapPin className="absolute left-3.5 h-4 w-4 text-emerald-500 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select Indian State or Territory"
        className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900/90 pl-10 pr-9 py-2.5 text-sm font-medium text-slate-200 shadow-inner backdrop-blur-md transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:border-slate-600 cursor-pointer"
      >
        <option value="ALL" className="bg-slate-900 font-bold text-emerald-400">
          🇮🇳 All India (36 States & UTs)
        </option>

        {REGION_GROUPS.map((region) => {
          const statesInRegion = ALL_INDIAN_STATES.filter((s) => s.region === region);
          return (
            <optgroup key={region} label={`${region} India`} className="bg-slate-900 font-bold text-slate-400">
              {statesInRegion.map((s) => (
                <option key={s.code} value={s.code} className="bg-slate-950 font-medium text-slate-200">
                  {s.name} ({s.code})
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
      <div className="pointer-events-none absolute right-3 text-xs text-slate-400">▼</div>
    </div>
  );
}
