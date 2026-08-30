"use client";

import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";

interface ThresholdFilterProps {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}

export function ThresholdFilter({
  value,
  error,
  onChange,
}: ThresholdFilterProps) {
  return (
    <div className="min-w-[12rem] flex-1">
      <Label htmlFor="sales-threshold">Show sales above</Label>
      <Input
        id="sales-threshold"
        className="mt-1.5"
        inputMode="numeric"
        placeholder="e.g. 15000"
        value={value}
        isInvalid={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "sales-threshold-error" : "sales-threshold-help"}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id="sales-threshold-error" className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      ) : (
        <p id="sales-threshold-help" className="mt-1.5 text-sm text-slate-500">
          Leave empty to show every month.
        </p>
      )}
    </div>
  );
}
