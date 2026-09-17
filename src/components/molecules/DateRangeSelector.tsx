"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, Check, X, ChevronRight, Clock } from "lucide-react";

export type DateRangeOption = "30d" | "6m" | "1y" | "ytd" | "2y" | "custom";

interface DateRangeSelectorProps {
  value: DateRangeOption;
  onChange: (range: DateRangeOption, customDates?: { start: string; end: string }) => void;
  customDates?: { start: string; end: string };
}

const RANGES: { id: DateRangeOption; label: string }[] = [
  { id: "30d", label: "Last 30 Days" },
  { id: "6m", label: "Last 6 Mo" },
  { id: "1y", label: "1 Year" },
  { id: "ytd", label: "YTD 2026" },
  { id: "2y", label: "All History + Forecast" },
];

export function DateRangeSelector({ value, onChange, customDates }: DateRangeSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState(customDates?.start || "2026-09-01");
  const [endDate, setEndDate] = useState(customDates?.end || "2026-09-17");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onChange("custom", { start: startDate, end: endDate });
    setIsCalendarOpen(false);
  };

  const handlePresetSelect = (presetId: DateRangeOption) => {
    onChange(presetId);
    setIsCalendarOpen(false);
  };

  return (
    <div className="relative inline-flex items-center z-50" ref={popoverRef}>
      <div className="flex items-center gap-1 rounded-xl border border-[#222E3A] bg-[#0A0E12] p-1 backdrop-blur-md">
        {/* Interactive Calendar Button */}
        <button
          type="button"
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            isCalendarOpen || value === "custom"
              ? "bg-[#D9A15B]/20 text-[#D9A15B] border-[#D9A15B]/50 shadow-sm"
              : "text-[#8A949E] hover:text-[#EDE6D9] hover:bg-[#161E26] border-transparent"
          }`}
          title="Open interactive calendar picker"
          aria-label="Open custom calendar picker"
        >
          <CalendarIcon className="h-3.5 w-3.5 text-[#D9A15B]" />
          <span className="hidden sm:inline">
            {value === "custom" ? `${startDate.slice(5)} to ${endDate.slice(5)}` : "Calendar"}
          </span>
        </button>

        <div className="h-4 w-[1px] bg-[#222E3A] my-auto mx-0.5 hidden sm:block" />

        {/* Quick Range Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {RANGES.map((r) => {
            const isActive = value === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onChange(r.id)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-[#D9A15B]/20 text-[#D9A15B] border border-[#D9A15B]/40 shadow-sm"
                    : "text-[#8A949E] hover:text-[#EDE6D9] hover:bg-[#161E26]"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Calendar Popover Dropdown */}
      {isCalendarOpen && (
        <div className="absolute top-full right-0 mt-2 z-[100] w-80 sm:w-96 rounded-2xl border border-[#2A3745] bg-[#12181D] p-4 shadow-2xl shadow-black/95 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#222E3A]">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#D9A15B]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#EDE6D9]">
                Date Range Picker · 2026
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsCalendarOpen(false)}
              className="rounded-lg p-1 text-[#8A949E] hover:bg-[#1A222B] hover:text-[#EDE6D9] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Presets Grid */}
          <div className="my-3">
            <p className="text-[11px] font-semibold text-[#8A949E] mb-2">Quick FinTech Presets:</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handlePresetSelect("30d")}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0A0E12] hover:bg-[#161E26] border border-[#222E3A] text-left text-xs text-[#EDE6D9] transition-colors"
              >
                <span>Last 30 Days</span>
                {value === "30d" && <Check className="h-3 w-3 text-[#D9A15B]" />}
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect("6m")}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0A0E12] hover:bg-[#161E26] border border-[#222E3A] text-left text-xs text-[#EDE6D9] transition-colors"
              >
                <span>Last 6 Mo (Apr-Sep)</span>
                {value === "6m" && <Check className="h-3 w-3 text-[#D9A15B]" />}
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect("ytd")}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0A0E12] hover:bg-[#161E26] border border-[#222E3A] text-left text-xs text-[#EDE6D9] transition-colors"
              >
                <span>YTD 2026</span>
                {value === "ytd" && <Check className="h-3 w-3 text-[#D9A15B]" />}
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect("2y")}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0A0E12] hover:bg-[#161E26] border border-[#222E3A] text-left text-xs text-[#EDE6D9] transition-colors"
              >
                <span>All + 2026 Forecast</span>
                {value === "2y" && <Check className="h-3 w-3 text-[#D9A15B]" />}
              </button>
            </div>
          </div>

          {/* Custom Date Range Inputs Form */}
          <form onSubmit={handleApplyCustom} className="space-y-3 pt-2 border-t border-[#222E3A]">
            <p className="text-[11px] font-semibold text-[#8A949E]">Custom Date Interval:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-[#8A949E] mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-[#2A3745] bg-[#0A0E12] px-2 py-1.5 text-xs text-[#EDE6D9] focus:border-[#D9A15B] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#8A949E] mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max="2026-12-31"
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-[#2A3745] bg-[#0A0E12] px-2 py-1.5 text-xs text-[#EDE6D9] focus:border-[#D9A15B] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="flex items-center gap-1 text-[10px] text-[#4E9B8F]">
                <Clock className="h-3 w-3" /> Fiscal 2026 Active
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="px-2.5 py-1 text-xs text-[#8A949E] hover:text-[#EDE6D9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D9A15B] hover:bg-[#C6904A] text-[#0A0E12] text-xs font-bold transition-all shadow-md shadow-[#D9A15B]/20"
                >
                  <span>Apply Range</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

