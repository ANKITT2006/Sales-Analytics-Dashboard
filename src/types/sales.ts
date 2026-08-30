export const AVAILABLE_YEARS = [2022, 2023, 2024] as const;

export type SalesYear = (typeof AVAILABLE_YEARS)[number];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type MonthName = (typeof MONTHS)[number];

export const CHART_TYPES = ["bar", "line", "area", "pie"] as const;

export type ChartType = (typeof CHART_TYPES)[number];

export interface MonthlySales {
  month: MonthName;
  sales: number;
}

export interface SalesRecord extends MonthlySales {
  year: SalesYear;
}

export interface QuarterSummary {
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  months: MonthName[];
  sales: number;
  share: number;
  growth: number | null;
}

export interface SalesSummary {
  totalSales: number;
  averageMonthlySales: number;
  highestMonth: MonthlySales;
  lowestMonth: MonthlySales;
}

export interface YearComparison {
  year: SalesYear;
  totalSales: number;
  averageMonthlySales: number;
}

export interface SalesApiResponse {
  year: SalesYear;
  data: SalesRecord[];
  summary: SalesSummary;
  previousYear: {
    year: SalesYear;
    data: SalesRecord[];
  } | null;
  comparison: YearComparison[];
}

export type SalesStatus = "Above Target" | "Below Target";

export type TableSortField = "month" | "sales" | "status" | "share";
export type TableSortOrder = "asc" | "desc";

