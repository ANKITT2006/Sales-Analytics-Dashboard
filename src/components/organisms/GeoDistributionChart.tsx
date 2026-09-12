"use client";

import React from "react";
import { Globe2, ChevronRight, Activity } from "lucide-react";
import type { StateDistribution } from "@/lib/analytics";
import { formatCurrency, formatNumberIN } from "@/lib/utils";

interface GeoDistributionChartProps {
  data: StateDistribution[];
  selectedState: string;
  onSelectState: (stateCode: string) => void;
}

export function GeoDistributionChart({
  data,
  selectedState,
  onSelectState,
}: GeoDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-xl backdrop-blur-md">
        <Activity className="h-7 w-7 text-emerald-500 mb-2 animate-pulse" />
        <h4 className="text-sm font-semibold text-white">Awaiting Geographic Data</h4>
        <p className="mt-1 text-xs text-slate-400 max-w-xs">
          State-level revenue distribution will map automatically as live transactions are captured via Razorpay webhooks.
        </p>
      </div>
    );
  }

  const maxRevenue = data[0]?.revenue || 1;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
            <Globe2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">State Revenue Distribution</h3>
            <p className="text-xs text-slate-400">Live retail turnover across Indian states (INR)</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {data.length} States
        </span>
      </div>

      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
        {data.map((st) => {
          const isSelected = selectedState === st.state_code;
          const progressPercent = Math.min(100, Math.round((st.revenue / maxRevenue) * 100));

          return (
            <div
              key={st.state_code}
              onClick={() => onSelectState(isSelected ? "ALL" : st.state_code)}
              className={`group flex flex-col rounded-xl border p-3 cursor-pointer transition-all ${
                isSelected
                  ? "border-emerald-500/50 bg-emerald-950/30 shadow-md shadow-emerald-950/50"
                  : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {st.state_code}
                  </span>
                  <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {st.state_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-mono font-medium">
                    {formatCurrency(st.revenue)}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    {st.share_pct}%
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSelected
                      ? "bg-emerald-400 shadow-sm shadow-emerald-400"
                      : "bg-gradient-to-r from-blue-500 to-emerald-400 opacity-80 group-hover:opacity-100"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
                <span>{formatNumberIN(st.orders)} verified orders</span>
                <span>Click to {isSelected ? "clear filter" : "filter state"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
