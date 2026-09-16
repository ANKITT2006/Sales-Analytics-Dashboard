"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Search,
  ArrowUpDown,
  Building2,
  TrendingUp,
  Globe2,
} from "lucide-react";
import { formatCurrency, formatNumberIN } from "@/lib/utils";
import type { IndianRegion, StateMetrics } from "@/lib/stream/indiaTransactionEngine";

interface StateBreakdownTableProps {
  selectedState?: string;
  onSelectState?: (stateCode: string) => void;
}

const REGIONS: Array<{ id: IndianRegion | "ALL"; label: string }> = [
  { id: "ALL", label: "All India (36)" },
  { id: "West", label: "West (5)" },
  { id: "South", label: "South (7)" },
  { id: "North", label: "North (9)" },
  { id: "East", label: "East (5)" },
  { id: "Central", label: "Central (2)" },
  { id: "North-East", label: "North-East (8)" },
];

export function StateBreakdownTable({
  selectedState = "ALL",
  onSelectState,
}: StateBreakdownTableProps) {
  const [states, setStates] = useState<StateMetrics[]>([]);
  const [activeRegion, setActiveRegion] = useState<IndianRegion | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"volume" | "count" | "aov">("volume");
  const [sortAsc, setSortAsc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStateBreakdown = useCallback(async () => {
    try {
      const url = `/api/analytics/state-breakdown?region=${activeRegion}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStates(json.data);
      }
    } catch (err) {
      console.error("Failed to load state breakdown:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeRegion]);

  useEffect(() => {
    fetchStateBreakdown();
    const interval = setInterval(fetchStateBreakdown, 3000);
    return () => clearInterval(interval);
  }, [fetchStateBreakdown]);

  // Filtering & Sorting
  const filtered = states
    .filter((s) => {
      const matchSearch =
        s.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.state_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.top_city.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === "volume") diff = b.total_volume_inr - a.total_volume_inr;
      else if (sortBy === "count") diff = b.transaction_count - a.transaction_count;
      else if (sortBy === "aov") diff = b.average_order_value - a.average_order_value;
      return sortAsc ? -diff : diff;
    });

  const maxVolume = states[0]?.total_volume_inr || 1;

  const getDensityBadge = (share: number) => {
    if (share >= 8) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#4E9B8F]/15 px-2 py-0.5 text-[10px] font-bold text-[#4E9B8F] border border-[#4E9B8F]/30">
          High Density
        </span>
      );
    }
    if (share >= 3) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[#D9A15B]/15 px-2 py-0.5 text-[10px] font-bold text-[#D9A15B] border border-[#D9A15B]/30">
          Medium Density
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-[#161E26] px-2 py-0.5 text-[10px] font-medium text-[#8A949E] border border-[#2A3745]">
        Emerging
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-[#222E3A] bg-[#13191F]/90 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A222B] text-[#D9A15B] border border-[#222E3A] shadow-md">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#EDE6D9] font-serif tracking-tight">
                All-India Statewise Retail Matrix
              </h3>
              <span className="inline-flex items-center rounded-full bg-[#4E9B8F]/15 px-2.5 py-0.5 text-xs font-bold text-[#4E9B8F] border border-[#4E9B8F]/30">
                28 States + 8 UTs
              </span>
            </div>
            <p className="text-xs text-[#8A949E]">
              Live transaction volume & digital density weighted across all Indian regions
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8A949E]" />
          <input
            type="text"
            placeholder="Search state or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#222E3A] bg-[#0A0E12] pl-8 pr-3 py-1.5 text-xs text-[#EDE6D9] placeholder-[#8A949E] focus:border-[#D9A15B] focus:outline-none"
          />
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-4 border-b border-[#222E3A]">
        {REGIONS.map((reg) => (
          <button
            key={reg.id}
            type="button"
            onClick={() => setActiveRegion(reg.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRegion === reg.id
                ? "bg-[#D9A15B] text-[#0A0E12] shadow-md shadow-[#D9A15B]/20 font-bold"
                : "bg-[#161E26] text-[#8A949E] hover:text-[#EDE6D9] hover:bg-[#1E2934] border border-[#2A3745]"
            }`}
          >
            {reg.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
            <tr>
              <th className="py-3 px-3">State / UT</th>
              <th className="py-3 px-3">Region</th>
              <th className="py-3 px-3">Density Tier</th>
              <th className="py-3 px-3">Top Hub</th>
              <th
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => {
                  if (sortBy === "volume") setSortAsc(!sortAsc);
                  else {
                    setSortBy("volume");
                    setSortAsc(false);
                  }
                }}
              >
                <div className="inline-flex items-center gap-1">
                  <span>Total Volume (INR)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => {
                  if (sortBy === "count") setSortAsc(!sortAsc);
                  else {
                    setSortBy("count");
                    setSortAsc(false);
                  }
                }}
              >
                <div className="inline-flex items-center gap-1">
                  <span>Transactions</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">AOV</th>
              <th className="py-3 px-3 text-center min-w-[130px]">National Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading && states.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  Aggregating statewise transaction stream...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No states match the filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((s, idx) => {
                const isSelected = selectedState === s.state_code;
                const progressWidth = Math.min(
                  100,
                  Math.round((s.total_volume_inr / maxVolume) * 100)
                );

                return (
                  <tr
                    key={s.state_code}
                    onClick={() => onSelectState && onSelectState(isSelected ? "ALL" : s.state_code)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? "bg-emerald-950/40 border-l-2 border-l-emerald-500"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {s.state_code}
                        </span>
                        <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {s.state_name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-slate-400 font-medium">{s.region}</span>
                    </td>

                    <td className="py-3 px-3">{getDensityBadge(s.share_pct)}</td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Building2 className="h-3 w-3 text-slate-500" />
                        <span>{s.top_city}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-white text-sm">
                      {formatCurrency(s.total_volume_inr)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {formatNumberIN(s.transaction_count)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {formatCurrency(s.average_order_value)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1 items-end">
                        <span className="font-mono text-[11px] font-bold text-emerald-400">
                          {s.share_pct}%
                        </span>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <span className="text-[11px] text-slate-500">
          Showing {filtered.length} of 36 States & Union Territories • Click a row to filter dashboard
        </span>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold text-[11px]">
            Live Macro Retail Simulation Engine Active
          </span>
        </div>
      </div>
    </div>
  );
}
