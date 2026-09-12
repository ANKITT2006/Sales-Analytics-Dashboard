"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sparkles, TrendingUp, BarChart3, LineChart as LineIcon, Activity } from "lucide-react";
import type { MonthlySalesPoint } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

interface MlForecastChartProps {
  data: MonthlySalesPoint[];
  regionName: string;
}

export function MlForecastChart({ data, regionName }: MlForecastChartProps) {
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");

  if (!data || data.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-xl backdrop-blur-md">
        <Activity className="h-8 w-8 text-emerald-400 mb-2 animate-pulse" />
        <h4 className="text-base font-bold text-white">Awaiting Live Transactions</h4>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Sales timeline will plot transaction velocity dynamically as payments are captured through <code className="text-emerald-400 font-mono">/api/webhooks/razorpay</code>.
        </p>
      </div>
    );
  }

  const formattedData = data.map((d) => ({
    month: d.month,
    sales: d.sales,
  }));

  const formatCurrencyShort = (val: number) => {
    if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(2)} Cr`;
    if (val >= 100_000) return `₹${(val / 100_000).toFixed(1)} L`;
    if (val >= 1_000) return `₹${(val / 1_000).toFixed(0)}k`;
    return `₹${val}`;
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        sales: number;
      };
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const salesVal = payload[0].payload.sales;

      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs text-slate-200">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-semibold text-slate-400">{label}</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              Verified Captured
            </span>
          </div>
          <p className="text-base font-bold text-white mt-1">
            {formatCurrency(salesVal)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Live Transaction Velocity & Timeline</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/40">
              <Sparkles className="h-3 w-3" /> Real-Time Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological retail volume in <span className="text-emerald-400 font-medium">{regionName}</span>
          </p>
        </div>

        {/* Chart type toggle */}
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setChartType("area")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === "area"
                ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Area View"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === "bar"
                ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Bar View"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === "line"
                ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Line View"
          >
            <LineIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#475569" />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#475569"
                tickFormatter={formatCurrencyShort}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#actualGrad)"
                name="Revenue (INR)"
              />
            </AreaChart>
          ) : chartType === "bar" ? (
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#475569" />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#475569"
                tickFormatter={formatCurrencyShort}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue (INR)" />
            </BarChart>
          ) : (
            <LineChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#475569" />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                stroke="#475569"
                tickFormatter={formatCurrencyShort}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3, fill: "#10b981" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span>Verified Ingested Revenue (INR)</span>
        </div>
        <span className="text-[11px] text-slate-500">
          Direct real-time stream aggregation
        </span>
      </div>
    </div>
  );
}
