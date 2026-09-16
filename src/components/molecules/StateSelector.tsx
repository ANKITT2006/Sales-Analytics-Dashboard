"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { ALL_INDIAN_STATES } from "@/lib/stream/indiaTransactionEngine";

interface StateSelectorProps {
  value: string;
  onChange: (stateCode: string) => void;
}

const REGION_GROUPS = ["West", "South", "North", "East", "Central", "North-East"] as const;

export function StateSelector({ value, onChange }: StateSelectorProps) {
  return (
    <div className="relative flex items-center">
      <MapPin className="absolute left-3.5 h-4 w-4 text-[#D9A15B] pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select Indian State or Territory"
        className="w-full appearance-none rounded-xl border border-[#222E3A] bg-[#0A0E12] pl-10 pr-9 py-2.5 text-sm font-medium text-[#EDE6D9] shadow-inner backdrop-blur-md transition-all focus:border-[#D9A15B] focus:outline-none focus:ring-2 focus:ring-[#D9A15B]/20 hover:border-[#D9A15B]/40 cursor-pointer"
      >
        <option value="ALL" className="bg-[#0A0E12] font-bold text-[#D9A15B]">
          🇮🇳 All India (36 States & UTs)
        </option>

        {REGION_GROUPS.map((region) => {
          const statesInRegion = ALL_INDIAN_STATES.filter((s) => s.region === region);
          return (
            <optgroup key={region} label={`${region} India`} className="bg-[#12181D] font-bold text-[#8A949E]">
              {statesInRegion.map((s) => (
                <option key={s.code} value={s.code} className="bg-[#0A0E12] font-medium text-[#EDE6D9]">
                  {s.name} ({s.code})
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
      <div className="pointer-events-none absolute right-3 text-xs text-[#8A949E]">▼</div>
    </div>
  );
}
