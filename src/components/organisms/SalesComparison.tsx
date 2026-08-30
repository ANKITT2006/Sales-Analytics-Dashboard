"use client";

import { Badge } from "@/components/atoms/Badge";
import { Card, CardHeader } from "@/components/atoms/Card";
import { ChartHeader } from "@/components/molecules/ChartHeader";
import { EmptyState } from "@/components/molecules/EmptyState";
import { formatCurrency, formatPercent, monthShortName } from "@/lib/utils";
import type { SalesRecord, YearComparison } from "@/types/sales";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesComparisonProps {
  year: number;
  currentData: SalesRecord[];
  previous: { year: number; data: SalesRecord[] } | null;
  comparison: YearComparison[];
}

function yearOverYearChange(
  currentTotal: number,
  previousTotal: number | undefined,
): number | null {
  if (!previousTotal) {
    return null;
  }

  return ((currentTotal - previousTotal) / previousTotal) * 100;
}

function comparisonTooltipFormatter(value: unknown) {
  return [typeof value === "number" ? formatCurrency(value) : "", "Revenue"];
}

export function SalesComparison({
  year,
  currentData,
  previous,
  comparison,
}: SalesComparisonProps) {
  const currentTotal =
    comparison.find((item) => item.year === year)?.totalSales ?? 0;
  const previousTotal = previous
    ? comparison.find((item) => item.year === previous.year)?.totalSales
    : undefined;
  const change = yearOverYearChange(currentTotal, previousTotal);

  const monthlyCompare = currentData.map((record) => {
    const previousMonth = previous?.data.find((item) => item.month === record.month);

    return {
      shortMonth: monthShortName(record.month),
      [`FY ${year}`]: record.sales,
      ...(previous
        ? { [`FY ${previous.year}`]: previousMonth?.sales ?? 0 }
        : {}),
    };
  });

  return (
    <Card className="flex flex-col justify-between min-h-[30rem]">
      <CardHeader>
        <ChartHeader
          title="Year-over-Year Benchmark"
          description="Annual sales progression & month-by-month trajectory comparison vs previous fiscal year."
        />
        {change === null ? (
          <Badge tone="neutral">Baseline (No Prior Year)</Badge>
        ) : (
          <Badge tone={change >= 0 ? "success" : "warning"}>
            YoY Growth {formatPercent(change)}
          </Badge>
        )}
      </CardHeader>

      {comparison.length === 0 ? (
        <EmptyState
          title="No comparison data"
          description="Yearly totals are not available yet."
        />
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Annual Revenue Summary
            </p>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparison} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="annualBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" />
                      <stop offset="100%" stopColor="#0f766e" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis
                    tickFormatter={(value: number) => formatCurrency(value)}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={76}
                  />
                  <Tooltip formatter={comparisonTooltipFormatter} />
                  <Bar
                    dataKey="totalSales"
                    name="Annual Total"
                    fill="url(#annualBarGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Monthly Trajectory Comparison
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCompare} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="shortMonth" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis
                    tickFormatter={(value: number) => formatCurrency(value)}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={76}
                  />
                  <Tooltip formatter={comparisonTooltipFormatter} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: "4px" }} />
                  <Line
                    type="monotone"
                    dataKey={`FY ${year}`}
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#2563eb" }}
                  />
                  {previous ? (
                    <Line
                      type="monotone"
                      dataKey={`FY ${previous.year}`}
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 2.5, fill: "#94a3b8" }}
                    />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

