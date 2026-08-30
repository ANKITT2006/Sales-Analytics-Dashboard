import { SALES_DATA } from "@/data/sales";
import type {
  SalesApiResponse,
  SalesRecord,
  SalesSummary,
  SalesYear,
  YearComparison,
} from "@/types/sales";
import { AVAILABLE_YEARS } from "@/types/sales";
import { isSalesYear } from "@/lib/utils";

export function getAvailableYears(): SalesYear[] {
  return [...AVAILABLE_YEARS];
}

export function getAllSales(): SalesRecord[] {
  return SALES_DATA;
}

export function getSalesByYear(year: SalesYear): SalesRecord[] {
  return SALES_DATA.filter((record) => record.year === year);
}

export function computeSummary(records: SalesRecord[]): SalesSummary | null {
  if (records.length === 0) {
    return null;
  }

  const totalSales = records.reduce((sum, record) => sum + record.sales, 0);
  const highestMonth = records.reduce((best, record) =>
    record.sales > best.sales ? record : best,
  );
  const lowestMonth = records.reduce((worst, record) =>
    record.sales < worst.sales ? record : worst,
  );

  return {
    totalSales,
    averageMonthlySales: Math.round(totalSales / records.length),
    highestMonth: { month: highestMonth.month, sales: highestMonth.sales },
    lowestMonth: { month: lowestMonth.month, sales: lowestMonth.sales },
  };
}

export function getYearComparison(): YearComparison[] {
  return getAvailableYears().map((year) => {
    const records = getSalesByYear(year);
    const summary = computeSummary(records);

    return {
      year,
      totalSales: summary?.totalSales ?? 0,
      averageMonthlySales: summary?.averageMonthlySales ?? 0,
    };
  });
}

export function getPreviousYear(year: SalesYear): SalesYear | null {
  const previous = year - 1;
  return isSalesYear(previous) ? previous : null;
}

export function getSalesPayload(year: SalesYear): SalesApiResponse {
  const data = getSalesByYear(year);
  const summary = computeSummary(data);

  if (!summary) {
    throw new Error(`No sales data available for ${year}.`);
  }

  const previousYear = getPreviousYear(year);

  return {
    year,
    data,
    summary,
    previousYear: previousYear
      ? { year: previousYear, data: getSalesByYear(previousYear) }
      : null,
    comparison: getYearComparison(),
  };
}
