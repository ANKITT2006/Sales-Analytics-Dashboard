import { Card } from "@/components/atoms/Card";
import { StatCard } from "@/components/molecules/StatCard";
import { MONTHLY_SALES_TARGET } from "@/data/sales";

import { formatCurrency, formatPercent, getQuarterSummaries } from "@/lib/utils";
import type { SalesRecord, SalesSummary } from "@/types/sales";

interface SalesSummarySectionProps {
  summary: SalesSummary;
  data?: SalesRecord[];
  target?: number;
}

function CurrencyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 3v18M17 8.5c0-1.9-2.2-3.5-5-3.5S7 6.6 7 8.5 9.2 12 12 12s5 1.6 5 3.5S14.8 19 12 15.5 7 17.4 7 15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AverageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 19h16M6 15l4-5 3 3 5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HighIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M5 16l5-5 3 3 6-7M14 7h5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M5 8l5 5 3-3 6 7M14 17h5v-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SalesSummarySection({
  summary,
  data = [],
  target = MONTHLY_SALES_TARGET,
}: SalesSummarySectionProps) {
  const quarters = data.length > 0 ? getQuarterSummaries(data) : [];
  const targetMetMonths = data.filter((d) => d.sales >= target).length;
  const annualTarget = target * 12;
  const targetAttainment = annualTarget > 0 ? (summary.totalSales / annualTarget) * 100 : 0;

  return (
    <div className="space-y-4">
      <section aria-label="Sales summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Annual Sales"
          value={formatCurrency(summary.totalSales)}
          hint={`${targetAttainment.toFixed(0)}% of target`}
          icon={<CurrencyIcon />}
          tone="brand"
        />
        <StatCard
          label="Average Monthly Sales"
          value={formatCurrency(summary.averageMonthlySales)}
          hint={`${targetMetMonths}/12 target hit`}
          icon={<AverageIcon />}
          tone="neutral"
        />
        <StatCard
          label="Peak Performance Month"
          value={summary.highestMonth.month}
          hint={formatCurrency(summary.highestMonth.sales)}
          icon={<HighIcon />}
          tone="success"
        />
        <StatCard
          label="Lowest Month"
          value={summary.lowestMonth.month}
          hint={formatCurrency(summary.lowestMonth.sales)}
          icon={<LowIcon />}
          tone="warning"
        />
      </section>

      {quarters.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-0 py-4 px-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="shrink-0">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Quarterly Breakdown
              </span>
              <p className="text-sm text-slate-300">Revenue split across fiscal quarters</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
              {quarters.map((q) => (
                <div
                  key={q.quarter}
                  className="rounded-xl bg-white/10 p-3 backdrop-blur-md border border-white/10 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white tracking-wide">{q.quarter}</span>
                    <span className="text-indigo-200 font-medium">{q.share.toFixed(1)}%</span>
                  </div>
                  <p className="mt-1 text-base sm:text-lg font-bold text-white tracking-tight">
                    {formatCurrency(q.sales)}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate">{q.months[0].slice(0, 3)}-{q.months[2].slice(0, 3)}</span>
                    {q.growth !== null ? (
                      <span className={`font-semibold ${q.growth >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                        {formatPercent(q.growth)}
                      </span>
                    ) : (
                      <span className="text-slate-400">Baseline</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

