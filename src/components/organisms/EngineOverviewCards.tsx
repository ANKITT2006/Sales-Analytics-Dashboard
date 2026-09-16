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
      label: "Total revenue",
      value: formatCurrency(safeSummary.total_revenue),
      subValue: isZeroState
        ? "Awaiting live transactions..."
        : `${regionName} • ${dateRangeLabel}`,
      delta: isZeroState ? "Live Stream Ready" : "▲ 12.4% vs last month",
      isPositive: true,
      deltaColor: "text-[#4E9B8F]",
      icon: CreditCard,
    },
    {
      label: "New deals",
      value: formatNumberIN(safeSummary.active_shops),
      subValue: isZeroState
        ? "78 verified merchant network"
        : `${formatNumberIN(safeSummary.active_shops)} verified shops in ${regionName}`,
      delta: "▲ 8.1% vs last month",
      isPositive: true,
      deltaColor: "text-[#4E9B8F]",
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
      deltaColor: "text-[#4E9B8F]",
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
            className={`group relative overflow-hidden rounded-2xl border border-[#222E3A] bg-[#13191F]/90 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#D9A15B]/50 hover:bg-[#151D24] ${
              isLiveUpdating ? "ring-1 ring-[#D9A15B] shadow-lg shadow-[#D9A15B]/10" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-[#8A949E]">{card.label}</span>
              <div className="rounded-xl bg-[#1A222B] p-2 text-[#D9A15B] border border-[#222E3A] group-hover:border-[#D9A15B]/40 transition-colors">
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
