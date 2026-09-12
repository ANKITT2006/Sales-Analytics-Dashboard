import { MONTHLY_SALES_TARGET } from "@/data/sales";
import {
  MONTHS,
  type MonthName,
  type QuarterSummary,
  type SalesRecord,
  type SalesStatus,
  type SalesYear,
} from "@/types/sales";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatNumberIN(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function parseThreshold(raw: string): {
  value: number | null;
  error: string | null;
} {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return { value: null, error: null };
  }

  const parsed = Number(trimmed.replace(/,/g, ""));

  if (!Number.isFinite(parsed)) {
    return { value: null, error: "Enter a valid number." };
  }

  if (parsed < 0) {
    return { value: null, error: "Threshold cannot be negative." };
  }

  return { value: parsed, error: null };
}

export function getSalesStatus(
  sales: number,
  target: number = MONTHLY_SALES_TARGET,
): SalesStatus {
  return sales >= target ? "Above Target" : "Below Target";
}

export function monthShortName(month: MonthName): string {
  return month.slice(0, 3);
}

export function getMonthIndex(month: MonthName): number {
  return MONTHS.indexOf(month);
}

export function isSalesYear(value: number): value is SalesYear {
  return value === 2022 || value === 2023 || value === 2024;
}

export function filterByThreshold(
  records: SalesRecord[],
  threshold: number | null,
): SalesRecord[] {
  if (threshold === null) {
    return records;
  }

  return records.filter((record) => record.sales >= threshold);
}

export function getQuarterSummaries(data: SalesRecord[]): QuarterSummary[] {
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);

  const quartersConfig: Array<{
    quarter: "Q1" | "Q2" | "Q3" | "Q4";
    months: MonthName[];
  }> = [
    { quarter: "Q1", months: ["January", "February", "March"] },
    { quarter: "Q2", months: ["April", "May", "June"] },
    { quarter: "Q3", months: ["July", "August", "September"] },
    { quarter: "Q4", months: ["October", "November", "December"] },
  ];

  let prevQuarterSales: number | null = null;

  return quartersConfig.map(({ quarter, months }) => {
    const qData = data.filter((item) => months.includes(item.month));
    const sales = qData.reduce((sum, item) => sum + item.sales, 0);
    const share = totalSales > 0 ? (sales / totalSales) * 100 : 0;
    const growth =
      prevQuarterSales !== null && prevQuarterSales > 0
        ? ((sales - prevQuarterSales) / prevQuarterSales) * 100
        : null;

    prevQuarterSales = sales;

    return {
      quarter,
      months,
      sales,
      share,
      growth,
    };
  });
}

export function exportSalesToCsv(
  data: SalesRecord[],
  year: number,
  target: number = MONTHLY_SALES_TARGET,
): void {
  if (typeof window === "undefined") return;

  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
  const headers = ["Year", "Month", "Sales ($)", "Target ($)", "Variance ($)", "Share of Year (%)", "Status"];

  const rows = data.map((row) => {
    const variance = row.sales - target;
    const share = totalSales > 0 ? ((row.sales / totalSales) * 100).toFixed(2) : "0.00";
    const status = getSalesStatus(row.sales, target);
    return [
      row.year,
      `"${row.month}"`,
      row.sales,
      target,
      variance,
      `${share}%`,
      `"${status}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `sales-analytics-${year}-report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

