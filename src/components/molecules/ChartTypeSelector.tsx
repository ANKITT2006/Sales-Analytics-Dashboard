"use client";

import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import { CHART_TYPES, type ChartType } from "@/types/sales";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

const labels: Record<ChartType, { label: string; icon: React.ReactNode }> = {
  bar: {
    label: "Bar",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  line: {
    label: "Line",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 9l-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  area: {
    label: "Area",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 9l-4 4-4-4-3 3v7h11z" fill="currentColor" fillOpacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  pie: {
    label: "Pie",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  return (
    <div>
      <Label id="chart-type-label">Visualization</Label>
      <div
        role="group"
        aria-labelledby="chart-type-label"
        className="mt-1.5 flex flex-wrap gap-1.5"
      >
        {CHART_TYPES.map((type) => (
          <Button
            key={type}
            size="sm"
            variant="outline"
            isActive={value === type}
            aria-pressed={value === type}
            onClick={() => onChange(type)}
            className="flex items-center gap-1.5 shadow-sm"
          >
            {labels[type].icon}
            <span>{labels[type].label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

