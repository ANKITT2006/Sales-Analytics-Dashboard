"use client";

import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { AVAILABLE_YEARS, type SalesYear } from "@/types/sales";

interface YearSelectorProps {
  value: SalesYear;
  onChange: (year: SalesYear) => void;
}

export function YearSelector({ value, onChange }: YearSelectorProps) {
  const options = AVAILABLE_YEARS.map((year) => ({
    label: String(year),
    value: String(year),
  }));

  return (
    <div className="min-w-[8rem]">
      <Label htmlFor="year-selector">Year</Label>
      <Select
        id="year-selector"
        className="mt-1.5"
        aria-label="Select sales year"
        value={String(value)}
        options={options}
        onChange={(event) => onChange(Number(event.target.value) as SalesYear)}
      />
    </div>
  );
}
