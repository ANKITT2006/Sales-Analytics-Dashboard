import { Badge } from "@/components/atoms/Badge";
import type { SalesYear } from "@/types/sales";

interface DashboardHeaderProps {
  year?: SalesYear;
}

export function DashboardHeader({ year = 2024 }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200/80">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 9l-5 5-3-3-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Sales Analytics & Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Prototype
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Interactive multi-year financial performance, seasonality trends, and revenue benchmarking.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">Fiscal Year {year}</Badge>
        <Badge tone="neutral">Deterministic 2022–2024</Badge>
      </div>
    </header>
  );
}

