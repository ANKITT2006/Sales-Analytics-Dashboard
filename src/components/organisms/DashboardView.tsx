"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { EngineOverviewCards } from "@/components/organisms/EngineOverviewCards";
import { MlForecastChart } from "@/components/organisms/MlForecastChart";
import { GeoDistributionChart } from "@/components/organisms/GeoDistributionChart";
import { ShopLeaderboard } from "@/components/organisms/ShopLeaderboard";
import { LiveTransactionsFeed } from "@/components/organisms/LiveTransactionsFeed";
import { StateBreakdownTable } from "@/components/organisms/StateBreakdownTable";
import { StateSelector } from "@/components/molecules/StateSelector";
import { DateRangeSelector, DateRangeOption } from "@/components/molecules/DateRangeSelector";
import { CsvUploadModal } from "@/components/molecules/CsvUploadModal";
import { LoadingState } from "@/components/molecules/LoadingState";
import { ErrorState } from "@/components/molecules/ErrorState";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getAuthHeaders } from "@/lib/auth";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export function DashboardView() {
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRangeOption>("2y");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);

  const {
    summary,
    monthly,
    geoDistribution,
    leaderboard,
    regionName,
    isLoading,
    isLiveUpdating,
    error,
    refetch,
  } = useAnalytics(selectedState, dateRange);

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      // Trigger train script through lightweight fetch or re-ingestion
      const res = await fetch("/api/analytics/overview?retrain=true", {
        headers: getAuthHeaders(),
      });
      await res.json();
      refetch();
    } catch {
      //
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Faint animated ambient fintech lighting glows */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-[420px] w-[420px] rounded-full bg-[#D9A15B]/[0.07] blur-[120px] animate-ambient-glow -z-10" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-[440px] w-[440px] rounded-full bg-[#4E9B8F]/[0.06] blur-[130px] animate-ambient-glow-reverse -z-10" />
      <div className="pointer-events-none absolute bottom-1/4 -right-24 h-[440px] w-[440px] rounded-full bg-[#C4695A]/[0.05] blur-[130px] animate-ambient-glow -z-10" />

      {/* Header */}
      <DashboardHeader
        regionName={regionName}
        dateRange={dateRange}
        onSelectDateRange={setDateRange}
        onOpenUpload={() => setIsUploadOpen(true)}
        onRetrain={handleRetrain}
        isRetraining={isRetraining}
      />

      {/* Control Bar: State / Region Filter + Date Range + Live Simulated Stream Badge */}
      <div className="relative z-40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl glass-panel p-3.5 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-72">
            <StateSelector value={selectedState} onChange={setSelectedState} />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D9A15B]/30 bg-[#D9A15B]/10 px-3 py-1 text-xs font-semibold text-[#D9A15B]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9A15B] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9A15B]" />
            </span>
            <span>⚡ Live Simulated Stream · Dynamic Real-Time Updates</span>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          {selectedState !== "ALL" && (
            <button
              type="button"
              onClick={() => setSelectedState("ALL")}
              className="text-xs font-semibold text-[#D9A15B] hover:text-[#C6904A] underline underline-offset-2 shrink-0"
            >
              Reset to All India
            </button>
          )}
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <LoadingState label="Syncing live transaction intelligence..." />
      ) : null}

      {error ? <ErrorState message={error} onRetry={refetch} /> : null}

      {/* Main Content */}
      {!isLoading && !error ? (
        <>
          {/* Executive Overview KPI Summary (Sticky Top on Scroll) */}
          <div className="sticky top-2 z-30 -mx-2 px-2 py-2 rounded-2xl bg-black/40 backdrop-blur-md transition-all duration-300">
            <EngineOverviewCards
              summary={summary}
              regionName={regionName}
              dateRange={dateRange}
              isLiveUpdating={isLiveUpdating}
            />
          </div>

          {/* Time Series Forecast + Geo Distribution Split */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MlForecastChart data={monthly} regionName={regionName} />
            </div>
            <div className="lg:col-span-1">
              <GeoDistributionChart
                data={geoDistribution}
                selectedState={selectedState}
                onSelectState={setSelectedState}
              />
            </div>
          </div>

          {/* Real-time National Ticker & Razorpay Live Webhook Feed */}
          <LiveTransactionsFeed selectedState={selectedState} />

          {/* All-India 28 States & 8 UTs Regional Breakdown Matrix */}
          <StateBreakdownTable
            selectedState={selectedState}
            onSelectState={setSelectedState}
          />

          {/* Shop Leaderboard & Performance Ranking */}
          <ShopLeaderboard data={leaderboard} regionName={regionName} />
        </>
      ) : null}

      {/* CSV Ingestion Dropzone Modal */}
      <CsvUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={refetch}
      />

      {/* Footer Section: "Made with love" */}
      <footer className="mt-14 pt-8 pb-6 border-t border-[#222E3A]/80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8A949E]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#D9A15B]/15 border border-[#D9A15B]/30 text-[#D9A15B] shadow-sm">
              <Heart className="h-3.5 w-3.5 fill-[#D9A15B] text-[#D9A15B]" />
            </span>
            <span className="text-[#EDE6D9]/90 font-medium">
              Made with <span className="text-rose-400 font-bold">❤️</span> for Indian Retail & Commerce · 28 States & 8 Union Territories
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8A949E]">
            <span className="flex items-center gap-1 text-[#4E9B8F] font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-[#4E9B8F]" />
              GSTIN Certified Network
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#D9A15B]">
              <Sparkles className="h-3 w-3" />
              Real-Time UPI Ledger 2026
            </span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
