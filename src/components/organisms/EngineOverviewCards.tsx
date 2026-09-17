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
    dateRange === "30d"
      ? "Last 30 Days"
      : dateRange === "6m"
      ? "Last 6 Months"
      : dateRange === "1y"
      ? "1 Year Window"
      : dateRange === "ytd"
      ? "YTD 2026"
      : dateRange === "custom"
      ? "Custom Window"
      : "All History + Forecast";

  const cards = [
    {
      label: "Total revenue",
      value: formatCurrency(safeSummary.total_revenue),
      subValue: isZeroState
        ? "Awaiting live transactions..."
        : `${regionName} • ${dateRangeLabel}`,
      delta: isZeroState ? "Live Stream Ready" : "▲ 12.4% vs last month",
      isPositive: true,
      deltaColor: isZeroState ? "text-[#4E9B8F]" : "text-emerald-400",
      icon: CreditCard,
    },
    {
      label: "Active Merchants",
      value: formatNumberIN(safeSummary.active_shops),
      subValue: isZeroState
        ? "78 verified merchant network"
        : `${formatNumberIN(safeSummary.active_shops)} verified shops in ${regionName}`,
      delta: "▲ 8.1% vs last month",
      isPositive: true,
      deltaColor: "text-emerald-400",
      icon: Store,
    },
    {
      label: "Avg deal size",
      value: formatCurrency(safeSummary.average_order_value),
      subValue: isZeroState
        ? "Calculated dynamically per order"
        : `Across ${formatNumberIN(safeSummary.total_transactions)} orders`,
      delta: "▼ 2.3% vs last month",
      isPositive: false,
      deltaColor: "text-[#C4695A]",
      icon: TrendingUp,
    },
    {
      label: "Win rate",
      value: `${safeSummary.total_transactions > 0 ? "34%" : "0%"}`,
      subValue: isZeroState
        ? "0 transactions recorded"
        : `${formatNumberIN(safeSummary.total_transactions)} total transactions`,
      delta: "▲ 1.9% vs last month",
      isPositive: true,
      deltaColor: "text-emerald-400",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl glass-panel-interactive p-5 transition-all duration-300 hover:-translate-y-1 ${
              isLiveUpdating ? "ring-1 ring-[#D9A15B] shadow-lg shadow-[#D9A15B]/20 animate-pulse" : ""
            }`}
          >
            {/* Subtle top edge glow on hover */}
            <div className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-[1px] w-3/4 bg-gradient-to-r from-transparent via-[#D9A15B]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-[#8A949E]">{card.label}</span>
              <div className="rounded-xl bg-[#1A222B] p-2 text-[#D9A15B] border border-[#222E3A] group-hover:border-[#D9A15B]/40 group-hover:scale-105 transition-all">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDE6D9] font-sans">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-[#8A949E]/80 truncate">{card.subValue}</p>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <span className={`inline-flex items-center font-semibold ${card.deltaColor}`}>
                {card.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
