import { MONTHS, type SalesRecord, type SalesYear } from "@/types/sales";

function buildYear(year: SalesYear, values: readonly number[]): SalesRecord[] {
  return MONTHS.map((month, index) => ({
    year,
    month,
    sales: values[index],
  }));
}

/**
 * Deterministic monthly sales figures (USD) for a mid-market B2B product line.
 * Seasonality: slower February, stronger Q4. Year-over-year growth is intentional.
 */
export const SALES_DATA: SalesRecord[] = [
  ...buildYear(2022, [
    14200, 11850, 15600, 17100, 18900, 20400, 19200, 20100, 21800, 23900, 27100,
    31450,
  ]),
  ...buildYear(2023, [
    16800, 14100, 19200, 20800, 22600, 25100, 23400, 24700, 26900, 29100, 32800,
    37200,
  ]),
  ...buildYear(2024, [
    19400, 16200, 22100, 24300, 26800, 29600, 27500, 28900, 31800, 34100, 38600,
    43200,
  ]),
];

/** Monthly sales target used for table status badges. */
export const MONTHLY_SALES_TARGET = 20_000;
