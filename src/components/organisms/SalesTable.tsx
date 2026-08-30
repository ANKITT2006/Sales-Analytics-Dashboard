"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card, CardHeader } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { ChartHeader } from "@/components/molecules/ChartHeader";
import { EmptyState } from "@/components/molecules/EmptyState";
import { MONTHLY_SALES_TARGET } from "@/data/sales";
import { exportSalesToCsv, formatCurrency, getMonthIndex, getSalesStatus } from "@/lib/utils";
import type { SalesRecord, TableSortField, TableSortOrder } from "@/types/sales";
import { useMemo, useState } from "react";

interface SalesTableProps {
  data: SalesRecord[];
  year?: number;
  target?: number;
}

export function SalesTable({
  data,
  year = 2024,
  target = MONTHLY_SALES_TARGET,
}: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<TableSortField>("month");
  const [sortOrder, setSortOrder] = useState<TableSortOrder>("asc");

  const totalSales = useMemo(
    () => data.reduce((acc, curr) => acc + curr.sales, 0),
    [data],
  );

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((item) =>
        item.month.toLowerCase().includes(term),
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "month") {
        comparison = getMonthIndex(a.month) - getMonthIndex(b.month);
      } else if (sortField === "sales" || sortField === "share") {
        comparison = a.sales - b.sales;
      } else if (sortField === "status") {
        const aStatus = getSalesStatus(a.sales, target);
        const bStatus = getSalesStatus(b.sales, target);
        comparison = aStatus.localeCompare(bStatus);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [data, searchTerm, sortField, sortOrder, target]);

  const toggleSort = (field: TableSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "sales" || field === "share" ? "desc" : "asc");
    }
  };

  const handleExport = () => {
    exportSalesToCsv(data, year, target);
  };

  const renderSortIndicator = (field: TableSortField) => {
    if (sortField !== field) {
      return (
        <span className="ml-1 text-slate-300 group-hover:text-slate-500">↕</span>
      );
    }
    return (
      <span className="ml-1 text-brand-600 font-bold">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ChartHeader
          title="Monthly Performance Table"
          description={`Comprehensive monthly dataset. Status benchmarked against ${formatCurrency(target)} monthly target.`}
        />
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <Input
              type="text"
              placeholder="Search month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 text-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            disabled={data.length === 0}
            className="flex items-center gap-1.5 h-9 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border-slate-300"
          >
            <svg
              className="h-3.5 w-3.5 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export CSV
          </Button>
        </div>
      </CardHeader>

      {filteredAndSortedData.length === 0 ? (
        <EmptyState
          title={searchTerm ? `No results found for "${searchTerm}"` : "No sales data available for this year."}
          description={searchTerm ? "Try searching for a different month name or clearing your search." : "No rows match the selected year and sales threshold."}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">
              Monthly sales, year, target variance, and status
            </caption>
            <thead className="border-b border-slate-200 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-600 font-semibold">
              <tr>
                <th scope="col" className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("month")}
                    className="group inline-flex items-center hover:text-slate-900"
                  >
                    Month {renderSortIndicator("month")}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("sales")}
                    className="group inline-flex items-center hover:text-slate-900"
                  >
                    Sales Revenue {renderSortIndicator("sales")}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("share")}
                    className="group inline-flex items-center hover:text-slate-900"
                  >
                    Share of Year {renderSortIndicator("share")}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Variance to Target
                </th>
                <th scope="col" className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("status")}
                    className="group inline-flex items-center hover:text-slate-900"
                  >
                    Performance Status {renderSortIndicator("status")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedData.map((record) => {
                const status = getSalesStatus(record.sales, target);
                const variance = record.sales - target;
                const sharePercent = totalSales > 0 ? (record.sales / totalSales) * 100 : 0;

                return (
                  <tr
                    key={`${record.year}-${record.month}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                      {record.month}
                    </th>
                    <td className="px-4 py-3 tabular-nums font-medium text-slate-900">
                      {formatCurrency(record.sales)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ width: `${Math.min(100, sharePercent * 4)}%` }}
                          />
                        </div>
                        <span className="text-xs">{sharePercent.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-xs font-medium">
                      <span className={variance >= 0 ? "text-emerald-600" : "text-amber-600"}>
                        {variance >= 0 ? `+${formatCurrency(variance)}` : `-${formatCurrency(Math.abs(variance))}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={status === "Above Target" ? "success" : "warning"}>
                        {status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

