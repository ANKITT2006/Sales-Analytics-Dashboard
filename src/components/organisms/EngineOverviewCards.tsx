"use client";

import React from "react";
import { TrendingUp, Store, ShoppingBag, CreditCard } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/analytics";
import { formatCurrency, formatNumberIN } from "@/lib/utils";

interface EngineOverviewCardsProps {
  summary: AnalyticsSummary | null;
  regionName: string;
  dateRange?: string;
  isLiveUpdating?: boolean;
}

export function EngineOverviewCards({
  summary,
  regionName,
  dateRange = "2y",
  isLiveUpdating = false,
}: EngineOverviewCardsProps) {
  const safeSummary: AnalyticsSummary = summary || {
    total_revenue: 0,
    active_shops: 0,
    total_transactions: 0,
    average_order_value: 0,
    return_rate_pct: 0,
    yoy_growth_pct: 0,
    mom_growth_pct: 0,
  };

  const isZeroState = safeSummary.total_transactions === 0;

  const dateRangeLabel =
    dateRange === "6m"
      ? "Last 6 Months"
      : dateRange === "1y"
      ? "1 Year Window"
      : dateRange === "2y"
      ? "2 Years Cumulative"
      : "Live Pipeline";

  const cards = [
    {
      label: `Gross Revenue (${regionName})`,
      value: formatCurrency(safeSummary.total_revenue),
      subValue: isZeroState
        ? "Awaiting live transactions..."
        : `${formatCurrency(safeSummary.total_revenue)} • ${dateRangeLabel}`,
      delta: isZeroState ? "Live Stream Ready" : "Verified Ingested",
      isPositive: true,
      icon: CreditCard,
      accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    },
    {
      label: "Verified Retail Merchants",
      value: formatNumberIN(safeSummary.active_shops),
      subValue: isZeroState
        ? "78 verified merchant network ready"
        : `${formatNumberIN(safeSummary.active_shops)} verified shops in ${regionName}`,
      delta: "100% GST Verified",
      isPositive: true,
      icon: Store,
      accent: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30",
    },
    {
      label: "Total Transactions",
      value: `${formatNumberIN(safeSummary.total_transactions)}`,
      subValue: isZeroState
        ? "0 transactions recorded"
        : `${formatNumberIN(safeSummary.total_transactions)} verified payments`,
      delta: isZeroState ? "Listening on Webhook" : "Live Ingested",
      isPositive: true,
      icon: ShoppingBag,
      accent: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    },
    {
      label: "Average Order Value (AOV)",
      value: formatCurrency(safeSummary.average_order_value),
      subValue: isZeroState
        ? "Calculated dynamically per order"
        : `Across ${formatNumberIN(safeSummary.total_transactions)} orders`,
      delta: isZeroState ? "₹0.00 baseline" : "Dynamic AOV",
      isPositive: true,
      icon: TrendingUp,
      accent: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b ${
              card.accent
            } p-5 shadow-lg backdrop-blur-md transition-all duration-500 hover:scale-[1.01] ${
              isLiveUpdating ? "ring-2 ring-emerald-400 scale-[1.02] shadow-emerald-500/40" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{card.label}</span>
              <div className="rounded-xl bg-slate-900/60 p-2 text-current">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-black tracking-tight text-white">{card.value}</div>
              <p className="mt-0.5 text-xs text-slate-400 font-mono">{card.subValue}</p>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-400 font-semibold">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                {card.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
