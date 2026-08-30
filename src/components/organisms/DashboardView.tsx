"use client";

import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { FilterPanel } from "@/components/organisms/FilterPanel";
import { SalesChart } from "@/components/organisms/SalesChart";
import { SalesComparison } from "@/components/organisms/SalesComparison";
import { SalesSummarySection } from "@/components/organisms/SalesSummary";
import { SalesTable } from "@/components/organisms/SalesTable";
import { ErrorState } from "@/components/molecules/ErrorState";
import { LoadingState } from "@/components/molecules/LoadingState";
import { MONTHLY_SALES_TARGET } from "@/data/sales";
import { useSales } from "@/hooks/useSales";
import { filterByThreshold, parseThreshold } from "@/lib/utils";
import type { ChartType, SalesYear } from "@/types/sales";
import { useMemo, useState } from "react";

export function DashboardView() {
  const [year, setYear] = useState<SalesYear>(2024);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [thresholdInput, setThresholdInput] = useState("");
  const [targetInput, setTargetInput] = useState(String(MONTHLY_SALES_TARGET));
  const { data, isLoading, error, retry } = useSales(year);

  const threshold = useMemo(
    () => parseThreshold(thresholdInput),
    [thresholdInput],
  );

  const targetValue = useMemo(() => {
    const parsed = Number(targetInput.replace(/,/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : MONTHLY_SALES_TARGET;
  }, [targetInput]);

  const filteredData = useMemo(() => {
    if (!data) {
      return [];
    }

    return filterByThreshold(data.data, threshold.value);
  }, [data, threshold.value]);

  const handleResetFilters = () => {
    setThresholdInput("");
    setTargetInput(String(MONTHLY_SALES_TARGET));
    setChartType("bar");
  };

  return (
    <div className="space-y-6">
      <DashboardHeader year={year} />
      <FilterPanel
        year={year}
        chartType={chartType}
        thresholdInput={thresholdInput}
        thresholdError={threshold.error}
        targetInput={targetInput}
        onYearChange={setYear}
        onChartTypeChange={setChartType}
        onThresholdChange={setThresholdInput}
        onTargetChange={setTargetInput}
        onResetFilters={handleResetFilters}
      />

      {isLoading ? (
        <LoadingState label="Loading sales analytics dataset..." />
      ) : null}

      {error ? <ErrorState message={error} onRetry={retry} /> : null}

      {!isLoading && !error && data ? (
        <>
          <SalesSummarySection
            summary={data.summary}
            data={data.data}
            target={targetValue}
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <SalesChart
              year={year}
              chartType={chartType}
              data={filteredData}
              target={targetValue}
            />
            <SalesComparison
              year={year}
              currentData={data.data}
              previous={data.previousYear}
              comparison={data.comparison}
            />
          </div>
          <SalesTable
            data={filteredData}
            year={year}
            target={targetValue}
          />
        </>
      ) : null}
    </div>
  );
}

