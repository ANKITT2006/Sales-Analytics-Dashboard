"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { ChartTypeSelector } from "@/components/molecules/ChartTypeSelector";
import { ThresholdFilter } from "@/components/molecules/ThresholdFilter";
import { YearSelector } from "@/components/molecules/YearSelector";
import { MONTHLY_SALES_TARGET } from "@/data/sales";
import type { ChartType, SalesYear } from "@/types/sales";

interface FilterControlsProps {
  year: SalesYear;
  chartType: ChartType;
  thresholdInput: string;
  thresholdError: string | null;
  targetInput?: string;
  onYearChange: (year: SalesYear) => void;
  onChartTypeChange: (type: ChartType) => void;
  onThresholdChange: (value: string) => void;
  onTargetChange?: (value: string) => void;
  onResetFilters?: () => void;
}

export function FilterControls({
  year,
  chartType,
  thresholdInput,
  thresholdError,
  targetInput = String(MONTHLY_SALES_TARGET),
  onYearChange,
  onChartTypeChange,
  onThresholdChange,
  onTargetChange,
  onResetFilters,
}: FilterControlsProps) {
  const isFiltered = thresholdInput !== "" || targetInput !== String(MONTHLY_SALES_TARGET) || chartType !== "bar";

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-wrap items-end gap-4">
        <YearSelector value={year} onChange={onYearChange} />
        <ChartTypeSelector value={chartType} onChange={onChartTypeChange} />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <ThresholdFilter
          value={thresholdInput}
          error={thresholdError}
          onChange={onThresholdChange}
        />

        {onTargetChange && (
          <div className="min-w-[9rem]">
            <Label htmlFor="target-input">Monthly Target ($)</Label>
            <Input
              id="target-input"
              className="mt-1.5 h-10"
              inputMode="numeric"
              value={targetInput}
              onChange={(e) => onTargetChange(e.target.value)}
              placeholder="e.g. 20000"
            />
          </div>
        )}

        {onResetFilters && isFiltered && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-10 mb-0.5"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

