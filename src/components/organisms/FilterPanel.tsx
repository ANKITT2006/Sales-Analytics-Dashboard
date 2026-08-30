"use client";

import { Card } from "@/components/atoms/Card";
import { FilterControls } from "@/components/molecules/FilterControls";
import type { ChartType, SalesYear } from "@/types/sales";

interface FilterPanelProps {
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

export function FilterPanel(props: FilterPanelProps) {
  return (
    <Card className="shadow-sm border-slate-200/90 bg-white/90 backdrop-blur-sm">
      <FilterControls {...props} />
    </Card>
  );
}

