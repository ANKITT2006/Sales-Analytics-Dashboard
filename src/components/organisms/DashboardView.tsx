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
      {/* Faint ambient fintech lighting glows */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-[#D9A15B]/5 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-96 w-96 rounded-full bg-[#4E9B8F]/4 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-[#C4695A]/4 blur-3xl -z-10" />

      {/* Header */}
      <DashboardHeader
        regionName={regionName}
        onOpenUpload={() => setIsUploadOpen(true)}
        onRetrain={handleRetrain}
        isRetraining={isRetraining}
      />

      {/* Control Bar: State / Region Filter + Date Range */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-[#222E3A] bg-[#12181D]/90 p-3.5 backdrop-blur-md shadow-lg">
        <div className="w-full sm:w-72">
          <StateSelector value={selectedState} onChange={setSelectedState} />
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
          {/* Executive Overview KPI Summary */}
          <EngineOverviewCards
            summary={summary}
            regionName={regionName}
            dateRange={dateRange}
            isLiveUpdating={isLiveUpdating}
          />

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
    </div>
  );
}
